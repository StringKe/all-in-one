import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { camelCase } from 'lodash-es';
import ts from 'ts-morph';

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
                throw new Error(`Duplicate export: ${name}`);
            }
            if (declarations.length !== 1) {
                throw new Error(`Tool export ${name} must be a function`);
            }
            const declaration = declarations[0];
            if (!ts.Node.isFunctionDeclaration(declaration)) {
                throw new Error(`Tool export ${name} must be a function`);
            } else {
                declaration.rename(exportName);
            }
        }
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

// 处理成 tree 与 tools/router.ts 里的导出 toolRouter 进行合并
const toolRouterTsPath = join(toolsPath, 'generate-router.ts');
const toolRouterTsSourceFile = project.createSourceFile(toolRouterTsPath, '', { overwrite: true });
// 获取 tools/router.ts 里的变量 toolRouter
let toolRouter = toolRouterTsSourceFile.getVariableDeclaration('GenerateRouter');
if (!toolRouter) {
    toolRouterTsSourceFile.addVariableStatement({
        declarationKind: ts.VariableDeclarationKind.Const,
        declarations: [
            {
                name: 'GenerateRouter',
                initializer: '{}',
            },
        ],
    });
    toolRouter = toolRouterTsSourceFile.getVariableDeclaration('GenerateRouter')!;
    // 将 toolRouter 添加到导出
    toolRouterTsSourceFile.addExportDeclaration({
        namedExports: ['GenerateRouter'],
    });
}

declare type Router = {
    id: string;
    name: string;
    url: string;
    children: Router[];
};
const tree: Router[] = [];
// 生成 tree，路径
toolExportRouters.forEach(({ router, exportName }) => {
    const paths = router.replace(/^\//, '').replace(/\/$/, '').split('/');
    let currentTree = tree;
    paths.forEach((path, index) => {
        const findIndex = currentTree.findIndex((item) => item.name === path);
        if (findIndex === -1) {
            const newTree: Router = {
                id: exportName,
                name: path,
                url: `/${paths.slice(0, index + 1).join('/')}`,
                children: [],
            };
            currentTree.push(newTree);
            currentTree = newTree.children;
        } else {
            currentTree = currentTree[findIndex]!.children;
        }
    });
});
// 将 tree 替换到 toolRouter
toolRouter.setInitializer(JSON.stringify(tree, null, 4));
toolRouterTsSourceFile.saveSync();

// 清空 toolPagePath 下的所有文件
fileSystem.globSync([`${toolPagePath}/**/*.tsx`]).forEach((filePath) => {
    fileSystem.deleteSync(filePath);
});

const pageTemplate = (exportName: string, filePath: string) => {
    // 将 filePath (encode-decode/base64/image.tool.tsx) encode-decode/base64/page.tsx
    const baseFilePath = `${filePath.replace(/\.tool\.tsx$/, '')}/page.tsx`;
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
