export declare type IToolRouter = {
    id: string;
    name: string;
    url: string;
    metadata: Record<string, unknown>;
    children: IToolRouterArray;
};

export declare type IToolRouterArray = IToolRouter[];
