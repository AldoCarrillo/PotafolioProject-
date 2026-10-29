
/*here are the main containers of the html file  */

var quizdiv = document.querySelector("#quiz-div");
var namediv = document.querySelector("#name-form");
var h1Start = document.querySelector("#h1start");
var questionText = document.querySelector("#questioneText")
var feedBackAnswer = document.querySelector("#correct-answer")

/*here are the elements of the html file  */
var quizList = document.querySelector("#quiz-list");
var quizCount = document.querySelector("#quiz-count");
var quizScore = document.querySelector("#quiz-score");
var nameText = document.querySelector("#name-text");
var quizTimer = document.querySelector("#quiz-timer");
var quizResults = document.querySelector("#results-list");

var startButton = document.querySelector("#start-button");
var clearButton = document.querySelector("#clear-button");

/*gloobal variables need it  */
var answersArray =[] ;
var rightAnswersArray = [];
var score = 0;


/* Structure of the quiz, questiones and answers  based in a google example */
var quiz = [
    {
      question: "Who invented JavaScript?",
      answers: {
        a: "Douglas Crockford",
        b: "Sheryl Sandberg",
        c: "Brendan Eich",
        d: "Deniss Ritchie"
      },
      correctAnswer: "c"
    },
    {
      question: "Which one of these is a JavaScript package manager?",
      answers: {
        a: "Node.js",
        b: "TypeScript",
        c: "npm",
        d: "react"
      },
      correctAnswer: "c"
    },
    {
      question: "Which tool can you use to ensure code quality?",
      answers: {
        a: "Angular",
        b: "jQuery",
        c: "RequireJS",
        d: "ESLint"
      },
      correctAnswer: "d"
    },
    {
      question: "How many blue stripes are there on the U.S. flag?",
      answers: {
        a: "6",
        b: "7",
        c: "13",
        d: "0"
      },
      correctAnswer: "d"
    },
    {
      question: "Which one of these characters is not friends with Harry Potter?",
      answers: {
        a: "Ron Weasley",
        b: "Neville Longbottom",
        c: "Draco Malfoy",
        d: "Hermione Granger"
      },
      correctAnswer: "c"
    },
    {
      question: "Which animal does not appear in the Chinese zodiac?",
      answers: {
        a: "Dragon",
        b: "Rabbit",
        c: "Dog",
        d: "Bird"
      },
      correctAnswer: "d"
    },
    {
      question: "Which country held the 2016 Summer Olympics?",
      answers: {
        a: "China",
        b: "Ireland",
        c: "Brazil",
        d: "Italy"
      },
      correctAnswer: "c"
    },
    {
      question: "Which planet is the hottest?",
      answers: {
        a: "Venus",
        b: "Saturn",
        c: "Mercury",
        d: "Mars"
      },
      correctAnswer: "a"
    },
    {
      question: "In which city can you find the Liberty Bell?",
      answers: {
        a: "Washington, D.C.",
        b: "Boston",
        c: "Philadelphia",
        d: "Manhattan"
      },
      correctAnswer: "c"
    },
    {
      question: "Who was the only U.S. President to resign?",
      answers: {
        a: "Herbert Hoover",
        b: "Richard Nixon",
        c: "George W. Bush",
        d: "Barack Obama"
      },
      correctAnswer: "b"
    },
    {
      question: "What is the rarest blood type?",
      answers: {
        a: "O",
        b: "A",
        c: "B",
        d: "AB-Negative"
      },
      correctAnswer: "d"
    },
    {
      question: "Which U.S. state is known as the sunflower state?",
      answers: {
        a: "Florida",
        b: "California",
        c: "Maine",
        d: "Kansas"
      },
      correctAnswer: "d"
    },
    {
      question: "How many bones are there in the human body?",
      answers: {
        a: "206",
        b: "205",
        c: "201",
        d: "209"
      },
      correctAnswer: "a"
    },
    {
      question: "How old do you have to be to enter in the hunger games?",
      answers: {
        a: "12",
        b: "11",
        c: "10",
        d: "15"
      },
      correctAnswer: "a"
    },
    {
      question: " Whic country won the soccer worldcup in 2018",
      answers: {
        a: "Germany",
        b: "Brazil",
        c: "France",
        d: "Spain"
      },
      correctAnswer: "c"
    }
  ];

/*here is whre the proggrams starts */
var indexQuiz = 0;
startQuiz();


/*main fucntion starts the quiz */
function startQuiz() {
    startButton.setAttribute("style", "visibility: visible;");
    quizdiv.setAttribute("style", "display: none;");

    namediv.setAttribute("style", "display: none;");
    h1Start.textContent = "Lets Do The Quiz!";
    indexQuiz = 0;
    score =0;
    renderQuiz();
}

