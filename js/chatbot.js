
/* =====================================================
   BUSUNG AI CHATBOT UI
===================================================== */

document.addEventListener("DOMContentLoaded", function(){

    const toggle =
        document.getElementById("busungAiToggle");

    const close =
        document.getElementById("busungAiClose");

    const windowEl =
        document.getElementById("busungAiWindow");

    const form =
        document.getElementById("busungAiForm");

    const input =
        document.getElementById("busungAiInput");

    const messages =
        document.getElementById("busungAiMessages");


    if(!toggle || !windowEl) return;


    /* OPEN */

    toggle.addEventListener("click", function(){

        windowEl.classList.add("is-open");

        setTimeout(() => {

            input?.focus();

        }, 250);

    });


    /* CLOSE */

    close?.addEventListener("click", function(){

        windowEl.classList.remove("is-open");

    });


    /* QUICK QUESTIONS */

    document
        .querySelectorAll(".ai-quick-buttons button")
        .forEach(button => {

            button.addEventListener("click", function(){

                const text =
                    this.textContent.trim();

                input.value = text;

                form.dispatchEvent(
                    new Event("submit")
                );

            });

        });


    /* TEMP MESSAGE */

    form?.addEventListener("submit", function(e){

        e.preventDefault();

        const text =
            input.value.trim();

        if(!text) return;


        const userMessage =
            document.createElement("div");

        userMessage.className =
            "ai-message user-message";

        userMessage.innerHTML = `

            <div class="ai-bubble">
                ${text}
            </div>

        `;

        messages.appendChild(userMessage);

        input.value = "";

        messages.scrollTop =
            messages.scrollHeight;


        form?.addEventListener("submit", async function(e){

            e.preventDefault();

            const text = input.value.trim();

            if(!text) return;


            // =========================
            // 사용자 메시지
            // =========================

            const userMessage =
                document.createElement("div");

            userMessage.className =
                "ai-message user-message";

            userMessage.innerHTML = `
                <div class="ai-bubble">
                    ${escapeHtml(text)}
                </div>
            `;

            messages.appendChild(userMessage);

            input.value = "";

            messages.scrollTop =
                messages.scrollHeight;


            // =========================
            // 로딩
            // =========================

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


            try {

                // =========================
                // Cloudflare Function 호출
                // =========================

                const response =
                    await fetch("/chat", {

                        method:"POST",

                        headers:{
                            "Content-Type":"application/json"
                        },

                        body:JSON.stringify({
                            message:text
                        })

                    });


                const data =
                    await response.json();


                loadingMessage.remove();


                if(!response.ok){

                    throw new Error(
                        data.error ||
                        "AI 서버 오류"
                    );

                }


                // =========================
                // AI 메시지
                // =========================

                const aiMessage =
                    document.createElement("div");

                aiMessage.className =
                    "ai-message";

                aiMessage.innerHTML = `

                    <div class="ai-avatar">
                        BS
                    </div>

                    <div class="ai-bubble">
                        ${formatAiText(data.answer)}
                    </div>

                `;

                messages.appendChild(aiMessage);

                messages.scrollTop =
                    messages.scrollHeight;


            } catch(error){

                loadingMessage.remove();

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

                console.error(error);

            }

        });


        /* =========================
        HTML 안전 처리
        ========================= */

        function escapeHtml(text){

            const div =
                document.createElement("div");

            div.textContent = text;

            return div.innerHTML;

        }


        /* =========================
        AI 답변 포맷
        ========================= */

        function formatAiText(text){

            return escapeHtml(text)
                .replace(/\n/g,"<br>");

        }

    });

});