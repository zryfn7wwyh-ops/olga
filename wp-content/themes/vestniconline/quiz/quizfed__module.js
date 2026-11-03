document.addEventListener('DOMContentLoaded', function() {
    const questions = [
        {
            title: "<h3>Выберите вид сообщения</h3>",
            type: "select",
            options: [
                { label: "Ликвидация", value: "option1" },
                { label: "Реорганизация", value: "option2" },
                { label: "Уменьшение УК", value: "option3" },
                { label: "Чистые Активы", value: "option4" },
                { label: "Приобретение 20% долей/акций", value: "option5" },
                { label: "Отмена доверенности", value: "option6" },
                { label: "Утеря печати", value: "option7" },
            ]
        },
        {
            title: "<h3>Нужна ли публикация в Федресурсе?</h3>",
            type: "select",
            options: [
                { label: "Да", value: "yes" },
                { label: "Нет", value: "no" },
                { label: "Не знаю", value: "que" }
            ]
        },
        {
            "title": "<h3>Контактная информация</h3>",
            "type": "inputs",
            "inputs": [
                { "label": "Имя", "type": "text", "name": "name" },
                { "label": "Номер телефона", "type": "tel", "name": "phone" },
                { 
                    "label": "Нажимая кнопку «Позвоните мне», я даю свое <a href=\"/soglasie-pers-dannyh/\" target=\"_blank\">Согласие на обработку моих персональных данных</a> в соответствии с Федеральным законом от 27.07.2006 года № 152-ФЗ «О персональных данных» на условиях и для целей, определенных <a href=\"/politika-konfidencialnosti/\" target=\"_blank\">Политикой конфиденциальности</a>. *", 
                    "type": "checkbox", 
                    "name": "consentPersonalData" 
                },
                { 
                    "label": "Нажимая кнопку «Позвоните мне», я даю свое согласие на получение сообщений информационного (рекламного) характера в соответствии с Федеральным законом от 13.03.2006 г № 38-ФЗ «О рекламе» на условиях и для целей, определенных <a href=\"/politika-konfidencialnosti/\" target=\"_blank\">Политикой конфиденциальности</a>, <a href=\"/soglasie-rassylki/\" target=\"_blank\">Согласием на осуществление рекламной рассылки</a>. *", 
                    "type": "checkbox", 
                    "name": "consentMarketing" 
                }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    const answers = {};

    function createQuizModal() {
        const modal = document.createElement('div');
        modal.id = 'quizModal';
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2 class="text-header-quiz">Сделаем ее вместо вас онлайн, сэкономив вам 30% затрат на пошлину Журнала</h2>
                <div id="progressContainer"></div>
                <form id="quizForm">
                    <div id="questionContainer"></div>
                    
                    <div class="navigation">
                        <button type="button" id="prevButton">Назад</button>
                        <button type="button" id="nextButton">Далее</button>
                        <button type="submit" id="submitButton" style="display: none;">Отправить</button>
                    </div>
                    
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = modal.querySelector('.close');
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.getElementById('prevButton').addEventListener('click', showPreviousQuestion);
        document.getElementById('nextButton').addEventListener('click', showNextQuestion);
        document.getElementById('quizForm').addEventListener('submit', submitQuiz);

        createProgressBar();
        showQuestion(currentQuestionIndex);
    }

    function createProgressBar() {
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.innerHTML = questions.map((_, index) => `
            <div class="progress-step">
                <div class="circle">${index + 1}</div>
                ${index < questions.length - 1 ? '<div class="line"></div>' : ''}
            </div>
        `).join('');
    }

    function showQuestion(index) {
        const questionContainer = document.getElementById('questionContainer');
        const question = questions[index];

        if (question.type === "select") {
            questionContainer.innerHTML = `
                ${question.title}
                <select class="custom__select__quiz" name="q${index + 1}">
                    ${question.options.map(option => `
                        <option value="${option.value}" ${answers[`q${index + 1}`] === option.value ? 'selected' : ''}>${option.label}</option>
                    `).join('')}
                </select>
                ${index < questions.length - 1 ? '<button type="button" class="nextButton">Далее</button>' : ''}
            `;
        } else if (question.type === "inputs") {
            questionContainer.innerHTML = `
                ${question.title}
               
                ${question.inputs.map(input => {
                    if (input.type === "select") {
                        return `
                        <div class="col-c-4">
                            <label>${input.label}
                                <select class="custom__select__quiz" name="${input.name}">
                                    ${input.options.map(option => `
                                        <option value="${option.value}" ${answers[input.name] === option.value ? 'selected' : ''}>${option.label}</option>
                                    `).join('')}
                                </select>
                            </label>
                        </div>
                        `;
                    } else if (input.type === "checkbox") {
        let errorMessage = '';
        if (input.name === 'consentPersonalData') {
            errorMessage = '<div class="col-12" id="errorMessage" style="color: red; display: block;margin;bottom:10px;">Все поля обязательные для заполнения</div>';
        }
        return `
        ${errorMessage}
        <div class="col-12">
            <label>
                <input type="checkbox" name="${input.name}" ${answers[input.name] ? 'checked' : ''}>
                ${input.label}
            </label>
        </div>
        `;
    }
     else {
                        return `
                        <div class="col-c-4">
                            <label>${input.label}
                                <input class="custom__input__quiz" type="${input.type}" name="${input.name}" value="${answers[input.name] || ''}">
                            </label>
                        </div>
                        `;
                    }
                }).join('')}
                ${index < questions.length - 1 ? '<button type="button" class="nextButton">Далее</button>' : ''}
            `;
        }

        document.querySelectorAll('.nextButton').forEach(button => {
            button.addEventListener('click', showNextQuestion);
        });

        document.getElementById('prevButton').style.display = index === 0 ? 'none' : 'inline-block';
        document.getElementById('nextButton').style.display = index === questions.length - 1 ? 'none' : 'inline-block';
        document.getElementById('submitButton').style.display = index === questions.length - 1 ? 'inline-block' : 'none';

        updateProgressBar();
    }


    function showNextQuestion() {
        saveAnswer();
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    }

    function showPreviousQuestion() {
        saveAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    }
    
         function openQuizModal() {
            let modal = document.getElementById('quizModal');
            if (!modal) {
                createQuizModal();
                modal = document.getElementById('quizModal');
            }
            modal.style.display = 'block';
        }

    function saveAnswer() {
        const form = document.getElementById('quizForm');
        const currentAnswer = new FormData(form);
        for (let [key, value] of currentAnswer.entries()) {
            answers[key] = value;
        }
    }

    function getUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_content: urlParams.get('utm_content') || '',
            utm_term: urlParams.get('utm_term') || ''
        };
    }

    function submitQuiz(event) {
        event.preventDefault();
        saveAnswer();

        const requiredFields = ['name', 'phone'];
        const missingFields = requiredFields.filter(field => !answers[field]);
        const consentPersonalData = document.querySelector('input[name="consentPersonalData"]').checked;
        const consentMarketing = document.querySelector('input[name="consentMarketing"]').checked;

        if (missingFields.length > 0 || !consentPersonalData || !consentMarketing) {
            document.getElementById('errorMessage').style.display = 'block';
            return;
        } else {
            document.getElementById('errorMessage').style.display = 'none';
        }

        let comment = '';
        questions.forEach((question, index) => {
            if (question.type === "select") {
                const answer = question.options.find(option => option.value === answers[`q${index + 1}`]);
                if (answer) {
                    comment += `${question.title.replace(/<[^>]*>?/gm, '')}: ${answer.label}\n`;
                }
            } else if (question.type === "inputs") {
                question.inputs.forEach(input => {
                    if (answers[input.name]) {
                        comment += `${input.label}: ${answers[input.name]}\n`;
                    }
                });
            }
        });

        const utmParameters = getUTMParameters();
        const bitrixData = {
            phone: answers.phone || '',
            name: answers.name || '',
            lead_name: 'Пройден квиз на сайте Fedresurs.online',
            comment: comment || '',
            from_url: window.location.href,
            utm_source: utmParameters.utm_source,
            utm_medium: utmParameters.utm_medium,
            utm_campaign: utmParameters.utm_campaign,
            utm_content: utmParameters.utm_content,
            utm_term: utmParameters.utm_term
        };

        fetch('https://vestnic.online/api/sendData.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bitrixData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        console.log('Ответы квиза:', answers);
        document.getElementById('quizModal').style.display = 'none';
        ym(82948618,'reachGoal','kviz');
    }

    function updateProgressBar() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index <= currentQuestionIndex) {
                step.querySelector('.circle').classList.add('active');
                if (index < currentQuestionIndex) {
                    step.querySelector('.line').classList.add('active');
                }
            } else {
                step.querySelector('.circle').classList.remove('active');
                if (index > 0) {
                    steps[index - 1].querySelector('.line').classList.remove('active');
                }
            }
        });
    }

    function bindOpenButton(id) {
  const btn = document.getElementById(id);
  if (!btn) return;

  btn.addEventListener('click', function () {
    let modal = document.getElementById('quizModal');
    if (!modal) {
      createQuizModal();
      modal = document.getElementById('quizModal');
    }
    modal.style.display = 'block';
  });
}

bindOpenButton('openQuizButton');
bindOpenButton('openQuizButton_1');

setTimeout(function () {
  const quizDiv = document.querySelector('.quizDiv');
  if (quizDiv) quizDiv.classList.remove('hidden');

  const quizDivMobile = document.querySelector('.quizDiv__mobile');
  if (quizDivMobile) quizDivMobile.classList.remove('hidden');
}, 100);

});


