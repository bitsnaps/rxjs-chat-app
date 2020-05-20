export function getUsername() {
  const username = sessionStorage.getItem('username')

  if (username) return username

  let newUsername = prompt('Please enter a username', '')

  // If no username entered by user, generate random
  if (!newUsername) {
    const randomNum = Math.floor(Math.random() * 1000)
    newUsername = 'user' + randomNum
  }

  sessionStorage.setItem('username', newUsername)

  return newUsername
}

export function addMessage(username, message) {
  document.querySelector('.messages')
    .insertAdjacentHTML(
      'beforeend',
      `<li><span>${username}: </span>${message}</li>`
    )

  window.scrollTo(0, document.body.scrollHeight)
}

export function addUser(id, username){
  document.querySelector('.users')
    .insertAdjacentHTML(
      'beforeend',
      `<option value=${id}>${username}</option>`
    )
}

export function clearUsers() {
  document.querySelector('.users').innerHTML = ''
}

export function clearUserInput() {
  document.querySelector('.input').value = ''
}

export function removeUser(id, username){
  const optionToRemove = document.querySelector(`.users option[value="${id}"]`)

  if (optionToRemove) {
    optionToRemove.parentNode.removeChild(optionToRemove)

    if (username){
      document.querySelector('.messages')
        .insertAdjacentHTML(
          'beforeend',
          `<li class="fade-out">${username} has left the chat.</li>`
        )
        fadeOut()
    }
  }

}

function fadeOut(){
  setTimeout(function() { // start a delay
   var fade = document.getElementsByClassName("fade-out")[0]; // get required element
   fade.style.opacity = 1; // set opacity for the element to 1
   var timerId = setInterval(function() { // start interval loop
     var opacity = fade.style.opacity; // get current opacity
     if (opacity == 0) { // check if its 0 yet
       clearInterval(timerId); // if so, exit from interval loop
       fade.parentNode.removeChild(fade)
     } else {
       fade.style.opacity = opacity - 0.05; // else remove 0.05 from opacity
     }
   }, 100); // run every 0.1 second
 }, 800); // wait to run after 5 seconds
}
