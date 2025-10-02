const answerBox  = document.getElementById('answer');
const answerForm = document.getElementById('answerSubmission');

answerBox.addEventListener('focusin', (e) =>{
  answerBox.scrollIntoView({
    behavior:"smooth",
    block:"end",
  })
})

answerBox.addEventListener('keydown', (e) =>{
  if (e.key === 'Enter'){
    if (!e.shiftKey){
      e.preventDefault();
      answerForm.submit();
    }
  }
})