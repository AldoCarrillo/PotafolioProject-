// Assignment Code
var generateBtn = document.querySelector("#generate");

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");
  passwordText.value = password;
}

function generatePassword(){
  var tempPassword =[""]; // this is the value is going to be return to the fucntion
  var infoCriteria = ["Upper_Case", "Lower_case", "Numbers","Special_Characters"]; // array to choose the criteria
  var criteria = [0,0,0,0]; // array to choose random which charactrer is gonna be add to the password array

  // validation to mak make sure at least 1 opctions of the criteria is be selected
  if(document.getElementById("check1").checked==false && document.getElementById("check2").checked==false && document.getElementById("check3").checked==false && document.getElementById("check4").checked==false )
    return  "NO CRITERIA SELECTED";

    //check which type of characteres are going to be add to the pass
  if(document.getElementById("check1").checked==true )
    criteria[0] = 1;

  if(document.getElementById("check2").checked==true )
    criteria[1] = 1;

  if(document.getElementById("check3").checked==true )
    criteria[2] = 1;

  if(document.getElementById("check4").checked==true )
    criteria[3] = 1;

  var i;
  var randomOption;
  var addToPass;

  //loop to generate the pass from 0 to the lengt selected by the user
  for(i=0 ; i<lenghtOfPassword; i++){

    randomOption = Math.round(Math.random()*3);
    //check which checkboxed were selected by the user
    while(criteria[randomOption]== 0){
      randomOption = Math.round(Math.random()*3);
    }
    //switch to choose the random char
    switch(randomOption){
      case 0:
        addToPass = "uppperCase";

      break;

      case 1:
        addToPass = "lowerCase";

      break;

      case 2:
        addToPass = "Number";

      break;

      case 3:
        addToPass = "Special";

      break;
    } ;
    //check what type of character are going to be add to the password array and add it
    if(addToPass == "uppperCase"){
      var randomUpper= Math.round(Math.random()*25);
      randomUpper = randomUpper + 65;
      tempPassword [i] = String.fromCharCode(randomUpper);
    }
    else if(addToPass == "lowerCase"){
      var randomLower= Math.round(Math.random()*25);
      randomLower = randomLower + 97;
      tempPassword [i] = String.fromCharCode(randomLower);
    }
    else if(addToPass == "Number"){
      var randomNumber= Math.round(Math.random()*9);
      randomNumber = randomNumber +48;
      tempPassword [i] = String.fromCharCode(randomNumber);
    }
    else if(addToPass == "Special"){
      var randomSpecial= Math.round(Math.random()*15);
      randomSpecial = randomSpecial + 33;
      tempPassword [i] = String.fromCharCode(randomSpecial);
    }


  }

//clone temporal password to the return value
  var passwordToReturn="";
  for(i=0;i<tempPassword.length;i++){
    passwordToReturn = passwordToReturn + tempPassword[i];

  }
  return passwordToReturn;
}


//validation for the input only nmumber are accepted
var lenghtOfPassword;
do{
  lenghtOfPassword = prompt("How Long do you want your PASSWORD?");

}while(isNaN(parseInt(lenghtOfPassword)) || parseInt(lenghtOfPassword) <1);

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
