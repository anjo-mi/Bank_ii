const page = document.getElementById('whole-page');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar-menu');


menuToggle.addEventListener('click', e => {
  e.stopPropagation();
  sidebar.classList.toggle('-translate-x-full');
  menuToggle.style.display = 'none';
});

document.addEventListener('click', e => {
  if (!sidebar.classList.contains('-translate-x-full') && !sidebar.contains(e.target)) {
    e.preventDefault()
    e.stopPropagation()
    sidebar.classList.add('-translate-x-full');
    menuToggle.style.display = 'block';
  }
})

document.addEventListener('DOMContentLoaded', () => {
  page.style.opacity = 100;
})