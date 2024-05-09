import { IconCode } from '@tabler/icons-react';

import { GenerateRouter } from './generate-router';
import { buildRouterModify, type Router } from './router.utils';

const toolRouter: Router[] = GenerateRouter;
const modifyRouter = buildRouterModify(toolRouter);

modifyRouter('/encode-decode/unicode', {
    tKey: 'EncodeDecodeUnicodeTool',
    icon: <IconCode />,
});

export { toolRouter };
