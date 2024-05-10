import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { camelCase } from 'lodash-es';
import ts, { ScriptTarget } from 'ts-morph';

const factory = ts.ts.factory;

const projectRootPath = resolve(join(dirname(fileURLToPath(import.meta.url)), '../'));
const sourcePath = join(projectRootPath, 'src');
const toolsPath = join(sourcePath, 'tools');
const projectTsConfigPath = join(projectRootPath, 'tsconfig.json');

const toolPagePath = join(sourcePath, '/app/[locale]/(shell)/(tools)');

const project = new ts.Project({
    tsConfigFilePath: projectTsConfigPath,
    skipFileDependencyResolution: true,
});
const fileSystem = project.getFileSystem();

// 递归扫描 project/tools 下 *.tool.tsx 文件
const toolsResult = fileSystem.globSync([`${toolsPath}/**/*.tool.tsx`]).map((filePath) => {
    return filePath.replace(toolsPath, '');
});

const routerResult = toolsResult.map((toolPath) => {
    return {
        filePath: toolPath,
        router: toolPath.replace(/\.tool\.tsx$/, '').replace(/\/index$/, ''),
    };
});

// 检查是否存在一样的 router
(() => {
    const routerSet = new Set();
    routerResult.forEach(({ router }) => {
        if (routerSet.has(router)) {
            throw new Error(`Duplicate router: ${router}`);
        }
        routerSet.add(router);
    });
})();

if (!fileSystem.directoryExistsSync(toolPagePath)) {
    fileSystem.mkdirSync(toolPagePath);
}

// 修改 toolsResult 下所有文件的导出，并计算出对应目录的 index.ts
const toolExportRouters = routerResult.map(({ filePath, router }) => {
    const sourceFile = project.addSourceFileAtPath(join(toolsPath, filePath));
    // 使用路径拼接出导出名字，移除最开始的 / 和 尾巴的 /
    let exportName = router.replace(/^\//, '').replace(/\/$/, '');
    exportName = camelCase(exportName);
    exportName = exportName.replace(/^[a-z]/, (s) => s.toUpperCase()) + 'Tool';

    // 获取 sourceFile 所有的导出
    // 导出不能存在多个后缀为 Tool 的导出，并且为 Tool 后缀的导出必须是函数
    let nameToolsCount = 0;
    for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
        if (name.endsWith('Tool')) {
            nameToolsCount++;
            if (nameToolsCount > 1) {
                throw new Error(`Duplicate export: ${name} ${filePath}`);
            }
            const declaration = declarations[0];
            if (!ts.Node.isFunctionDeclaration(declaration)) {
                throw new Error(`Tool export ${name} must be a function ${filePath}`);
            } else {
                declaration.rename(exportName);
            }
        }
    }

    let hasMetadata = false;
    // 扫描所有的 expressions
    sourceFile.forEachChild((node) => {
        if (ts.Node.isExpressionStatement(node)) {
            // 获取是否 xxx.metadata = {}
            const expression = node.getExpression();
            if (ts.Node.isBinaryExpression(expression)) {
                // 判断是否是 any.metadata
                const left = expression.getLeft();
                if (ts.Node.isPropertyAccessExpression(left)) {
                    const leftExpression = left.getExpression();
                    const leftName = left.getName();
                    if (leftName === 'metadata') {
                        // 将 xxx 修改为 exportName
                        leftExpression.replaceWithText(exportName);
                        hasMetadata = true;
                    }
                }
            }
        }
    });
    if (!hasMetadata) {
        sourceFile.addStatements([
            `${exportName}.metadata = {
        tKey: 'tools:${exportName.replace('Tool', '')}',
        icon: undefined,
};`,
        ]);
    }
    sourceFile.saveSync();
    return {
        filePath,
        router,
        exportName,
    };
});

// 生成 tools/tools.ts
const toolsTsPath = join(toolsPath, 'tools.ts');
const toolsTsSourceFile = project.createSourceFile(toolsTsPath, '', { overwrite: true });

toolExportRouters.forEach((router) => {
    toolsTsSourceFile.addExportDeclaration({
        namedExports: [router.exportName],
        moduleSpecifier: './' + relative(toolsPath, join(toolsPath, router.filePath.replace(/\.tsx$/, ''))),
    });
});
toolsTsSourceFile.saveSync();

