document.addEventListener('DOMContentLoaded', function() {
  // Set the current year in the footer
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
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
