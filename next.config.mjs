/* eslint-disable */

import bundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        optimizePackageImports: [
            '@emotion/cache',
            '@emotion/react',
            '@emotion/serialize',
            '@emotion/utils',
            '@mantine/carousel',
            '@mantine/charts',
            '@mantine/code-highlight',
            '@mantine/core',
            '@mantine/dates',
            '@mantine/dropzone',
            '@mantine/emotion',
            '@mantine/form',
            '@mantine/hooks',
            '@mantine/modals',
            '@mantine/notifications',
            '@mantine/nprogress',
            '@mantine/spotlight',
            '@mantine/tiptap',
            '@tabler/icons-react',
            '@tanstack/react-query',
            '@tiptap/extension-link',
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@trpc/client',
            '@trpc/react-query',
            'dayjs',
            'embla-carousel-react',
            'recharts',
        ],
    },
};

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withBundleAnalyzer(config));
