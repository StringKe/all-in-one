import dynamic from 'next/dynamic';

const EncodeDecodeUrlTool = dynamic(() => import('@/tools//encode-decode/url/index').then((mod) => mod.default));

export default function EncodeDecodeUrlToolPage() {
    return <EncodeDecodeUrlTool />;
}