#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const POSTS_DIR = 'src/posts';
const IMAGES_DIR = 'src/images';
const DATA_DIR = 'src/_data';
const GRID_WIDTH = 120; // Much wider than GitHub's 53 columns
const GRID_HEIGHT = 40; // Much taller than GitHub's 7 rows
const SQUARE_SIZE = 8;
const SQUARE_GAP = 2;
const CROP_WIDTH = 40; // Width of cropped section (in squares)
const CROP_HEIGHT = 20; // Height of cropped section (in squares)

// Get all markdown files from posts directory
function getPostFiles() {
  const files = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort()
    .reverse(); // Most recent first

  return files;
}

// Implement a simple seedable random number generator
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

// Generate contribution-style data with varying intensity
function generateContributionData() {
  const data = [];

  for (let row = 0; row < GRID_HEIGHT; row++) {
    data[row] = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      // Create clusters of activity with varying intensity
      const clusterX = Math.floor(col / 8);
      const clusterY = Math.floor(row / 4);
      const clusterSeed = (clusterX * 37 + clusterY * 47) % 100;

      let intensity = 0;

      // Base random activity
      if (Math.random() < 0.3) {
        intensity = Math.floor(Math.random() * 5);
      }

      // Add cluster-based activity
      if (clusterSeed < 25) {
        intensity = Math.max(intensity, Math.floor(Math.random() * 4) + 1);
      }

      // Add some hot spots
      if (clusterSeed < 5) {
        intensity = Math.max(intensity, 3 + Math.floor(Math.random() * 2));
      }

      // Add noise patterns
      const noiseX = Math.sin(col * 0.1) * Math.cos(row * 0.15);
      const noiseY = Math.cos(col * 0.08) * Math.sin(row * 0.12);
      if (noiseX + noiseY > 1.2) {
        intensity = Math.max(intensity, 2);
      }

      data[row][col] = intensity;
    }
  }

  return data;
}

// Get color for contribution intensity (0-4)
function getContributionColor(intensity, isDark = false) {
  if (isDark) {
    const colors = [
      '#161b22', // No contributions
      '#0e4429', // Low
      '#006d32', // Medium-low
      '#26a641', // Medium
      '#39d353'  // High
    ];
    return colors[intensity] || colors[0];
  } else {
    const colors = [
      '#ebedf0', // No contributions
      '#9be9a8', // Low
      '#40c463', // Medium-low
      '#30a14e', // Medium
      '#216e39'  // High
    ];
    return colors[intensity] || colors[0];
  }
}

// Generate the full contribution graph SVG
function generateFullContributionSVG(data, isDark = false) {
  const svgWidth = GRID_WIDTH * (SQUARE_SIZE + SQUARE_GAP) - SQUARE_GAP;
  const svgHeight = GRID_HEIGHT * (SQUARE_SIZE + SQUARE_GAP) - SQUARE_GAP;

  let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

  // Add a subtle background gradient
  const bgColor1 = isDark ? '#0d1117' : '#f6f8fa';
  const bgColor2 = isDark ? '#21262d' : '#ffffff';

  svg += `
  <defs>
    <linearGradient id="bg${isDark ? '-dark' : ''}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor1};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:${bgColor2};stop-opacity:0.1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg${isDark ? '-dark' : ''})" />`;

  // Add the contribution squares
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const intensity = data[row][col];

      const x = col * (SQUARE_SIZE + SQUARE_GAP);
      const y = row * (SQUARE_SIZE + SQUARE_GAP);
      const color = getContributionColor(intensity, isDark);

      // Add slight randomization to square size for organic feel
      const sizeVariation = (Math.sin(col * 0.3) * Math.cos(row * 0.4)) * 0.3;
      const currentSize = SQUARE_SIZE + sizeVariation;
      const offset = (SQUARE_SIZE - currentSize) / 2;

      svg += `<rect x="${x + offset}" y="${y + offset}" width="${currentSize}" height="${currentSize}" fill="${color}" rx="1" opacity="${intensity > 0 ? 0.8 : 0.4}" />`;
    }
  }

  svg += '</svg>';
  return svg;
}

// Generate crop data for all posts
function generateCropData(postFiles) {
  const cropData = {};
  const maxX = GRID_WIDTH - CROP_WIDTH;
  const maxY = GRID_HEIGHT - CROP_HEIGHT;

  for (const file of postFiles) {
    const slug = path.basename(file, '.md');
    const seedHash = slug.split('').reduce((hash, char) => hash + char.charCodeAt(0), 0);
    const seededRandom = seedRandom(seedHash);

    cropData[slug] = {
      x: Math.floor(seededRandom() * maxX),
      y: Math.floor(seededRandom() * maxY),
      // Calculate percentages for CSS positioning
      xPercent: Math.floor(seededRandom() * maxX) / maxX * 100,
      yPercent: Math.floor(seededRandom() * maxY) / maxY * 100
    };
  }

  return cropData;
}

// Main function
function generateBackgrounds() {
  console.log('🎨 Generating single GitHub contribution graph with crop data...\n');

  const postFiles = getPostFiles();
  const contributionData = generateContributionData();

  console.log(`📊 Generated ${GRID_WIDTH}x${GRID_HEIGHT} contribution graph`);
  console.log(`📦 Processing ${postFiles.length} posts with crop coordinates\n`);

  try {
    // Ensure directories exist
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Generate the full SVGs
    const lightSVG = generateFullContributionSVG(contributionData, false);
    const darkSVG = generateFullContributionSVG(contributionData, true);

    // Write SVG files
    const lightPath = path.join(IMAGES_DIR, 'contribution-graph.svg');
    const darkPath = path.join(IMAGES_DIR, 'contribution-graph-dark.svg');

    fs.writeFileSync(lightPath, lightSVG);
    fs.writeFileSync(darkPath, darkSVG);

    console.log(`✓ Generated: ${lightPath}`);
    console.log(`✓ Generated: ${darkPath}`);

    // Generate crop data
    const cropData = generateCropData(postFiles);

    // Write crop data as JSON
    const cropDataPath = path.join(DATA_DIR, 'postCropData.json');
    fs.writeFileSync(cropDataPath, JSON.stringify(cropData, null, 2));

    console.log(`✓ Generated: ${cropDataPath}`);
    console.log(`📍 Generated crop coordinates for ${Object.keys(cropData).length} posts`);

    // Also write crop dimensions for use in templates
    const cropConfig = {
      gridWidth: GRID_WIDTH,
      gridHeight: GRID_HEIGHT,
      cropWidth: CROP_WIDTH,
      cropHeight: CROP_HEIGHT,
      squareSize: SQUARE_SIZE,
      squareGap: SQUARE_GAP
    };

    const configPath = path.join(DATA_DIR, 'contributionConfig.json');
    fs.writeFileSync(configPath, JSON.stringify(cropConfig, null, 2));

    console.log(`✓ Generated: ${configPath}`);

    console.log(`\n🎉 Complete! Generated single contribution graph with crop data.`);
    console.log('📝 Each post will use CSS to show a different section of the same image.');
    console.log('🚀 This reduces from 240+ files to just 2 SVG files + JSON data.');
    console.log('\n💡 Tip: Run "npm run build && npm run start" to see the results!');

  } catch (error) {
    console.error('❌ Error generating backgrounds:', error.message);
  }
}

// Run the script
if (require.main === module) {
  generateBackgrounds();
}
