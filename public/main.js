let incomingSearch = document.getElementById('incomingSearch') 
                      ? document.getElementById('incomingSearch').value
                      : null;
const searchedQs = Array.from(document.querySelectorAll('.question-list-item'));
const searchButton = document.getElementById('search-btn');
const clearButton = document.getElementById('clear-btn');
const clearButtonTwo = document.getElementById('clear-btn-two');
const noResultsMessage = document.getElementById('noResultsBox');
const tooStrictMessage = document.getElementById('tooStrictBox');


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
  handleNoResults();
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
  handleNoResults();
}

const clearFilters = () => {
  searchedQs.forEach(question => question.style.display = 'block');
  handleNoResults();
}

const handleNoResults = () => {
  const visibleItemsCount = countVisibleQuestions();
  console.log({visibleItemsCount})
  if (visibleItemsCount){
    noResultsMessage.style.display = 'none';
    tooStrictMessage.style.display = 'none';
  }
  else if(!searchedQs.length){
    noResultsMessage.style.display = 'none';
    tooStrictMessage.style.display = 'block';
  }
  else {
    tooStrictMessage.style.display = 'none';
    noResultsMessage.style.display = 'block';
  }
}

const countVisibleQuestions = () => {
  let visibleCount = 0;
  searchedQs.forEach(question => {
    console.log({question})
    if (question.style.display !== 'none') visibleCount++;
  });

  return visibleCount;
}

if (incomingSearch) filterSearch();

document.addEventListener('keydown', filterSearchEnter);
searchButton.addEventListener('click', filterSearch);
clearButton.addEventListener('click', clearFilters);
clearButtonTwo.addEventListener('click', clearFilters);
window.addEventListener('load', handleNoResults);