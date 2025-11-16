const viewSavedBtn = document.getElementById('view-saved');
const dismissBtn = document.getElementById('dismiss');
const prevAnswerBox = document.getElementById('saved-answer');

viewSavedBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevAnswerBox.style.display = 'flex';
  setTimeout(() => prevAnswerBox.style.opacity = 100,0);
})

dismissBtn.addEventListener('click', (e) => {
  e.preventDefault();
  prevAnswerBox.style.opacity = 0;
  setTimeout(() => {
    prevAnswerBox.style.display = 'none';
  },300)
})

document.addEventListener('click', (e) => {
  console.log(e.target)
  if (!e.target.classList.contains('saved-answer') 
    && !e.target.classList.contains('view-saved')){
    prevAnswerBox.style.opacity = 0;
  setTimeout(() => {
    prevAnswerBox.style.display = 'none';
  },300)
  }
})