import { EncodeDecodeBase64ImageTool, EncodeDecodeBase64TextTool, EncodeDecodeUnicodeTool, EncodeDecodeUrlTool } from './tools';
import type { IToolRouterArray } from './types';

export const toolRouter: IToolRouterArray = [
    {
        id: 'EncodeDecodeUnicodeTool',
        name: 'encode-decode',
        url: '/encode-decode',
        component: EncodeDecodeUnicodeTool,
        children: [
            {
                id: 'EncodeDecodeUnicodeTool',
                name: 'unicode',
                url: '/encode-decode/unicode',
                component: EncodeDecodeUnicodeTool,
                children: [],
            },
            {
                id: 'EncodeDecodeBase64ImageTool',
                name: 'base64',
                url: '/encode-decode/base64',
                component: EncodeDecodeBase64ImageTool,
                children: [
                    {
                        id: 'EncodeDecodeBase64ImageTool',
                        name: 'image',
                        url: '/encode-decode/base64/image',
                        component: EncodeDecodeBase64ImageTool,
                        children: [],
                    },
                    {
                        id: 'EncodeDecodeBase64TextTool',
                        name: 'text',
                        url: '/encode-decode/base64/text',
                        component: EncodeDecodeBase64TextTool,
                        children: [],
                    },
                ],
            },
            {
                id: 'EncodeDecodeUrlTool',
                name: 'url',
                url: '/encode-decode/url',
                component: EncodeDecodeUrlTool,
                children: [],
            },
        ],
    },
];
