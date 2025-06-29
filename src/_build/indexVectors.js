const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createHash } = require('node:crypto');

// Import transformers dynamically since it's an ES module
let pipeline;

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2'; // Use the same model as client-side

/**
 * Check if vector indexing is needed by comparing file modification times
 * @param {string} inputDir - Folder containing .md files
 * @param {string} vectorsPath - Path to vectors.json file
 * @returns {boolean} True if indexing is needed
 */
function isIndexingNeeded(inputDir, vectorsPath) {
  if (!fs.existsSync(vectorsPath)) {
    return true; // No vectors file exists
  }

  const vectorsStats = fs.statSync(vectorsPath);
  const vectorsMtime = vectorsStats.mtime.getTime();

  // Check if any markdown file is newer than vectors.json
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const fileStats = fs.statSync(filePath);
    if (fileStats.mtime.getTime() > vectorsMtime) {
      return true; // Found a newer file
    }
  }

  return false; // All files are older than vectors.json
}

/**
 * Index all markdown files in a folder and generate vectors.json.
 * Skips unchanged files using MD5 hash comparison.
 *
 * @param {string} inputDir - Folder containing .md files (e.g. './src/posts')
 * @param {string} vectorsPath - Output file (e.g. './src/_data/vectors.json')
 * @param {boolean} force - Force indexing even if not needed
 */
async function indexVectors(inputDir, vectorsPath, force = false) {
  // Check if indexing is actually needed
  if (!force && !isIndexingNeeded(inputDir, vectorsPath)) {
    console.log('📍 Vector data is up to date, skipping indexing');
    return;
  }

  // Dynamic import for ES module
  if (!pipeline) {
    const transformers = await import('@xenova/transformers');
    pipeline = transformers.pipeline;
  }

  let existing = {};
  if (fs.existsSync(vectorsPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(vectorsPath, 'utf-8'));
    } catch (e) {
      console.warn('Warning: Could not parse existing vectors.json, starting fresh');
      existing = {};
    }
  }

  console.log('🤖 Loading ONNX model for embedding generation...');
  const extractor = await pipeline('feature-extraction', MODEL_NAME, {
    quantized: true
  });

  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.md'))
    .sort(); // Sort for consistent ordering

  const updated = {};
  let changedCount = 0;
  let skippedCount = 0;

  console.log(`📚 Processing ${files.length} markdown files...`);

  for (const file of files) {
    const full = path.join(inputDir, file);
    const raw = fs.readFileSync(full, 'utf-8');
    const { data, content } = matter(raw);

    const title = data.title || '';
    const slug = data.slug || path.basename(file, '.md');
    const textToEmbed = title + '\n\n' + content;
    const hash = createHash('md5').update(textToEmbed).digest('hex');

    const prev = existing[full];
    if (prev && prev.hash === hash) {
      updated[full] = prev;
      skippedCount++;
      continue;
    }

    console.log(`  📝 Embedding: ${file}`);

    try {
      const tensor = await extractor([textToEmbed], {
        pooling: 'mean',
        normalize: true
      });

      updated[full] = {
        vector: Array.from(tensor.data),
        metadata: {
          lastIndexed: Date.now(),
          title,
          slug,
          hash,
          ...data,
          url: `/posts/${slug}/`
        }
      };
      changedCount++;
    } catch (error) {
      console.error(`❌ Error embedding ${file}:`, error.message);
      // Keep existing embedding if available
      if (prev) {
        updated[full] = prev;
      }
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(vectorsPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(vectorsPath, JSON.stringify(updated, null, 2));

  console.log(`✅ Vector indexing complete:`);
  console.log(`   📊 ${changedCount} files embedded`);
  console.log(`   ⏭️  ${skippedCount} files skipped (unchanged)`);
  console.log(`   💾 Total vectors: ${Object.keys(updated).length}`);
  console.log(`   📁 Output: ${vectorsPath}`);

  return updated;
}

module.exports = { indexVectors, isIndexingNeeded };
