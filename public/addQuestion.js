const newCategoryBox = document.getElementById('new-category');
const newCategoryBtn = document.getElementById('add-new-category');
const newQuestionForm = document.getElementById('create-question-form');

const answerArea = document.getElementById('answer');
const questionArea = document.getElementById('question');

const errorMessage = document.getElementById('error-message');
const successBox = document.getElementById('success-message')

const categories = new Set(Array.from(document.querySelectorAll('input[name="categori"]')).map(cat => cat.value));

const possNewCategories = document.getElementById('possible-new-categories');

// const showError = (message) => {
//   const errorMessage = document.getElementById('error-message');
//   errorMessage.textContent = message;
//   errorMessage.style.display = 'block';
// }

// const showSuccess = (message) => {
//   const successMessage = document.getElementById('success-message');
//   successMessage.textContent = message;
//   successMessage.style.display = 'block';
// }

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
    li.className="min-w-3/10 text-xs md:text-md text-sky-200 font-bold";
    
    const label = document.createElement('label');
    label.className="flex gap-1 py-1 px-2 mr-auto place-content-evenly items-center bg-gray-700 hover:bg-cyan-950 hover:cursor-pointer rounded-lg border-1 border-blue-300";
    label.htmlFor=category;
    
    const input = document.createElement('input');
    input.type="checkbox";
    input.name="categori";
    input.id=category;
    input.value=category; 
    input.checked=true; 
    input.className="w-4 h-4 md:w-6 md:h-6 accent-indigo-800 outline-1 outline-white"
    
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
  li.className="min-w-3/10 text-xs md:text-md text-sky-200 font-bold";
  
  const label = document.createElement('label');
  label.className="flex gap-1 py-1 px-2 mr-auto place-content-evenly items-center bg-gray-700 hover:bg-cyan-950 hover:cursor-pointer rounded-lg border-1 border-blue-300";
  label.htmlFor=category;
  
  const input = document.createElement('input');
  input.type="checkbox";
  input.name="categori";
  input.id=category;
  input.value=category; 
  input.checked=true; 
  input.className="w-4 h-4 md:w-6 md:h-6 accent-indigo-800 outline-1 outline-white"
  
  label.appendChild(input);
  li.appendChild(label);
  const list = document.getElementById('category-list');
  list.appendChild(li);
  label.appendChild(document.createTextNode(category));
  possNewCategories.value += 'VERYUNIQUEIFSOMEONECOPIESTHISTHEYREJUSTBEINGDIFFICULT' + category;
  return;
  
  
})

newQuestionForm.addEventListener('submit', async (e) => {
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
      const response = await fetch('/questions/create', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({
          question,
          categori: selectedCategories,
          answer: answer.trim() || null,
          newCategories,
        })
      })

      const data = await response.json();

      // if were good, go to practice (login occurs in registration method)
      if (response.ok){
        // window.location.href = '/questions/form'
        handleGood(data.message);
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        possNewCategories.value = '';
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

newQuestionForm.addEventListener('keydown', async (e) => {
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
      const response = await fetch('/questions/create', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({
          question,
          categori: selectedCategories,
          answer: answer.trim() || null,
          newCategories,
        })
      })

      const data = await response.json();

      // if were good, go to practice (login occurs in registration method)
      if (response.ok){
        // window.location.href = '/questions/form'
        handleGood(data.message);
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        possNewCategories.value = '';
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

answerArea.addEventListener('click', (e) => {
  setTimeout(() => {
    answerArea.scrollIntoView({
      block: "center",
      behavior: 'smooth',
    })
  }, 300)
})

questionArea.addEventListener('click', (e) => {
  setTimeout(() => {
    questionArea.scrollIntoView({
      block: "center",
      behavior: 'smooth',
    })
  }, 300)
})

document.addEventListener('click', (e) => {
  let elm = e.target;
  while (elm){
    if (elm.id === 'submit') return
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