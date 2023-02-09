import { createSSRApp } from 'vue'

export default function createApp (component) {

    const app = createSSRApp(component);

    if (typeof window === 'undefined') {
        app.mount = selector => app._selector = selector;
    }

    return app;

}