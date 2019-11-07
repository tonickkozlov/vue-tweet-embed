const Vue = require('vue/dist/vue.js')
const Tweet = require('../../dist/tweet').default

new Vue({
  el: '#app',
  template: `<Tweet :id="'1129378242283098112'"></Tweet>`,
  components: {
    Tweet,
  }
})
