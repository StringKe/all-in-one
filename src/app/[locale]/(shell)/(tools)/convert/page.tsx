import { buildToolMetadata, ToolWelcomePage } from '@/tools';

export const metadata = buildToolMetadata('/convert');

export default function ConvertMetadata() {
    return <ToolWelcomePage url='/convert' />;
}