const newCategoryBox = document.getElementById('new-category');
const newCategoryBtn = document.getElementById('add-new-category');
const deleteBtn = document.getElementById('delete-btn');
const updateQuestionForm = document.getElementById('edit-question-form');
const questionId = document.getElementById('questionId').value;

const viewFeedbackBtn = document.getElementById('view-fb');
const dismissFeedbackBtn = document.getElementById('dismiss-fb');
const prevFeedbackBox = document.getElementById('saved-feedback');

const categories = new Set(Array.from(document.querySelectorAll('input[name="categori"]')).map(cat => cat.value));

const possNewCategories = document.getElementById('possible-new-categories');

const showError = (message) => {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

const showSuccess = (message) => {
  const successMessage = document.getElementById('success-message');
  successMessage.textContent = message;
  successMessage.style.display = 'block';
}

newCategoryBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    e.preventDefault();
    const category = newCategoryBox.value;
    newCategoryBox.value = '';
    if (!category.trim().length){
      showError('categories cant be empty')
      return;
    }
    if (categories.has(category)){
      showError('youve created this category before')
      return;
    }
    categories.add(category);
    const li = document.createElement('li');
    li.className="bg-slate-700 p-1 min-w-3/10 rounded-lg border-1 border-gray-200 text-xs md:text-lg lg:text-lg md:mt-0 lg:mt-0 text-sky-200 font-bold";
    
    const label = document.createElement('label');
    label.className="w-full h-full";
    label.htmlFor=category;
    
    const input = document.createElement('input');
    input.type="checkbox";
    input.name="categori";
    input.id=category;
    input.value=category; 
    input.checked=true; 
    input.className="w-full h-full text-blue-600 mt-2 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    
    label.appendChild(input);
    li.appendChild(label);
    const list = document.getElementById('category-list');
    list.appendChild(li);
    list.appendChild(newCategoryBox);
    label.appendChild(document.createTextNode(category));
    possNewCategories.value += 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULT' + category;
    return;
  }
  return;
})

newCategoryBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const category = newCategoryBox.value;
  newCategoryBox.value = '';
  if (!category.trim().length){
    showError('categories cant be empty')
    return;
  }
  if (categories.has(category)){
    showError('youve created this category before')
    return;
  }
  categories.add(category);
  const li = document.createElement('li');
  li.className="bg-slate-700 p-1 min-w-3/10 rounded-lg border-1 border-gray-200 text-xs md:text-lg lg:text-lg md:mt-0 lg:mt-0 text-sky-200 font-bold";
  
  const label = document.createElement('label');
  label.className="w-full h-full";
  label.htmlFor=category;
  
  const input = document.createElement('input');
  input.type="checkbox";
  input.name="categori";
  input.id=category;
  input.value=category; 
  input.checked=true; 
  input.className="w-full h-full text-blue-600 mt-2 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  
  label.appendChild(input);
  li.appendChild(label);
  const list = document.getElementById('category-list');
  list.appendChild(li);
  list.appendChild(newCategoryBox);
  label.appendChild(document.createTextNode(category));
  possNewCategories.value += 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULT' + category;
  return;
  
  
})

updateQuestionForm.addEventListener('submit', async (e) => {
 // block form submission
    e.preventDefault();
    if (e.target === newCategoryBox || e.target === newCategoryBtn) return;

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    // hide the input / display the load indicator
    document.getElementById('submit').style.display = 'none';
    document.getElementById('load-indicator').style.display = 'block';

    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    const newCategories = document.getElementById('possible-new-categories').value;

    if (!selectedCategories.length){
      showError('questions each need at least 1 category')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    if (!question.trim().length){
      showError('questions need content')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    if (question.trim().split(' ').length > 60){
      showError('questions shouldnt be so verbose')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    try{
      // now attempt form submission
      const response = await fetch('/questions/edit/update', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({
          question,
          questionId,
          categori: selectedCategories,
          answer: answer.trim() || null,
          newCategories,
        })
      })

      const data = await response.json();

      // if were good, go to practice (login occurs in registration method)
      if (response.ok){
        showSuccess(data.message);
        
        setTimeout(() => {window.location.href = '/questions/edit/select'}, 1500)
        
      }
      // register sends data.message, login sends data.error
      else showError(data.message || data.error);
      // redisplay input for next attempt
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
    }
    catch(e){
      console.log({e});
      showError(e.message);
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
    }
  })

updateQuestionForm.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    if (e.shiftKey) return;
 // block form submission
    e.preventDefault();
    if (e.target === newCategoryBox || e.target === newCategoryBtn) return;

    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    // hide the input / display the load indicator
    document.getElementById('submit').style.display = 'none';
    document.getElementById('load-indicator').style.display = 'block';

    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    const newCategories = document.getElementById('possible-new-categories').value;

    if (!selectedCategories.length){
      showError('questions each need at least 1 category')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    if (!question.trim().length){
      showError('questions need content')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    if (question.trim().split(' ').length > 60){
      showError('questions shouldnt be so verbose')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    try{
      // now attempt form submission
      // action="/questions/edit/update"
      const response = await fetch('/questions/edit/update', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({
          question,
          questionId,
          categori: selectedCategories,
          answer: answer.trim() || null,
          newCategories,
        })
      })

      const data = await response.json();

      // if were good, go to practice (login occurs in registration method)
      if (response.ok){
        showSuccess(data.message);
        
        setTimeout(() => {window.location.href = '/questions/edit/select'}, 1500)
      }
      // register sends data.message, login sends data.error
      else showError(data.message || data.error);
      // redisplay input for next attempt
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
    }
    catch(e){
      console.log({e});
      showError(e.message);
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
    }
  })

deleteBtn.addEventListener('click', async (e) => {
  e.preventDefault();
    
  // open a box making sure the user want to "delete" delete
  // checkDeleteIntent();
    
  const response = await fetch(`/questions/delete/${questionId}`, {
    method: 'DELETE'
  })
  const data = await response.json();
    
  if (response.ok){
      // fadeout the question, wait for transition, switch display to none
    

    const questionEditingBox = document.getElementById('edit-question-container');
    questionEditingBox.style.display = 'none';

    const successage = document.getElementById('success-message');
    successage.textContent = data.message;
    successage.style.display= 'block';

    // show a success message that fades in and fades out
    console.log('the question was deleted!!!');
    setTimeout(() => {
      window.location.href = '/questions/edit/select'
    },600);

  }
  // otherwise 
  else showError(data.message);
})

viewFeedbackBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevFeedbackBox.style.display = 'flex';
  setTimeout(() => prevFeedbackBox.style.opacity = 100,0);
  prevFeedbackBox.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
})

dismissFeedbackBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevFeedbackBox.style.opacity = 0;
  setTimeout(() => {
    prevFeedbackBox.style.display = 'none';
  },300)
})

document.addEventListener('click', (e) => {
  let elm = e.target;
  while (elm){
    if (elm.classList.contains('saved-feedback') || elm.classList.contains('view-fb')) return;
    elm = elm.parentElement;
  }
  prevFeedbackBox.style.opacity = 0;
  setTimeout(() => {
    prevFeedbackBox.style.display = 'none';
  },300)
})