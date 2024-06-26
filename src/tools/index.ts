import { first } from 'lodash-es';

import { toolRouters, type IToolRouter } from '@/tool';

export * from './ToolWelcomePage';

export function buildToolMetadata(url: string) {
    return {
        title: 'convert.charset',
        description: 'convert.charset.description',
        keywords: ['charset'],
        url,
    };
}

export function getRouterKeywords(url: string) {
    // 从 url 往上查找所有的 router 提取 keywords
    const keywords = new Set<string>();
    eachRouter(toolRouters, (router) => {
        if (router.url === url) {
            router.keywords?.forEach((keyword) => keywords.add(keyword));
        }
        if (url.startsWith(router.url)) {
            router.keywords?.forEach((keyword) => keywords.add(keyword));
        }
    });
    return Array.from(keywords);
}

export function findRouter(url: string) {
    let result: IToolRouter | undefined;
    eachRouter(toolRouters, (router) => {
        if (router.url === url) {
            result = router;
        }
    });
    return result;
}

export function findRouterParent(url: string) {
    let result: IToolRouter | undefined;
    eachRouter(toolRouters, (router) => {
        if (router.children) {
            router.children.forEach((child) => {
                if (child.url === url) {
                    result = router;
                }
            });
        }
    });
    return result;
}

export function eachRouter(routers: IToolRouter[], callback: (router: IToolRouter) => void) {
    routers.forEach((router) => {
        callback(router);
        if (router.children) {
            eachRouter(router.children, callback);
        }
    });
}

export function getFlatRouter(skipGroup = true) {
    const result: IToolRouter[] = [];
    eachRouter(toolRouters, (router) => {
        if (skipGroup && router.children && router.children.length > 0) {
            return;
        }
        result.push(router);
    });
    return result;
}

export function getAllSubTools(parentUrl: string): (IToolRouter & {
    parent?: IToolRouter;
    parents?: IToolRouter[];
})[] {
    const result: IToolRouter[] = [];
    eachRouter(toolRouters, (router) => {
        const notChildren = !router.children || router.children.length === 0;
        if (router.url.startsWith(parentUrl) && notChildren) {
            result.push(router);
        }
    });
    return result.map((item) => {
        // 找到当前路由的所有父级路由
        let parents: IToolRouter[] = [];
        let parent = findRouterParent(item.url);
        while (parent) {
            parents.push(parent);
            parent = findRouterParent(parent.url);
        }
        parents = parents.reverse();
        return {
            ...item,
            parent: first(parents),
            parents: parents,
        };
    });
}
