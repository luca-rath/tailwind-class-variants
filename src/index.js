const assert = require('assert');
const plugin = require('tailwindcss/plugin');
const {default: prefixSelector} = require('tailwindcss/lib/util/prefixSelector');
const {
    applyPseudoToMarker,
    updateAllClasses,
    transformAllSelectors,
    transformAllClasses,
} = require('tailwindcss/lib/util/pluginUtils');

module.exports = plugin.withOptions(({ variants = [] } = {}) => {
    return function ({ addVariant, config }) {
        let pseudoVariants = variants.map((variant) => {
            let variantName, selector;

            if (Array.isArray(variant)) {
                assert(variant.length === 2);

                variantName = variant[0];
                assert(typeof variantName === 'string');
                assert(variantName);

                selector = variant[1];
                assert(typeof selector === 'string');
                assert(selector);
            } else {
                assert(typeof variant === 'string');
                assert(variant);

                variantName = variant;
                selector = `is(.${variant})`;
            }

            return [variantName, selector];
        });

        // The following code is copied from https://github.com/tailwindlabs/tailwindcss/blob/v2.2.19/src/jit/corePlugins.js#L149-L209
        for (let variant of pseudoVariants) {
            let [variantName, state] = Array.isArray(variant) ? variant : [variant, variant]

            addVariant(
                variantName,
                transformAllClasses((className, { withPseudo }) => {
                    return withPseudo(`${variantName}${config('separator')}${className}`, `:${state}`)
                })
            )
        }

        let groupMarker = prefixSelector(config('prefix'), '.group')
        for (let variant of pseudoVariants) {
            let [variantName, state] = Array.isArray(variant) ? variant : [variant, variant]
            let groupVariantName = `group-${variantName}`

            addVariant(
                groupVariantName,
                transformAllSelectors((selector) => {
                    let variantSelector = updateAllClasses(selector, (className) => {
                        if (`.${className}` === groupMarker) return className
                        return `${groupVariantName}${config('separator')}${className}`
                    })

                    if (variantSelector === selector) {
                        return null
                    }

                    return applyPseudoToMarker(
                        variantSelector,
                        groupMarker,
                        state,
                        (marker, selector) => `${marker} ${selector}`
                    )
                })
            )
        }

        let peerMarker = prefixSelector(config('prefix'), '.peer')
        for (let variant of pseudoVariants) {
            let [variantName, state] = Array.isArray(variant) ? variant : [variant, variant]
            let peerVariantName = `peer-${variantName}`

            addVariant(
                peerVariantName,
                transformAllSelectors((selector) => {
                    let variantSelector = updateAllClasses(selector, (className) => {
                        if (`.${className}` === peerMarker) return className
                        return `${peerVariantName}${config('separator')}${className}`
                    })

                    if (variantSelector === selector) {
                        return null
                    }

                    return applyPseudoToMarker(variantSelector, peerMarker, state, (marker, selector) =>
                        selector.trim().startsWith('~') ? `${marker}${selector}` : `${marker} ~ ${selector}`
                    )
                })
            )
        }
    };
});
