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

export function findRouter(url: string) {
    let result: IToolRouter | undefined;
    eachRouter(toolRouters, (router) => {
        if (router.url === url) {
            result = router;
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
