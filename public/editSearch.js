const filterSearchBtn = document.getElementById('filter-search');
const questionList = document.getElementById('questions-list');
const searchBar = document.getElementById('search-bar');
const noResultsBox = document.getElementById('no-results-box');
const questionListItems = Array.from(document.querySelectorAll('.question-list-item'));
const categoryBoxes = Array.from(document.querySelectorAll('.category-input'));
console.log({categoryBoxes})


/*
make a function that when the button is clicked:
  - gives questionList: opacity 0
    - waits: gives all li's display: none
  - determines what (if any questions pass the search)
    - gives those questions each display: block
      - waits (maybe reqAnFr ?): gives questionList opacity 1

takes in:
*/
const filterQuestions = (e) => {
  if (e.key === 'Enter' || e.detail){
    e.preventDefault();
    noResultsBox.style.opacity = 0;
    const contentSearch = searchBar.value.trim().split(' ').map(word => word.toLowerCase());
    const categorySearch = categoryBoxes.filter(box => box.checked).map(input => input.value);
    console.log({categorySearch})
    searchBar.value = '';
    categoryBoxes.forEach(box => box['checked']= false);

    const matchingQuestions = questionListItems.filter(q => {
      let catMatch = true;
      let contentMatch = true;
      if (categorySearch.length) catMatch = categorySearch.every(cat =>{
        const questionCategories = Array.from(q.querySelectorAll('button')).map(btn => btn.value)
        console.log({questionCategories});
        return questionCategories.includes(cat);
      });
      if (contentSearch.length) contentMatch = contentSearch.every(word => {
        const questionContent = q.querySelector('.question-content').textContent.toLowerCase()
        // console.log({questionContent});
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

  }
}

filterSearchBtn.addEventListener('click', filterQuestions);
searchBar.addEventListener('keydown', filterQuestions);
/*
  id:noResultsBox .style = none, wait opacity 0.
  const selectedCategories = document.querySelectorAll: input[type='checkbox']:checked .map => value
  const searchContent = document.getElementById: search-bar .content

  questionList.style.opacity = 0;
  wait for .3 seconds, questionListItems.forEach(li => li.style.display = none);
  let pass;
  if (!searchContent.trim().length){
    pass = questionListItems.filter(q => q.categories.every(cat => selectedCategories.has())
  }else pass = questionListItems.filter(q => q.categories.every(cat => selectedCategories.has() 
                                              && searchContent.split(' ')).every(word => question.content.has())

  if pass.length:
  pass.forEach(li => li.style.diplay => block)
  wait / rAF: questionList.style.opacity = 1

  else:
  id:noResultsBox .style = block, wait opacity 1.

*/

// start with questionList as display block, but opactity 0
// transition to opacity 1
document.addEventListener('DOMContentLoaded', () =>  questionList.style.opacity=1);

// give every delete button on the page functionality
const deleteButtons = document.querySelectorAll('.delete-question-btn');

for (const deleteBtn of deleteButtons){

  deleteBtn.addEventListener('click', async (e) => {

    const listItem = e.target.closest('li')
    
    const questionId = listItem.querySelector('input[name="questionId"]').value;
    
    // open a box making sure the user want to "delete" delete
    // checkDeleteIntent();
    
    const response = await fetch(`/questions/delete/${questionId}`, {
      method: 'DELETE'
    })
    const data = await response.json();
    console.log({data})
    if (response.ok){
      // fadeout the question, wait for transition, switch display to none
      const successage = document.getElementById('success-message');
      successage.textContent = data.message;
      successage.style.display= 'block';

      // show a success message that fades in and fades out
      console.log('the question was deleted!!!')

      listItem.style.display = 'none';
    }
    // otherwise 
    // else showError(data.message);
  })
}