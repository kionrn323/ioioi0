let answers = {}; // Store answers indexed by question
let currentQuestionIndex = 0; // 현재 질문의 인덱스를 추적
let currentDimensionIndex = 0; // 현재 카테고리의 인덱스를 추적


// 질문 배열을 정의
const userSessions = {};

const answerScores = {
    "매우 그렇다": 5,
    "그렇다": 4,
    "보통이다": 3,
    "아니다": 2,
    "매우 아니다": 1
};

const questions = {
    E: [
        "조용하고 한적한 장소보다 시끌벅적 핫한 장소에서의 데이트를 선호한다.",
        "개인의 시간보다 연인과 함께하는 시간 더 소중하다."
    ],
    I: [
        "연인의 친구를 소개받는 자리가 조금 불편하다.",
        "연인에게 적극적으로 마음을 표현하기보다는 은은하게 뒤에서 챙겨준다."
    ],
   
    T: [
        "연인과의 다툼 중 의견이 다를 때 상대가 인정할 만한 근거를 제시하며 설득한다. ",
        "연애 초반에 마음과는 달리 감정 표현이 서툰 편이다."
    ],
    F: [
        "연인이 조별 과제로 힘들어할 때 원인 분석보다 위로를 우선시한다.",
        "기념일 선물로 상대에게 필요한 실용적인 선물보다는 정성이 들어간 이벤트를 선호한다."
    ],
   
    J: ["연인과 여행을 갈 때, 출발부터 돌아오는 날까지 모든 일정을 계획한다.",
        "내일이 시험인데 보고 싶어서 집 앞으로 왔다는 애인이 불편하다." ],
        
    P: ["자유롭고 즉흥적인 데이트를 선호한다.",
        "잔잔한 연애보다는 다이나믹한 연애를 선호한다."]
};


const dimensions = ["E", "I", "T", "F", "J", "P"];

const personalityImages = {
  ENFP: "C:\pepero\frontend\ENFP.jpg",
  ENFJ: "C:\pepero\frontend\ENFJ.jpg",
  ENTJ: "C:\pepero\frontend\ENTJ.jpg",
  ENTP: "C:\pepero\frontend\ENTP.jpg",
  ESFJ: "C:\pepero\frontend\ESFJ.jpg",
  ESFP: "C:\pepero\frontend\ESFP.jpg",
  ESTJ: "C:\pepero\frontend\ESTJ.jpg",
  ESTP: "C:\pepero\frontend\ESTP.jpg",
  INFJ: "C:\pepero\frontend\INFJ.jpg",
  INFP: "C:\pepero\frontend\INFP.jpg",
  INTJ: "C:\pepero\frontend\INTJ.jpg",
  INTP: "C:\pepero\frontend\INTP.jpg",
  INFJ: "C:\pepero\frontend\INFJ.jpg",
  INFP: "C:\pepero\frontend\INFP.jpg",
  ISFP: "C:\pepero\frontend\ISFP.jpg",
  ISFJ: "C:\pepero\frontend\ISFJ.jpg",
  ISTP: "C:\pepero\frontend\ISTP.jpg",
  ISTJ: "C:\pepero\frontend\ISTJ.jpg",
  // 여기에 다른 MBTI 유형별 이미지 경로를 추가
};


function displayQuestion(questionText) {
  const questionElement = document.getElementById("question");
  if (questionElement) {
    questionElement.textContent = questionText;
  }
}

function startTest() {
  document.querySelector(".start-section").style.display = "none";
  document.querySelector(".question-section").style.display = "block";

  // 첫 번째 카테고리의 첫 번째 질문을 표시
  displayQuestion(questions[dimensions[currentDimensionIndex]][currentQuestionIndex]);
}

function submitAnswer(answer) {
  const currentDimension = dimensions[currentDimensionIndex];
  
  if (!answers[currentDimension]) {
    answers[currentDimension] = 0;
  }

  answers[currentDimension] += answerScores[answer];
  nextQuestion();
}

