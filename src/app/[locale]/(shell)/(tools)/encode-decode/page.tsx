import { buildToolMetadata, ToolWelcomePage } from '@/tools';

export const metadata = buildToolMetadata('/encode-decode');

export default function EncodeDecodeMetadata() {
    return <ToolWelcomePage url='/encode-decode' />;
}