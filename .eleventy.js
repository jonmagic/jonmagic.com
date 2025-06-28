const fs = require("fs");
const markdownIt = require('markdown-it');
const pluginRss = require("@11ty/eleventy-plugin-rss");

let markdownItEmoji = require('markdown-it-emoji');
if (markdownItEmoji.default) markdownItEmoji = markdownItEmoji.default;

module.exports = function(eleventyConfig) {
  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // Enable emoji support in markdown for Eleventy 3.x
  const mdLib = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  }).use(markdownItEmoji);
  eleventyConfig.setLibrary('md', mdLib);

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addGlobalData("layout", "layout.njk");
  eleventyConfig.addGlobalData("post", "post.njk");

  // Add a collection for blog posts
  eleventyConfig.addCollection('posts', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md');
  });

  // Generate avatars.json in src/ and _site/ before build
  eleventyConfig.on('beforeBuild', () => {
    const path = require('path');
    const avatarsDir = path.join(__dirname, 'src/images/avatars');
    const outputSite = path.join(__dirname, '_site/avatars.json');
    const files = fs.readdirSync(avatarsDir);
    const avatars = files.filter(f => f.endsWith('.webp'));
    try {
      fs.mkdirSync(path.join(__dirname, '_site'), { recursive: true });
      fs.writeFileSync(outputSite, JSON.stringify(avatars, null, 2));
    } catch (e) {
      console.warn('Could not write avatars.json to _site:', e);
    }
    console.log(`Wrote ${avatars.length} avatars to avatars.json`);
  });

  // Add .nojekyll and CNAME files after build
  eleventyConfig.on('afterBuild', () => {
    fs.writeFileSync('_site/.nojekyll', '');
    fs.writeFileSync('_site/CNAME', 'jonmagic.com');
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
