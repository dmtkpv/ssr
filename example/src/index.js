import createApp from '@dmtkpv/ssr/createApp'
import App from './index.vue'







export default function (state) {

    const app = createApp(App);
    // // const api = createAPI({ state });
    // // const head = createHead();
    // // const router = createRouter({ api });
    // //
    // // app.provide('api', api);
    // // app.use(head);
    // // app.use(router);
    app.mount('body');
    //
    return app;

}

