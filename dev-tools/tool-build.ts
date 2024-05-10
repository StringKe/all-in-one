import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { camelCase } from 'lodash-es';
import ts from 'ts-morph';

declare type AnalyzeResult = {
    filePath: string;
    router: string;
    isIndex?: boolean;
};

declare type GenerateRouterResult = {
    filePath: string;
    router: string;
    isIndex: boolean;
    metadataImport: {
        path: string;
        name: string;
        as?: string;
    };
};

declare type RouterTree = {
    id: string;
    name: string;
    url: string;
    isIndex: boolean;
    metadata: {
        path: string;
        name: string;
        as?: string;
    };
    children: RouterTree[];
};

class ToolBuild {
    projectRootPath: string;
    projectTsConfigPath: string;
    sourcePath: string;
    project: ts.Project;

    toolPath: string;
    toolPagePath: string;

    analyzeResult: AnalyzeResult[] = [];
    generateRouterResult: GenerateRouterResult[] = [];
    tree: RouterTree[] = [];

    factory = ts.ts.factory;

    constructor() {
        this.projectRootPath = resolve(join(dirname(fileURLToPath(import.meta.url)), '../'));
        this.sourcePath = join(this.projectRootPath, 'src');
        this.projectTsConfigPath = join(this.projectRootPath, 'tsconfig.json');

        this.project = new ts.Project({
            tsConfigFilePath: this.projectTsConfigPath,
            skipFileDependencyResolution: true,
        });

        this.toolPath = join(this.sourcePath, 'tools');
        this.toolPagePath = join(this.sourcePath, '/app/[locale]/(shell)/(tools)');
    }

    static Run() {
        const toolBuild = new ToolBuild();
        toolBuild.run();
    }

    eachDirectory(path: string, callback: (path: string) => void) {
        const fileSystem = this.project.getFileSystem();
        const result = fileSystem.readDirSync(path);
        result.forEach((directory) => {
            if (directory.isDirectory) {
                callback(directory.name);
                this.eachDirectory(directory.name, callback);
            }
        });
    }

    // 分析目录下信息
    analyze() {
        const toolsResult = this.project
            .getFileSystem()
            .globSync([`${this.toolPath}/**/*.tool.tsx`])
            .map((filePath) => {
                return filePath.replace(this.toolPath, '');
            });

        this.analyzeResult = toolsResult.map((toolPath) => {
            return {
                filePath: toolPath,
                router: toolPath.replace(/\.tool\.tsx$/, '').replace(/\/index$/, ''),
            } as AnalyzeResult;
        });

        // 检查是否存在一样的 router
        (() => {
            const routerSet = new Set();
            this.analyzeResult.forEach(({ router }) => {
                if (routerSet.has(router)) {
                    throw new Error(`Duplicate router: ${router}`);
                }
                routerSet.add(router);
            });
        })();

        this.eachDirectory(this.toolPath, (path) => {
            // 检查是否包含 index.tool.tsx
            const indexToolPath = join(path, 'index.tool.tsx');
            // 如果存在 index.tool.tsx 则不生成
            if (this.project.getFileSystem().fileExistsSync(indexToolPath)) {
                return;
            }

            const metadataConfigPath = join(path, 'metadata.ts');
            const metadataConfigSourceFile = this.project.createSourceFile(metadataConfigPath, '', { overwrite: true });
            if (!this.checkFileHasOneExport(metadataConfigSourceFile, (name) => name === 'metadata')) {
                metadataConfigSourceFile.addStatements([`export const metadata = {};`]);
            }
            metadataConfigSourceFile.saveSync();
            this.analyzeResult.push({
                filePath: metadataConfigPath,
                router: path.replace(this.toolPath, ''),
                isIndex: true,
            } as AnalyzeResult);
        });
    }

    checkFileHasOneExport(sourceFile: ts.SourceFile, check: (name: string) => boolean) {
        let nameToolsCount = 0;
        for (const [name] of sourceFile.getExportedDeclarations()) {
            if (check(name)) {
                nameToolsCount++;
            }
        }
        return nameToolsCount === 1;
    }

