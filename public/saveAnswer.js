const successBox = document.getElementById('success-message');
const errorBox = document.getElementById('error-message');
const dismisses = document.querySelectorAll('.dismiss');

if (dismisses) dismisses.forEach(dismissBox => {
  dismissBox.addEventListener('click', (e) => {
    successBox.style.opacity = 0;
    errorBox.style.opacity = 0;
    setTimeout(() => {
      successBox.style.display = 'none';
      errorBox.style.display = 'none';
    }, 300)
  })
})

const handleGood = (message) => {
  successBox.querySelector('.message').textContent = message;
  successBox.style.display = 'flex';
  setTimeout(() => {
    successBox.style.opacity = 100;
  }, 100)
}

const handleBad = (message) => {
  errorBox.querySelector('.message').textContent = message;
  errorBox.style.display = 'flex';
  errort(() => {
    errorBox.style.opacity = 100;
  }, 100)
}

document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('save-answer')){
    e.preventDefault();
    const answer = e.target.querySelector('.answer').value;
    const content = e.target.querySelector('.content').value;
    const questionId = e.target.querySelector('.questionId').value;
    const isDefault = e.target.querySelector('.isDefault') ? e.target.querySelector('.isDefault').value : null;

    const response = await fetch('/questions/saveAnswer', {
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({
        answer,
        content,
        questionId,
        isDefault,
      })
    })

    const data = await response.json();

    console.log({data})
    if (response.ok){
      handleGood(data.message);
    }
    else handleBad(data.message);
  }
})