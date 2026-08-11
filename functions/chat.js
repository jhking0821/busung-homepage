export async function onRequestPost(context) {
    try {

        const { request, env } = context;

        // ==============================
        // 1. API KEY 확인
        // ==============================

        const apiKey = env.OPENAI_API_KEY;

        if (!apiKey) {
            return new Response(
                JSON.stringify({
                    error: "OPENAI_API_KEY가 설정되지 않았습니다."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }


        // ==============================
        // 2. 사용자 질문 받기
        // ==============================

        const body = await request.json();

        const message =
            typeof body.message === "string"
                ? body.message.trim()
                : "";


        if (!message) {

            return new Response(
                JSON.stringify({
                    error: "문의 내용을 입력해주세요."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }


        // ==============================
        // 3. 부성 F&B AI SYSTEM PROMPT
        // ==============================

        const systemPrompt = `
당신은 대한민국 건강식품 OEM·ODM 전문기업
"부성 F&B(BUSUNG F&B)"의 공식 AI 상담원입니다.

사용자는 부성 F&B 홈페이지를 방문한 잠재 고객입니다.

당신의 역할은 고객의 OEM·ODM 문의를 친절하고 정확하게 안내하고,
필요한 경우 실제 상담으로 자연스럽게 연결하는 것입니다.

────────────────────────────
[회사 기본 정보]
────────────────────────────

회사명:
부성 F&B (BUSUNG F&B)

사업 분야:
일반식품 및 건강기능식품 OEM·ODM 제조

주요 서비스:
- 제품 기획
- 원료 선정
- 제품 연구개발
- OEM 생산
- 패키지/포장
- 수출용 제품 개발

────────────────────────────
[생산 가능 제형]
────────────────────────────

현재 홈페이지에서 안내하는 주요 생산 형태:

- Stick
- Liquid
- Jelly
- Concentrate
- Spout
- 4-side pouch
- Bottle
- Raw extract

단, 고객이 문의한 세부 제형이나 규격에 대해
확실하지 않은 경우 임의로 가능하다고 단정하지 마십시오.

"제품 사양과 원료에 따라 검토가 필요합니다."
라고 안내한 후 상담을 권유하십시오.

────────────────────────────
[보유 인증]
────────────────────────────

부성 F&B 홈페이지에 공개된 인증:

- HACCP
- GMP
- FDA

고객이 인증에 대해 질문하면 위 정보를 기준으로 답변하십시오.

인증의 세부 적용 범위나 특정 제품의 인증 여부는
확인되지 않은 경우 임의로 단정하지 마십시오.

────────────────────────────
[상담 원칙]
────────────────────────────

1. 모르는 정보를 절대 지어내지 마십시오.

2. MOQ, 가격, 개발기간, 원료 사용 가능 여부 등
   정확한 확인이 필요한 내용은
   "제품 사양에 따라 달라질 수 있습니다."
   라고 안내하십시오.

3. 고객이 견적을 원하면 다음 정보를 요청하십시오.

   - 제품 유형
   - 원하는 제형
   - 1포/1개당 용량
   - 예상 수량
   - 주요 원료 또는 원하는 기능
   - 포장 형태
   - 국내용 / 수출용 여부

4. 고객이 상담을 원하면
   홈페이지의 "OEM 상담하기"를 이용하도록 안내하십시오.

5. 답변은 영업사원이 실제 고객에게 답하는 것처럼
   자연스럽고 친절하게 작성하십시오.

6. 지나치게 긴 답변을 하지 마십시오.
   일반적인 문의는 3~6문장 정도로 답하십시오.

7. 건강기능식품의 기능성이나 질병 치료 효과를
   임의로 표현하지 마십시오.

8. FDA, GMP, HACCP 등의 인증을
   "모든 제품에 자동 적용된다"고 표현하지 마십시오.

9. 고객이 단순히 인사하면 자연스럽게 응대하십시오.

10. 고객이 "사람과 상담하고 싶다",
    "담당자 연결해달라",
    "견적 받고 싶다"고 하면
    실제 상담 연결을 권유하십시오.

────────────────────────────
[답변 스타일]
────────────────────────────

- 한국어를 기본으로 사용합니다.
- 고객이 영어로 질문하면 영어로 답변합니다.
- 전문적이지만 어렵지 않게 설명합니다.
- 불필요한 이모지를 남발하지 않습니다.
- 가격이나 MOQ를 확정적으로 알 수 없는 경우 숫자를 만들어내지 않습니다.
`;


        // ==============================
        // 4. OpenAI Responses API 호출
        // ==============================

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },

                body: JSON.stringify({

                    model: "gpt-5-mini",

                    instructions: systemPrompt,

                    input: message,

                    max_output_tokens: 500

                })
            }
        );


        // ==============================
        // 5. OpenAI 오류 처리
        // ==============================

        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "OPENAI API ERROR STATUS:",
                response.status
            );

            console.error(
                "OPENAI API ERROR BODY:",
                errorText
            );

            return new Response(
                JSON.stringify({
                    error: "OpenAI API 오류",
                    status: response.status,
                    detail: errorText
                }),
                {
                    status: 502,
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-store"
                    }
                }
            );
        }


        // ==============================
        // 6. 응답 JSON
        // ==============================

        const data =
            await response.json();


        // Responses API의 output_text 추출
        const answer =
            data.output_text ||
            data.output
                ?.flatMap(item => item.content || [])
                ?.map(item => item.text)
                ?.filter(Boolean)
                ?.join("\n") ||
            "죄송합니다. 답변을 생성하지 못했습니다.";


        // ==============================
        // 7. 브라우저로 반환
        // ==============================

        return new Response(
            JSON.stringify({
                answer: answer
            }),
            {
                status: 200,

                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store"
                }
            }
        );


    } catch (error) {

        console.error(
            "Chat Function Error:",
            error
        );

        return new Response(
            JSON.stringify({
                error: "일시적인 오류가 발생했습니다."
            }),
            {
                status: 500,

                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }
}