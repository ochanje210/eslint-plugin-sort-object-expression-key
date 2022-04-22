import rules from './rules'

module.exports = {
    configs: {
        recommended: {
            plugins: ['sort-object-expression-key'],
            rules: {
                "sort-object-expression-key/object-properties": "warn",
            }
        }
    },
    rules: {
        "object-properties": rules
    }
}
