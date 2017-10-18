import test from 'ava'
import jsdom from 'jsdom'
import decache from 'decache'
import { spy } from 'simple-spy'

const createEnv = (scripts = []) => {
    return new Promise((resolve, reject) => {
        jsdom.env({
            html: '<!doctype html><html><body></body></html>',
            scripts: [require.resolve('vue/dist/vue'), ...scripts],
            done: (err, window) => {
                if (err) {
                    reject(err)
                }

                const Vue = window.Vue
                const document = window.document
                // require a new instance of Tweet every time to avoid side-effects
                const Tweet = require('./index.js').default

                // set global after initialization of Vue
                global.window = window
                global.document = document

                resolve({ Vue, Tweet, window, document })
            }
        })
    })
}

test.beforeEach(t => {
    return createEnv().then(data => {
        t.context = data
    })
})

test.afterEach(() => {
    // remove old cached versoin of Tweet every time to avoid side-effects
    decache('./index.js')
})

test('Should inject twitter embed script if none is given', t => {
    const { Tweet, Vue, document } = t.context
    const Ctor = Vue.extend(Tweet)
    new Ctor().$mount()

    const $script = document.querySelector('script[src="//platform.twitter.com/widgets.js"]')
    t.true($script !== null)
})

test('Should not inject more than one script par page', t => {
    const { Tweet, Vue, document } = t.context

    const TweetPage = {
        components: { Tweet },
        template: '<div><Tweet v-for="i in [1, 2, 3]"/></div>'
    }
    const Ctor = Vue.extend(TweetPage)
    new Ctor().$mount()

    const $scripts = document.querySelectorAll('script[src="//platform.twitter.com/widgets.js"]')
    t.is($scripts.length, 1)
})

test('Should not inject anything if a twttr object is set on a window', t => {
    const { Tweet, Vue, document, window } = t.context
    window.twttr = { foo: 'bar' }
    const Ctor = Vue.extend(Tweet)
    new Ctor().$mount()

    const $script = document.querySelector('script[src="//platform.twitter.com/widgets.js"]')
    t.true($script === null)
})

test('Should call twitter embed library with own id, element', t => {
    const { Tweet, Vue, window } = t.context
    const mockTwttr = {
        widgets: {
            createTweetEmbed: spy(() => {})
        }
    }
    window.twttr = mockTwttr

    const Ctor = Vue.extend(Tweet)
    const vm = new Ctor({
        propsData: {
            id: '123' /* options not specified */
        }
    }).$mount()

    t.is(mockTwttr.widgets.createTweetEmbed.callCount, 1)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0].length, 3)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][0], '123')
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][1], vm.$el)
})

test('Should call twitter embed library with passed options', t => {
    const { Tweet, Vue, window } = t.context
    const mockTwttr = {
        widgets: {
            createTweetEmbed: spy(() => {})
        }
    }
    window.twttr = mockTwttr

    const Ctor = Vue.extend(Tweet)
    const vm = new Ctor({
        propsData: {
            id: '123',
            options: { foo: 'bar' }
        }
    }).$mount()

    t.is(mockTwttr.widgets.createTweetEmbed.callCount, 1)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0].length, 3)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][0], '123')
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][1], vm.$el)
    t.deepEqual(mockTwttr.widgets.createTweetEmbed.args[0][2], { foo: 'bar' })
})

test.cb('Should show children while tweet is not loaded', t => {

    const { Tweet, Vue, window } = t.context
    const mockTwttr = {
        widgets: {
            createTweetEmbed: () => {
                // emulate tweet being loaded
                return Promise.resolve()
            }
        }
    }
    window.twttr = mockTwttr

    const Ctor = Vue.extend({
        template: '<Tweet id="123"><div id="foo">hi</div></Tweet>',
        components: { Tweet }
    })
    const vm = new Ctor().$mount()

    t.truthy(vm.$el.querySelector('#foo'))
    setTimeout(() => {
        t.falsy(vm.$el.querySelector('#foo'))
        t.end()
    }, 0)
})

test('Should call twitter embed library with own id here tweet is NA or deleted, element', t => {
    const { Tweet, Vue, window } = t.context
    const mockTwttr = {
        widgets: {
            createTweetEmbed: spy(() => {})
        }
    }
    window.twttr = mockTwttr

    const Ctor = Vue.extend(Tweet)
    const vm = new Ctor({
        propsData: {
            id: '14' /* options not specified */
        }
    }).$mount()

    t.is(mockTwttr.widgets.createTweetEmbed.callCount, 1)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0].length, 3)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][0], '14')
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][1], vm.$el)
})

test('Should call twitter embed library with passed options  here tweet(id) is NA or deleted', t => {
    const { Tweet, Vue, window } = t.context
    const mockTwttr = {
        widgets: {
            createTweetEmbed: spy(() => {})
        }
    }
    window.twttr = mockTwttr

    const Ctor = Vue.extend(Tweet)
    const vm = new Ctor({
        propsData: {
            id: '14',
            options: { foo1: 'bar1' }
        }
    }).$mount()

    t.is(mockTwttr.widgets.createTweetEmbed.callCount, 1)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0].length, 3)
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][0], '14')
    t.is(mockTwttr.widgets.createTweetEmbed.args[0][1], vm.$el)
    t.deepEqual(mockTwttr.widgets.createTweetEmbed.args[0][2], { foo1: 'bar1' })
})

test.cb('Should show children while tweet is not loaded', t => {

    const { Tweet, Vue, window } = t.context
    const mockTwttr = {
        widgets: {
            createTweetEmbed: () => {
                // emulate tweet being loaded
                return Promise.resolve()
            }
        }
    }
    window.twttr = mockTwttr

    const Ctor = Vue.extend({
        template: '<Tweet id="14"><div id="foo1">hi</div></Tweet>',
        components: { Tweet }
    })
    const vm = new Ctor().$mount()

    t.truthy(vm.$el.querySelector('#foo1'))
    setTimeout(() => {
        t.falsy(vm.$el.querySelector('#foo1'))
        t.end()
    }, 0)
})