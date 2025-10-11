
const showError = (message) => {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}


document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;
  const confirmation = document.getElementById('confirm-password').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  if (password !== confirmation){
    showError('Which password do you want?');
    return;
  }

  const validChars = new Set(' abcdefghijklmnopqrstuvwxyz0123456789,./+=-!@#$%^&*_');

  const nameUsesValidChars = username.toLowerCase().split('').every(char => validChars.has(char));
  const passwordUsesValidChars = password.toLowerCase().split('').every(char => validChars.has(char));

  if (!nameUsesValidChars){
    showError('Your username may only contain alpha-numeric characters or ,./+=-!@#$%^&*_, but no whitespace')
    return
  }

  if (!passwordUsesValidChars){
    showError('Your password may only contain alpha-numeric characters or ,./+=-!@#$%^&*_, but no whitespace')
    return
  }

  try{

    const response = await fetch('/auth/register', {
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({
        email,username,password
      })
    })

    console.log({response})
    const data = await response.json();
    console.log({data,response})

    if (response.ok) window.location.href = '/auth'
    else showError(data.message);
  }
  catch(e){
    console.log({e});
    showError(e.message);
  }
})