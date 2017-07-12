# vue-tweet-embed

Embed tweets in your vue.js app
inspired by https://github.com/capaj/react-tweet-embed

## Install
```
npm i vue-tweet-embed
#or
jspm i npm:vue-tweet-embed
```

## Quickstart

```javascript
import Tweet from 'vue-tweet-embed'

<Tweet :id="'692527862369357824'"></Tweet>
```

You don't have to put `//platform.twitter.com/widgets.js` script in your index.html as this lib will
put it there if `twttr` is not found on window.  


## Using Options

```javascript
<Tweet :id="'783943172057694208'" :options="{ cards: 'hidden' }"/>
<Tweet :id="'771763270273294336'" :options="{ theme: 'dark' }"/>
```

Embedded-Tweet Options Reference:
https://dev.twitter.com/web/embedded-tweets/parameters


## Showing a placeholder while the tweet is being loaded

To show some content to the user while the tweet is being loaded, just put it inside the Tweet
component. Placeholder content will be removed automatically once the tweet has finished loading.

```javascript
<Tweet :id="'783943172057694208'"/><div class="spinner"></div></Tweet>
```


## Show some css effect to deleted tweet message - "We could not access this Tweet."

Define "msgClass" css class with your css in your page.

```
.msgClass {
	// styles goes here
}
```