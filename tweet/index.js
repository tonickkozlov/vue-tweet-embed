import { twitterEmbedComponent } from '../core'

const Tweet = twitterEmbedComponent({
    embedComponent (twttr, ...args) {
        return twttr.widgets.createTweetEmbed(...args)
    },
    props: {
        errorMessage: {
            type: String,
            default: 'Whoops! We couldn\'t access this Tweet.'
        },
        errorMessageClass: {
            type: String,
            required: false
        },
        widgetClass: {
            type: String,
            required: false
        }
    }
})

export default Tweet
