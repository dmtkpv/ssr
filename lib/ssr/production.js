const { resolve, parse } = require('path');
const { readFileSync } = require('fs');
const { resolveConfig, mergeConfig, build } = require('vite');
const { getEntry, renderToString } = require('./common')
const express = require('express');



// ---------------------
// Vite SSR config
// ---------------------

function getServerConfig (config) {
    return {
        build: {
            ssr: getEntry(config),
            outDir: resolve(__dirname, '../dist'),
            emptyOutDir: true,
        },
        ssr: {
            format: 'cjs'
        }
    }
}



// ---------------------
// Exports
// ---------------------

module.exports = async function createProdSSR (inlineConfig) {

    const config = await resolveConfig(inlineConfig, 'build', 'production');
    const serverConfig = mergeConfig(inlineConfig, getServerConfig(config));

    await build(inlineConfig);
    await build(serverConfig);

    const dist = resolve(config.root, config.build.outDir);
    const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
    const entry = require(resolve(serverConfig.build.outDir, parse(serverConfig.build.ssr).name));

    function render (url) {
        return renderToString(url, template, entry);
    }

    return {
        render,
        middlewares: express.static(dist, { index: false })
    }

}
