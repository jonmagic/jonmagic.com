// Client-side query embedding using the same model as the backend
// This should match the backend embeddings if using the same model weights

let extractorPromise = null;

/**
 * Get or initialize the feature extraction model
 * Uses dynamic import since @xenova/transformers is an ES module
 */
async function getExtractor() {
  if (!extractorPromise) {
    try {
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');

      // Use the same model identifier that should match our local ONNX model
      // Note: This will download the model from HuggingFace Hub on first use
      // For full offline capability, we'd need to serve the ONNX model files
      extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (error) {
      console.error('Failed to load embedding model:', error);
      throw new Error('Could not load the search embedding model');
    }
  }
  return extractorPromise;
}

/**
 * Embed a search query into the same vector space as the indexed content
 * @param {string} query - The search query
 * @returns {Promise<number[]>} 384-dimensional embedding vector
 */
export async function embedQuery(query) {
  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }

  try {
    const extractor = await getExtractor();
    const tensor = await extractor([query.trim()], {
      pooling: 'mean',
      normalize: true
    });
    return Array.from(tensor.data);
  } catch (error) {
    console.error('Error embedding query:', error);
    throw new Error('Failed to embed search query');
  }
}

/**
 * Check if the embedding model is ready
 * @returns {Promise<boolean>}
 */
export async function isModelReady() {
  try {
    await getExtractor();
    return true;
  } catch {
    return false;
  }
}
