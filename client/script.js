import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

function loader(el){
  el.textContent= '';

  loadInterval = setInterval( () =>{
    el.textContent += '.';

    if(el.textContent === '....')
      el.textContent = ''
  }, 300)
}

function typer(el, text){
  let index = 0;

  let interval = setInterval( () =>{
    if(index < text.length){
      el.innerHTML += text.charAt(index)
      index++;
    }else
      clearInterval(interval)
  }, 20)
}

function generateUniqueId(){
  const timestamp = Date.now()
  const randomNumber = Math.random();
  const hexaString = randomNumber.toString(16);   // 16 is a radix which converts the number to a base 16 num ber string

  return `id-${timestamp}-${hexaString}`;
}

function chatStripe(isAi, value, uniqueId){
  return `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot': 'user'}">
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `
}

const handleSubmit = async (e)=>{
  e.preventDefault(); // stops the browser from refreshing the page when submit

  const data = new FormData(form);

  // adding user chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
  form.reset(); // for resetting the textArea in the form

  // adding user chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '',uniqueId);

  // viewing the last messages on the top
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const botMessage = document.getElementById(uniqueId);
  loader(botMessage)

  // fetch data from the server (bot's response)
  const res = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded'
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  botMessage.innerHTML = '';
  
  if(res.ok){
    const data = await res.json();
    const parsedData = data.bot.trim();

    typer(botMessage, parsedData) // botMessage is the div that the bot types in
  }else{
    const err = res.text();
    botMessage.innerHTML = 'Something went wrong!'
    console.log(err)
  }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keydown', (e)=>{
  if(e.keyCode ===13){
    handleSubmit(e);
  }
})