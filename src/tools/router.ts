import {
    EncodeDecodeBase64ImageTool,
    EncodeDecodeBase64Metadata,
    EncodeDecodeBase64TextTool,
    EncodeDecodeMetadata,
    EncodeDecodeUnicodeTool,
    EncodeDecodeUrlTool,
} from './tools';
import type { IToolRouterArray } from './types';

export const toolRouter: IToolRouterArray = [
    {
        id: 'EncodeDecodeMetadataIndex',
        name: '/encode-decode',
        url: '/encode-decode',
        metadata: EncodeDecodeMetadata,
        children: [
            {
                id: 'EncodeDecodeUrlTool',
                name: '/encode-decode/url',
                url: '/encode-decode/url',
                metadata: EncodeDecodeUrlTool.metadata,
                children: [],
            },
            {
                id: 'EncodeDecodeBase64MetadataIndex',
                name: '/encode-decode/base64',
                url: '/encode-decode/base64',
                metadata: EncodeDecodeBase64Metadata,
                children: [
                    {
                        id: 'EncodeDecodeBase64TextTool',
                        name: '/encode-decode/base64/text',
                        url: '/encode-decode/base64/text',
                        metadata: EncodeDecodeBase64TextTool.metadata,
                        children: [],
                    },
                    {
                        id: 'EncodeDecodeBase64ImageTool',
                        name: '/encode-decode/base64/image',
                        url: '/encode-decode/base64/image',
                        metadata: EncodeDecodeBase64ImageTool.metadata,
                        children: [],
                    },
                ],
            },
            {
                id: 'EncodeDecodeUnicodeTool',
                name: '/encode-decode/unicode',
                url: '/encode-decode/unicode',
                metadata: EncodeDecodeUnicodeTool.metadata,
                children: [],
            },
        ],
    },
];
