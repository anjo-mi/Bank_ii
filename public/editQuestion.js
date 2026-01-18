const newCategoryBox = document.getElementById('new-category');
const newCategoryBtn = document.getElementById('add-new-category');
const deleteBtn = document.getElementById('delete-btn');
const updateQuestionForm = document.getElementById('edit-question-form');
const questionId = document.getElementById('questionId').value;

const answerArea = document.getElementById('answer');

const viewFeedbackBtn = document.getElementById('view-fb');
const dismissFeedbackBtn = document.getElementById('dismiss-fb');
const prevFeedbackBox = document.getElementById('saved-feedback');

const errorMessage = document.getElementById('error-message');
const successBox = document.getElementById('success-message');

const categories = new Set(Array.from(document.querySelectorAll('input[name="categori"]')).map(cat => cat.value));

const possNewCategories = document.getElementById('possible-new-categories');

const handleBad = (message) => {
  errorMessage.style.display = 'flex';
  errorMessage.querySelector('#message').textContent = message;
  setTimeout(() => {
    errorMessage.style.opacity = 100;
  }, 300)
}

const handleGood = (message) => {
  successBox.querySelector('.message').textContent = message;
  successBox.style.display = 'flex';
  setTimeout(() => {
    successBox.style.opacity = 100;
  }, 100)
}

newCategoryBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    e.preventDefault();
    const category = newCategoryBox.value;
    newCategoryBox.value = '';
    if (!category.trim().length){
      handleBad('categories cant be empty')
      return;
    }
    if (categories.has(category)){
      handleBad('youve created this category before')
      return;
    }
    categories.add(category);
    const li = document.createElement('li');
    li.className = "min-w-3/10 text-xs md:text-lg lg:text-lg text-sky-200 font-bold";
    
    const label = document.createElement('label');
    label.className = "flex py-1 px-2 mr-auto place-content-evenly items-center bg-gray-700 hover:bg-cyan-950 hover:cursor-pointer rounded-lg border-1 border-blue-300";
    label.htmlFor = category;
    
    const input = document.createElement('input');
    input.type = "checkbox";
    input.name = "categori";
    input.id = category;
    input.value = category; 
    input.checked = true; 
    input.className = "w-4 h-4 md:w-6 md:h-6 accent-indigo-800 outline-1 outline-white"
    
    label.appendChild(input);
    li.appendChild(label);
    const list = document.getElementById('category-list');
    list.appendChild(li);
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
    handleBad('categories cant be empty')
    return;
  }
  if (categories.has(category)){
    handleBad('youve created this category before')
    return;
  }
  categories.add(category);
  const li = document.createElement('li');
  li.className = "min-w-3/10 text-xs md:text-lg lg:text-lg text-sky-200 font-bold";
  
  const label = document.createElement('label');
  label.className = "flex py-1 px-2 mr-auto place-content-evenly items-center bg-gray-700 hover:bg-cyan-950 hover:cursor-pointer rounded-lg border-1 border-blue-300";
  label.htmlFor = category;
  
  const input = document.createElement('input');
  input.type = "checkbox";
  input.name = "categori";
  input.id = category;
  input.value = category; 
  input.checked = true; 
  input.className = "w-4 h-4 md:w-6 md:h-6 accent-indigo-800 outline-1 outline-white"
  
  label.appendChild(input);
  li.appendChild(label);
  const list = document.getElementById('category-list');
  list.appendChild(li);
  label.appendChild(document.createTextNode(category));
  possNewCategories.value += 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULT' + category;
  return;
  
  
})

updateQuestionForm.addEventListener('submit', async (e) => {
 // block form submission
    e.preventDefault();
    if (e.target === newCategoryBox || e.target === newCategoryBtn) return;

    // hide the input / display the load indicator
    document.getElementById('submit').style.display = 'none';
    document.getElementById('load-indicator').style.display = 'block';

    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    const newCategories = document.getElementById('possible-new-categories').value;

    if (!selectedCategories.length){
      handleBad('questions each need at least 1 category')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    if (!question.trim().length){
      handleBad('questions need content')
      // hide the load indicator / display the button
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    if (question.trim().split(' ').length > 60){
      handleBad('questions shouldnt be so verbose')
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
        handleGood(data.message);
        
        setTimeout(() => {window.location.href = '/questions/edit/select'}, 1500)
        
      }
      // register sends data.message, login sends data.error
      else handleBad(data.message || data.error);
      // redisplay input for next attempt
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
    }
    catch(e){
      console.log({e});
      handleBad(e.message);
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
  // hide the input / display the load indicator
  document.getElementById('submit').style.display = 'none';
  document.getElementById('load-indicator').style.display = 'block';
  const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
  const question = document.getElementById('question').value;
  const answer = document.getElementById('answer').value;
  const newCategories = document.getElementById('possible-new-categories').value;
  if (!selectedCategories.length){
    handleBad('questions each need at least 1 category')
    // hide the load indicator / display the button
    document.getElementById('load-indicator').style.display = 'none';
    document.getElementById('submit').style.display = 'block';
    return;
  }
  if (!question.trim().length){
    handleBad('questions need content')
    // hide the load indicator / display the button
    document.getElementById('load-indicator').style.display = 'none';
    document.getElementById('submit').style.display = 'block';
    return;
  }
  if (question.trim().split(' ').length > 60){
    handleBad('questions shouldnt be so verbose')
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
      handleGood(data.message);
      
      setTimeout(() => {window.location.href = '/questions/edit/select'}, 1500)
    }
    // register sends data.message, login sends data.error
    else handleBad(data.message || data.error);
    // redisplay input for next attempt
    document.getElementById('load-indicator').style.display = 'none';
    document.getElementById('submit').style.display = 'block';
  }
  catch(e){
    console.log({e});
    handleBad(e.message);
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
    // show a success message that fades in and fades out
    handleGood(data.message);
    // redirect
    setTimeout(() => {
      window.location.href = '/questions/edit/select'
    },1500);

  } else handleBad(data.message);
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

document.addEventListener('click', (e) => {
  let elm = e.target;
  while (elm){
    if (elm.id === 'submit' || elm.id === 'delete-btn') return
    elm = elm.parentElement;
  }
  errorMessage.style.opacity = 0;
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 300);

  successBox.style.opacity = 0;
  setTimeout(() => {
    successBox.style.display = 'none';
  }, 300);
})

answerArea.addEventListener('click', (e) => {
  setTimeout(() => {
    answerArea.scrollIntoView({
      block: "center",
      behavior: 'smooth',
    })
  }, 300)
})


document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.querySelectorAll('code')).forEach(code => {
    code.style.whiteSpace = 'pre-wrap';
    code.style.wordBreak = 'break-word';
  })
  Array.from(document.querySelectorAll('pre')).forEach(pre => {
      pre.style.backgroundColor = 'black';
      pre.style.border = '1px solid white';
      pre.style.borderRadius = '5%';
      pre.style.textAlign = 'start';
      pre.style.padding = '.8rem';
  })
})
