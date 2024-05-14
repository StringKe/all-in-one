import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ImageResponse } from 'next/og';

import { getTranslate } from '@/tolgee/server';
import { findRouter, findRouterParent } from '@/tools';

export async function getPageOgImage(locale: string) {
    const t = await getTranslate();
    const font = await fs.promises.readFile(path.join(fileURLToPath(import.meta.url), '../', 'font.ttf'));

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '-.02em',
                    fontWeight: 700,
                    background: 'white',
                }}
            >
                <div
                    style={{
                        left: 42,
                        top: 42,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <span
                        style={{
                            width: 24,
                            height: 24,
                            background: 'black',
                        }}
                    />
                    <span
                        style={{
                            marginLeft: 8,
                            fontSize: 20,
                        }}
                    >
                        yzos.com
                    </span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '20px 50px',
                        margin: '0 42px',
                        fontSize: 40,
                        width: 'auto',
                        maxWidth: 550,
                        textAlign: 'center',
                        backgroundColor: 'black',
                        color: 'white',
                        lineHeight: 1.4,
                    }}
                >
                    {t('site.one-description', {
                        language: locale,
                        noWrap: true,
                    })}
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Font',
                    data: font,
                    style: 'normal',
                    weight: 400,
                },
            ],
        },
    );
}

export async function getToolOgImage(locale: string, url: string) {
    const currentRouter = findRouter(url)!;
    const parentRouter = findRouterParent(url);

    const t = await getTranslate();
    const font = await fs.promises.readFile(path.join(fileURLToPath(import.meta.url), '../', 'font.ttf'));

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    letterSpacing: '-.02em',
                    fontWeight: 700,
                    background: 'white',
                }}
            >
                <div
                    style={{
                        left: 42,
                        top: 42,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <span
                        style={{
                            width: 24,
                            height: 24,
                            background: 'black',
                        }}
                    />
                    <span
                        style={{
                            marginLeft: 8,
                            fontSize: 20,
                        }}
                    >
                        {parentRouter
                            ? `${t(parentRouter.title, {
                                  language: locale,
                                  noWrap: true,
                              })} - yzos.com`
                            : 'yzos.com'}
                    </span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '20px 50px',
                        margin: '0 42px',
                        fontSize: 40,
                        width: 'auto',
                        maxWidth: 800,
                        textAlign: 'center',
                        backgroundColor: 'black',
                        color: 'white',
                        lineHeight: 1.4,
                    }}
                >
                    <div>
                        {t(currentRouter.title, {
                            language: locale,
                            noWrap: true,
                        })}
                    </div>
                    <div
                        style={{
                            color: '#c4c4c4',
                            fontSize: 18,
                            fontWeight: 400,
                            lineHeight: 1.2,
                        }}
                    >
                        {t(currentRouter.description, {
                            language: locale,
                            noWrap: true,
                        })}
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Font',
                    data: font,
                    style: 'normal',
                    weight: 400,
                },
            ],
        },
    );
}
