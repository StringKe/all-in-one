import { toolRouter } from './router';
import { type IToolRouter, type IToolRouterArray } from './types';

export function findRouter(url: string) {
    let result: IToolRouter | undefined;
    eachRouter(toolRouter, (router) => {
        if (router.url === url) {
            result = router;
        }
    });
    return result;
}

export function eachRouter(routers: IToolRouterArray, callback: (router: IToolRouter) => void) {
    routers.forEach((router) => {
        callback(router);
        if (router.children) {
            eachRouter(router.children, callback);
        }
    });
}
