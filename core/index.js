let addScriptPromise = null

/** Adds proviced script to the page, once **/
function addPlatformScript (src) {
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
        required: true
    },
    options: Object
}

/** Basic function used to mount Twitter component */
const twitterEmbedComponent = (me) => {
    return {
        data () {
            return {
                isLoaded: false,
                isAvailable: false
            }
        },
        props: Object.assign({}, defaultProps, me.props),
        mounted () {
            Promise.resolve(window.twttr ? window.twttr : addPlatformScript('//platform.twitter.com/widgets.js'))
            .then(twttr => me.embedComponent(twttr, this.id, this.$el, this.options))
            .then(data => {
                this.isAvailable = (data !== undefined)
                this.isLoaded = true
            })
        },
        render (h) {
            if (this.isLoaded && this.isAvailable) {
                return h('div')
            }
            if (this.isLoaded && !this.isAvailable && this.$props.errorMessage) {
                const $errorMsg = h('div', { class: this.$props.errorMessageClass }, this.$props.errorMessage)
                return h('div', [$errorMsg])
            }
            return h('div', this.$slots.default)
        }
    }
}

module.exports = { addPlatformScript, twitterEmbedComponent }
