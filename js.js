const questions = Array.from({ length: 80 }, (_, i) => ({
            question: `Question ${i + 1}?`,
            options: ["Réponse 1", "Réponse 2", "Réponse 3", "Réponse 4"],
            answer: "Réponse 1",
            validated: false
        }));

        let currentQuestion = 0;
        let userAnswers = {};

        function loadQuestion() {
            let q = questions[currentQuestion];
            document.getElementById("question").innerText = q.question;
            document.getElementById("options").innerHTML = q.options.map((opt) =>
                `<label><input type='radio' name='qcm' value='${opt}' ${userAnswers[currentQuestion] === opt ? "checked" : ""} ${q.validated ? "disabled" : ""}><span>${opt}</span></label>`
            ).join('');
            document.getElementById("progress").innerText = `Question: ${currentQuestion + 1} / ${questions.length}`;
            updateQuestionList();
        }

        function nextQuestion() {
            saveAnswer();
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                loadQuestion();
            }
        }

        function prevQuestion() {
            saveAnswer();
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
            }
        }

        function saveAnswer() {
            let q = questions[currentQuestion];
            if (q.validated) return; // Empêche la modification si déjà validée

            let selectedOption = document.querySelector("input[name='qcm']:checked");
            if (selectedOption) {
                userAnswers[currentQuestion] = selectedOption.value;
            }
        }

        function validateQCM() {
            saveAnswer();
            let score = 0;
            questions.forEach((q, index) => {
                if (userAnswers[index]) {
                    q.validated = true;
                }
            });
            updateQuestionList();

            questions.forEach((q, index) => {
                if (q.validated && userAnswers[index] === q.answer) {
                    score++;
                }
            });

            let percentage = (score / questions.length) * 100;
            document.getElementById("score").innerText = `Score: ${percentage.toFixed(2)}%`;
            loadQuestion(); // Recharge la question pour désactiver les boutons radio
        }

        function updateQuestionList() {
            const listContainer = document.getElementById("questionList");
            listContainer.innerHTML = "";
            questions.forEach((q, index) => {
                let div = document.createElement("div");
                div.innerText = `Q${index + 1}`;
                div.id = `q${index}`;

                if (q.validated) {
                    if (userAnswers[index] === q.answer) {
                        div.classList.add("correct");
                    } else {
                        div.classList.add("incorrect");
                    }
                } else {
                    div.classList.add("unvalidated");
                }

                if (currentQuestion === index) {
                    div.classList.add("active");
                }

                div.onclick = () => {
                    saveAnswer();
                    currentQuestion = index;
                    loadQuestion();
                };
                listContainer.appendChild(div);
            });
        }

        loadQuestion();