document.addEventListener('DOMContentLoaded', function() {
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
            // Finished typing, remove cursor after a short pause
            setTimeout(() => {
              postDateTyping.innerHTML = dateText;
            }, 1000);
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
});
