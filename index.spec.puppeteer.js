import 'regenerator-runtime/runtime'
import test from 'ava'
const express = require('express');
const puppeteer = require('puppeteer');
const PORT = 3002

async function setUp(path, port = PORT) {
  const app = express()

  app.use("/", express.static(__dirname + '/examples'));

  console.debug('Listening at port', port)
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
  const screenshotFilename = page + (new Date().getTime()) + '.jpg'
  await page.screenshot({ path: screenshotFilename });
  console.info(`Screenshot saved to ${screenshotFilename}`)
}

test('Tweet is rendered successfully', async t => {
  const ctx = await setUp('/tweet')
  const { page } = ctx

  const tweetHandle = await page.waitForSelector('.twitter-tweet-rendered')
  const innerHTML = await tweetHandle.evaluate(node => node.shadowRoot.innerHTML)
  const expected = "What if you didn't need to manually install Node"
  if (!innerHTML.includes(expected)) {
    await saveScreenshotWithTimestamp(page, '/tmp/vue-tweet-embed-puppeteer-fail-')
    t.fail(`Did not find '${expected}' in '${innerHTML}'`)
  }
  t.pass()
  await tearDown(ctx)
});
