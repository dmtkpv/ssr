const { resolve } = require('path');
const { readFileSync } = require('fs');
const { Router } = require('express');
const { createServer } = require('vite');
const { renderToString } = require('vue/server-renderer');
const { JSDOM } = require('jsdom');




// ---------------------
// Render
// ---------------------

async function render (url, template, entry) {

    const { app, data } = await entry.default();
    const { $router, $head } = app.config.globalProperties;

    if ($router) {
        await $router.push(url);
    }

    const html = await renderToString(app);
    const dom = new JSDOM(template);
    const doc = dom.window.document;

    if ($head) {
        const { renderDOMHead } = require('@unhead/dom');
        await renderDOMHead($head, { document: doc })
    }

    const script = doc.createElement('script');
    script.textContent = `window.INITIAL_DATA = ${JSON.stringify(data)}`;
    doc.head.append(script);

    const root = doc.querySelector(app._selector);
    root.innerHTML = html + root.innerHTML

    return doc.documentElement.outerHTML;

}




// ---------------------
// Dev server
// ---------------------

async function createDevSSR () {

    const router = Router();

    const vite = await createServer({
        server: { middlewareMode: true, force: true },
        appType: 'custom'
    })

    function getTemplate (url) {
        const path = resolve(vite.config.root, 'index.html');
        const content = readFileSync(path, 'utf8');
        return vite.transformIndexHtml(url, content);
    }

    function getEntry (template) {
        const index = template.lastIndexOf('script type="module"');
        const matches = template.substr(index).match(/src="(.*)">/);
        const entry = matches?.[1] || 'src/main'
        return vite.ssrLoadModule(entry);
    }

    router.use(vite.middlewares);

    router.get('/*', async (req, res, next) => {
        try {
            const url = req.originalUrl;
            const template = await getTemplate(url);
            const entry = await getEntry(template);
            const html = await render(url, template, entry);
            res.send(html);
        }
        catch (error) {
            vite.ssrFixStacktrace(error);
            next(error);
        }

    })

    return router;

}



// ---------------------
// Prod server
// ---------------------

function createProdSSR () {

}



// ---------------------
// Exports
// ---------------------

module.exports = function createSSR () {
    return process.env.NODE_ENV === 'production' ? createProdSSR() : createDevSSR();
}
