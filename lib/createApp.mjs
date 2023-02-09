import { createSSRApp } from 'vue'

export default function createApp (component, callback) {

    const isSSR = typeof window === 'undefined';

    async function setup (data = {}) {
        const app = createSSRApp(component);
        app._mount = app.mount;
        app.mount = selector => app._selector = selector;
        await callback(app, data);
        return { app, data };
    }

    async function mount () {
        const { app } = await setup(window.INITIAL_DATA);
        const { $router } = app.config.globalProperties;
        if ($router) await $router.isReady();
        app._mount(app._selector);
    }

    return isSSR ? setup : mount();

}