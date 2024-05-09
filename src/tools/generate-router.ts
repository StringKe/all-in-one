const GenerateRouter = [
            {
                "id": "EncodeDecodeUnicodeTool",
                "name": "encode-decode",
                "url": "/encode-decode",
                "children": [
                    {
                        "id": "EncodeDecodeUnicodeTool",
                        "name": "unicode",
                        "url": "/encode-decode/unicode",
                        "children": []
                    },
                    {
                        "id": "EncodeDecodeBase64ImageTool",
                        "name": "base64",
                        "url": "/encode-decode/base64",
                        "children": [
                            {
                                "id": "EncodeDecodeBase64ImageTool",
                                "name": "image",
                                "url": "/encode-decode/base64/image",
                                "children": []
                            },
                            {
                                "id": "EncodeDecodeBase64TextTool",
                                "name": "text",
                                "url": "/encode-decode/base64/text",
                                "children": []
                            }
                        ]
                    },
                    {
                        "id": "EncodeDecodeUrlTool",
                        "name": "url",
                        "url": "/encode-decode/url",
                        "children": []
                    }
                ]
            }
        ];

export { GenerateRouter };
