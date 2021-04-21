var questionsNotAsked = new Array();
var currentQuestion = null;
var numCorrect = 0;
var numWrong = 0;
var totalTime = 0;
var isUpdatingTimer = false;
var timerInterval = 200;
var questions = null;
var quiz;

if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
	};
}

Array.prototype.remove = function(item) {
	found = false;
	for ( var i = 0; i < this.length; i++) {
		if (this[i] == item) {
			found = true;
			break;
		}
	}

	if (found) {
		this.splice(i, 1);
	}
	return found;
};

function displayQuestion() {
	if (questionsNotAsked.length > 0) {
		answerText = document.getElementById('answerText');
		questionDiv = document.getElementById('question');
		answerText.value = '';
		questionNum = questionsNotAsked[Math.floor(Math.random() * questionsNotAsked.length)];
		currentQuestion = questions[questionNum];
		questionDiv.innerHTML = currentQuestion.question;
		answerText.focus();
		questionsNotAsked.remove(questionNum);
	} else {
		answerDiv = document.getElementById('answer');
		feedbackDiv = document.getElementById('feedback');
		questionDiv = document.getElementById('questionDiv');
		questionDiv.style.display = 'none';
		answerDiv.style.display = 'none';
		feedbackDiv.className = 'finished';
		feedbackDiv.innerHTML = '<p>This quiz is finished.</p><p><a href="quiz.html?quiz=' + quiz
				+ '">Play again</a></p><p> <a href="index.html">Play a different quiz</a></p>';
		isUpdatingTimer = false;
	}
}

function keyPress(event) {
	if (event.keyCode == 13 && document.getElementById('answerText').value.trim().length > 0) { // enter
		submitAnswer();
	}
}

function submitAnswer() {
	isUpdatingTimer = false;
	answerText = document.getElementById('answerText');
	feedbackDiv = document.getElementById('feedback');

	feedbackDiv.innerHTML = '';
	feedbackDiv.className = 'flash';

	answer = answerText.value.trim();
	setTimeout(function() {
		if (currentQuestion.answer.toLowerCase() == answer.toLowerCase()) {
			numCorrect++;
			feedbackDiv.innerHTML = 'RIGHT!';
			feedbackDiv.className = 'correctAnswer';
		} else {
			numWrong++;
			feedbackDiv.innerHTML = 'The correct answer was:<br/>' + currentQuestion.question + ' ' + currentQuestion.answer.toLowerCase() + '.';
			feedbackDiv.className = 'wrongAnswer';
		}
		numCorrectTd = document.getElementById('numCorrect');
		numWrongTd = document.getElementById('numWrong');
		scorePercentTd = document.getElementById('scorePercent');
		numCorrectTd.innerHTML = numCorrect;
		numWrongTd.innerHTML = numWrong;
		scorePercentTd.innerHTML = Math.round(100 * numCorrect / (numCorrect + numWrong)) + ' %';
		displayQuestion();
		updateNumQuestions();

		if (numCorrect == questions.length) {
			document.getElementById('perfectScoreDiv').style.display = 'block';
		}
		if (numCorrect + numWrong < questions.length) {
			isUpdatingTimer = true;
		}
	}, 200);
}

function updateTimer() {
	if (isUpdatingTimer) {
		totalTime += timerInterval;
		timerTd = document.getElementById('timer');
		meanTimeTd = document.getElementById('meanTime');
		timerTd.innerHTML = formatTime(totalTime);
		numAnswered = numCorrect + numWrong;
		if (numAnswered > 0) {
			meanTimeTd.innerHTML = formatTime(totalTime / numAnswered);
		}
	}
}

function formatTime(ms) {
	seconds = Math.floor(ms / 1000) % 60;
	minutes = Math.floor(ms / 60000) % 60;
	hours = Math.floor(ms / 3600000);
	formatted = minutes + ':';
	if (seconds < 10) {
		formatted += '0';
	}
	formatted += seconds;

	if (hours > 0) {
		if (minutes < 10) {
			formatted = '0' + formatted;
		}
		formatted = hours + ':' + formatted;
	}
	return formatted;
}

function start() {
	mainDiv = document.getElementById('main');
	startDiv = document.getElementById('start');
	answerText = document.getElementById('answerText');

	startDiv.style.display = 'none';
	mainDiv.style.display = 'block';
	answerText.focus();
	isUpdatingTimer = true;
}

function onLoad() {
	toggleTimes(document.getElementById('toggleTimesCheckbox'));
	quiz = 'questions'; // default quiz name
	if (document.URL.split('?').length > 1) {
		params = document.URL.split('?')[1].split('&');
		for ( var i = 0; i < params.length; i++) {
			key = params[i].split('=')[0];
			value = params[i].split('=')[1];
			if (key == 'quiz') {
				quiz = value;
			}
		}
	}

	var fileRef = document.createElement('script');
	fileRef.setAttribute('type', 'text/javascript');
	fileRef.setAttribute('src', quiz + '.js');
	document.getElementsByTagName('head')[0].appendChild(fileRef);

	loadInterval = setInterval(function() {
		if (questions != null) {
			clearInterval(loadInterval);
			initQuestionsNotAsked();
			updateNumQuestions();

			displayQuestion();
			setInterval(updateTimer, timerInterval);
		}
	}, 100);
}

function updateNumQuestions() {
	numQuestionsSpan = document.getElementById('numQuestions');
	quizNameSpan = document.getElementById('quizName');
	quizNameSpan.innerHTML = quizName;
	numQuestionsSpan.innerHTML = Math.min(numCorrect + numWrong + 1, questions.length) + ' / ' + questions.length;
}

function addQuestion(question, answer) {
	d = new Object();
	d.question = question;
	d.answer = answer;
	if (questions == null) {
		questions = new Array();
	}
	questions[questions.length] = d;
}

function initQuestionsNotAsked() {
	for ( var i = 0; i < questions.length; i++) {
		questionsNotAsked[i] = i;
	}
}

function toggleTimes(checkbox) {
	meanTimeRow = document.getElementById('meanTimeRow');
	totalTimeRow = document.getElementById('totalTimeRow');
	var style = checkbox.checked ? '' : 'hidden';
	meanTimeRow.style.visibility = style;
	totalTimeRow.style.visibility = style;
}
