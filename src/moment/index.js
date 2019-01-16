import { twitterEmbedComponent } from '../core'

const Moment = twitterEmbedComponent({
    embedComponent (twttr, ...args) {
        return twttr.widgets.createMoment(...args)
    },
    props: {
        errorMessage: {
            type: String,
            default: 'Whoops! We couldn\'t access this Moment.'
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

export default Moment
