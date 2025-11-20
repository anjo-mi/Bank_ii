document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const resource = e.target.id || e.target.parentElement.id;
    console.log(e.target);
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