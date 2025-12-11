/* ===========================================================
   QUIZ BAUDUCCO – SCRIPT FINAL
   =========================================================== */

/* ========= REDIRECIONAMENTO ========= */
function startQuiz() {
    window.location.href = "quiz.html";
}

/* ========= PERGUNTAS DO QUIZ ========= */
const quizData = [
    {
        question: "Qual é o produto mais tradicional da Bauducco?",
        answers: ["Cookies", "Panetone", "Biscoito recheado", "Wafer de chocolate"]
    },
    {
        question: "Em que país a Bauducco foi fundada?",
        answers: ["Brasil", "Itália", "Estados Unidos", "Argentina"]
    },
    {
        question: "Qual destes produtos NÃO faz parte do portfólio da Bauducco?",
        answers: ["Panetone", "Torrada", "Bolinho", "Refrigerante"]
    },
    {
        question: "O fundador da Bauducco imigrou de qual país para abrir a empresa no Brasil?",
        answers: ["Itália", "Alemanha", "Espanha", "Portugal"]
    },
    {
        question: "Qual destes sabores é comum nas linhas de wafers da Bauducco?",
        answers: ["Chocolate", "Limão", "Café", "Coco queimado"]
    }
];

let currentIndex = 0;

/* ========= CARREGAR PERGUNTA ========= */
function loadQuestion() {
    const title = document.getElementById("question");
    const optionsBox = document.getElementById("options");
    const nextButton = document.getElementById("next-button");

    if (!title || !optionsBox || !nextButton) return;

    nextButton.disabled = true;

    const q = quizData[currentIndex];

    title.innerText = q.question;
    optionsBox.innerHTML = "";

    q.answers.forEach(answer => {
        const div = document.createElement("div");
        div.className = "quiz-option";
        div.innerText = answer;

        div.onclick = () => {
            document.querySelectorAll(".quiz-option").forEach(opt => opt.classList.remove("selected"));
            div.classList.add("selected");
            nextButton.disabled = false;
        };

        optionsBox.appendChild(div);
    });
}

/* ========= PRÓXIMA PERGUNTA ========= */
function nextQuestion() {
    if (!document.querySelector(".quiz-option.selected")) {
        alert("Escolha uma opção antes de continuar.");
        return;
    }

    currentIndex++;

    if (currentIndex >= quizData.length) {
        window.location.href = "parabens.html";
        return;
    }

    loadQuestion();
}

/* ========= IR PARA FORMULÁRIO ========= */
function goToForm() {
    window.location.href = "formulario.html";
}

/* ===========================================================
   FORMULÁRIO → ENVIAR PARA GOOGLE SHEETS
   =========================================================== */

const scriptURL =
    "https://script.google.com/macros/s/AKfycbz9g8ILTtTFbDHARDUNta3g2Zyxc5kjuH35E0YarK_LA8xNfs5v9O8EUFL5nz4W7OaP/exec";

/* ===========================================================
   PAGAMENTO – CRONÔMETRO + REDIRECIONAMENTO
   =========================================================== */

let tempo = 120; // 2 minutos
let pagamentoConfirmado = false;

function iniciarCronometro() {
    const timerElement = document.getElementById("timer");
    if (!timerElement) return;

    const intervalo = setInterval(() => {
        if (pagamentoConfirmado) {
            clearInterval(intervalo);
            return;
        }

        let minutos = Math.floor(tempo / 60);
        let segundos = tempo % 60;

        if (segundos < 10) segundos = "0" + segundos;

        timerElement.textContent = `Tempo restante: ${minutos}:${segundos}`;

        if (tempo <= 0) {
            clearInterval(intervalo);

            // REDIRECIONA PARA O WHATSAPP SE NÃO PAGOU
            window.location.href =
                "https://wa.me/5511999999999?text=Olá,%20preciso%20de%20ajuda%20com%20meu%20pagamento.";
        }

        tempo--;
    }, 1000);
}

function concluirPagamento() {
    pagamentoConfirmado = true;
    window.location.href = "obrigado.html";
}

/* ===========================================================
   EVENTOS GERAIS DO SITE
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========== ENVIO DO FORMULÁRIO =========== */
    const form = document.getElementById("formBauducco");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = new URLSearchParams();
            formData.forEach((value, key) => data.append(key, value));

            fetch(scriptURL, {
                method: "POST",
                body: data,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            })
            .then(() => {
                window.location.href = "pagamento.html";
            })
            .catch(err => {
                console.error("Erro ao enviar:", err);
                alert("Erro ao enviar. Tente novamente.");
            });
        });
    }

    /* ========== INICIAR QUIZ ========== */
    if (window.location.pathname.includes("quiz.html")) {
        loadQuestion();
    }

    /* ========== INICIAR CRONÔMETRO NA PÁGINA DE PAGAMENTO ========== */
    if (window.location.pathname.includes("pagamento.html")) {
        iniciarCronometro();
    }

    /* ========== PERMITIR QUE O HTML ACESSE A FUNÇÃO ========== */
    window.concluirPagamento = concluirPagamento;
});
