
// Set the current year in the footer
document.addEventListener('DOMContentLoaded', function() {
  var yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
