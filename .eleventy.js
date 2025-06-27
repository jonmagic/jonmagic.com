const fs = require("fs");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");
  // Add a collection for blog posts
  eleventyConfig.addCollection('posts', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md');
  });
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
