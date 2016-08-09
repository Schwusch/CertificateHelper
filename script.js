/**
 * Created by JonathanBöcker on 01/08/2016.
 */
$(document).ready(start);
var questionsRaw;
var questionsFormatted = [];
var questionIndex = 0;

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        displayContents(contents);
    };
    reader.readAsText(file, "cp1252");
}

function displayContents(contents) {
    questionsRaw = contents.split('---');
    $.each(questionsRaw, function (index, question) {
        var answer = question.split("Answer:")[1];
        var splittedQuestion = question.split("A.")[0];
        var alternatives = question.match(/\s[A-Z]\..+?(?=\s+[A-Z]\.|\W*Answer:)/g);
        questionsFormatted.push({
            question: splittedQuestion,
            alternatives: alternatives,
            answer: answer
        });

        //alternatives.splice(0,1);

    });
    var element = document.getElementById('file-content');
    element.innerHTML = questionsFormatted[questionIndex].question;
    for (var i = 0; i < questionsFormatted[questionIndex].alternatives.length; i++) {
        $('#alternatives').append('<button type="button" class="list-group-item">' + questionsFormatted[questionIndex].alternatives[i] + '</button>');
    }
}
function start() {
    document.getElementById('file-input')
        .addEventListener('change', readSingleFile, false);

    $(window).keydown(function (e) {
        e = e || event;
        switch (e.keyCode) {
            case 37: // left
                previousQuestion();
                return false;
            case 38: // up
                showQuestion();
                return false;
            case 39: // right
                nextQuestion();
                return false;
            case 40: // down
                showAnswer();
                return false;
        }
    });
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    $(':file').on('fileselect', function (event, numFiles, label) {
        var element = document.getElementById('filechoose');
        element.innerHTML = label;
    });
}

function showAnswer() {
    var element = document.getElementById('file-content');
    element.innerHTML = questionsFormatted[questionIndex].answer;
}

function showQuestion() {
    var element = document.getElementById('file-content');
    element.innerHTML = questionsFormatted[questionIndex].question;
}

function nextQuestion() {
    if (questionIndex < questionsFormatted.length - 1) questionIndex++;
    else questionIndex = 0;
    var element = document.getElementById('file-content');
    element.innerHTML = questionsFormatted[questionIndex].question;
    $(".list-group-item").remove();
    for (var i = 0; i < questionsFormatted[questionIndex].alternatives.length; i++) {
        $('#alternatives').append('<button type="button" class="list-group-item">' + questionsFormatted[questionIndex].alternatives[i] + '</button>');
    }
}

function previousQuestion() {
    if (questionIndex > 0) questionIndex--;
    else questionIndex = questionsFormatted.length - 1;
    var element = document.getElementById('file-content');
    element.innerHTML = questionsFormatted[questionIndex].question;
    $(".list-group-item").remove();
    for (var i = 0; i < questionsFormatted[questionIndex].alternatives.length; i++) {
        $('#alternatives').append('<button type="button" class="list-group-item">' + questionsFormatted[questionIndex].alternatives[i] + '</button>');
    }
}