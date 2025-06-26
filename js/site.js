document.addEventListener('DOMContentLoaded', function() {
  // Set the current year in the footer
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Shuffle the avatars in the avatar column
  const column = document.getElementById('avatarColumn');
  const mobile = document.getElementById('mobileAvatar');
  console.log({ mobile })
  if (!column || !mobile) return;
  const avatars = Array.from(column.children);
  const shuffled = avatars.sort(() => Math.random() - 0.5);
  shuffled.forEach(el => column.appendChild(el));
  const avatarHeight = 96; // px
  const gap = 16; // gap: 1rem
  const topOffset = column.getBoundingClientRect().top;
  const availableHeight = window.innerHeight - topOffset;
  const maxVisible = Math.floor((availableHeight + gap) / (avatarHeight + gap)) - 1;
  avatars.forEach((avatar, index) => {
    avatar.style.display = index < maxVisible ? 'block' : 'none';
  });
  const single = shuffled[0].cloneNode(true);
  single.style.display = 'block';
  mobile.appendChild(single);
});
