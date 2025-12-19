// still catering to EJS's needy ass, incomingSearch needs to be defined
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
  // this takes place in two parts, the controller gets questions that match the categories search
  // all category matches are sent to the client
  // but here we discover which meet the keyword search requirements as well
  const searchItems = incomingSearch 
                      ? incomingSearch.split(' ')
                      : document.getElementById('search-bar').value.split(' ');
  document.getElementById('search-bar').value = '';
  const search = searchItems.map(word => word.toLowerCase().trim()).filter(Boolean);
  
  // filter any questions whose content matches
  const pass = searchedQs.filter(question => {
    return search.every(item => question.textContent.toLowerCase().includes(item));
  });
  
  // filter those that dont match (styling purposes)
  const fail = searchedQs.filter(question => {
    return search.some(item => !question.textContent.toLowerCase().includes(item));
  });
  
  handleResults();

  // allow times for each transition to occur before changin displays
  // remove opacity from ALL questions, takes .3s to trans-out, then display = none
  // wait for those .3s, set elements display to block
  // DELAY AGAIN (both styles will be picked up on same pass and skip transition), add opacity to trans-in
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

  // reset incoming search so current search queries dont affect next search
  incomingSearch = null;

  // wait .3s AGAIN, handle no matching results
  setTimeout(() => {
    handleNoResults();
  }, 300)
  return pass.length;
}

// same logic, form submission by keypress
const filterSearchEnter = (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const searchContainer = document.getElementById('search-container');
  searchContainer.style.opacity = 0;
  setTimeout(() => {
    searchContainer.style.display = 'none';
  }, 300)
  document.body.scrollIntoView({block:'start', behavior: 'smooth'});
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

// this plays the same delay opacity and display changes for transitions game
// explained in filterSearch()
// does so for all questions that were initially returned (category Matches)
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

// this ensures the error messages for no results are removed
// plays the same delay game as mentioned above
const handleResults = () => {
  noResultsMessage.classList.remove('opacity-100');
  tooStrictMessage.classList.remove('opacity-100');
  setTimeout(() =>{
    noResultsMessage.style.display = 'none';
    tooStrictMessage.style.display = 'none';
  }, 300);
}

// this ensures the proper error message for no results are displayed / removed
// plays the same delay game as mentioned above
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

// use this count to determine how to display error messages
const countVisibleQuestions = () => {
  let visibleCount = 0;
  searchedQs.forEach(question => {
    if (question.style.display !== 'none') visibleCount++;
  });

  return visibleCount;
}

// all questions start as transparent to be faded in
// if there are any questions that pass ALL search requirement (category and keyword)
  // display them
// other wise handle which result message should show
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

document.addEventListener('click', (e) => {
  let elm = e.target;
  while (elm){
    if (elm.id === 'search-box' || elm.id === 'show-search') return;
    elm = elm.parentElement;
  }
  const searchContainer = document.getElementById('search-container');
  searchContainer.style.opacity = 0;
  setTimeout(() => {
    searchContainer.style.display = 'none';
  }, 300)
})

document.getElementById('show-search').addEventListener('click', () => {
  const searchContainer = document.getElementById('search-container');
  searchContainer.style.display = 'flex';
  setTimeout(() => {searchContainer.style.opacity = 1;},0)
})

document.addEventListener('click', (e) => {
  const id = e.target.id;
  if (id === 'search-btn' || id === 'clear-btn'){
    const searchContainer = document.getElementById('search-container');
    searchContainer.style.opacity = 0;
    setTimeout(() => {
      searchContainer.style.display = 'none';
    }, 300)
    document.body.scrollIntoView({block:'start', behavior: 'smooth'});
  }
})