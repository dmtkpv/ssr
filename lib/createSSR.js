module.exports = function createSSR (inlineConfig = {}) {
    const isProd = process.env.NODE_ENV === 'production';
    const create = isProd ? require('./ssr/production') : require('./ssr/development');
    return create(inlineConfig);
}
