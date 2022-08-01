"use strict";

var _vue = require("vue");

var addScriptPromise = 0;
/** Adds provided script to the page, once **/

function addPlatformScript(src) {
  if (!addScriptPromise) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
    addScriptPromise = new Promise(function (resolve) {
      s.onload = function () {
        resolve(window.twttr);
      };
    });
  }

  return addScriptPromise;
}

var defaultProps = {
  id: {
    type: String,
    required: true
  },
  sourceType: {
    type: String
  },
  slug: {
    type: String
  },
  options: Object
};
/** Basic function used to mount Twitter component */

var twitterEmbedComponent = function twitterEmbedComponent(me) {
  return {
    data: function data() {
      return {
        isLoaded: false,
        isAvailable: false
      };
    },
    props: Object.assign({}, defaultProps, me.props),
    mounted: function mounted() {
      var _this = this;

      var params;

      if (this.sourceType === 'profile') {
        params = {
          sourceType: this.sourceType,
          screenName: this.id
        };
      } else if (this.sourceType === 'list') {
        params = {
          sourceType: this.sourceType,
          ownerScreenName: this.id,
          slug: this.slug
        };
      } else {
        params = this.id;
      }

      Promise.resolve(window.twttr ? window.twttr : addPlatformScript('//platform.twitter.com/widgets.js')).then(function (twttr) {
        if (typeof params === 'string' && !Number(params)) return Promise.reject();
        return me.embedComponent(twttr, params, _this.$el, _this.options);
      }).then(function (data) {
        _this.isAvailable = data !== undefined;
        _this.isLoaded = true;
      }).catch(function () {
        _this.isAvailable = false;
        _this.isLoaded = true;
      });
    },
    render: function render() {
      if (this.isLoaded && this.isAvailable) {
        return (0, _vue.h)('div', {
          class: this.$props.widgetClass
        });
      }

      if (this.isLoaded && !this.isAvailable && this.$props.errorMessage) {
        var $errorMsg = (0, _vue.h)('div', {
          class: this.$props.errorMessageClass,
          innerHTML: this.$props.errorMessage
        });
        return (0, _vue.h)('div', [$errorMsg]);
      }

      return (0, _vue.h)('div', {
        class: this.$props.widgetClass
      }, this.$slots.default && this.$slots.default());
    }
  };
};

module.exports = {
  addPlatformScript: addPlatformScript,
  twitterEmbedComponent: twitterEmbedComponent
};