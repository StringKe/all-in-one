import { type ComponentType } from 'react';

export declare type IToolRouter = {
    id: string;
    name: string;
    url: string;
    component: IToolComponent;
    children: IToolRouterArray;
};

export declare type IToolRouterArray = IToolRouter[];
export declare type IToolComponent = ComponentType & {
    metadata: Record<string, unknown>;
};
