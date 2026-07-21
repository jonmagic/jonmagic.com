const test = require('node:test');
const assert = require('node:assert/strict');
const markdownIt = require('markdown-it');
const githubAlerts = require('../src/_build/markdown-it-github-alerts');

test('renders TLDR alerts as a labeled aside', () => {
  const md = markdownIt().use(githubAlerts);
  const html = md.render('> [!TLDR]\n> Trust should not be a blank check.');

  assert.match(html, /<aside class="markdown-alert markdown-alert-tldr">/);
  assert.match(html, /<p class="markdown-alert-title">tl;dr<\/p>/);
  assert.match(html, /<p>Trust should not be a blank check\.<\/p>/);
  assert.match(html, /<\/aside>/);
  assert.doesNotMatch(html, /\[!TLDR\]/);
});
