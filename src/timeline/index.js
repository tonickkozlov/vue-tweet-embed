import { twitterEmbedComponent } from '../core'

const Timeline = twitterEmbedComponent({
    embedComponent (twttr, ...args) {
        return twttr.widgets.createTimeline(...args)
    },
    props: {
        errorMessage: {
            type: String,
            default: 'Whoops! We couldn\'t access this Timeline.'
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

export default Timeline
