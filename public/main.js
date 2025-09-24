let incomingSearch = document.getElementById('incomingSearch') 
                      ? document.getElementById('incomingSearch').value
                      : null;
const searchedQs = Array.from(document.querySelectorAll('.question-list-item'));
const searchButton = document.getElementById('search-btn');


const filterSearch = () => {
  const searchItems = incomingSearch 
                      ? incomingSearch.split(' ')
                      : document.getElementById('search-bar').value.split(' ');
  document.getElementById('search-bar').value = '';
  const search = searchItems.map(word => word.toLowerCase().trim()).filter(Boolean);
  if (!search.length) return;
  
  const pass = searchedQs.filter(question => {
    return search.every(item => question.textContent.toLowerCase().includes(item));
  });
  
  const fail = searchedQs.filter(question => {
    return search.some(item => !question.textContent.toLowerCase().includes(item));
  });
  
  pass.forEach(question => question.style.display = 'block');
  fail.forEach(question => question.style.display = 'none');
  
  incomingSearch = null;
}


const filterSearchEnter = (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const searchItems = incomingSearch 
                      ? incomingSearch.split(' ')
                      : document.getElementById('search-bar').value.split(' ');
  document.getElementById('search-bar').value = '';
  const search = searchItems.map(word => word.toLowerCase().trim()).filter(Boolean);
  if (!search.length) return;
  
  const pass = searchedQs.filter(question => {
    return search.every(item => question.textContent.toLowerCase().includes(item));
  });
  
  const fail = searchedQs.filter(question => {
    return search.some(item => !question.textContent.toLowerCase().includes(item));
  });
  
  pass.forEach(question => question.style.display = 'block');
  fail.forEach(question => question.style.display = 'none');
  
  incomingSearch = null;
}
if (incomingSearch) filterSearch();
console.log({incomingSearch})

document.addEventListener('keydown', filterSearchEnter);
searchButton.addEventListener('click', filterSearch);