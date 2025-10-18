const deleteBtn = document.getElementById('delete-btn')



deleteBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const questionId = document.getElementById('questionId').value;
    
  // open a box making sure the user want to "delete" delete
  // checkDeleteIntent();
    
  const response = await fetch(`/questions/delete/${questionId}`, {
    method: 'DELETE'
  })
  const data = await response.json();
  console.log({data})
    
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
  // else showError(data.message);
})