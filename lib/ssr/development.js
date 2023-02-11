const { resolve } = require('path');
const { readFileSync } = require('fs');
const { createServer } = require('vite');
const { getEntry, renderToString } = require('./common');



// ---------------------
// Exports
// ---------------------

module.exports = async function createDevSSR () {

    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom'
    })

    function getTemplate (url) {
        const path = resolve(vite.config.root, 'index.html');
        const content = readFileSync(path, 'utf8');
        return vite.transformIndexHtml(url, content);
    }

    function loadEntry () {
        const entry = getEntry(vite.config);
        return vite.ssrLoadModule(entry);
    }

    async function render (url) {
        try {
            const template = await getTemplate(url);
            const entry = await loadEntry();
            return renderToString(url, template, entry);
        }
        catch (error) {
            vite.ssrFixStacktrace(error);
            throw error;
        }
    }

    return {
        render,
        middlewares: vite.middlewares
    }

}
