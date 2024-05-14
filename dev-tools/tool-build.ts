import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import { fileURLToPath } from 'node:url';

import { camelCase } from 'lodash-es';

import { toolRouters, type IToolRouter } from '@/tool';

class ToolBuild {
    srcDir: string;
    toolPagesDir: string;
    toolDir: string;
    debug = !!process.env.TOOL_BUILD_DEBUG;

    constructor() {
        this.srcDir = path.resolve(path.join(path.dirname(fileURLToPath(import.meta.url)), '../src'));
        this.toolPagesDir = path.resolve(path.join(this.srcDir, '/app/[locale]/(shell)/(tools)'));
        this.toolDir = path.resolve(path.join(this.srcDir, '/tools'));
    }

    static run() {
        new ToolBuild().build();
    }

    name(value: string) {
        let name = value.replace(/^\//, '');
        name = name.replace(/\/$/, '');
        name = name.replace(/-/g, '_');
        name = name.replace(/\//g, '_');
        name = camelCase(name);
        name = name.replace(/^[a-z]/, (s) => s.toUpperCase());
        return name;
    }

    eachRouter(router: IToolRouter[], callback: (router: IToolRouter) => void) {
        router.forEach((router) => {
            callback(router);
            if (router.children) {
                this.eachRouter(router.children, callback);
            }
        });
    }

    buildPath(...args: string[]) {
        const fullPath = path.join(...args);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        return fullPath;
    }

    buildPageTsxPath(router: IToolRouter, fileName = 'page.tsx') {
        return path.join(this.buildPath(this.toolPagesDir, router.url), fileName);
    }

    makeIndexPage(router: IToolRouter) {
        const pagePath = this.buildPageTsxPath(router);
        if (fs.existsSync(pagePath)) {
            fs.rmSync(pagePath);
        }
        fs.writeFileSync(
            pagePath,
            `import { buildToolMetadata, ToolWelcomePage } from '@/tools';

export const metadata = buildToolMetadata('${router.url}');

export default function ${this.name(router.url)}Metadata() {
    return <ToolWelcomePage url='${router.url}' />;
}`,
        );
    }

    makeToolPage(router: IToolRouter) {
        const pagePath = this.buildPageTsxPath(router);
        if (fs.existsSync(pagePath)) {
            fs.rmSync(pagePath);
        }

        const toolPagePath = `@/tools/${router.url}/index`;

        const componentName = `${this.name(router.url)}Tool`;

        fs.writeFileSync(
            pagePath,
            `import dynamic from 'next/dynamic';

const ${componentName} = dynamic(() => import('${toolPagePath}').then((mod) => mod.default));

export default function ${componentName}Page() {
    return <${componentName} />;
}`,
        );
    }

    buildBaseOg(router: IToolRouter) {
        const ogImagePath = this.buildPageTsxPath(router, 'og-image.tsx');
        const twitterImagePath = this.buildPageTsxPath(router, 'twitter-image.tsx');

        const ogAndTwitterImage = `import { getToolOgImage } from '@/lib/image/og-image';

export const contentType = 'image/png';

export default async function Image({
    params: { locale },
}: {
    params: {
        locale: string;
    };
}) {
    return await getToolOgImage(locale, '${router.url}');
}
`;

        const ogAltPath = this.buildPageTsxPath(router, 'og-image.alt.txt');
        const twitterAltPath = this.buildPageTsxPath(router, 'twitter-image.alt.txt');

        const altContent = router.url
            .trim()
            .split('/')
            .filter(Boolean)
            .map((item) => {
                let text = camelCase(item);
                text = text.replace(/^[a-z]/, (s) => s.toUpperCase());
                return text;
            })
            .join(' ');

        if (fs.existsSync(ogAltPath)) {
            fs.rmSync(ogAltPath);
        }
        if (fs.existsSync(twitterAltPath)) {
            fs.rmSync(twitterAltPath);
        }
        if (fs.existsSync(ogImagePath)) {
            fs.rmSync(ogImagePath);
        }
        if (fs.existsSync(twitterImagePath)) {
            fs.rmSync(twitterImagePath);
        }

        fs.writeFileSync(ogImagePath, ogAndTwitterImage);
        fs.writeFileSync(twitterImagePath, ogAndTwitterImage);
        fs.writeFileSync(ogAltPath, altContent);
        fs.writeFileSync(twitterAltPath, altContent);
    }

    makeToolComponent(router: IToolRouter) {
        const componentPath = path.join(this.buildPath(this.toolDir, router.url), 'index.tsx');
        if (!fs.existsSync(componentPath) || this.debug) {
            fs.writeFileSync(
                componentPath,
                `export default function ${this.name(router.url)}Tool() {
    return <div>${router.title}</div>;
}`,
            );
        }
    }

    build() {
        this.eachRouter(toolRouters, (router) => {
            const isTool = router.children === undefined || router.children.length === 0;

            if (!isTool) {
                this.makeIndexPage(router);
            } else {
                this.makeToolComponent(router);
                this.makeToolPage(router);
            }
            this.buildBaseOg(router);
        });
    }
}

ToolBuild.run();
