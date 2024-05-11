import dynamic from 'next/dynamic';

const EncodeDecodeBase64BinaryTool = dynamic(() => import('@/tools//encode-decode/base64/binary/index').then((mod) => mod.default));

export default function EncodeDecodeBase64BinaryToolPage() {
    return <EncodeDecodeBase64BinaryTool />;
}
