
var app = angular.module('game', []);
app.controller("mainCtrl", ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

  let promise;
  $scope.highScore = 0;
  $scope.score = 0;
  $scope.timeLeft = 120;
  $scope.level = 'Easy';
  $scope.levels = ['Easy', 'Medium', 'Hard'];
  $scope.rowCol = 9;
  $scope.rowColArray = [];


  // Function to create DOM for new matrix
  changeRowCol = number => {
      let totalNumber = number * number;
      let dimension = (300 / number);
      $('.grid-container').css('grid-template-rows', 'repeat(' + number + ', ' + dimension + 'px)');
      $('.grid-container').css('grid-template-columns', 'repeat(' + number + ', ' + dimension + 'px)');

      $scope.rowColArray = [];
      while(totalNumber--) {
        $scope.rowColArray.push({grey: true});
      }
      $timeout(() => {
        for(var i=0; i<$scope.rowCol; i++) {
          checkForClick(i, $scope.timeLeft);
        }
      });
  }

  // Getting score from localStorage if High Score is already there
  if(localStorage.getItem('highScore')) {
    $scope.highScore = JSON.parse(localStorage.getItem('highScore'));
  }

  // Making objects for rowColArray
  while($scope.rowCol--) {
    $scope.rowColArray.push({grey: true});
  }

  // Function to change Matrix Dimensions
  $scope.changeGrids = () => {
      if($scope.level === 'Easy') {
        $scope.rowCol = 9;
        changeRowCol(3);
      }
      else if($scope.level === 'Medium') {
        $scope.rowCol = 16;
        changeRowCol(4);
      }
      else {
        $scope.rowCol = 36;
        changeRowCol(6);
      }
      $scope.score = 0;
      $scope.timeLeft = 120;
      $('.grid-item').removeClass('green');
      $interval.cancel(promise);
  }
  $scope.changeGrids();

  // Function to check if the Score is higher than High Score
  checkForHighScore = score => {
    if(score > $scope.highScore) {
      $scope.highScore = score;
      localStorage.setItem('highScore', JSON.stringify($scope.highScore));
    }
  }

  startTimer = () => {
    $scope.timeLeft = 120;
    $scope.score = 0;
    var timerVal;
    promise = $interval(() => {
        let indexVal = 3;
        if($scope.level === 'Easy') {
          indexVal = Math.floor(Math.random() * 9);
        }
        else if($scope.level === 'Medium') {
          indexVal = Math.floor(Math.random() * 16);
        }
        else {
          indexVal = Math.floor(Math.random() * 36);
        }
        $scope.rowColArray[indexVal].grey = false;
        $('.grid-item').removeClass('green');
        $('#grid-' + indexVal).addClass('green');
        $scope.timeLeft--;
        checkForClick(indexVal, $scope.timeLeft);
    }, 1000);
  }

  checkForClick = (indexVal, timeLeft) => {

    if(timeLeft == 0) {
      $('.grid-item').removeClass('green');
      $interval.cancel(promise);
      if (confirm('Game Over !')) {
          startTimer();
      }
    }

    document.getElementById('grid-' + indexVal).onclick = () => {
      if($('#grid-' + indexVal).hasClass('green')) {
        $scope.score++;
        document.getElementById("coinAudio").play();
        checkForHighScore($scope.score);
      }
      else {
        $scope.score--;
        document.getElementById("failAudio").play();
      }
    }
  }

  $('#startBtn').on('click', () => {
    $interval.cancel(promise);
    startTimer();
  });


}]);
