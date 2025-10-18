document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('li').forEach(li =>li.style.opacity=1);
})

const deleteButtons = document.querySelectorAll('.delete-question-btn');

for (const deleteBtn of deleteButtons){

  deleteBtn.addEventListener('click', async (e) => {

    const listItem = e.target.closest('li')
    
    const questionId = listItem.querySelector('input[name="questionId"]').value;
    
    // open a box making sure the user want to "delete" delete
    // checkDeleteIntent();
    
    const response = await fetch(`/questions/delete/${questionId}`, {
      method: 'DELETE'
    })
    const data = await response.json();
    console.log({data})
    if (response.ok){
      // fadeout the question, wait for transition, switch display to none
      const successage = document.getElementById('success-message');
      successage.textContent = data.message;
      successage.style.display= 'block';

      // show a success message that fades in and fades out
      console.log('the question was deleted!!!')

      listItem.style.display = 'none';
    }
    // otherwise 
    // else showError(data.message);
  })
}