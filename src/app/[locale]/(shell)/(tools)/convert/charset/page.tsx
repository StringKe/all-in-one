import dynamic from 'next/dynamic';

const ConvertCharsetTool = dynamic(() => import('@/tools//convert/charset/index').then((mod) => mod.default));

export default function ConvertCharsetToolPage() {
    return <ConvertCharsetTool />;
}