declare type Router = {
    id: string;
    name: string;
    url: string;
    filePath: string;
    children: Router[];
};
const tree = (() => {
    const tree: Router[] = [];
    // 生成 tree，路径
    toolExportRouters.forEach(({ router, exportName, filePath }) => {
        const paths = router.replace(/^\//, '').replace(/\/$/, '').split('/');
        let currentTree = tree;
        paths.forEach((path, index) => {
            const findIndex = currentTree.findIndex((item) => item.name === path);
            if (findIndex === -1) {
                const newTree: Router = {
                    id: exportName,
                    name: path,
                    url: `/${paths.slice(0, index + 1).join('/')}`,
                    filePath: filePath,
                    children: [],
                };
                currentTree.push(newTree);
                currentTree = newTree.children;
            } else {
                currentTree = currentTree[findIndex]!.children;
            }
        });
    });

    return tree;
})();

const treeNodes = (() => {
    const importNodes: string[] = [];

    function buildRouterStatement(router: Router): ts.ts.ObjectLiteralExpression {
        // 因为要增加一个 component 的属性，所以要使用 ts.createNode
        const children = router.children.map((child) => buildRouterStatement(child));

        importNodes.push(router.id);

        return factory.createObjectLiteralExpression(
            [
                factory.createPropertyAssignment(factory.createIdentifier('id'), factory.createStringLiteral(router.id)),
                factory.createPropertyAssignment(factory.createIdentifier('name'), factory.createStringLiteral(router.name)),
                factory.createPropertyAssignment(factory.createIdentifier('url'), factory.createStringLiteral(router.url)),
                factory.createPropertyAssignment(
                    factory.createIdentifier('metadata'),
                    factory.createPropertyAccessExpression(factory.createIdentifier(router.id), factory.createIdentifier('metadata')),
                ),
                factory.createPropertyAssignment(factory.createIdentifier('children'), factory.createArrayLiteralExpression(children)),
            ],
            true,
        );
    }

    const routerStatement = tree.map((router) => buildRouterStatement(router));
    const routerExportStatement = factory.createVariableStatement(
        [factory.createToken(ts.SyntaxKind.ExportKeyword)],
        factory.createVariableDeclarationList(
            [
                factory.createVariableDeclaration(
                    factory.createIdentifier('toolRouter'),
                    undefined,
                    factory.createTypeReferenceNode(factory.createIdentifier('IToolRouterArray'), undefined),
                    factory.createArrayLiteralExpression(routerStatement, true),
                ),
            ],
            ts.NodeFlags.Const,
        ),
    );
    return { importNodes, routerExportStatement };
})();

const toolRouterTsPath = join(toolsPath, 'router.ts');

if (fileSystem.fileExistsSync(toolRouterTsPath)) {
    fileSystem.deleteSync(toolRouterTsPath);
}

const toolRouterTsContent = (() => {
    const file = ts.ts.createSourceFile(toolsTsSourceFile.getFilePath(), '', ScriptTarget.ES2018);
    const printer = ts.ts.createPrinter();

    const importNodesSet = new Set(treeNodes.importNodes);
    const importNodesArray = Array.from(importNodesSet);

    const nodeArray = [
        factory.createImportDeclaration(
            undefined,
            factory.createImportClause(
                true,
                undefined,
                factory.createNamedImports([factory.createImportSpecifier(false, undefined, factory.createIdentifier('IToolRouterArray'))]),
            ),
            factory.createStringLiteral('./types'),
            undefined,
        ),
        factory.createImportDeclaration(
            undefined,
            factory.createImportClause(
                false,
                undefined,
                factory.createNamedImports(
                    importNodesArray.map((importNode) =>
                        factory.createImportSpecifier(false, undefined, factory.createIdentifier(importNode)),
                    ),
                ),
            ),
            factory.createStringLiteral('./tools'),
            undefined,
        ),
        treeNodes.routerExportStatement,
    ];

    return printer.printList(ts.ts.ListFormat.MultiLine, ts.ts.factory.createNodeArray(nodeArray, true), file);
})();

fileSystem.writeFileSync(toolRouterTsPath, toolRouterTsContent);

// 清空 toolPagePath 下的所有文件
fileSystem.deleteSync(toolPagePath);

// 生成具体页面
(() => {
    const pageTemplate = (exportName: string, filePath: string) => {
        // 将 filePath (encode-decode/base64/image.tool.tsx) encode-decode/base64/page.tsx
        let baseFilePath = `${filePath.replace(/\.tool\.tsx$/, '')}`;
        baseFilePath = baseFilePath.replace(/\/index$/, '');
        baseFilePath = baseFilePath + '/page.tsx';
        const fullFilePath = join(toolPagePath, baseFilePath);
        console.log('Generate Tool Page => ', baseFilePath);

        return project.createSourceFile(
            fullFilePath,
            `import { ${exportName} } from '@/tools';

export default function ${exportName}Page(){
    return <${exportName} />
}
        `,
            { overwrite: true },
        );
    };

    toolExportRouters.forEach(({ exportName, filePath }) => {
        pageTemplate(exportName, filePath).saveSync();
    });
})();

// 生成索引页面
(() => {
    const generatePage = (router: Router) => {
        if (router.children.length === 0) {
            return;
        }
        const filePath = join(router.url, '/page.tsx');
        const fullFilePath = join(toolPagePath, filePath);
        console.log('Generate Tool Page => ', filePath);
        const sourceFile = project.createSourceFile(
            fullFilePath,
            `import { ToolIndexPage } from '@/tools';

export default function ${router.id.replace('Tool', 'IndexPage')}(){
    return <ToolIndexPage url="${router.url}" />
}
        `,
            { overwrite: true },
        );
        router.children.forEach((child) => {
            generatePage(child);
        });
        sourceFile.saveSync();
        return sourceFile;
    };

    tree.forEach((router) => {
        generatePage(router);
    });
})();
