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
            'lodash/core': 'lodash/core',
            'lodash/cloneDeep': 'lodash/cloneDeep',
            'vue-phone-number-input': 'vue-phone-number-input',
            'libphonenumber-js': 'libphonenumber-js',
            'vue-google-autocomplete': 'vue-google-autocomplete'
        }
        config.externals = {
            ...config.externals,
            ...(process.env.NODE_ENV === 'production' ? externalPackages : {})
        }
    }
}