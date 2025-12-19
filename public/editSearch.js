const filterSearchBtn = document.getElementById('filter-search');
const questionList = document.getElementById('questions-list');
const searchBar = document.getElementById('search-bar');
const noResultsBox = document.getElementById('no-results-box');
const questionListItems = Array.from(document.querySelectorAll('.question-list-item'));
const categoryBoxes = Array.from(document.querySelectorAll('.category-input'));
const successBox = document.getElementById('success-message');
const errorBox = document.getElementById('error-message');

const handleGood = (message) => {
  console.log({message})
  successBox.querySelector('.message').textContent = message;
  successBox.style.display = 'flex';
  setTimeout(() => {
    successBox.style.opacity = 100;
  }, 100)
}

const handleBad = (message) => {
  errorBox.querySelector('.message').textContent = message;
  errorBox.style.display = 'flex';
  setTimeout(() => {
    errorBox.style.opacity = 100;
  }, 100)
}

const filterQuestions = (e) => {
  if (e.key === 'Enter' || e.detail){
    e.preventDefault();
    const searchContainer = document.getElementById('search-container');
    searchContainer.style.opacity = 0;
    setTimeout(() => {
      searchContainer.style.display = 'none';
    }, 300)
    noResultsBox.style.opacity = 0;
    const contentSearch = searchBar.value.trim().split(' ').map(word => word.toLowerCase());
    const categorySearch = categoryBoxes.filter(box => box.checked).map(input => input.value);
    searchBar.value = '';
    categoryBoxes.forEach(box => box['checked']= false);

    const matchingQuestions = questionListItems.filter(q => {
      let catMatch = true;
      let contentMatch = true;
      if (categorySearch.length) catMatch = categorySearch.every(cat =>{
        const questionCategories = Array.from(q.querySelectorAll('.category-quick-search')).map(p => p.textContent)
        return questionCategories.includes(cat);
      });
      if (contentSearch.length) contentMatch = contentSearch.every(word => {
        const questionContent = q.querySelector('.question-content').textContent.toLowerCase()
        return questionContent.includes(word);
      });
      
      return catMatch && contentMatch
    })

    questionList.style.opacity = 0;
    setTimeout(() => {
      questionListItems.forEach(li => li.style.display = 'none');
      matchingQuestions.forEach(li => li.style.display = 'block');
      setTimeout(() => questionList.style.opacity = 1 ,0);
      if (!matchingQuestions.length) setTimeout(() => noResultsBox.style.opacity = 1 ,0)
    } ,300)
    document.body.scrollIntoView({block: 'start', behavior: 'smooth'});
  }
}

filterSearchBtn.addEventListener('click', filterQuestions);
searchBar.addEventListener('keydown', filterQuestions);

// start with questionList as display block, but opactity 0
// transition to opacity 1
document.addEventListener('DOMContentLoaded', () =>  questionList.style.opacity=1);

// give every delete button on the page functionality
const deleteButtons = document.querySelectorAll('.delete-question-btn');

for (const deleteBtn of deleteButtons){

  deleteBtn.addEventListener('click', async (e) => {

    const listItem = e.target.closest('li');

    const defaultValue = listItem.querySelector('input[name="isDefault"]').value;
    const isDefault = Boolean(+defaultValue);
    if (isDefault){
      handleBad('default questions stay, this is the way');
      return;
    }
    
    const questionId = listItem.querySelector('input[name="questionId"]').value;
    
    // open a box making sure the user want to "delete" delete
    // checkDeleteIntent();
    
    const response = await fetch(`/questions/delete/${questionId}`, {
      method: 'DELETE'
    })
    const data = await response.json();
    if (response.ok){
      // show a success message that fades in and fades out
      handleGood('the question was deleted!!!')

      listItem.style.display = 'none';
    }
    // otherwise 
    else {
      console.log(data.message);
      handleBad(data.message);
    }
  })
}

document.addEventListener('click', (e) => {
  let elm = e.target;
  while (elm){
    if (elm.classList.contains('delete-question-btn')) return;
    elm = elm.parentElement;
  }
  successBox.style.opacity = 0;
  errorBox.style.opactiy = 0;
  setTimeout(() => {
    successBox.style.display = 'none';
    errorBox.style.display = 'none';
  }, 300);
})

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