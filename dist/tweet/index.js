'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _core = require('../core');

var Tweet = (0, _core.twitterEmbedComponent)({
    embedComponent: function embedComponent(twttr) {
        var _twttr$widgets;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        return (_twttr$widgets = twttr.widgets).createTweetEmbed.apply(_twttr$widgets, args);
    },

    props: {
        errorMessage: {
            type: String,
            default: 'Whoops! We couldn\'t access this Tweet.'
        },
        errorMessageClass: {
            type: String,
            required: false
        }
    }
});

exports.default = Tweet;