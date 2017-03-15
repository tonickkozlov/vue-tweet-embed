# vue-tweet-embed
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

```
<Tweet :id="'783943172057694208'" :options="{ cards: 'hidden' }"/>
<Tweet :id="'771763270273294336'" :options="{ theme: 'dark' }"/>
```

Embedded-Tweet Options Reference:
https://dev.twitter.com/web/embedded-tweets/parameters