    name(value: string) {
        let name = value.replace(/^\//, '').replace(/\/$/, '').replace(/-/g, '_').replace(/\//g, '_');
        name = camelCase(name);
        name = name.replace(/^[a-z]/, (s) => s.toUpperCase());
        return name;
    }

    processGenerateInfo() {
        this.generateRouterResult = this.analyzeResult.map(({ filePath, router, isIndex }) => {
            if (isIndex) {
                const asName = this.name(router) + 'Metadata';
                return {
                    filePath,
                    router,
                    isIndex: true,
                    metadataImport: {
                        path: filePath.replace(this.toolPath, ''),
                        name: 'metadata',
                        as: asName,
                    },
                } as GenerateRouterResult;
            } else {
                // 生成导入名字，如果不对则修改成正确的名字
                const name = this.name(router) + 'Tool';
                const sourceFile = this.project.addSourceFileAtPath(join(this.toolPath, filePath));
                let hasTool = false;
                for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
                    if (name.endsWith('Tool')) {
                        const declaration = declarations[0];
                        if (ts.Node.isFunctionDeclaration(declaration)) {
                            declaration.rename(name);
                            hasTool = true;
                        }
                    }
                }

                if (!hasTool) {
                    throw new Error(`Tool export ${name} must be a function ${filePath}`);
                }

                return {
                    filePath,
                    router,
                    isIndex: false,
                    metadataImport: {
                        path: filePath,
                        name: name,
                    },
                } as GenerateRouterResult;
            }
        });
    }

    generateToolTs() {
        const toolsTsPath = join(this.toolPath, 'tools.ts');
        const toolsTsSourceFile = this.project.createSourceFile(toolsTsPath, '', { overwrite: true });

        this.generateRouterResult.forEach((router) => {
            if (router.metadataImport.as) {
                toolsTsSourceFile.addImportDeclaration({
                    namedImports: [
                        {
                            name: router.metadataImport.name,
                            alias: router.metadataImport.as,
                        },
                    ],
                    moduleSpecifier: '.' + router.metadataImport.path.replace(/\.ts$/, ''),
                });
                toolsTsSourceFile.addExportDeclaration({
                    namedExports: [router.metadataImport.as],
                });
            } else {
                toolsTsSourceFile.addExportDeclaration({
                    namedExports: [router.metadataImport.name],
                    moduleSpecifier: '.' + router.filePath.replace(/\.tsx$/, ''),
                });
            }
        });
        toolsTsSourceFile.saveSync();
    }

    generateTree() {
        // 将 this.generateRouterResult 转换成树形结构，避免路由出现在最后导致的生成错误
        // 扁平化结构
        const weekMap = new Map<string, RouterTree>();
        this.generateRouterResult.forEach((router) => {
            weekMap.set(router.router, {
                id: router.metadataImport.name,
                name: router.router,
                url: router.router,
                isIndex: router.isIndex,
                metadata: {
                    path: router.filePath,
                    name: router.metadataImport.name,
                    as: router.metadataImport.as,
                },
                children: [],
            });
        });
        // 构建树形结构
        // 计算出所有的 url 并且按照 url 的长度排序
        const urls = Array.from(weekMap.keys()).sort((a, b) => a.length - b.length);
        urls.forEach((url) => {
            const router = weekMap.get(url)!;
            if (url === '/') {
                this.tree.push(router);
                return;
            }
            const parentUrl = url.split('/').slice(0, -1).join('/');
            const parentRouter = weekMap.get(parentUrl);
            if (parentRouter) {
                parentRouter.children.push(router);
            } else {
                this.tree.push(router);
            }
        });
    }

    buildRouterItem(importSet: Set<string>, router: RouterTree): ts.ts.ObjectLiteralExpression {
        const children = router.children.map((child) => this.buildRouterItem(importSet, child));

        let name: string;
        if (router.isIndex) {
            name = router.metadata.as!;
        } else {
            name = router.metadata.name;
        }

        importSet.add(name);

        return this.factory.createObjectLiteralExpression(
            [
                this.factory.createPropertyAssignment(
                    this.factory.createIdentifier('id'),
                    this.factory.createStringLiteral(this.name(`${name}_${router.isIndex ? 'Index' : ''}`)),
                ),
                this.factory.createPropertyAssignment(this.factory.createIdentifier('name'), this.factory.createStringLiteral(router.name)),
                this.factory.createPropertyAssignment(this.factory.createIdentifier('url'), this.factory.createStringLiteral(router.url)),
                router.isIndex
                    ? this.factory.createPropertyAssignment(
                          this.factory.createStringLiteral('metadata'),
                          this.factory.createIdentifier(name),
                      )
                    : this.factory.createPropertyAssignment(
                          this.factory.createIdentifier('metadata'),
                          this.factory.createPropertyAccessExpression(
                              this.factory.createIdentifier(name),
                              this.factory.createIdentifier('metadata'),
                          ),
                      ),
                this.factory.createPropertyAssignment(
                    this.factory.createIdentifier('children'),
                    this.factory.createArrayLiteralExpression(children),
                ),
            ],
            true,
        );
    }

