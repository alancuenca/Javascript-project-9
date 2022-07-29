const btn1 = document.querySelector('.btn');
const h1 = document.querySelector('h1');
h1.textContent = 'Trivia Data Based Game'
const output = document.querySelector('.output');
const output1 = genElement(document.body, 'div', 'Make your selection <br>');
output1.classList.add('box')
const inputVal = document.querySelector('.val');
output1.append(inputVal);
const sel1 = genElement(output1, 'select', '');
const sel2 = genElement(output1, 'select', '');
output1.append(btn1);

output1.append(btn1)
const baseURL = 'https://opentdb.com/api.php?';
const game = {
    que: [],
    question: 0,
    eles: [],
    score: 0
};
const cats = [{ "title": "general knowledge", "num": 9 }, { "title": "sports", "num": 21 }, { "title": "animals", "num": 27 }]
const dif = ['easy', 'medium', 'hard']

window.addEventListener('DOMContentLoaded', (e) => {
    console.log('DOM ready');
    getSelection()
    btn1.textContent = 'Start Game';
    inputVal.setAttribute('type', 'number'); // input value is a number
    inputVal.value = 10; // set number of questions to 10
});

function getSelection() {
    //CATEGORY
    cats.forEach((cat) => {
        console.log(cat);
        const optEle = genElement(sel1, 'option', cat.title)
        optEle.value = cat.num;
    })
    //DIFFICULTY
    dif.forEach((d) => {
        console.log(d);
        const optEle = genElement(sel2, 'option', d)
        optEle.value = d;
    })
}

btn1.addEventListener('click', (e) => {
    output1.style.display = 'none';
    //inputVal.style.display = 'none';
    h1.textContent = inputVal.value + ' question(s) selected';
    let tempURL = `${baseURL}amount=${inputVal.value}&difficulty=${sel2.value}&category=${sel1.value}`;
    console.log(tempURL);
    popPage(tempURL);
});

function popPage(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(game); // {que: Array(0), question: 0}
            game.que = data.results
            console.log(game.que) // (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
            outputPage();
        })
};

function outputPage() {
    output.innerHTML = '';
    console.log(game.question);
    if (game.question >= game.que.length) {
        output.innerHTML = `<div>Your Score ${game.score} out of ${game.que.length}</div>`;
        game.score = 0;
        output1.style.display = 'block';
        game.question = 0;
    } else {
        output.innerHTML = '';
        let question = game.que[game.question];//grab the first question
        game.question++ // move to next question
        //console.log(question);//{category: 'Sports', type: 'multiple', difficulty: 'hard', question: 'How many times did Martina Navratilova win the Wimbledon Singles Championship?', correct_answer: 'Nine', …}
        let answers = question.incorrect_answers;
        // here we randomize the question order
        let ranIndex = Math.floor(Math.random() * (answers.length + 1))
        answers.splice(ranIndex, 0, question.correct_answer)
        //answers.push(question.correct_answer) // push would always make the last option the correct answer
        console.log(answers);//(4) ['Roy Lichtenstein', 'David Hockney', 'Peter Blake', undefined]
        const mainDiv = genElement(output, 'div', '');
        const que1 = genElement(mainDiv, 'div', question.question)// line 38 we see the return and we want to get the question
        game.eles.length = 0;
        console.log(game.eles);
        /**  []
        0: button
        1: button
        2: button
        3: button
        */
        const optsDiv = genElement(output, 'div', '');
        answers.forEach(options => {
            const opt1 = genElement(optsDiv, 'button', options);
            game.eles.push(opt1);
            if (options == question.correct_answer) {
                opt1.bgC = 'green'
            } else {
                opt1.bgC = 'red'
            }
            opt1.addEventListener('click', (e) => {
                game.eles.forEach((btnv) => {
                    btnv.disabled = true;
                    btnv.style.backgroundColor = btnv.bgC
                })
                const message = genElement(optsDiv, 'div', `Sorry.<br><small>${question.correct_answer} was correct.</small><br>`)
                if (options == question.correct_answer) {
                    game.score++
                    message.innerHTML = `You got it correct!<br><small>${options} was correct.</small><br>`
                    opt1.style.backgroundColor = 'green'
                } else {
                    opt1.style.backgroundColor = 'red'
                }
                h1.textContent = `Question ${game.question} of ${game.que.length} - Score: ${game.score}`
                nextQue(message);
            })
        })
    }
};

function nextQue(parent) {
    const btn2 = genElement(parent, 'button', 'Next Question');
    btn2.addEventListener('click', outputPage)
};

function genElement(parent, eleType, html) {
    const temp = document.createElement(eleType)
    temp.innerHTML = html;
    parent.append(temp);
    return temp
}