function nextQuestion() {
  if (currentQuestionIndex < questions[dimensions[currentDimensionIndex]].length - 1) {
    currentQuestionIndex++;
    displayQuestion(questions[dimensions[currentDimensionIndex]][currentQuestionIndex]);
  } else if (currentDimensionIndex < dimensions.length - 1) {
    currentDimensionIndex++;
    currentQuestionIndex = 0;
    displayQuestion(questions[dimensions[currentDimensionIndex]][currentQuestionIndex]);
  } else {
    document.querySelector(".question-section").style.display = "none"; // 질문 섹션 숨기기
    displayResults(answers); // 결과 섹션 표시
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
      const peperoResult = getPeperoTypeAndDescription(personality);

      const imgElement = document.createElement('img'); // 이미지 요소 생성
      imgElement.src = `${personality}.jpg`; 
      imgElement.alt = 'MBTI Result Image';
      resultsSection.appendChild(imgElement); // 결과 섹션에 이미지 요소 추가

      const name = document.getElementById("name").value;
      const resultString = `${name}님! 결과가 나왔어요! 당신의 빼빼로 유형은 "${peperoResult.type}" 입니다.\n\n${peperoResult.description}`;
      resultsSection.innerHTML += `<p>${resultString}</p>`; // 이미지 아래에 결과 텍스트 추가
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
          type: "오지랖 빼빼로",
          description: "#오지라퍼 #자발적을의연애 #첫만남에2세계획 상대방의 감정을 잘 읽고 맞춰줘서 연애할 때 갈등이 적어요. 주변을 잘 챙겨서 누구든 당신 곁에 있기를 좋아해요. 하지만 사실은 호불호가 명확해서 연인의 행동에 간섭하고 싶지만, 갈등을 만들고 싶지 않아서 불만이 있어도 속에 쌓아두는 편이에요! 가끔 속마음을 표현할 때에도 불편한 말이 다 필터링 된 예쁜 말만 해주려고 노력해서 누구든 당신을 좋아해요."

          
      },
      ENFJ: {
          type: "완벽주의 빼뺴로",
          description: "#칭찬봇 #1분에100마디 #저세상오지랖 빠른 눈치로 연인의 감정을 척척 알아맞히고 연애를 위해 시간과 노력을 아끼지 않는 스타일이군요! 장점을 알아보고 응원해 주는 데에 능숙해서 자존감 낮은 사람도 당신과 함께라면 언제나 당당해요! 하지만 상처받기 싫은 마음에 갈등을 피하고 좋은 말만 계속한다면 문제는 해결되지 않고 깊어질 거예요. 힘들 때 자기 생각과 감정을 솔직하게 표현하는 것도 중요해요!!"
      },
       ESTJ: {
          type: "팩트폭격 빼빼로",
          description: "#호불호확실 #뒷담극혐 #연애도학습함 밀당이라곤 일절 모르는 솔직담백 스타일이에요! 가식없는 쿨한 매력에 많은 이성이 호감을 느낄 거예요. 연애 초반엔 감정 표현이 서툴러도 연애도 사랑도 열심히 학습하는 노력파!! 다만 명확한 호불호와 냉철한 성향 때문에 의도치 않게 연인에게 상처를 줄 수 있어요. 상대의 마음을 헤아려 보는 노력하면 더 좋은 관계를 유지할 수 있습니다~!"
         
      },
      ENTJ: {
          type: "해병대 빼빼로",
          description: "#불도저연애 #프로야망러 #성취감변태 우주는 나를 중심으로 돌아가!! 야망 가득한 워커홀릭인 데다 사랑도 일처럼 척척 해치우고 불도저 정신으로 썸에서 연애까지 다이렉트! 연인이 고민할 때 빠르게 해결책을 제시하고, 싸울 때도 잘잘못을 확실히 따지는 편이에요. 남의 눈치를 보지 않고 주도적으로 행동하다 보면 나도 모르는 사이 상대방에게 상처를 줄 수 있어요! 상대의 감정을 조금 더 생각해 주려 노력한다면 오랫동안 안정적인 연애를 할 수 있을 거예요."

      },
      ESTP: {
          type: "철판 빼빼로",
          description: "#쿨내진동 #19금풀게이지 #연애성공률200% 모르는 사람과도 10분 만에 절친이 되는 핵인싸에게 연애는 식은 죽 먹기죠. 이상형을 만나면 어마어마한 애정 폭발력으로 썸부터 연애까지 빠르게 직진하는 스타일이에요. 남의 눈치를 보지 않고 애정표현이나 스킨십도 적극적으로 하는 편이라 연인에게 사랑받는 느낌을 듬뿍 주는 프로 표현러군요! 갈등이 생겨도 피하지 않고 뒤끝도 없어서 쿨한 연애가 가능해요. 얽매이는 걸 싫어하는 자유영혼이기 때문에 지나치게 구속하지 않고 다양한 데이트를 즐기며 취미를 공유할 수 있는 사람을 만나는 걸 추천해요."
      },
      ENTP: {
          type: "모험가 빼빼로",
          description: "#호불호확실 #일단들이대는편 #나도몰라종착지 좋으면 앞뒤 안 재고 돌진하며 썸도 연애도 빠르게 시작하는 성향입니다! 창의력과 비판적인 사고로 말발이 상당해 격렬한 토론도 좋아해요. 관심 있는 주제로 밤새 떠들 수 있는 상대라면 운명적인 연애를 시작할 수 있을 거예요. 호불호 확실하고 싫증을 빨리 내는 편이라 새로운 핫플이나 액티비티를 함께 찾아다니는 등 다이나믹한 연애를 즐길 수 있답니다~ "
         
      },
      ESFP: {
          type: "무지개 빼빼로",
          description: "#오버액션 #이벤트덕후 #변덕이탱탱볼급 연애할 때 한없이 다정하고 콩깍지가 단단히 씌어서 매일 연애 1일 차 같은 설렘과 이벤트가 가득할 거예요. 썸 추진력도 5G급이라 연애 성공률은 걱정할 것 없겠네요! 하지만 생각이 자주 바뀌는 편이라 나도 모르는 사이 마음이 갈대처럼 흔들릴 수 있어요. 당신의 무한동력 같은 에너지로 연인과 함께 파티, 스포츠처럼 활동적인 데이트를 즐기다 보면 다시 마음이 불타오를 수 있어요. 또 '한 번뿐인 인생, 즐겁게 살자'는 나의 가치관을 응원해주는 사람이라면 오랫동안 즐거운 연애가 가능할 거예요."
      },
      ENFP: {
          type: "4차원 빼빼로",
          description: "#애정으로지구폭발 #충동 3000% #취향존중 개성을 존중하고 자유를 사랑하는 나에게 구속하는 연애를 싫어하고, 연인에게 간섭하지 않네요. 갑자기 일을 그만두고 여행을 떠나겠다고 하면 묻지도 따지지도 않고 응원해 줄 스타일이에요. 한 번 빠지면 화끈하게 올인하기 때문에 헌신적인 연애를 할 가능성이 높아요. 어느 정도의 보답을 원하기도 해서 나의 헌신과 응원에 진심으로 감사할 줄 알고 내 모습을 있는 그대로 존중해줄 수 있는 빼빼로를 만나세요!"
        
      }, 
      ISFJ: {
          type: "현모양처 빼빼로",
          description: "#뒤끝100스푼 #사랑확인형 #챙김마스터 나서는 거 싫어하는데 관심 받는건 좋아합니다. 작은 기념일, 이벤트까지 꼼꼼하게 챙기며 연인의 행복을 확실히 서포트합니다. 상대를 행복하게 해주는 것이 연애의 의무 중 하나라 생각하기 때문이죠. 누구보다 아낌없이 사랑을 주는 만큼 때로는 상대의 사랑을 확인하고 싶어합니다. 감정 표현에 서툰 사람을 만나면 내가 주는 만큼 받지 못하는 것 같아 오랫동안 뒤끝이 남을 수도 있어요. 따라서 인간관계에서 스트레스를 많이 받아요. 나의 노력을 존중해주고 진심으로 감사할 줄 아는 사람을 만나면 오랫동안 사랑 넘치는 연애를 기대해도 좋아요. 남의 눈치를 보는 데에 너무 많은 시간을 쓰지 말고 내 감정부터 충실하게 살피고 표현하는 것도 잊지 마세요."
          
      },
      INFJ: {
          type: "어린왕자 빼빼로",
          description: "#속앓이원탑 #짝사랑매니아 #표정관리고수 생각이 너무 많아서 좋아하는 사람이 다가오면 속으론 행복해해도 겉으론 차갑게 반응해요. 이상형은 확실하지만, 표현이 서툴러서 짝사랑과 속앓이를 가장 많이 하는 스타일이기도 해요. 하지만 일단 시작하면 삶의 1순위가 연애로 바뀌기 때문에 연애를 방해하는 모든 장애물을 다 부수며 상대에게 올인해요. 표정 관리를 너무 잘해서 상대가 내 마음을 전혀 눈치채지 못할 때도 많을 거예요. 남의 눈치를 보는 데에 너무 많은 시간을 쓰지 말고 혼자 생각할 시간을 갖고 내 감정을 조금 더 솔직하게 표현해 보세요." // Modified description for N
      },
       ISTJ: {
          type: "모범생 빼빼로",
          description: "#내적사랑꾼 #플래너성애자 #연애원칙주의자 정확하고 체계적인 성향에 약간의 관종끼가 있지만 내성적이라 표출이 서툴고, 외적 표현보다는 내적 사랑 가득한 연애봇이에요. 연애도 나만의 원칙에 맞게 계획적으로 차근차근 진행하기 때문에 시작이 다소 느릴 수 있어요. 하지만 눈치가 빨라 상대의 생각을 잘 읽고 맞춰 줘서 한번 시작하면 갈등 없이 가장 안정적으로 연애를 하는 완벽주의자 스타일이기도 해요. 나의 계획성과 꼼꼼함을 존중해주고 인정해주는 사람을 만나면 더없이 행복한 연애가 가능할 거예요."
            },
      INTJ: {
          type: "카리스마 빼빼로",
          description: "#츤데레 #데이트창조신 #분석성애자 자신의 주관이 뚜렷해서 가치관이나 관심사가 맞지 않으면 관심을 주지 않는 편이에요. 하지만 전형적인 츤데레 스타일이라 겉보다 속이 훨씬 따뜻해요. 애정표현은 조금 서툴러도 이 사람이다 싶으면 철저하게 분석하고 계획해서 썸에서 연애까지 빠르게 추진해요. 덕분에 연애 성공률도 높은 편. 아이디어와 상상력이 넘쳐서 남들이 하지 않는 색다른 데이트를 창조하고 즐기는 경우가 많아요. 연애에서도 완벽을 추구하기 때문에 늘 분석하고 탐구하지만 때로는 마음을 따라가는 게 정답일 때도 있다는 걸 잊지 마세요." // Modified description for N
      },
      ISTP: {
          type: "귀차니즘 빼빼로",
          description: "#마이웨이 #혼자놀기만렙 #내사람홀릭 연애도 인생도 일관성 있게 마이웨이! 서로의 생활을 존중하고 구속하지 않는 자유로운 연애를 좋아해요. 연애할 때에도 반드시 혼자만의 시간이 필요하고 그렇지 못하면 스트레스를 받아요. 상대의 감정이나 생각을 잘 읽는 편이지만 마이웨이답게 눈치를 보며 행동하지는 않아요. 처음엔 속마음을 잘 꺼내지 않지만 내 사람이 되었다고 생각하면 박찬호급 투머치토커로 돌변하는 스타일이기도 해요. 애정표현이나 스킨십은 다소 소극적인 편이라 좋아하는 사람이 생겨도 티가 잘 안 나요. 감정을 먼저 표현하려 조금 더 노력한다면 연애 성공률을 200% 끌어올릴 수 있을 거예요."
          
      },
      INTP: {
          type: "로봇 빼빼로",
          description: "#삐걱삐걱 #자존감최고 #팩트폭행범 기존의 연애 방식을 거부하고 나만의 연애를 만들어 가는 스타일이에요! 연애관이 뚜렷해서 자신만의 연애를 만들어 나가는 스타일이에요! 늘 새로운 생각이 머릿속에 가득 차 있어서 데이트 코스를 신박하게 짜는 경우가 많아요. 워낙 직설적이고 팩트로 KO시키는 편이라 본인 의견을 이야기하는 것뿐인데도 의도치 않게 상처가 주는 말들을 할수도 있어요. 조금만 더 상대의 감정을 읽으려 노력한다면 오랫동안 안정적인 연애가 가능할 거예요"
          

      },
      ISFP: {
          type: " 소금 빼빼로",
          description: "#집순이집돌이 #내적관종 #느긋느긋 타고난 공감능력과 선한 성격 덕분에 연애에서도 상대방을 행복하게 해주는 사람이에요. 공감력 200%로 상대방의 특이 취향까지 존중해 주고 맞춰 주며 긍정에너지를 마구마구 전파해요. 미친 공감능력을 가진 공감능력자로 상대방의 취미와 취향을 존중해주고 맞춰주며 밝은 에너지를 마구 분출해요. 착한 성격을 가져서 거절을 잘 못 해서 부탁도 하소연도 잘 들어주지만, 상대의 감정만 받아주다 보면 정작 나에게 소홀해질 때도 있을 거예요. 때로는 솔직한 자신의 감정을 표현해도 좋을거에요."
          
      },
      INFP: {
          type: "구름  빼빼로",
          description: "#아기고양이 #망상전문가 #감정선100만개 연애 시작과 동시에 앞으로 행복할 일, 싸울 일, 우울할 일을 미리 상상하고 기뻐하고 걱정하는 스타일이에요. 연애 시작도 전에 모든 상황을 먼저 망상해보고 행복해하기도 하고 우울해하기도 하고 불행해하기도 해요 항상 연애를 하고싶어 하지만, 연애 기준이 높아서 막상 썸남이나 썸녀가 생겨도 철벽을 치는 사람이에요. 하지만 연애를 시작하면 언제 철벽을 쳤는지 기억도 안 날 정도로 아기고양이가 간택된거처럼 졸졸졸 따라다녀요 연애하고 싶으시다구요? 눈을 조금만 낮춰보시는건 어떨까요? 행복한 미래가 기다릴지도 몰라요!"
         
          

      },

      // 여기에 다른 유형들을 추가할 수 있습니다.
  };

  return (
      peperoTypes[personality] || {
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
