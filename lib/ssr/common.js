const { resolve } = require('path');
const { readFileSync } = require('fs');
const { renderToString } = require('vue/server-renderer');
const { JSDOM } = require('jsdom');



// -------------------------------
// Get entry point from index.html
// -------------------------------

exports.getEntry = function ({ root }) {
    const path = resolve(root, 'index.html');
    const template = readFileSync(path, 'utf8');
    const index = template.lastIndexOf('script type="module"');
    const matches = template.substr(index).match(/src="(.*)">/);
    return matches?.[1] || 'src/main'
}



// ---------------------
// Render
// ---------------------

exports.renderToString = async function (url, template, entry) {

    const app = await entry.default();
    const { config, ssr } = app;
    const { data, selector } = ssr;
    const { globalProperties: { $router, $head } } = config;

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
    script.textContent = `window.__STATE__ = ${JSON.stringify(data)}`;
    doc.head.append(script);

    const root = doc.querySelector(selector);
    root.innerHTML = html + root.innerHTML

    return doc.documentElement.outerHTML;

}
