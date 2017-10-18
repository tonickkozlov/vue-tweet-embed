let addScriptPromise = null
function addScript (src) {
    if (!addScriptPromise) {
        const s = document.createElement('script')
        s.setAttribute('src', src)
        document.body.appendChild(s)
        addScriptPromise = new Promise((resolve, reject) => {
            s.onload = resolve
        })
    }
    return addScriptPromise
}

function renderTweet (id, $el, options) {
    return window.twttr.widgets.createTweetEmbed(id, $el, options)
}

export default {
    data () {
        return {
            isTweetLoaded: false,
            isTweetAvailable: false
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },
        errorMessage: {
            type: String,
            default: 'Whoops! We couldn\'t access this Tweet.'
        },
        errorMessageClass: {
            type: String,
            required: false
        },
        options: Object
    },
    mounted () {
        (
            !window.twttr ? addScript('//platform.twitter.com/widgets.js')
            .then(() => renderTweet(this.id, this.$el, this.options))
            : renderTweet(this.id, this.$el, this.options)
        )
        .then(data => {
            this.isTweetAvailable = (data !== undefined)
            this.isTweetLoaded = true
        })
    },
    render (h) {
        if (this.isTweetLoaded && this.isTweetAvailable) {
            return h('div')
        }
        if (this.isTweetLoaded && !this.isTweetAvailable) {
            const $errorMsg = h('div', { class: this.$props.errorMessageClass }, this.$props.errorMessage)
            return h('div', [$errorMsg])
        }
        return h('div', this.$slots.default)
    }
}
