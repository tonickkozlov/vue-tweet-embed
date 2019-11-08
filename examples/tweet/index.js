const Vue = require('vue/dist/vue.js')
const Tweet = require('../../dist/tweet').default

new Vue({
  el: '#app',
  template: `<div>
    <div id="tweetLoaded">
      <p>Tweet that renders successfully:</p>
      <Tweet :id="'1129378242283098112'"></Tweet>
    </div>
    <div id="loadingError">
      <p>Error in loading tweet:</p>
      <Tweet :id="'y-u-no-load'" error-message="This tweet could not be loaded"></Tweet>
    </div>
    </div>`,
  components: {
    Tweet,
  }
})
