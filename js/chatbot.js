/* =====================================================
   BUSUNG AI CHATBOT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("busungAiToggle");
    const close = document.getElementById("busungAiClose");
    const windowEl = document.getElementById("busungAiWindow");
    const form = document.getElementById("busungAiForm");
    const input = document.getElementById("busungAiInput");
    const messages = document.getElementById("busungAiMessages");

    if (!toggle || !windowEl || !form || !input || !messages) {
        console.error("BUSUNG AI: 필수 요소를 찾을 수 없습니다.");
        return;
    }


    /* =====================================================
       OPEN
    ===================================================== */

    toggle.addEventListener("click", function () {

        windowEl.classList.add("is-open");

        setTimeout(function () {
            input.focus();
        }, 250);

    });


    /* =====================================================
       CLOSE
    ===================================================== */

    if (close) {

        close.addEventListener("click", function () {

            windowEl.classList.remove("is-open");

        });

    }


    /* =====================================================
       QUICK QUESTIONS
    ===================================================== */

    document
        .querySelectorAll(".ai-quick-buttons button")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const text = this.textContent.trim();

                if (!text) return;

                input.value = text;

                /*
                 * 실제 submit 이벤트 실행
                 */
                form.requestSubmit();

            });

        });


    /* =====================================================
       CHAT SUBMIT
    ===================================================== */

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const text = input.value.trim();

        if (!text) return;


        console.log("BUSUNG AI 질문:", text);


        /* =================================================
           사용자 메시지
        ================================================= */

        const userMessage = document.createElement("div");

        userMessage.className =
            "ai-message user-message";

        userMessage.innerHTML = `
            <div class="ai-bubble">
                ${escapeHtml(text)}
            </div>
        `;

        messages.appendChild(userMessage);


        /* 입력창 초기화 */

        input.value = "";


        /* 스크롤 */

        messages.scrollTop = messages.scrollHeight;


        /* =================================================
           로딩 메시지
        ================================================= */

        const loadingMessage =
            document.createElement("div");

        loadingMessage.className =
            "ai-message ai-loading";

        loadingMessage.innerHTML = `
            <div class="ai-avatar">
                BS
            </div>

            <div class="ai-bubble">
                답변을 준비하고 있습니다...
            </div>
        `;

        messages.appendChild(loadingMessage);

        messages.scrollTop =
            messages.scrollHeight;


        /* =================================================
           AI API 호출
        ================================================= */

        try {

            console.log("BUSUNG AI: /chat 요청 시작");


            const response = await fetch("/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: text
                })

            });


            console.log(
                "BUSUNG AI: /chat 응답",
                response.status
            );


            /*
             * JSON 응답 확인
             */

            const data = await response.json();

            console.log(
                "BUSUNG AI: 서버 데이터",
                data
            );


            /* 로딩 제거 */

            loadingMessage.remove();


            /* =================================================
               서버 오류
            ================================================= */

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "AI 서버 오류"
                );

            }


            /* =================================================
               AI 답변
            ================================================= */

            const answer =
                data.answer ||
                data.message ||
                "죄송합니다. 답변을 불러오지 못했습니다.";


            const aiMessage =
                document.createElement("div");

            aiMessage.className =
                "ai-message";


            aiMessage.innerHTML = `
                <div class="ai-avatar">
                    BS
                </div>

                <div class="ai-bubble">
                    ${formatAiText(answer)}
                </div>
            `;


            messages.appendChild(aiMessage);


            messages.scrollTop =
                messages.scrollHeight;


        } catch (error) {

            console.error(
                "BUSUNG AI 오류:",
                error
            );


            /* 로딩 제거 */

            loadingMessage.remove();


            /* 오류 메시지 */

            const errorMessage =
                document.createElement("div");

            errorMessage.className =
                "ai-message";


            errorMessage.innerHTML = `
                <div class="ai-avatar">
                    BS
                </div>

                <div class="ai-bubble">

                    죄송합니다.<br>
                    AI 상담 연결에 문제가 발생했습니다.

                    <br><br>

                    잠시 후 다시 시도해주세요.

                </div>
            `;


            messages.appendChild(errorMessage);


            messages.scrollTop =
                messages.scrollHeight;

        }

    });


    /* =====================================================
       ENTER KEY
    ===================================================== */

    input.addEventListener("keydown", function (e) {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            form.requestSubmit();

        }

    });


    /* =====================================================
       HTML 안전 처리
    ===================================================== */

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    /* =====================================================
       AI 답변 포맷
    ===================================================== */

    function formatAiText(text) {

        return escapeHtml(String(text))
            .replace(/\n/g, "<br>");

    }


    console.log("BUSUNG AI CHATBOT: 정상 로드됨");

});