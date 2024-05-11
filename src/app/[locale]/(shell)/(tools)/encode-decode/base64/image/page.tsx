import dynamic from 'next/dynamic';

const EncodeDecodeBase64ImageTool = dynamic(() => import('@/tools//encode-decode/base64/image/index').then((mod) => mod.default));

export default function EncodeDecodeBase64ImageToolPage() {
    return <EncodeDecodeBase64ImageTool />;
}
