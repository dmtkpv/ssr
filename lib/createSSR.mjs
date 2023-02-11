import production from './ssr/production.mjs'
import development from './ssr/development.mjs'

export default function createSSR (inlineConfig = {}) {
    const isProd = process.env.NODE_ENV === 'production';
    const create = isProd ? production : development;
    return create(inlineConfig);
}
