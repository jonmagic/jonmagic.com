---
title: Adding client-side semantic search to jonmagic.com
date: 2025-07-03
tags:
  - post
description: >-
  How to add client-side semantic search to your static website, no server needed.
featured: 1
---

I recently rebuilt jonmagic.com from the ground up with help from [GitHub Copilot](https://github.com/features/copilot), transforming it from a boring [about page](/about/) into a real blog and migrating over 100 posts from my old blog. After adding this much content, I wanted a way to make it searchable, but using [eleventy](https://www.11ty.dev) on [GitHub Pages](https://pages.github.com/) meant there was no backend to rely on.

Most of my projects these days involve building AI-powered features, so I started to wonder if it was possible to add semantic search that runs entirely in the browser, even on a static site? Turns out [it is](https://github.com/jonmagic/jonmagic.com/pull/5) and with a little help from ChatGPT and Copilot I had it up and running in an hour.

<figure>
  <video controls width="640" poster="/images/search-demo.png">
    <source src="/images/posts/adding-client-side-semantic-search-to-jonmagic-com/search-demo.mp4" type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
  </video>
  <figcaption>
    <strong>Video Demo:</strong> Semantic search returning posts that match concepts, not just keywords.
  </figcaption>
</figure>

The entire semantic search (including the model) runs on your device, inside the browser, using precomputed post embeddings. No server required!

Try it yourself: [Search jonmagic.com](/search/)

Later I found out about [https://pagefind.app/](https://pagefind.app/) and did briefly consider it but afaict it doesn't support semantic search and my site only has a little over 100 blog posts so I'm very happy with the solution I landed on.

## How It Works

**1. Embedding posts during build.**

At build time, I use [@xenova/transformers](https://xenova.github.io/transformers.js/) to generate a vector embedding for each post. This happens in the build script:

```js
// src/_build/indexVectors.js (excerpt)
const tensor = await extractor([textToEmbed], {
  pooling: 'mean',
  normalize: true
});
updated[full] = {
  vector: Array.from(tensor.data),
  metadata: { ... }
};
```

These go into a static `vectors.json` file.

**2. Embedding queries in the browser.**

On the search page, as you type, your query text is embedded **client-side** using the *same* model (MiniLM-L6-v2). That means no server round-trips, and your queries are never sent anywhere.

```js
// src/js/embedQuery.js (excerpt)
const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js');
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

export async function embedQuery(query) {
  const tensor = await extractor([query.trim()], { pooling: 'mean', normalize: true });
  return Array.from(tensor.data);
}
```

**3. Finding the best matches.**

The browser calculates cosine similarity between your query embedding and every post embedding. The top matches are shown, sorted by score.

```js
// src/js/search.js (excerpt)
function cosineSim(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function topK(queryVec, vectorData, K = 10) {
  return Object.entries(vectorData)
    .map(([filePath, item]) => ({
      score: cosineSim(queryVec, item.vector),
      metadata: item.metadata
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, K);
}
```

## What You Can Search For

- **Topics:** e.g., `"project management"`, `"learning new skills"`
- **Questions:** e.g., `"advice for new developers"`
- **Fuzzy phrases:** e.g., `"why did I move to git?"` or `"being acquired at work"`

You’re not limited to exact words, vector search will match *related* posts.

## What's Next?

Next I'd like to see if client-side [Retrieval Augmented Generation (RAG)](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) is possible.  That is, not only find relevant posts, but also pass their text into a client-side LLM that can summarize or answer questions *about my own blog*, entirely on your device.

If you're interested in following along, [subscribe to the feed](/feed.xml) or check out the [search page](/search/).
