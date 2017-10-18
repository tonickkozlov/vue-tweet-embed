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
            isTweetLoaded: false,
            isTweetAvailable: false
        };
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
    mounted: function mounted() {
        var _this = this;

        (!window.twttr ? addScript('//platform.twitter.com/widgets.js').then(function () {
            return renderTweet(_this.id, _this.$el, _this.options);
        }) : renderTweet(this.id, this.$el, this.options)).then(function (data) {
            _this.isTweetAvailable = data !== undefined;
            _this.isTweetLoaded = true;
        });
    },
    render: function render(h) {
        if (this.isTweetLoaded && this.isTweetAvailable) {
            return h('div');
        }
        if (this.isTweetLoaded && !this.isTweetAvailable) {
            var $errorMsg = h('div', { class: this.$props.errorMessageClass }, this.$props.errorMessage);
            return h('div', [$errorMsg]);
        }
        return h('div', this.$slots.default);
    }
};