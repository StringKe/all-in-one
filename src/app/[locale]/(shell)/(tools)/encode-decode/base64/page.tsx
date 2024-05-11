import { buildToolMetadata, ToolWelcomePage } from '@/tools';

export const metadata = buildToolMetadata('/encode-decode/base64');

export default function EncodeDecodeBase64Metadata() {
    return <ToolWelcomePage url='/encode-decode/base64' />;
}
