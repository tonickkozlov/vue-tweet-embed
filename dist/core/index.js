"use strict";

var addScriptPromise = 0;
/** Adds proviced script to the page, once **/

function addPlatformScript(src) {
  if (!addScriptPromise) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
    addScriptPromise = new Promise(function (resolve, reject) {
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
    requred: true
  },
  sourceType: {
    type: String
  },
  options: Object
  /** Basic function used to mount Twitter component */

};

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

      var params = this.sourceType ? {
        sourceType: this.sourceType,
        screenName: this.id
      } : this.id;
      Promise.resolve(window.twttr ? window.twttr : addPlatformScript('//platform.twitter.com/widgets.js')).then(function (twttr) {
        return me.embedComponent(twttr, params, _this.$el, _this.options);
      }).then(function (data) {
        _this.isAvailable = data !== undefined;
        _this.isLoaded = true;
      });
    },
    render: function render(h) {
      if (this.isLoaded && this.isAvailable) {
        return h('div', {
          class: this.$props.widgetClass
        });
      }

      if (this.isLoaded && !this.isAvailable && this.$props.errorMessage) {
        var $errorMsg = h('div', {
          class: this.$props.errorMessageClass
        }, this.$props.errorMessage);
        return h('div', [$errorMsg]);
      }

      return h('div', {
        class: this.$props.widgetClass
      }, this.$slots.default);
    }
  };
};

module.exports = {
  addPlatformScript: addPlatformScript,
  twitterEmbedComponent: twitterEmbedComponent
};