/** @type {import('next-i18next').UserConfig} */
module.exports = {
    debug: process.env.NODE_ENV === 'development',
    reloadOnPrerender: process.env.NODE_ENV === 'development',
    i18n: {
        locales: ['zh-CN', 'en'],
        defaultLocale: 'zh-CN',
    },
    localePath:
        typeof window === 'undefined'
            ? require('path').resolve('./public/locales')
            : '/locales',
};
