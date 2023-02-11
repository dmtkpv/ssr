import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from 'vue-router'

export default function createRouter (options) {
    const isSSR = typeof window === 'undefined';
    const history = isSSR ? createMemoryHistory() : createWebHistory();
    return createVueRouter({ ...options, history });
}