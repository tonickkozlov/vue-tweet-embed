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
            isTweetAvailable: true
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
        }) : renderTweet(this.id, this.$el, this.options)).then(function (data) {
            if(data == undefined){
                _this.isTweetAvailable = false
            }
            else{
                _this.isTweetAvailable = true   
            }
            _this.isTweetLoaded = true;
        });
    },
    render: function render(h) {
        var msg = h('div', {class: 'msgClass' }, "We could not access this Tweet."); //define css for 'msgClass' in your page
        return h('div', this.isTweetLoaded ? (this.isTweetAvailable ? undefined : [msg]) : this.$slots.default);
    }
};