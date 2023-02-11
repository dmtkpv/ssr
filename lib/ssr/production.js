import express from 'express'
import { resolve, basename } from 'path'
import { readFileSync } from 'fs'
import { resolveConfig, mergeConfig, build } from 'vite'
import { getEntry, getRenderedHTML } from './common.js'



// ---------------------
// Vite SSR config
// ---------------------

function getServerConfig (config) {
    return {
        build: {
            ssr: getEntry(config),
            outDir: 'dist/111',
            emptyOutDir: true,
        }
    }
}



// ---------------------
// Exports
// ---------------------

export default async function createProdSSR (inlineConfig) {

    const config = await resolveConfig(inlineConfig, 'build', 'production');
    const serverConfig = mergeConfig(inlineConfig, getServerConfig(config));

    await build(inlineConfig);
    await build(serverConfig);

    const dist = resolve(config.root, config.build.outDir);
    const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
    const entry = await import(resolve(serverConfig.build.outDir, basename(serverConfig.build.ssr)));

    function render (url) {
        return getRenderedHTML(url, template, entry);
    }

    return {
        render,
        middlewares: express.static(dist, { index: false })
    }

}