    generateRouterTree() {
        const importNodesSet = new Set<string>();
        const routerItems = this.tree.map((router) => this.buildRouterItem(importNodesSet, router));
        const importNodesArray = Array.from(importNodesSet);

        const routerExportStatement = this.factory.createVariableStatement(
            [this.factory.createToken(ts.SyntaxKind.ExportKeyword)],
            this.factory.createVariableDeclarationList(
                [
                    this.factory.createVariableDeclaration(
                        this.factory.createIdentifier('toolRouter'),
                        undefined,
                        this.factory.createTypeReferenceNode(this.factory.createIdentifier('IToolRouterArray'), undefined),
                        this.factory.createArrayLiteralExpression(routerItems, true),
                    ),
                ],
                ts.NodeFlags.Const,
            ),
        );

        const toolRouterTsPath = join(this.toolPath, 'router.ts');
        if (this.project.getFileSystem().fileExistsSync(toolRouterTsPath)) {
            this.project.getFileSystem().deleteSync(toolRouterTsPath);
        }
        const toolRouterTsContent = (() => {
            const file = ts.ts.createSourceFile(toolRouterTsPath, '', ts.ScriptTarget.ES2018);
            const printer = ts.ts.createPrinter();
            const nodeArray = [
                this.factory.createImportDeclaration(
                    undefined,
                    this.factory.createImportClause(
                        true,
                        undefined,
                        this.factory.createNamedImports([
                            this.factory.createImportSpecifier(false, undefined, this.factory.createIdentifier('IToolRouterArray')),
                        ]),
                    ),
                    this.factory.createStringLiteral('./types'),
                    undefined,
                ),
                this.factory.createImportDeclaration(
                    undefined,
                    this.factory.createImportClause(
                        false,
                        undefined,
                        this.factory.createNamedImports(
                            importNodesArray.map((importNode) =>
                                this.factory.createImportSpecifier(false, undefined, this.factory.createIdentifier(importNode)),
                            ),
                        ),
                    ),
                    this.factory.createStringLiteral('./tools'),
                    undefined,
                ),
                routerExportStatement,
            ];
            return printer.printList(ts.ts.ListFormat.MultiLine, ts.ts.factory.createNodeArray(nodeArray, true), file);
        })();

        this.project.getFileSystem().writeFileSync(toolRouterTsPath, toolRouterTsContent);
    }

    generateToolPage({ filePath, metadataImport }: GenerateRouterResult) {
        let baseFilePath = `${filePath.replace(/\.tool\.tsx$/, '')}`;
        baseFilePath = baseFilePath.replace(/\/index$/, '');
        baseFilePath = baseFilePath + '/page.tsx';
        const fullFilePath = join(this.toolPagePath, baseFilePath);

        console.log('Generate Tool Page => ', baseFilePath);

        const exportName = metadataImport.name;

        const sourceFile = this.project.createSourceFile(
            fullFilePath,
            `import { ${exportName} } from '@/tools';

export default function ${exportName}Page(){
    return <${exportName} />
}
        `,
            { overwrite: true },
        );
        sourceFile.saveSync();
        return sourceFile;
    }

    generateToolIndexPage(item: GenerateRouterResult) {
        let filePath = join(item.filePath.replace(this.toolPath, ''), '/page.tsx');
        filePath = filePath.replace(/\/index$/, '');
        filePath = filePath.replace('/metadata.ts', '');
        const fullFilePath = join(this.toolPagePath, filePath);

        console.log('Generate Tool Index Page => ', filePath);

        const sourceFile = this.project.createSourceFile(
            fullFilePath,
            `import { ToolIndexPage } from '@/tools';

export default function ${item.metadataImport.as!}(){
    return <ToolIndexPage url="${item.router}" />
}
        `,
            { overwrite: true },
        );
        sourceFile.saveSync();
        return sourceFile;
    }

    makeToolPage() {
        if (this.project.getFileSystem().directoryExistsSync(this.toolPagePath)) {
            this.project.getFileSystem().deleteSync(this.toolPagePath);
        }
        this.project.getFileSystem().mkdirSync(this.toolPagePath);

        this.generateRouterResult.forEach((item) => {
            if (!item.isIndex) {
                this.generateToolPage(item);
            } else {
                this.generateToolIndexPage(item);
            }
        });
    }

    run() {
        this.analyze();
        this.processGenerateInfo();
        this.generateToolTs();
        this.generateTree();
        this.generateRouterTree();

        this.makeToolPage();
    }
}

ToolBuild.Run();
