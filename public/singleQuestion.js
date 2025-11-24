const viewSavedBtn = document.getElementById('view-saved');
const dismissBtn = document.getElementById('dismiss');
const prevAnswerBox = document.getElementById('saved-answer');

const viewFeedbackBtn = document.getElementById('view-fb');
const dismissFeedbackBtn = document.getElementById('dismiss-fb');
const prevFeedbackBox = document.getElementById('saved-feedback');

const answerForm = document.getElementById('answer-form');


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
  if (!e.target.classList.contains('saved-answer') 
    && !e.target.classList.contains('view-saved')){
    prevAnswerBox.style.opacity = 0;
  setTimeout(() => {
    prevAnswerBox.style.display = 'none';
  },300)
  }
  if (!e.target.classList.contains('saved-feedback') 
    && !e.target.classList.contains('view-fb')){
    prevFeedbackBox.style.opacity = 0;
  setTimeout(() => {
    prevFeedbackBox.style.display = 'none';
  },300)
  }
})

answerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.target.id = 'submit-answer'){
    const answer = document.getElementById('answer').value;
    let question = document.getElementById('question').value;
    const questionId = document.getElementById('questionId').value;
    question = JSON.parse(question);
    if (!answer.trim().length){
      // handleBad('lets not waste calls with blank data chief');
      return;
    }
    const response = await fetch('/questions/answerQuestion', {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({
        answer,
        questionId,
        question
      })
    })


    if (response.ok){
      window.location.replace('/practice/getLoadResults');
    }
    else{
      // handleBad(response.mesage);
    }
  }
})