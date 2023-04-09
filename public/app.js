window.onload = () => {
  'use strict'

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }
}

// const demoBtn = document.querySelector(".demo");

// demoBtn.style.display = "block";

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  // Stash the event so it can be triggered later.
  // Update UI to notify the user they can add to home screen
  // demoBtn.style.display = "none";
})

navigator.serviceWorker.addEventListener('controllerchange', function () {
  window.location.reload()
})
