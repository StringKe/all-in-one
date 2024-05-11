import dynamic from 'next/dynamic';

const EncodeDecodeBase64TextTool = dynamic(() => import('@/tools//encode-decode/base64/text/index').then((mod) => mod.default));

export default function EncodeDecodeBase64TextToolPage() {
    return <EncodeDecodeBase64TextTool />;
}
