const deleteBtns = document.querySelectorAll('.delete-btn');
const deleteSessionBtns = document.querySelectorAll('.delete-session');
const settingsForm = document.getElementById('user-settings');
const settingsMenu = document.getElementById('settings-menu');
const settingsBtn = document.getElementById('settings-toggle');

deleteBtns.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const resource = e.target.id || e.target.parentElement.id;
    const response = await fetch('/deleteResource', {
      method: 'PATCH',
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({resource: resource}),
    })

    if (response.ok) {
      let clicked = e.target;
      while (!clicked.classList.contains('resource-li')) clicked = clicked.parentElement;
      clicked.style.opacity = 0;
      setTimeout(() => {
        clicked.style.display = 'none';
      }, 300);
    }
    else console.log('failed to delete');
  })
})

deleteSessionBtns.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const id = e.target.id || e.target.parentElement.id;
    const response = await fetch(`/practice/delete`, {
      method: "PATCH",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({id}),
    });

    if (response.ok){
      let clicked = e.target;
      while (!clicked.classList.contains('session-form')) clicked = clicked.parentElement;
      clicked.style.opacity = 0;
      setTimeout(() => {
        clicked.style.display = 'none';
      }, 300)
      const count = document.getElementById('session-count');
      const prevCount = +count.textContent;
      count.textContent = `${prevCount - 1}`;
    }else console.log('failed to delete');
  })
})

settingsBtn.addEventListener('click', () => {
  settingsMenu.style.display = 'block';
  setTimeout(() => {
    settingsMenu.style.opacity = 100;
  },0)
})

settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const level = settingsForm.querySelector('input[name="status"]:checked').value;
  const title = settingsForm.querySelector('#title').value;

  const response = await fetch('/updateUser', {
    method: 'PATCH',
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify({
      level,
      title,
    })
  })

  const data = response.json();

  if (response.ok){
    settingsMenu.style.opacity = 0;
    setTimeout(() => {
      settingsMenu.style.display = 'none';
    },300);
  }else console.log("error: ", data.message);
})

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('settings')){
    settingsMenu.style.opacity = 0
    setTimeout(() => {
      settingsMenu.style.display = "none"
    }, 300)
  }
})