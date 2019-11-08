/**
 * Runs Puppeteer assertions againt examples
 * Run `npm run examples` and visit http://localhost:3002 for more info
 */
import 'regenerator-runtime/runtime'
import test from 'ava'
const express = require('express');
const puppeteer = require('puppeteer');
const PORT = 3002

async function setUp(path, port = PORT) {
  const app = express()

  app.use("/", express.static(__dirname + '/examples'));

  const server = app.listen(port);
  const browser = await puppeteer.launch({
    // headless: false,
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000)
  await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle0' });

  return { server, browser, page }
}

async function tearDown(ctx) {
  await ctx.browser.close()
  await ctx.server.close()
}

async function saveScreenshotWithTimestamp(page, pathPrefix) {
  const screenshotFilename = page + (new Date().getTime()).toString() + '.jpg'
  await page.screenshot({ path: screenshotFilename });
  console.info(`Screenshot saved to ${screenshotFilename}`)
}

test('Tweet is rendered successfully', async t => {
  const ctx = await setUp('/tweet')
  const { page } = ctx

  const tweetHandle = await page.waitForSelector('#tweetLoaded .twitter-tweet-rendered')
  const innerHTML = await tweetHandle.evaluate(node => node.shadowRoot.innerHTML)
  const expected = "What if you didn't need to manually install Node"
  if (!innerHTML.includes(expected)) {
    await saveScreenshotWithTimestamp(page, '/tmp/vue-tweet-embed-puppeteer-fail-')
    t.fail(`Did not find '${expected}' in '${innerHTML}'`)
  }
  t.pass()
  await tearDown(ctx)
});

test('Displays an error when a tweet cannot be loaded', async t => {
  const ctx = await setUp('/tweet')
  const { page } = ctx

  const tweetHandle = await page.waitForSelector('#loadingError')
  const innerHTML = await tweetHandle.evaluate(node => node.innerText)
  const expected = "This tweet could not be loaded"
  if (!innerHTML.includes(expected)) {
    await saveScreenshotWithTimestamp(page, '/tmp/vue-tweet-embed-puppeteer-fail-')
    t.fail(`Did not find '${expected}' in '${innerHTML}'`)
  }
  t.pass()
  await tearDown(ctx)
})

test('Displays an error in HTML when a tweet cannot be loaded', async t => {
  const ctx = await setUp('/tweet')
  const { page } = ctx

  // if the <a> element can be queried, the HTML is rendered correctly
  const tweetHandle = await page.waitForSelector('#htmlError a')
  const innerText = await tweetHandle.evaluate(node => node.innerText)
  const expected = "twitter"
  if (expected != innerText) {
    await saveScreenshotWithTimestamp(page, '/tmp/vue-tweet-embed-puppeteer-fail-')
    t.fail(`'${expected}' is not equal to '${innerText}'`)
  }
  t.pass()
  await tearDown(ctx)
})


test('Moment is rendered successfully', async t => {
  const ctx = await setUp('/moment')
  const { page } = ctx

  // moment is inside of an iframe so extract first
  const iframeHandle = await page.waitForSelector('iframe#twitter-widget-0')
  const document = await iframeHandle.evaluateHandle(node => node.contentDocument)
  t.truthy(document)

  // for simplicity, get all lines inside of <p> elements
  // and check an arbitrary one
  const $ps = await document.$$('p')
  t.truthy($ps && $ps.length > 0)
  const pContents = await Promise.all($ps.map(x => x.evaluate($el => $el.innerText)))
  const momentContent = pContents.join('\n')

  const expected = "You whipped out that Mexican thing again"
  if (!momentContent.includes(expected)) {
    await saveScreenshotWithTimestamp(page, '/tmp/vue-tweet-embed-puppeteer-fail-')
    t.fail(`Did not find '${expected}' in '${momentContent}'`)
  }
  t.pass()
  await tearDown(ctx)
});
