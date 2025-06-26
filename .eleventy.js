const fs = require("fs");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.on('afterBuild', () => {
    fs.writeFileSync('_site/.nojekyll', '');
  });
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
