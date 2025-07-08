document.addEventListener('DOMContentLoaded', function() {
  // Animate the favicon
  const faviconFrames = [
    '/images/favicon-frame01.png',
    '/images/favicon-frame02.png',
  ];
  const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
  let current = 0;
  setInterval(() => {
    link.rel = 'icon';
    link.href = faviconFrames[current];
    document.head.appendChild(link);
    current = (current + 1) % faviconFrames.length;
  }, 800);

  // Set the current year in the footer
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // MS-DOS style typing effect with cycling phrases
  var dosTyping = document.getElementById('dos-typing');
  if (dosTyping) {
    var phrases = [
      'Generate an executive summary of...',
      'You are a coding assistant...',
      'Explain this code...',
      'Fix grammar and spelling...',
      'Extract todo list from...',
      'Create documentation for...',
      'Tell me a dad joke about...',
      'Refactor this function to...',
      'Write unit tests for...',
      'Convert this code to...',
    ];

    // Calculate max characters that fit without wrapping
    function getMaxCharWidth() {
      var container = dosTyping.parentElement;
      var containerWidth = container.offsetWidth;

      // On mobile, use the full site-header width instead of just the title group
      if (window.innerWidth <= 900) {
        var siteHeader = container.closest('.site-header');
        if (siteHeader) {
          containerWidth = siteHeader.offsetWidth - 40; // Account for padding
        }
      }

      var testSpan = document.createElement('span');
      testSpan.style.visibility = 'hidden';
      testSpan.style.position = 'absolute';
      testSpan.style.fontFamily = window.getComputedStyle(container).fontFamily;
      testSpan.style.fontSize = window.getComputedStyle(container).fontSize;
      testSpan.style.letterSpacing = window.getComputedStyle(container).letterSpacing;
      testSpan.textContent = 'A';
      document.body.appendChild(testSpan);
      var charWidth = testSpan.offsetWidth;
      document.body.removeChild(testSpan);

      // Account for cursor width and some padding
      var maxChars = Math.floor((containerWidth - 20) / charWidth);
      return Math.max(15, maxChars); // minimum 15 characters (increased from 10)
    }

    // Truncate phrases if they're too long
    function truncatePhrase(phrase, maxChars) {
      if (phrase.length <= maxChars) return phrase;
      return phrase.substring(0, maxChars - 3) + '...';
    }

    var maxChars = getMaxCharWidth();
    phrases = phrases.map(function(phrase) {
      return truncatePhrase(phrase, maxChars);
    });

    for (var i = phrases.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = phrases[i];
      phrases[i] = phrases[j];
      phrases[j] = temp;
    }

    var currentPhraseIndex = 0;
    var currentCharIndex = 0;
    var isTyping = true;

    // Recalculate on window resize
    window.addEventListener('resize', function() {
      maxChars = getMaxCharWidth();
      phrases = phrases.map(function(phrase) {
        return truncatePhrase(phrase, maxChars);
      });
    });

    function typeChar() {
      var currentPhrase = phrases[currentPhraseIndex];
      var typingSpeed = 80 + Math.random() * 60; // human-like speed
      var backspaceSpeed = 30 + Math.random() * 20; // faster backspacing

      if (isTyping) {
        // Typing phase
        if (currentCharIndex <= currentPhrase.length) {
          dosTyping.innerHTML = currentPhrase.slice(0, currentCharIndex) + '<span class="dos-cursor">█</span>';
          currentCharIndex++;
          setTimeout(typeChar, typingSpeed);
        } else {
          // Finished typing, pause for 2 seconds then start backspacing
          setTimeout(() => {
            isTyping = false;
            typeChar();
          }, 2000);
        }
      } else {
        // Backspacing phase
        if (currentCharIndex > 0) {
          currentCharIndex--;
          dosTyping.innerHTML = currentPhrase.slice(0, currentCharIndex) + '<span class="dos-cursor">█</span>';
          setTimeout(typeChar, backspaceSpeed);
        } else {
          // Finished backspacing, pause for 1 second then move to next phrase
          setTimeout(() => {
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            isTyping = true;
            typeChar();
          }, 1000);
        }
      }
    }

    // Start with just the blinking cursor
    dosTyping.innerHTML = '<span class="dos-cursor">█</span>';
    setTimeout(typeChar, 600);
  }

  // Post date typing effect (types once and stays)
  var postDateTyping = document.getElementById('post-date-typing');
  if (postDateTyping) {
    var dateText = postDateTyping.getAttribute('data-date');
    if (dateText) {
      var currentCharIndex = 0;
      var typingSpeed = 80 + Math.random() * 40; // slightly faster than the homepage

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
