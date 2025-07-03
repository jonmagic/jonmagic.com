const fs = require('fs');
const path = require('path');
const { createHash } = require('node:crypto');

// Import transformers dynamically since it's an ES module
let pipeline;

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2'; // Use the same model as client-side

/**
 * Index all markdown files in a folder and generate vectors.json.
 * Skips unchanged files using MD5 hash comparison.
 *
 * @param {string} inputDir - Folder containing .md files (e.g. './src/posts')
 * @param {string} vectorsPath - Output file (e.g. './src/_data/vectors.json')
 */
async function indexVectors(inputDir, vectorsPath) {
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
    const relativePath = '/' + path.relative(path.join(process.cwd(), 'src'), full);
    const raw = fs.readFileSync(full, 'utf-8');
    const hash = createHash('md5').update(raw).digest('hex');

    const prev = existing[relativePath];
    if (prev && prev.metadata && prev.metadata.hash === hash) {
      updated[relativePath] = prev;
      skippedCount++;
      continue;
    }

    console.log(`  📝 Embedding: ${file}`);

    // Use filename (without extension) as title and slug
    const slug = path.basename(file, '.md');
    const title = slug;
    const textToEmbed = raw;

    try {
      const tensor = await extractor([textToEmbed], {
        pooling: 'mean',
        normalize: true
      });

      updated[relativePath] = {
        vector: Array.from(tensor.data),
        metadata: {
          title,
          slug,
          hash,
          url: `/posts/${slug}/`
        }
      };
      changedCount++;
    } catch (error) {
      console.error(`❌ Error embedding ${file}:`, error.message);
      // Keep existing embedding if available
      if (prev) {
        updated[relativePath] = prev;
      }
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(vectorsPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const newContent = JSON.stringify(updated, null, 2);
  let shouldWrite = true;

  if (fs.existsSync(vectorsPath)) {
    const oldContent = fs.readFileSync(vectorsPath, 'utf-8');
    const oldHash = createHash('md5').update(oldContent).digest('hex');
    const newHash = createHash('md5').update(newContent).digest('hex');
    shouldWrite = oldHash !== newHash;
  }

  if (shouldWrite) {
    fs.writeFileSync(vectorsPath, newContent);
    console.log('💾 vectors.json updated.');
  } else {
    console.log('🟢 vectors.json unchanged, not rewritten.');
  }

  console.log(`✅ Vector indexing complete:`);
  console.log(`   💾 Total vectors: ${Object.keys(updated).length}`);
  console.log(`   📁 Output: ${vectorsPath}`);

  return updated;
}

module.exports = { indexVectors };
