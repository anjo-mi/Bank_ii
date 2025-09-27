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
  // if (!search.length) return;
  
  const pass = searchedQs.filter(question => {
    return search.every(item => question.textContent.toLowerCase().includes(item));
  });
  
  const fail = searchedQs.filter(question => {
    return search.some(item => !question.textContent.toLowerCase().includes(item));
  });
  
  handleResults();

  searchedQs.forEach(question => question.classList.remove('opacity-100'))
  setTimeout(() => {
    searchedQs.forEach(question => question.style.display = 'none');
  }, 300)
  setTimeout(() => {
    pass.forEach(question => question.style.display = 'block');
    setTimeout(() => {
      pass.forEach(question => question.classList.add('opacity-100'))
    }, 100)
  },300)

  
  // if (!pass.length) searchedQs.forEach(question => question.classList.add('opacity-100'));

  incomingSearch = null;
  setTimeout(() => {
    handleNoResults();
  }, 300)
  return pass.length;
}


const filterSearchEnter = (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const searchItems = incomingSearch 
                      ? incomingSearch.split(' ')
                      : document.getElementById('search-bar').value.split(' ');
  document.getElementById('search-bar').value = '';
  const search = searchItems.map(word => word.toLowerCase().trim()).filter(Boolean);
  if (!search.length) return [];
  
  const pass = searchedQs.filter(question => {
    return search.every(item => question.textContent.toLowerCase().includes(item));
  });
  
  const fail = searchedQs.filter(question => {
    return search.some(item => !question.textContent.toLowerCase().includes(item));
  });

  handleResults();
  
  searchedQs.forEach(question => question.classList.remove('opacity-100'))
  setTimeout(() => {
    searchedQs.forEach(question => question.style.display = 'none');
  }, 300)
  setTimeout(() => {
    pass.forEach(question => question.style.display = 'block');
    setTimeout(() => {
      pass.forEach(question => question.classList.add('opacity-100'))
    }, 100)
  },300)
  
  incomingSearch = null;
  setTimeout(() => {
    handleNoResults();
  }, 300)
  return pass;
}

const clearFilters = () => {
  handleResults();
  searchedQs.forEach(question => question.classList.remove('opacity-100'))
  setTimeout(() => {
    searchedQs.forEach(question => question.style.display = 'none');
  }, 300)
  setTimeout(() => {
    searchedQs.forEach(question => question.style.display = 'block');
    setTimeout(() => {
      searchedQs.forEach(question => question.classList.add('opacity-100'))
    }, 100)
  },300)
}

const handleResults = () => {
  noResultsMessage.classList.remove('opacity-100');
  tooStrictMessage.classList.remove('opacity-100');
  setTimeout(() =>{
    noResultsMessage.style.display = 'none';
    tooStrictMessage.style.display = 'none';
  }, 300);
}

const handleNoResults = () => {
  const visibleItemsCount = countVisibleQuestions();
  if (visibleItemsCount){
    noResultsMessage.classList.remove('opacity-100');
    tooStrictMessage.classList.remove('opacity-100');
    setTimeout(() =>{
      noResultsMessage.style.display = 'none';
      tooStrictMessage.style.display = 'none';
    }, 300);
  }
  else if(!searchedQs.length){
    noResultsMessage.classList.remove('opacity-100');
    setTimeout(() => {
      noResultsMessage.style.display = 'none';
    }, 300)
    tooStrictMessage.style.display = 'block';
    setTimeout(() => {
      tooStrictMessage.classList.add('opacity-100');
    }, 300)
  }
  else {
    noResultsMessage.style.display = 'block';
    setTimeout(() => {
      noResultsMessage.classList.add('opacity-100');
    }, 300)
  }
}

const countVisibleQuestions = () => {
  let visibleCount = 0;
  searchedQs.forEach(question => {
    if (question.style.display !== 'none') visibleCount++;
  });

  return visibleCount;
}

const pass = filterSearch();

if (pass.length) {
  setTimeout(() => {
    pass.forEach(question => question.classList.add('opacity-100'))
  }, 300)
}else setTimeout(() => {
    handleNoResults();
  }, 300)

document.addEventListener('keydown', filterSearchEnter);
searchButton.addEventListener('click', filterSearch);
clearButton.addEventListener('click', clearFilters);
clearButtonTwo.addEventListener('click', clearFilters);