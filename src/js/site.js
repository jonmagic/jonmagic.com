document.addEventListener('DOMContentLoaded', function() {
  // Animate the favicon
  // const faviconFrames = [
  //   '/images/favicon-frame01.png',
  //   '/images/favicon-frame02.png',
  // ];
  // const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
  // let current = 0;
  // setInterval(() => {
  //   link.rel = 'icon';
  //   link.href = faviconFrames[current];
  //   document.head.appendChild(link);
  //   current = (current + 1) % faviconFrames.length;
  // }, 800);

  // Set the current year in the footer
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  document.addEventListener('click', function(event) {
    var copyButton = event.target && typeof event.target.closest === 'function'
      ? event.target.closest('[data-copy-target]')
      : null;
    if (copyButton) {
      var targetId = copyButton.getAttribute('data-copy-target');
      var target = targetId ? document.getElementById(targetId) : null;
      if (!target || typeof target.select !== 'function') return;

      target.select();
      target.setSelectionRange(0, target.value.length);

      navigator.clipboard.writeText(target.value).then(function() {
        var originalText = copyButton.textContent;
        copyButton.textContent = 'Copied';
        setTimeout(function() {
          copyButton.textContent = originalText;
        }, 2000);
      }).catch(function() {
        copyButton.textContent = 'Copy failed';
      });
      return;
    }

    if (typeof window.plausible !== 'function') return;
    if (!event.target || typeof event.target.closest !== 'function') return;

    var eventLink = event.target.closest('[data-plausible-event-name]');
    if (!eventLink) return;

    var eventName = eventLink.getAttribute('data-plausible-event-name');
    if (!eventName) return;

    var eventTarget = eventLink.getAttribute('data-plausible-event-target') || eventLink.getAttribute('href') || 'unknown';
    var props = { target: eventTarget };
    if (eventLink.href) {
      props.url = eventLink.href;
    }

    window.plausible(eventName, { props: props });
  });

  // Post date typing effect (types once and stays)
  var postDateTyping = document.getElementById('post-date-typing');
  if (postDateTyping) {
    var dateText = postDateTyping.getAttribute('data-date');
    if (dateText) {
      var currentCharIndex = 0;
      var typingSpeed = 80 + Math.random() * 40;

      function typeDate() {
        if (currentCharIndex <= dateText.length) {
          postDateTyping.innerHTML = dateText.slice(0, currentCharIndex) + '<span class="post-date-cursor">█</span>';
          currentCharIndex++;
          if (currentCharIndex <= dateText.length) {
            setTimeout(typeDate, typingSpeed);
          } else {
            // Finished typing, keep cursor blinking.
            postDateTyping.innerHTML = dateText + '<span class="post-date-cursor">█</span>';
          }
        }
      }

      // Start with just the blinking cursor
      postDateTyping.innerHTML = '<span class="post-date-cursor">█</span>';
      setTimeout(typeDate, 300);
    }
  }

  // Load avatars.json and set a random avatar in the header
  const headerAvatar = document.getElementById('headerAvatar');
  if (headerAvatar) {
    fetch('/avatars.json')
      .then(res => res.json())
      .then(avatars => {
        if (!Array.isArray(avatars) || avatars.length === 0) return;
        const random = avatars[Math.floor(Math.random() * avatars.length)];
        const img = document.createElement('img');
        img.src = `/images/avatars/${random}`;
        img.alt = 'Jon Magic Avatar';
        img.width = 128;
        img.height = 128;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        headerAvatar.innerHTML = '';
        headerAvatar.appendChild(img);
      });
  }

  // Semantic search functionality
  const searchInput = document.getElementById('semantic-search-input');
  const searchResults = document.getElementById('semantic-search-results');
  const searchHeader = document.getElementById('semantic-search-header');
  const searchStatus = document.getElementById('semantic-search-status');
  const searchHelp = document.querySelector('.search-help');

  if (searchInput && searchResults && searchHeader) {
    let vectorData = null;
    let embedQuery = null;
    let searchModule = null;
    let isInitialized = false;
    let searchTimeout = null;

    // Load search dependencies and data
    async function initializeSearch() {
      if (isInitialized) return true;

      try {
        if (searchStatus) {
          searchStatus.textContent = 'Loading search model...';
          searchStatus.className = 'search-status loading';
        }

        // Load vector data
        const vectorResponse = await fetch('/vectors.json');
        if (!vectorResponse.ok) {
          throw new Error('Could not load search vectors');
        }
        vectorData = await vectorResponse.json();

        // Load search modules
        const embedModule = await import('/js/embedQuery.js');
        searchModule = await import('/js/search.js');
        embedQuery = embedModule.embedQuery;

        // Check if model is ready
        await embedModule.isModelReady();

        isInitialized = true;

        if (searchStatus) {
          searchStatus.textContent = 'Search ready!';
          searchStatus.className = 'search-status ready';
          setTimeout(() => {
            searchStatus.style.display = 'none';
          }, 2000);
        }

        return true;
      } catch (error) {
        console.error('Search initialization failed:', error);
        if (searchStatus) {
          searchStatus.textContent = 'Search unavailable';
          searchStatus.className = 'search-status error';
        }
        return false;
      }
    }

    // Perform search with debouncing
    async function performSearch(query) {
      if (!query.trim()) {
        searchResults.innerHTML = '';
        return;
      }

      try {
        if (searchStatus) {
          searchStatus.textContent = 'Searching...';
          searchStatus.className = 'search-status searching';
          searchStatus.style.display = 'block';
        }

        const results = await searchModule.searchPosts(query, vectorData, embedQuery, 9);
        displayResults(results, query);

        if (searchStatus) {
          searchStatus.style.display = 'none';
        }
      } catch (error) {
        console.error('Search failed:', error);
        searchResults.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';

        if (searchStatus) {
          searchStatus.textContent = 'Search error';
          searchStatus.className = 'search-status error';
        }
      }
    }    // Display search results
    function displayResults(results, query) {
      if (!results || results.length === 0) {
        searchHeader.style.display = 'none';
        if (searchHelp) searchHelp.style.display = 'block';
        searchResults.innerHTML = `
          <div class="search-no-results">
            No posts found for "${query}". Try different keywords or topics.
          </div>
        `;
        return;
      }

      // Hide search help when showing results
      if (searchHelp) searchHelp.style.display = 'none';

      const template = document.getElementById('search-result-template');
      if (!template) {
        console.error('Search result template not found');
        return;
      }

      // Show and populate the header
      const resultCount = results.length;
      const plural = resultCount === 1 ? '' : 's';
      searchHeader.textContent = `Found ${resultCount} post${plural} for "${query}"`;
      searchHeader.style.display = 'block';

      // Load postCropData for consistent background positioning
      fetch('/postCropData.json')
        .then(response => response.json())
        .then(postCropData => {
          const resultsHtml = results.map(result => {
            const { metadata, scorePercent } = result;
            const postUrl = metadata.url || `/posts/${metadata.slug}/`;
            const cropData = postCropData[metadata.slug] || {};

            // Clone the template
            const clone = template.content.cloneNode(true);
            const link = clone.querySelector('.post-card-link');
            const background = clone.querySelector('.post-card-background');
            const title = clone.querySelector('.post-title');
            const score = clone.querySelector('.search-score');
            const date = clone.querySelector('.post-date');

            // Populate the template
            link.href = postUrl;
            background.setAttribute('data-crop-x', cropData.x || 0);
            background.setAttribute('data-crop-y', cropData.y || 0);
            background.style.setProperty('--crop-x', `${cropData.xPercent || 0}%`);
            background.style.setProperty('--crop-y', `${cropData.yPercent || 0}%`);
            title.textContent = metadata.title;
            score.textContent = `${scorePercent}% match`;
            date.textContent = metadata.date ? new Date(metadata.date).toISOString().split('T')[0] : '';            return clone;
          });

          // Clear and populate results
          searchResults.innerHTML = '';

          resultsHtml.forEach(element => {
            searchResults.appendChild(element);
          });
        })
        .catch(error => {
          console.warn('Could not load postCropData:', error);
          // Fallback without crop data
          const resultsHtml = results.map(result => {
            const { metadata, scorePercent } = result;
            const postUrl = metadata.url || `/posts/${metadata.slug}/`;

            // Clone the template
            const clone = template.content.cloneNode(true);
            const link = clone.querySelector('.post-card-link');
            const title = clone.querySelector('.post-title');
            const score = clone.querySelector('.search-score');
            const date = clone.querySelector('.post-date');

            // Populate the template
            link.href = postUrl;
            title.textContent = metadata.title;
            score.textContent = `${scorePercent}% match`;
            date.textContent = metadata.date ? new Date(metadata.date).toISOString().split('T')[0] : '';

            return clone;
          });

          // Clear and populate results
          searchResults.innerHTML = '';

          resultsHtml.forEach(element => {
            searchResults.appendChild(element);
          });
        });
    }

    // Event listeners
    searchInput.addEventListener('focus', async () => {
      if (!isInitialized) {
        await initializeSearch();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      // Clear previous timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      if (!query) {
        searchResults.innerHTML = '';
        searchHeader.style.display = 'none';
        if (searchHelp) searchHelp.style.display = 'block';
        return;
      }

      // Debounce search
      searchTimeout = setTimeout(async () => {
        if (isInitialized) {
          await performSearch(query);
        } else {
          const initialized = await initializeSearch();
          if (initialized) {
            await performSearch(query);
          }
        }
      }, 300);
    });

    // Clear results when input is cleared
    searchInput.addEventListener('keyup', (e) => {
      if (e.target.value.trim() === '') {
        searchResults.innerHTML = '';
        searchHeader.style.display = 'none';
        if (searchHelp) searchHelp.style.display = 'block';
      }
    });
  }
});
