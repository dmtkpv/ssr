const express = require('express');
const createSSR = require('@dmtkpv/ssr/createSSR');

(async () => {

    const port = 8080;
    const app = express();
    const ssr = await createSSR();

    app.use(ssr.middlewares);

    app.get('/*', (req, res, next) => {
        ssr.render(req.url).then(html => res.send(html)).catch(next)
    })

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })

})();


