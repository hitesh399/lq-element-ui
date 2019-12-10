module.exports = {
    configureWebpack: config => {
        const externalPackages = {
            'axios': 'axios',
            'validate.js': 'validate.js',
            'vuex': 'vuex',
            'vuejs-object-helper': 'vuejs-object-helper',
            'vue': 'vue',
            'lq-form': 'lq-form',
            'date-fns': 'date-fns',
            'lodash': 'lodash',
        }
        config.externals = {
            ...config.externals,
            ...(process.env.NODE_ENV === 'production' ? externalPackages : {})
        }
    }
}