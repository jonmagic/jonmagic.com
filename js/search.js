/**
 * Compute cosine similarity between two normalized vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} Cosine similarity score between -1 and 1
 */
function cosineSim(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const norm = Math.sqrt(normA) * Math.sqrt(normB);
  return norm === 0 ? 0 : dot / norm;
}

/**
 * Find top K most similar items to a query vector
 * @param {number[]} queryVec - Query embedding vector
 * @param {Object} vectorData - Object with file paths as keys and {vector, metadata} as values
 * @param {number} K - Number of top results to return
 * @returns {Array} Array of {score, metadata} objects sorted by similarity score
 */
export function topK(queryVec, vectorData, K = 10) {
  if (!queryVec || !Array.isArray(queryVec)) {
    throw new Error('Query vector must be a non-empty array');
  }

  if (!vectorData || typeof vectorData !== 'object') {
    throw new Error('Vector data must be an object');
  }

  const results = [];

  for (const [filePath, item] of Object.entries(vectorData)) {
    if (!item.vector || !Array.isArray(item.vector)) {
      console.warn(`Skipping item with invalid vector: ${filePath}`);
      continue;
    }

    try {
      const score = cosineSim(queryVec, item.vector);
      results.push({
        score,
        metadata: {
          ...item.metadata,
          filePath
        }
      });
    } catch (error) {
      console.warn(`Error computing similarity for ${filePath}:`, error);
    }
  }

  // Sort by score descending and return top K
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, K);
}

/**
 * Search for posts similar to a query
 * @param {string} query - Search query
 * @param {Object} vectorData - Pre-loaded vector data
 * @param {Function} embedQuery - Function to embed the query
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Search results with scores and metadata
 */
export async function searchPosts(query, vectorData, embedQuery, limit = 10) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const queryVector = await embedQuery(query);
    const results = topK(queryVector, vectorData, limit);

    // Add relevance threshold - only return results with score > 0.1
    const relevantResults = results.filter(result => result.score > 0.1);

    return relevantResults.map(result => ({
      ...result,
      // Add percentage score for display
      scorePercent: Math.round(result.score * 100)
    }));
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
