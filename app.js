const countryName = document.querySelector('#country-name');
let listJSON = [];
let countryObject = {};
const resultDiv = document.querySelector('#resultDiv');
const resultDivSpan = resultDiv.querySelector('span');
const resultDivText = resultDiv.querySelector('p');
const formDiv = document.querySelector('#formDiv');
const playAgainButton = document.querySelector('#playAgainButton');
const countryUl = resultDiv.querySelector('#countryUl');
const introDiv = document.querySelector('#introDiv');
const startButton = introDiv.querySelector('#startButton');
const playerName = introDiv.querySelector('#playerName');
let playerCount = [];
const counterDiv = document.querySelector('#counterDiv');
const modalNameSpan = document.querySelector('#modalNameSpan');
const newPlayerButton = document.querySelector('#newPlayerButton');
const nameErrorMessage = document.querySelector('#nameErrorMessage');
const cancelModals = document.querySelectorAll('.cancelModal');
const backtoIntroButton = document.querySelector('#backToIntro');
let randomNumList = [];
const multipleChoiceButtons = document.querySelectorAll('.multiple-choice');
const countdownTimerSpan = document.querySelector('#countdownTimer');

// when user gets a question right
function questionSuccess() {
  formDiv.style.display = "none";
  resultDiv.style.display = "";
  resultDivText.textContent = "Correct!"
  resultDivSpan.style.display = "none";
  resultDiv.className = "resultDivSuccess text-center m-5 p-4";
  playerCount.correct += 1;
  updateLocalStorage(playerCount);
  updateCounterDiv();
    //record the countryObject in playerCount local data.
  playerCount['questionsAsked'].push(countryObject.SNo);
  updateLocalStorage(playerCount);
}

// when user gets a question wrong.
function questionFail() {
  formDiv.style.display = "none";
  resultDiv.style.display = "";
  resultDivSpan.style.display = "none";
  resultDivText.textContent = "Sorry, the correct answer is: " + countryObject["Capital City"];
  resultDiv.className = "resultDivFailure text-center m-5 p-4";
  playerCount.incorrect += 1;
  updateLocalStorage(playerCount);
  updateCounterDiv();
  //record the countryObject in playerCount local data.
  playerCount['questionsAsked'].push(countryObject.SNo);
  updateLocalStorage(playerCount);
}


//////////////// TIMER ////////////////////////////////////////
function timer() {
  // Set the date we're counting down to
  let distance = 6;

  // Update the count down every 1 second
  const x = setInterval(function() {
    if(distance > 0) {
      // clear interval if answer is chosen before countdown ends
      if(formDiv.style.display === "none") {
        clearInterval(x);
      }
      distance = distance - 1;
      countdownTimerSpan.innerHTML = distance;
            // If the count down is over, write some text
    } else {
      clearInterval(x);
      questionFail();
      resultDivSpan.style.display = "";
      resultDivSpan.textContent = "Out of Time!";
    }
  }, 1000);
}

/////////////////////////////////////////////////////////////////

//check if the user's broswer supports Local Storage
function supportsLocalStorage() {
  try {
  return 'localStorage' in window && window['localStorage'] !== null;
} catch(e) {
  return false;
}
}

//retrieve the historical Local data if any exists.
function getExistingLocalData(playerName) {
    playerCount = localStorage.getItem('playerData');
    if(playerCount) {
      return JSON.parse(playerCount);
    } else {
      playerCount = {
        'name' : playerName,
        'correct' : 0,
        'incorrect' : 0,
        'questionsAsked' : []
      }
      localStorage.setItem('playerData', JSON.stringify(playerCount));
      return playerCount;
    }
  }

function updateLocalStorage(playerCount) {
  localStorage.setItem('playerData', JSON.stringify(playerCount));
}

function updateCounterDiv() {
  counterDiv.style.display = "";
  counterDiv.firstElementChild.firstElementChild.textContent = 'Player: ' + playerCount.name;
  counterDiv.firstElementChild.firstElementChild.nextElementSibling.textContent = 'Questions Answered: ' + (playerCount.correct + playerCount.incorrect);
  counterDiv.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.textContent = 'Questions Correct: ' +  playerCount.correct;
  counterDiv.firstElementChild.lastElementChild.previousElementSibling.textContent = 'Questions Incorrect: ' +  playerCount.incorrect;
  if(counterDiv.firstElementChild.firstElementChild.nextElementSibling.textContent !== 'Questions Answered: 0') {
    counterDiv.firstElementChild.lastElementChild.textContent = 'Win Percentage: ' + ((playerCount.correct / (playerCount.correct + playerCount.incorrect)) * 100).toFixed(2) + '%';
  }
}

// If playerData already exists, display their name on the intro page
function existingPlayer() {
  if(playerCount.name) {
    const nameBox = document.createElement('div');
    nameBox.textContent = 'You are currently playing as ' + playerCount.name;
    nameBox.className = 'text-center nameBox text-success';
    introDiv.firstElementChild.nextElementSibling.nextElementSibling.insertBefore(nameBox, introDiv.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild);
  }
}

//if the player enters a different name in the name box, prompt them if they want to create a new player.
function resetPlayerData() {
  if(playerName.value !== "" && playerName.value !== playerCount.name) {
    modalNameSpan.textContent = playerCount.name;
    $('#myModal').modal('show');
    newPlayerButton.addEventListener('click', () => {
      localStorage.removeItem('playerData');
      playerCount = getExistingLocalData(playerName.value);
      introDiv.style.display = "none";
      formDiv.style.display = "block";
      $('#myModal').modal('hide');
      updateCounterDiv();
    });
    for(i = 0; i < cancelModals.length; i+= 1) {
      cancelModals[i].addEventListener('click', () => {
        playerName.value = "";
      });
    }
    // display the form and remove the intro
  } else {
    introDiv.style.display = "none";
    formDiv.style.display = "block";
  }
}