/*function loads the questione and answers list*/
function renderQuiz(){

   if(indexQuiz >= 15){
    endQuiz();
    return 0;
   }


  nextQuestionQuiz();

  questionText.textContent = quiz[indexQuiz].question;

  for (let i = 0; i < 4; i++) {
    var li = document.createElement("li");
    li.setAttribute("data-index", i);
    var button = document.createElement("button");
    switch (i) {
      case 0:
        li.textContent = "A) " + quiz[indexQuiz].answers.a;
        break;
      case 1:
        li.textContent = "B) " + quiz[indexQuiz].answers.b;
        break;
      case 2:
        li.textContent = "C) " + quiz[indexQuiz].answers.c;
        break;
      case 3:
        li.textContent = "D) " + quiz[indexQuiz].answers.d;
        break;
      }

    quizList.appendChild(li);

    }

}

/*function clear the previus questione */
function nextQuestionQuiz(){
  quizList.removeChild[0];
  quizList.removeChild[1];
  quizList.removeChild[2];
  quizList.removeChild[3];
  quizList.innerHTML = "";
  quizCount.textContent++;


}

/*function when finish with all questiones */
function endQuiz(){
  startButton.setAttribute("style", "visibility: invisible;");
  quizdiv.setAttribute("style", "display: none;");
  namediv.setAttribute("style", "display: block;");
  h1Start.setAttribute("style","display: block;");
  h1Start.textContent = "Final Results!";
  startButton.textContent = "Restart!";

  checkScore();
  loadResults();
  answersArray=[];
  rightAnswersArray = [];



}

/*fuction loads the scores */
function loadResults(){

  if(JSON.parse(localStorage.getItem("names")))
  var storedNames = JSON.parse(localStorage.getItem("names"));
  else
  storedNames = [];
  storedNames.forEach(element => {

    var tempLi = document.createElement("li");
    tempLi.textContent = element;
    quizResults.appendChild(tempLi);


  });

}

/*fucntion gives the final score to your quiz */
function checkScore(){

  quiz.forEach(element => {
    rightAnswersArray.push(element.correctAnswer);
  });

  for (let i = 0; i < answersArray.length; i++) {
     if(answersArray[i] == rightAnswersArray[i])
      score+=10;
  }

  quizScore.textContent = score;


}

/*function check every asnwwer if is correct or incorrect */
function checkAnswer(ans){
  if(quiz[indexQuiz].correctAnswer == ans){
    feedBackAnswer.textContent = "Correct" ;
    feedBackAnswer.setAttribute("style","color: green;");
  }
  else{
    feedBackAnswer.textContent = "Incorrect";
    feedBackAnswer.setAttribute("style","color: red;");

    var presentTime = document.getElementById("quiz-timer").innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    s-=10;
    if(s<0){m=m-1; s= 60+(s)}
    document.getElementById("quiz-timer").innerHTML = m + ":" + s;


  }

}

/*listener to save your name in the scores storage */
nameText.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
      event.preventDefault();
      var textname = document.getElementById("name-text").value;

      if(JSON.parse(localStorage.getItem("names")))
        var names = JSON.parse(localStorage.getItem("names"));
      else
      var names = [];

      names.push(textname + " " + score);

      localStorage.setItem("names", JSON.stringify(names));
      quizResults.innerHTML="";
      nameText.value="";
      loadResults();


  }

});

/*Main button to star or restart the quiz */
startButton.addEventListener("click", function(event) {
  startButton.setAttribute("style","visibility: hidden;");
  quizdiv.setAttribute("style","display: block;");
  quizdiv.setAttribute("style","visibility: visible;");
  h1Start.setAttribute("style","display: none;");
  namediv.setAttribute("style", "display: none;");
  nameText.value = "";
  quizCount.textContent= "1";
  quizResults.innerHTML = "";


  if(indexQuiz>=14) {
    score =0;
    indexQuiz =0;
    renderQuiz();
    quizCount.textContent= "1";

  }

  document.getElementById("quiz-timer").innerHTML =005 + ":" + 00;
  startTimer();


} );

/*Button to clear the storaged scores */
clearButton.addEventListener("click", function(event) {
  localStorage.clear();
  quizResults.innerHTML = "";
  nameText.value="";
  quizScore.textContent="";
  loadResults();

} );

/*Listener to the list of answers for every questione add the user questiones to an array */
quizList.addEventListener("click", function(event) {

  var element = event.target;
  var index = element.getAttribute("data-index");


    switch(index){
      case "0":
        answersArray.push("a");
        checkAnswer("a");

      break;

      case "1":
        answersArray.push("b");
        checkAnswer("b");

      break;

      case "2":
        answersArray.push("c");
        checkAnswer("c");

      break;

      case "3":
        answersArray.push("d");
        checkAnswer("d");

      break;

    };


    let delay = setTimeout(function() {
      indexQuiz++;

      renderQuiz();
      feedBackAnswer.textContent = "";

    }, 2000)



  });



/*timer of 5 minutes displayed in the page */
  /* code for this timer https://codepen.io/ishanbakshi/pen/pgzNMv*/

  function startTimer() {
    var presentTime = document.getElementById("quiz-timer").innerHTML;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = checkSecond((timeArray[1] - 1));
    if(s==59){m=m-1}
    document.getElementById("quiz-timer").innerHTML = m + ":" + s;
    setTimeout(startTimer, 1000);
  }

  function checkSecond(sec) {
    if (sec < 10 && sec >= 0) {sec = "0" + sec};
    if (sec < 0) {sec = "59"};
    return sec;
  }