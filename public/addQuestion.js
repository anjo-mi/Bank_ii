/*
<li class="bg-slate-700 p-1 min-w-3/10 rounded-lg border-1 border-gray-200 text-xs md:text-lg lg:text-lg md:mt-0 lg:mt-0 text-sky-200 font-bold">
  <label for="<%= cat.description %>" class="w-full h-full">
    <input  type="checkbox" 
    name="categori" 
    id="<%= cat.description %>" 
    value="<%= cat.description %>" 
    class="w-full h-full"
    >
  
  <%= cat.description %>
  </label>
</li>

<li class="w-3/10">
  <input type="text" 
  id="new-category" 
  placeholder="Add New Category" 
  class="px-2 w-full block text-center text-xs md:text-lg lg:text-lg border-1 border-gray-300 focus:outline-2 focus:outline-green-400"
  >
</li>
*/

const newCategoryBox = document.getElementById('new-category');
const newQuestionForm = document.getElementById('create-question-form');

const categories = new Set(Array.from(document.querySelectorAll('input[name="categori"]')).map(cat => cat.value));

const possNewCategories = document.getElementById('possible-new-categories');

const showError = (message) => {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
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

newQuestionForm.addEventListener('submit', async (e) => {
 // block form submission
    e.preventDefault();

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
      if (response.ok) window.location.href = '/questions/form'
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
