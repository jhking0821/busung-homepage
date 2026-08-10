
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


        /* 임시 응답 */

        setTimeout(() => {

            const aiMessage =
                document.createElement("div");

            aiMessage.className =
                "ai-message";

            aiMessage.innerHTML = `

                <div class="ai-avatar">
                    BS
                </div>

                <div class="ai-bubble">

                    문의 내용을 확인했습니다.<br><br>

                    현재 AI 상담 시스템을
                    연결하고 있습니다.

                    <br><br>

                    정확한 견적 및 제작 상담은
                    <strong>OEM 상담하기</strong>를
                    이용해주세요.

                </div>

            `;

            messages.appendChild(aiMessage);

            messages.scrollTop =
                messages.scrollHeight;

        }, 500);

    });

});