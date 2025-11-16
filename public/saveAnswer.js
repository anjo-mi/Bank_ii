const successBox = document.getElementById('success-message');
const errorBox = document.getElementById('error-message');
const dismisses = document.querySelectorAll('.dismiss');
const resultCards = Array.from(document.querySelectorAll('.result-card'));
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

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

const makeList = (array) => {
  class Node {
    constructor(val){
      this.val = val;
      this.next = null;
      this.prev = null;
    }
  }
  let head = null,
      tail = null;
  
  for (let i = 0 ; i < array.length ; i++){
    const n = new Node(array[i]);
    if (!head){
      head = n;
      tail = n;
      head.next = tail;
      head.prev = tail;
      tail.prev = head;
      tail.next = head;
    }else{
      n.prev = tail;
      tail.next = n;
      tail = tail.next;
      tail.next = head;
      head.prev = tail;
    }
  }
  return head;
}

let current;

document.addEventListener('DOMContentLoaded', (e) => {
  const resultsList = makeList(resultCards);
  console.log(resultsList)
  current = resultsList;
  current.val.style.display = 'block';
  current.val.style.opacity = 100;
})

prevBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!current.prev) return;
  console.log({current});
  current.val.style.opacity = 0;
  setTimeout(() => {
    current.val.style.display = 'none'
    setTimeout(() =>{
      current = current.prev;
      current.val.style.display = 'block';
      current.val.style.opacity = 100;
    })
  }, 300);
})

nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!current.next) return;
  console.log({current});
  current.val.style.opacity = 0;
  setTimeout(() => {
    current.val.style.display = 'none'
    setTimeout(() =>{
      current = current.next;
      current.val.style.display = 'block';
      current.val.style.opacity = 100;
    })
  }, 300);
})

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

    if (response.ok){

      handleGood(data.message);
    }
    else handleBad(data.message);
  }
}
)

document.addEventListener('submit', async (e) => {
  if (e.target.classList.contains('save-resource')){
    e.preventDefault();
    const resource = e.target.querySelector('.resource').value;
    
    const response = await fetch('/saveResource', {
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({
        resource,
      })
    })

    const data = await response.json();
    
    if (response.ok){
      
      handleGood(data.message);
    }
    else handleBad(data.message);
  }
})