
var app = angular.module('game', []);
app.controller("mainCtrl", ['$scope', '$interval', '$timeout', function($scope, $interval, $timeout) {

  var promise;
  $scope.highScore = 10;
  $scope.score = 0;
  $scope.timeLeft = 120;
  $scope.level = 'Easy';
  $scope.levels = ['Easy', 'Medium', 'Hard'];
  $scope.rowCol = 9;
  $scope.rowColArray = [];

  if(localStorage.getItem('highScore')) {
    $scope.highScore = JSON.parse(localStorage.getItem('highScore'));
  }

  while($scope.rowCol--) {
    $scope.rowColArray.push({grey: true});
  }

  $scope.changeGrids = function() {
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

  function changeRowCol(number) {
      let totalNumber = number * number;
      let dimension = (300 / number);
      $('.grid-container').css('grid-template-rows', 'repeat(' + number + ', ' + dimension + 'px)');
      $('.grid-container').css('grid-template-columns', 'repeat(' + number + ', ' + dimension + 'px)');

      while(totalNumber--) {
        $scope.rowColArray.push({grey: true});
      }
  }

  checkForHighScore = score => {
    if(score > $scope.highScore) {
      $scope.highScore = score;
      localStorage.setItem('highScore', JSON.stringify($scope.highScore));
    }
  }

  function startTimer() {
    $scope.timeLeft = 120;
    promise = $interval(function() {
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

  function checkForClick(indexVal, timeLeft) {

    if(timeLeft == 0) {
      $('.grid-item').removeClass('green');
      $interval.cancel(promise);
      alert('Game Over !');
    }
    document.getElementById('grid-' + indexVal).onclick = function() {
      //if($('grid-' + indexVal).hasClass('green')) {
        $scope.score += 1;
        console.log('$scope.score = ', $scope.score);
        checkForHighScore($scope.score);
      //}
    }
  }

  $('#startBtn').on('click', function() {
    startTimer();
  });


}]);
