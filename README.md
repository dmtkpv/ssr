# @dmtkpv/ssr
Server Side Rendering for Vite + Vue.  
Works with [`vue-router`](https://github.com/vuejs/router) and [`@vueuse/head`](https://github.com/vueuse/head).

## Installation
```shell
npm i @dmtkpv/ssr
```

## Usage

Create `server.js`
```js
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
```

In your main entry
```js
import createApp from '@dmtkpv/ssr/createApp'

export default () => {
    return createApp(App).mount('body');
}
```

Run the server
```shell
node server
```




