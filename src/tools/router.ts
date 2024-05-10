import { EncodeDecodeBase64ImageTool, EncodeDecodeBase64TextTool, EncodeDecodeUnicodeTool, EncodeDecodeUrlTool } from './tools';
import type { IToolRouterArray } from './types';

export const toolRouter: IToolRouterArray = [
    {
        id: 'EncodeDecodeUnicodeTool',
        name: 'encode-decode',
        url: '/encode-decode',
        metadata: EncodeDecodeUnicodeTool.metadata,
        children: [
            {
                id: 'EncodeDecodeUnicodeTool',
                name: 'unicode',
                url: '/encode-decode/unicode',
                metadata: EncodeDecodeUnicodeTool.metadata,
                children: [],
            },
            {
                id: 'EncodeDecodeBase64ImageTool',
                name: 'base64',
                url: '/encode-decode/base64',
                metadata: EncodeDecodeBase64ImageTool.metadata,
                children: [
                    {
                        id: 'EncodeDecodeBase64ImageTool',
                        name: 'image',
                        url: '/encode-decode/base64/image',
                        metadata: EncodeDecodeBase64ImageTool.metadata,
                        children: [],
                    },
                    {
                        id: 'EncodeDecodeBase64TextTool',
                        name: 'text',
                        url: '/encode-decode/base64/text',
                        metadata: EncodeDecodeBase64TextTool.metadata,
                        children: [],
                    },
                ],
            },
            {
                id: 'EncodeDecodeUrlTool',
                name: 'url',
                url: '/encode-decode/url',
                metadata: EncodeDecodeUrlTool.metadata,
                children: [],
            },
        ],
    },
];