//get a random number and return the corresponding country/city object pair matching that number in the json list
function getRandomObject() {

  //generate a random number between 1 and 244
  let randomNum = Math.floor((Math.random() * 244) + 1);

// check if the player is new. if they arent. call function to make sure questions arent repeated unnecessarily.
if(playerCount) {
  // compare random number to questions already asked. if its been asked before, generate a new random number and start the loop again(so the whole list can be checked again against the new number). If the nuymber of questions asked is equal to the number of questions possible to be asked, reset the number of questions asked to 0.
    for( let i = 0; i < playerCount['questionsAsked'].length; i += 1)
      while(playerCount['questionsAsked'][i] === randomNum) {
        if (playerCount['questionsAsked'].length >= 244) {
          playerCount['questionsAsked'] = [];
        }
        randomNum = Math.floor((Math.random() * 244) + 1);
        i = 0;
      }
}
  // find the corresponding object for the random number generated and return the object
  for(i = 0; i < listJSON.length; i += 1) {
    const objectNum = listJSON[i].SNo;
    if(randomNum === objectNum) {
      getFiveCities(listJSON[i]['Capital City'])
      return listJSON[i];
    }
  }
}

//fetch 5 random (incorrect) city names from the Json list to display as multiple choice options.
function getFiveCities(correctCity) {
  let fiveRandoms = [];
  let sixCities = [];
  let randomCities = [];
  //get 5 random numbers
  for (let i = 0; i < 5; i += 1) {
    fiveRandoms.push(Math.floor((Math.random() * 244) + 1));
  }
  //use the random numbers to get random capital city names
  fiveRandoms.forEach(num => sixCities.push(listJSON[num]['Capital City']));
  sixCities.push(correctCity);
  //assign the 5 incorrect and 1 correct city names to a new array in a random order.
  function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
  }
  sixCities = shuffle(sixCities);
  updateMultipleChoice(sixCities);
}

//add the random cities to the DOM.
function updateMultipleChoice(sixCities) {
  for(let i = 0; i < multipleChoiceButtons.length; i += 1 ) {
    multipleChoiceButtons[i].textContent = sixCities[i];
  }
}

function appendCountryName(countryObject) {
  countryName.textContent = countryObject.Country;
}

//create HTML to be dispalyed in the country card in resultsDiv
function countryUlData(countryObject) {
  countryUl.firstElementChild.innerHTML = "<strong>Country:</strong> " + countryObject.Country;
  countryUl.firstElementChild.nextElementSibling.innerHTML = "<strong>Capital City:</strong> " + countryObject["Capital City"];
  if(countryObject.Notes !== "") {
    countryUl.lastElementChild.innerHTML = "<strong>Notes:</strong> " + countryObject.Notes;
    countryUl.lastElementChild.style.display = "";
  } else {
    countryUl.lastElementChild.style.display = "none";
  }
}

//Use AJAX to get the country/city values from the JSON file
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      listJSON = JSON.parse(xhr.responseText);
      // for (let i = 0; i < listJSON.length; i += 1) {
      //   constlistJSON[0].Country;
      //   }
      countryObject = getRandomObject();
      appendCountryName(countryObject);
      countryUlData(countryObject);

    } else if (xhr.status === 404) {
        //file not found
        console.log("error: file not found")
        alert(xhr.statusText);
    } else {
        //server had a problem
        console.log("error: server had a problem")
        alert(xhr.statusText);
    }
  }
};
xhr.open('GET', 'https://raw.githubusercontent.com/Dannaroo/capital-city-quiz/gh-pages/country-city-list.json');
// xhr.open('GET', 'country-city-list.json');
xhr.send();


// display the current player name on the intro page if current player exists
if(supportsLocalStorage) {
  playerCount = JSON.parse(localStorage.getItem('playerData'));
  if(playerCount) {
    existingPlayer();
  }
}

//ensure a player name is entered if player doesnt exist when start Button is clicked.
startButton.addEventListener('click', (event) => {
  event.preventDefault();
  //user has no playerName and playerCount does not exist. show error message
  if(playerName.value === "" && !playerCount) {
    nameErrorMessage.style.display = "";
    return;
  }
  //get local storage data if local storage is supported
  if(supportsLocalStorage) {
    playerCount = getExistingLocalData(playerName.value);
    //function resetPlayerData() will hide introDiv and show formDiv once the localStorage player name matches the one entered in the text field or the text field is left blank.
    resetPlayerData();
    updateCounterDiv();
    timer();


  }// supports Local Storage
});

//check if the user answer matches the object answer and show the corresponding result div.
for (let i = 0; i < multipleChoiceButtons.length; i += 1) {
  multipleChoiceButtons[i].addEventListener('click', (event) => {
    event.preventDefault();
    let userResponse = multipleChoiceButtons[i].textContent;
    let correctCity = countryObject["Capital City"];
    if(userResponse === correctCity) {
      questionSuccess();
    } else {
      questionFail();
    }
    //record the countryObject in playerCount local data.

  });
}

//generate a new question.
playAgainButton.addEventListener('click', (event) => {
  event.preventDefault();
  resultDiv.style.display = "none";
  countryObject = getRandomObject();
  appendCountryName(countryObject);
  countryUlData(countryObject);
  formDiv.style.display = "";
  timer();

});

//return to intro and reload a new question.
backToIntroButton.addEventListener('click', (event) => {
  event.preventDefault();
  countryObject = getRandomObject();
  appendCountryName(countryObject);
  countryUlData(countryObject);
  introDiv.style.display = "";
  resultDiv.style.display = "none";
  nameErrorMessage.style.display = "none";
  playerName.value = "";
});
