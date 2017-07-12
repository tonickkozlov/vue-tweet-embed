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
            isTweetAvailable: true
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
        .then((data) => {
            this.isTweetLoaded = true
            if (data === undefined) {
                this.isTweetAvailable = false
            } else {
                this.isTweetAvailable = true
            }
        })
    },
    render (h) {
        var msg = h('div', { class: 'msgClass' }, 'We could not access this Tweet.') // define css for 'msgClass' in your page
        return h('div', this.isTweetLoaded ? (this.isTweetAvailable ? undefined : [msg]) : this.$slots.default)
    }
}
