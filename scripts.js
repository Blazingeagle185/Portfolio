// Dark mode toggle
const darkModeToggle = document.getElementById('darkMode');
const darkIcon = document.getElementById('dark-icon');
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  darkIcon.textContent = darkModeToggle.checked ? '🌙' : '☀️';
});

// Highlight project on click
function highlightProject(project) {
  project.classList.toggle('highlight');
  project.style.transform = 'scale(1.05)';
  setTimeout(() => {
    project.style.transform = 'scale(1)';
  }, 5);
}

