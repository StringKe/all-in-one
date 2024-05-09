import { merge } from 'merge-anything';
import { type ReactNode } from 'react';
import { type PartialDeep } from 'type-fest';

export declare type Router = {
    id: string;
    name: string;
    url: string;
    tKey?: string;
    icon?: ReactNode;
    children: Router[];
};

export function buildRouterModify(routers: Router[]) {
    return (path: string, router: PartialDeep<Router>) => {
        // 从 toolRouter 中找到对应的路由并修改
        const paths = path.replace(/^\//, '').replace(/\/$/, '').split('/');
        let currentTree = routers;
        paths.forEach((path, index) => {
            const findIndex = currentTree.findIndex((item) => item.name === path);
            if (findIndex === -1) {
                return;
            }
            if (index === paths.length - 1) {
                currentTree[findIndex] = merge(currentTree[findIndex], router) as Router;
            } else {
                currentTree = currentTree[findIndex]!.children;
            }
        });
    };
}
