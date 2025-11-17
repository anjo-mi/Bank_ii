const waitText = document.getElementById('wait-text');
document.addEventListener('DOMContentLoaded', async () => {
  console.log('i made an attempt?')
  const sessionId = document.getElementById('sessionId').value;
  let count = 0;
  
  const checkInterval = setInterval(async () => {
    try {
      const response = await fetch('/practice/checkSession', {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body:JSON.stringify({sessionId}),
      });
      console.log({response})
      if (response.ok && response.status !== 206){
        const data = await response.json();
        clearInterval(checkInterval);
        window.location.assign(`/practice/${data.sessionId}`);
      }else {
        count++;
        waitText.textContent = count >= 12
                                ? 'ok tf?!?!?!'
                              :count >=  9
                                ? 'i swear its me and not you'
                              :count >=  6
                                ? 'dont read into this'
                              :count >=  3
                                ? 'still cooking...'
                                : waitText.textContent;
        if (count >= 15){
          waitText.textContent = 'sorry, there may have been an error, well look into this. theres a good chance you can still access this feedback from the previousSessions page or your dashboard';
          clearInterval(checkInterval);
          setTimeout(() => window.location.replace('/dashboard'),3000);
        }
      }
    }catch(error){
      console.log({error});
      count++;
      if (count >= 15) clearInterval(checkInterval);
    }
  },2000)
})