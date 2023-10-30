let sessionId;
let currentQuestionData = null;
let questionHistory = [];
let answers = {}; // Store answers indexed by question
let currentQuestionIndex = 0; // 현재 질문의 인덱스를 추적

function startTest() {
    
  document.querySelector(".start-section").style.display = "none";
  document.querySelector(".question-section").style.display = "block";
  sessionId = Math.random().toString(36).substr(2, 9);
  fetchQuestion();
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(questionHistory[currentQuestionIndex]);
  }
}

function nextQuestion() {
  if (currentQuestionIndex < questionHistory.length - 1) {
    currentQuestionIndex++;
    displayQuestion(questionHistory[currentQuestionIndex]);
  } else {
    submitAnswer(null);
  }
}

function fetchQuestion() {
  fetch("http://localhost:4000/PEPEROmbti", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.assistant) {
        questionHistory.push(data);
        currentQuestionData = data;
        displayQuestion(data);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function submitAnswer(answer) {
  if (answer !== null) {
    answers[currentQuestionData.assistant] = answer;
  }

  if (!currentQuestionData) {
    console.warn("currentQuestionData is undefined. Cannot proceed.");
    return;
  }

  currentQuestionData.userAnswer = answer;

  fetch("http://localhost:4000/PEPEROmbti", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionId,
      userAnswer: answer,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.assistant === "질문이 더 이상 없습니다.") {
        showConfirmationForResults();
      } else {
        questionHistory.push(data);
        currentQuestionIndex++; // 질문 인덱스 증가
        displayQuestion(data);
      }
    })
    .catch((error) => console.error("Error:", error));
}
/*
if (!currentQuestionData) {
  console.warn("currentQuestionData is undefined. Cannot proceed.");
  return;
}

currentQuestionData.userAnswer = answer;

fetch("http://localhost:4000/PEPEROmbti", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sessionId: sessionId,
    userAnswer: answer,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.assistant === "질문이 더 이상 없습니다.") {
      showConfirmationForResults(); // Show confirmation before showing results
    } else {
      questionHistory.push(data);
      displayQuestion(data);
    }
  })
  .catch((error) => console.error("Error:", error));
*/
function displayQuestion(data) {
  const questionElement = document.getElementById("question");
  if (questionElement && data.assistant) {
    questionElement.innerText = data.assistant;

    const buttons = document.querySelectorAll(
      ".question-section button:not(.navigation-buttons button)"
    );
    buttons.forEach((button) => {
      button.style.backgroundColor = "";
      if (
        answers[data.assistant] &&
        button.innerText === answers[data.assistant]
      ) {
        button.style.backgroundColor = "blue";
      }
    });
  }
}

function showConfirmationForResults() {
  const questionSection = document.querySelector(".question-section");
  questionSection.style.display = "none";

  const confirmationSection = document.createElement("div");
  confirmationSection.className = "confirmation-section";
  confirmationSection.innerHTML = `
        <p>Would you like to see the results?</p>
        <button onclick="displayResultsAndRestart(true)">Yes</button>
        <button onclick="displayResultsAndRestart(false)">No</button>
    `;

  document.body.appendChild(confirmationSection);
}

function displayResultsAndRestart(showResults) {
  const confirmationSection = document.querySelector(".confirmation-section");
  if (confirmationSection) {
    confirmationSection.remove();
  }

  if (showResults) {
    displayResults(currentQuestionData.totalScores);
  } else {
    restartTest();
  }
}

function restartTest() {
  document.querySelector(".start-section").style.display = "block";
  document.querySelector(".question-section").style.display = "none";
  questionHistory = [];
  answers = {};
}

function displayResults(scores) {
  const resultsSection = document.getElementById("results");
  if (resultsSection) {
    const personality = calculatePersonality(scores);
    const peperoResult = getPeperoTypeAndDescription(personality); // 빼빼로 유형과 설명을 얻음
    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    const resultString = `"${name}님! 결과가 나왔어요! 당신의 성별은 ${gender}!!, \n"당신의 빼빼로 유형은 "${peperoResult.type}" 입니다. \n\n${peperoResult.description}`;
    resultsSection.innerHTML = `<p>${resultString}</p>`;
    resultsSection.style.display = "block";
  }
}

function calculatePersonality(scores) {
  let personality = "";
  personality += scores.E > scores.I ? "E" : "I";
  personality += Math.random() < 0.5 ? "S" : "N";
  personality += scores.T > scores.F ? "T" : "F";
  personality += scores.J > scores.P ? "J" : "P";
  return personality;
}

// 빼빼로 유형과 설명을 반환하는 함수
function getPeperoTypeAndDescription(personality) {
    const peperoTypes = {
        ESFJ: {
            type: "누드빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        ENFJ: {
            type: "아몬드누드빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        },
         ESTJ: {
            type: "아몬드빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        ENTJ: {
            type: "통아몬드빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        },
        ESTP: {
            type: "딸기맛 빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        ENTP: {
            type: "왕딸기맛빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        },
        ESFP: {
            type: "요거트맛 빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        ENFP: {
            type: "그릭 요거트맛 빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        }, 
        ISFJ: {
            type: "슬림 빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        INFJ: {
            type: "초슬림 빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        },
         ISTJ: {
            type: "다크 초콜릿 빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        INTJ: {
            type: "화이트 초콜릿 빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        },
        ISTP: {
            type: "쿠키 앤 크림 빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        INTP: {
            type: "민트 초코맛 빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        },
        ISFP: {
            type: "크런키 빼빼로",
            description: "누드빼빼로는 외향적이고 감각적인 성격을 가진 사람들에게 어울립니다." // Modified description for S
        },
        INFP: {
            type: "녹은 빼빼로",
            description: "누드빼빼로는 외향적이고 직관적인 성격을 가진 사람들에게 어울립니다." // Modified description for N
        },

        // 여기에 다른 유형들을 추가할 수 있습니다.
    };

  return (
    peperoTypes[personality] || {
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",
      type: "기본 빼빼로",
      description: "기본 빼빼로는 모든 성격 유형에게 잘 어울립니다.",

    }




    
  ); // 만약 해당 유형이 정의되지 않았다면 기본값을 반환
}

  function openResultInNewWindow(resultString) {
    const newWindow = window.open("", "_blank");
    newWindow.document.write(resultString);
    newWindow.document.close();
  }