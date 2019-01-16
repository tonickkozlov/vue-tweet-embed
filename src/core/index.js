let addScriptPromise = 0

/** Adds proviced script to the page, once **/
function addPlatformScript(src) {
    if (!addScriptPromise) {
        const s = document.createElement('script')
        s.setAttribute('src', src)
        document.body.appendChild(s)
        addScriptPromise = new Promise((resolve, reject) => {
            s.onload = () => {
                resolve(window.twttr)
            }
        })
    }
    return addScriptPromise
}

const defaultProps = {
    id: {
        type: String,
        requred: true
    },
    sourceType: {
        type: String
    },
    options: Object
}

/** Basic function used to mount Twitter component */
const twitterEmbedComponent = (me) => {
    return {
        data() {
            return {
                isLoaded: false,
                isAvailable: false
            }
        },
        props: Object.assign({}, defaultProps, me.props),
        mounted() {
            let params = (this.sourceType) ? { sourceType: this.sourceType, screenName: this.id } : this.id

            Promise.resolve(window.twttr ? window.twttr : addPlatformScript('//platform.twitter.com/widgets.js'))
                .then(twttr => me.embedComponent(twttr, params, this.$el, this.options))
                .then(data => {
                    this.isAvailable = (data !== undefined)
                    this.isLoaded = true
                })
        },
        render(h) {
            if (this.isLoaded && this.isAvailable) {
                return h('div', { class: this.$props.widgetClass })
            }

            if (this.isLoaded && !this.isAvailable && this.$props.errorMessage) {
                const $errorMsg = h('div', { class: this.$props.errorMessageClass }, this.$props.errorMessage)
                return h('div', [$errorMsg])
            }

            return h('div', { class: this.$props.widgetClass }, this.$slots.default)
        }
    }
}

module.exports = { addPlatformScript, twitterEmbedComponent }
