const waitText = document.getElementById("wait-text");
document.addEventListener("DOMContentLoaded", async () => {
  const sessionId = document.getElementById("sessionId").value;
  let count = 0;

  const checkInterval = setInterval(async () => {
    try {
      const response = await fetch("/practice/checkSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (response.ok && response.status !== 206) {
        const data = await response.json();
        clearInterval(checkInterval);
        window.location.assign(`/practice/${data.sessionId}`);
      } else {
        count++;
        waitText.textContent =
          count >= 25
            ? `This has never happened before (don't worry, it actually has).`
            : count >= 20
              ? `ok tf ?!?!?!`
              : count >= 15
                ? `I swear it's me and not you`
                : count >= 10
                  ? `Don't read into this`
                  : count >= 5
                    ? `Still cooking...`
                    : waitText.textContent;
        if (count >= 30) {
          waitText.textContent = `There's a good chance that the model is just replying slowly and you can still access this feedback from the "Previous Sessions" page or your dashboard. If there is an error, my bad, I'll look into it!`;
          clearInterval(checkInterval);
          setTimeout(() => window.location.replace("/dashboard"), 7000);
        }
      }
    } catch (error) {
      console.log({ error });
      count++;
      if (count >= 28) clearInterval(checkInterval);
    }
  }, 1000);
});
