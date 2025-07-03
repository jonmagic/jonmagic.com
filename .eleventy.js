const fs = require("fs");
const path = require("path");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require('markdown-it');
const pluginRss = require("@11ty/eleventy-plugin-rss");

let markdownItEmoji = require('markdown-it-emoji');
if (markdownItEmoji.default) markdownItEmoji = markdownItEmoji.default;

// Configuration for contribution graph cropping
const CROP_CONFIG = {
  gridWidth: 120,
  gridHeight: 40,
  cropWidth: 40,
  cropHeight: 20,
  squareSize: 8,
  squareGap: 2
};

// Seedable random number generator
function seedRandom(seed) {
  const m = 0x80000000; // 2**31
  const a = 1103515245;
  const c = 12345;
  let state = seed;
  return function() {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

// Generate crop data for posts based on title and date for consistency
function generatePostCropData() {
  try {
    const postsDir = path.join(__dirname, 'src/posts');
    const dataDir = path.join(__dirname, 'src/_data');
    const cropDataPath = path.join(dataDir, 'postCropData.json');

    // Check if crop data already exists and get its modification time
    let existingCropData = {};
    let cropDataExists = false;
    let cropDataMtime = 0;

    if (fs.existsSync(cropDataPath)) {
      cropDataExists = true;
      cropDataMtime = fs.statSync(cropDataPath).mtime.getTime();
      existingCropData = JSON.parse(fs.readFileSync(cropDataPath, 'utf8'));
    }

    // Get all markdown files and their modification times
    const postFiles = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse();

    // Check if any post files are newer than the crop data
    let needsRegeneration = !cropDataExists;

    if (cropDataExists) {
      for (const file of postFiles) {
        const filePath = path.join(postsDir, file);
        const fileMtime = fs.statSync(filePath).mtime.getTime();
        if (fileMtime > cropDataMtime) {
          needsRegeneration = true;
          break;
        }
      }

      // Also check if we have crop data for all posts
      for (const file of postFiles) {
        const slug = path.basename(file, '.md');
        if (!existingCropData[slug]) {
          needsRegeneration = true;
          break;
        }
      }
    }

    if (!needsRegeneration) {
      console.log('📍 Crop data is up to date, skipping regeneration');
      return;
    }

    console.log('🎨 Generating crop data for posts...');

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const cropData = {};
    const maxX = CROP_CONFIG.gridWidth - CROP_CONFIG.cropWidth;
    const maxY = CROP_CONFIG.gridHeight - CROP_CONFIG.cropHeight;

    for (const file of postFiles) {
      const slug = path.basename(file, '.md');
      const filePath = path.join(postsDir, file);

      // Read frontmatter to get title and date for seeding
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatterMatch = content.match(/^---\n(.*?)\n---/s);

      let title = slug;
      let date = '';

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const titleMatch = frontmatter.match(/title:\s*(.+)/);
        const dateMatch = frontmatter.match(/date:\s*(.+)/);

        if (titleMatch) title = titleMatch[1].replace(/['"]/g, '');
        if (dateMatch) date = dateMatch[1];
      }

      // Create seed from title + date + slug for consistency
      const seedString = `${title}${date}${slug}`;
      const seedHash = seedString.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
      const seededRandom = seedRandom(seedHash);

      const x = Math.floor(seededRandom() * maxX);
      const y = Math.floor(seededRandom() * maxY);

      cropData[slug] = {
        x: x,
        y: y,
        xPercent: (x / maxX) * 100,
        yPercent: (y / maxY) * 100
      };
    }

    // Write crop data
    fs.writeFileSync(cropDataPath, JSON.stringify(cropData, null, 2));

    console.log(`✓ Generated crop data for ${Object.keys(cropData).length} posts`);
  } catch (error) {
    console.error('❌ Error generating crop data:', error.message);
  }
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  // Add RSS plugin
  eleventyConfig.addPlugin(pluginRss);

  // Enable emoji support in markdown for Eleventy 3.x
  const mdLib = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true
  }).use(markdownItEmoji);
  eleventyConfig.setLibrary('md', mdLib);

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/_data/postCropData.json");

  eleventyConfig.addGlobalData("layout", "layout.njk");
  eleventyConfig.addGlobalData("post", "post.njk");
  eleventyConfig.addGlobalData("project", "project.njk");

  // Add a collection for blog posts
  eleventyConfig.addCollection('posts', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/posts/*.md');
  });

  // Add a collection for projects
  eleventyConfig.addCollection('projects', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/projects/*.md');
  });

  // Add a custom Nunjucks filter to filter and sort featured posts
  eleventyConfig.addNunjucksFilter('featured', function(posts) {
    if (!Array.isArray(posts)) return [];
    // Filter posts with a numeric 'featured' property
    const filtered = posts.filter((post) => {
      const val = post?.data?.featured;
      return typeof val === 'number' && !isNaN(val);
    });
    // Sort ascending by 'featured' value
    return filtered.sort((a, b) => a.data.featured - b.data.featured);
  });

  // Generate avatars.json, postCropData.json, and vectors.json before build
  eleventyConfig.on('beforeBuild', async () => {
    const path = require('path');

    // Generate avatars.json
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

    // Generate postCropData.json
    generatePostCropData();
  });

  // Add .nojekyll, CNAME, and vectors.json files after build
  eleventyConfig.on('afterBuild', async () => {
    fs.writeFileSync('_site/.nojekyll', '');
    fs.writeFileSync('_site/CNAME', 'jonmagic.com');

    // Copy vectors.json to _site if it exists
    const vectorsSource = path.join(__dirname, 'src/_data/vectors.json');
    const vectorsTarget = path.join(__dirname, '_site/vectors.json');

    // Generate vectors.json for semantic search (only if needed)
    try {
      const { indexVectors } = require('./src/_build/indexVectors.js');
      const postsDir = path.join(__dirname, 'src/posts');
      const vectorsPath = path.join(__dirname, 'src/_data/vectors.json');

      await indexVectors(postsDir, vectorsPath);
    } catch (error) {
      console.error('❌ Vector indexing failed:', error.message);
      console.warn('Continuing build without semantic search vectors');
    }

    if (fs.existsSync(vectorsSource)) {
      try {
        fs.copyFileSync(vectorsSource, vectorsTarget);
        console.log('📋 Copied vectors.json to _site');
      } catch (error) {
        console.warn('Could not copy vectors.json:', error.message);
      }
    } else {
      console.warn('vectors.json not found, semantic search will not be available');
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
