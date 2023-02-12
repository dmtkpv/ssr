# @dmtkpv/ssr
Server Side Rendering for Vite + Vue.  
Compatible with [`vue-router`](https://github.com/vuejs/router) and [`@vueuse/head`](https://github.com/vueuse/head).

## Installation
```shell
npm i @dmtkpv/ssr
```

## Usage

Create `server.js`
```js
import express from 'express';
import createSSR from '@dmtkpv/ssr/createSSR';

(async () => {

    const port = 8080;
    const app = express();
    const ssr = await createSSR();

    app.use(ssr.middlewares);

    app.get('/*', (req, res, next) => {
        ssr.render(req.originalUrl).then(html => res.send(html)).catch(next)
    })

    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })

})();
```

In your main entry
```js
import createApp from '@dmtkpv/ssr/createApp'

export default createApp(App, app => {
    app.mount('body');
})
```

Run dev server
```shell
node server
```

Run production server
```shell
NODE_ENV=production node server
```

## Examples


### Initial state
The initial state is the application data that is serialized as part of the server-rendered HTML for later hydration in the browser. This data is normally gathered using fetch or DB requests from your API code.

The initial state is a plain JS object that is passed to your application and can be modified at will during SSR. This object will be serialized and later hydrated automatically in the browser, and passed to your app again so you can use it as a data source.
```js
import createApp from '@dmtkpv/ssr/createApp'

export default createApp(App, (app, state) => {
    if (import.meta.env.SSR) state.foo = 'bar'
    else console.log(state.foo) // => 'bar'
    app.mount('body');
})
```


### vue-router
```js
import createApp from '@dmtkpv/ssr/createApp'
import createRouter from '@dmtkpv/ssr/createRouter'

export default createApp(App, app => {
    const router = createRouter({ routes });
    app.use(router);
    app.mount('body');
})
```







