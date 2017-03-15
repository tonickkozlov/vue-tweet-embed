const callbacks = []

function addScript (src, cb) {
    if (callbacks.length === 0) {
        callbacks.push(cb)
        var s = document.createElement('script')
        s.setAttribute('src', src)
        s.onload = () => callbacks.forEach((cb) => cb())
        document.body.appendChild(s)
    } else {
        callbacks.push(cb)
    }
}

function renderTweet (id, $el, options) {
    window.twttr.widgets.createTweetEmbed(id, $el, options)
}

export default {
    props: {
        id: {
            type: String,
            required: true
        },
        options: Object
    },
    mounted () {
        if (!window.twttr) {
            addScript('//platform.twitter.com/widgets.js', renderTweet.bind(null, this.id, this.$el, this.options))
        } else {
            renderTweet(this.id, this.$el, this.options)
        }
    },
    render (h) {
        return h('div', {}, this.$slots.default)
    }
}
