'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var addScriptPromise = null;
function addScript(src) {
    if (!addScriptPromise) {
        var s = document.createElement('script');
        s.setAttribute('src', src);
        document.body.appendChild(s);
        addScriptPromise = new Promise(function (resolve, reject) {
            s.onload = resolve;
        });
    }
    return addScriptPromise;
}

function renderTweet(id, $el, options) {
    return window.twttr.widgets.createTweetEmbed(id, $el, options);
}

exports.default = {
    data: function data() {
        return {
            isTweetLoaded: false
        };
    },

    props: {
        id: {
            type: String,
            required: true
        },
        options: Object
    },
    mounted: function mounted() {
        var _this = this;

        (!window.twttr ? addScript('//platform.twitter.com/widgets.js').then(function () {
            return renderTweet(_this.id, _this.$el, _this.options);
        }) : renderTweet(this.id, this.$el, this.options)).then(function () {
            _this.isTweetLoaded = true;
        });
    },
    render: function render(h) {
        return h('div', this.isTweetLoaded ? undefined : this.$slots.default);
    }
};