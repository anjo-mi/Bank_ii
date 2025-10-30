const selectAllBtn = document.getElementById('select-all');
const categories = document.querySelectorAll('.checkbox');

selectAllBtn.addEventListener('click', (e) =>  categories.forEach(cat => cat.checked = true));