const express = require('express');
const createSSR = require('@dmtkpv/ssr/createSSR');

(async () => {

    const port = 8080;
    const app = express();
    const ssr = await createSSR();

    app.use(ssr);

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })

})();


