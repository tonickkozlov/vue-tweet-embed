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
            isTweetLoaded: false
        }
    },
    props: {
        id: {
            type: String,
            required: true
        },
        options: Object
    },
    mounted () {
        (
            !window.twttr ? addScript('//platform.twitter.com/widgets.js')
            .then(() => renderTweet(this.id, this.$el, this.options))
            : renderTweet(this.id, this.$el, this.options)
        )
        .then(() => {
            this.isTweetLoaded = true
        })
    },
    render (h) {
        return h('div', this.isTweetLoaded ? undefined : this.$slots.default)
    }
}
