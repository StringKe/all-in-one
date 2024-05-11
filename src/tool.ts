/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/// 此文件不能导入任何外部模块
/// this file can not import any module
/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export declare type IToolRouter = {
    title: string;
    url: string;
    description: string;
    keywords: string[];
    icon?: string;
    children?: IToolRouter[];
};

export const toolRouters: IToolRouter[] = [
    {
        title: 'tool.encode-decode',
        url: '/encode-decode',
        description: 'tool.encode-decode.description',
        keywords: ['encode', 'decode'],
        children: [
            {
                title: 'tool.encode-decode.base64',
                url: '/encode-decode/base64',
                description: 'tool.encode-decode.base64.description',
                keywords: ['base64'],
                children: [
                    {
                        title: 'tool.encode-decode.base64.image',
                        url: '/encode-decode/base64/image',
                        description: 'tool.encode-decode.base64.image.description',
                        keywords: ['image'],
                    },
                    {
                        title: 'tool.encode-decode.base64.text',
                        url: '/encode-decode/base64/text',
                        description: 'tool.encode-decode.base64.text.description',
                        keywords: ['text'],
                    },
                    {
                        title: 'tool.encode-decode.base64.binary',
                        url: '/encode-decode/base64/binary',
                        description: 'tool.encode-decode.base64.binary.description',
                        keywords: ['binary'],
                    },
                ],
            },
            {
                title: 'tool.encode-decode.url',
                url: '/encode-decode/url',
                description: 'tool.encode-decode.url.description',
                keywords: ['url'],
            },
        ],
    },
    {
        title: 'convert',
        url: '/convert',
        description: 'convert',
        keywords: ['convert'],
        children: [
            {
                title: 'convert.charset',
                url: '/convert/charset',
                description: 'convert.charset.description',
                keywords: ['charset'],
            },
        ],
    },
];
