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
      'Generate an execute summary of...',
      'You are a coding assistant...',
      'Explain this code...',
      'Fix grammar and spelling...',
      'Extract todo list from...',
      'Generate documentation for...',
      'Try and make me smile...',
      'Refactor this function to...',
      'Write unit tests for...',
      'Convert this code to...',
    ];
    for (var i = phrases.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = phrases[i];
      phrases[i] = phrases[j];
      phrases[j] = temp;
    }

    var currentPhraseIndex = 0;
    var currentCharIndex = 0;
    var isTyping = true;

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
