const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

const showError = (message) => {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

if (registerForm){
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.getElementById('submit').style.display = 'none';
    document.getElementById('load-indicator').style.display = 'block';

    const password = document.getElementById('password').value;
    const confirmation = document.getElementById('confirm-password').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    if (password !== confirmation){
      showError('Which password do you want?');
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    const validChars = new Set(' abcdefghijklmnopqrstuvwxyz0123456789,./+=-!@#$%^&*_');

    const nameUsesValidChars = username.toLowerCase().split('').every(char => validChars.has(char));
    const passwordUsesValidChars = password.toLowerCase().split('').every(char => validChars.has(char));

    if (!nameUsesValidChars){
      showError('Your username may only contain alpha-numeric characters or ,./+=-!@#$%^&*_')
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    if (!passwordUsesValidChars){
      showError('Your password may only contain alpha-numeric characters or ,./+=-!@#$%^&*_');
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    try{

      const response = await fetch('/auth/register', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({
          email,username,password
        })
      })

      const data = await response.json();

      if (response.ok) window.location.href = '/auth'
      else showError(data.message);
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
}

if (loginForm){
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.getElementById('submit').style.display = 'none';
    document.getElementById('load-indicator').style.display = 'block';

    const password = document.getElementById('password').value;
    const provided = document.getElementById('provided-info').value;

    const validChars = new Set(' abcdefghijklmnopqrstuvwxyz0123456789,./+=-!@#$%^&*_');

    const usesValidChars = provided.toLowerCase().split('').every(char => validChars.has(char));

    if (!usesValidChars){
      showError('Your username may only contain alpha-numeric characters or ,./+=-!@#$%^&*_');
      document.getElementById('load-indicator').style.display = 'none';
      document.getElementById('submit').style.display = 'block';
      return;
    }

    try{

      const response = await fetch('/auth/login', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({
          provided,password
        })
      })

      const data = await response.json();

      if (response.ok) window.location.href = '/practice';
      else showError(data.message || data.error);
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
}