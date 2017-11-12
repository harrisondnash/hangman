//requirements
var inquirer = require('inquirer');
var isLetter = require('is-letter');
var Word = require('./word.js');
var Game = require('./game.js');

//set the maxListener
require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
  wordBank: Game.newWord.wordList,
  guessesRemaining: 10,
  //empty array to hold letters guessed by user. And checks if the user guessed the letter already
  guessedLetters: [],
  //index to display graphic
  display: 0,
  currentWord: null,
  //asks user if they are ready to play
  startGame: function() {
    var that = this;
    //clears guessedLetters before a new game starts if it's not already empty.
    if(this.guessedLetters.length > 0){
      this.guessedLetters = [];
    }

    inquirer.prompt([{
      name: "play",
      type: "confirm",
      message: "Wanna play hangman?"
    }]).then(function(answer) {
      if(answer.play){
        that.newGame();
      } else{
        console.log("Fine, be that way..");
      }
    });},
  //if they want to play starts new game.
  newGame: function() {
    if(this.guessesRemaining === 10) {
      console.log("Game on dude..");
      console.log('*****************');
      //generates random number based on the wordBank
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();
      //displays current word as blanks.
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
    } else{
      this.resetGuessesRemaining();
      this.newGame();
    }
  },
  resetGuessesRemaining: function() {
    this.guessesRemaining = 10;
  },
  keepPromptingUser : function(){
    var that = this;
    //asks player for a letter
    inquirer.prompt([{
      name: "chosenLtr",
      type: "input",
      message: "Type a letter:",
      validate: function(value) {
        if(isLetter(value)){
          return true;
        } else{
          return false;
        }
      }
    }]).then(function(ltr) {
      //toUpperCase because words in word bank are all caps
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      //adds to the guessedLetters array if it isn't already there
      var guessedAlready = false;
        for(var i = 0; i<that.guessedLetters.length; i++){
          if(letterReturned === that.guessedLetters[i]){
            guessedAlready = true;
          }
        }
        //if the letter wasn't guessed already run through entire function, else reprompt user
        if(guessedAlready === false){
          that.guessedLetters.push(letterReturned);

          var found = that.currentWord.checkIfLetterFound(letterReturned);
          //if none were found tell user they were wrong
          if(found === 0){
            console.log('Wrong!');
            that.guessesRemaining--;
            that.display++;
            console.log('Guesses remaining: ' + that.guessesRemaining);

            console.log('\n*******************');
            console.log(that.currentWord.wordRender());
            console.log('\n*******************');

            console.log("Letters guessed: " + that.guessedLetters);
          } else{
            console.log('U got it!');
              //checks to see if user won
              if(that.currentWord.didWeFindTheWord() === true){
                console.log(that.currentWord.wordRender());
                console.log('You win!');
                // that.startGame();
              } else{
                // display the user how many guesses remaining
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
                console.log('\n*******************');
                console.log("Letters guessed: " + that.guessedLetters);
              }
          }
          if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
            that.keepPromptingUser();
          }else if(that.guessesRemaining === 0){
            console.log('Daaang.. u suck!');
            console.log('The word was: ' + that.currentWord.word);
          }
        } else{
            console.log("You already guessed that one.");
            that.keepPromptingUser();
          }
    });
  }
};

hangman.startGame();
