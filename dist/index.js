'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var callbacks = [];

function addScript(src, cb) {
    if (callbacks.length === 0) {
        callbacks.push(cb);
        var s = document.createElement('script');
        s.setAttribute('src', src);
        s.onload = function () {
            return callbacks.forEach(function (cb) {
                return cb();
            });
        };
        document.body.appendChild(s);
    } else {
        callbacks.push(cb);
    }
}

function renderTweet(id, $el, options) {
    window.twttr.widgets.createTweetEmbed(id, $el, options);
}

exports.default = {
    props: {
        id: {
            type: String,
            required: true
        },
        options: Object
    },
    mounted: function mounted() {
        if (!window.twttr) {
            addScript('//platform.twitter.com/widgets.js', renderTweet.bind(null, this.id, this.$el, this.options));
        } else {
            renderTweet(this.id, this.$el, this.options);
        }
    },
    render: function render(h) {
        return h('div', {}, this.$slots.default);
    }
};