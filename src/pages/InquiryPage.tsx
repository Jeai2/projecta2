import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/common/Accordion";

// FAQ 데이터 (이전과 동일)
const faqData = [
  {
    id: "item-1",
    question: "결제는 어떻게 하나요?",
    answer:
      "현재 저희 서비스는 포인트 기반으로 운영되며, 포인트 충전은 계좌 이체 또는 제휴된 결제 플랫폼을 통해 가능합니다. 자세한 내용은 결제 페이지를 참고해주세요.",
  },
  {
    id: "item-2",
    question: "운세 결과는 언제든지 다시 볼 수 있나요?",
    answer:
      "네, 구매한 운세 결과는 '운세 보관함' 메뉴에서 언제든지 다시 확인하실 수 있습니다. 보관 기간은 결제일로부터 1년입니다.",
  },
  {
    id: "item-3",
    question: "회원 탈퇴는 어떻게 하나요?",
    answer:
      "회원 탈퇴는 '프로필' 페이지 하단의 '회원 탈퇴' 버튼을 통해 진행할 수 있습니다. 탈퇴 시 모든 개인 정보와 운세 결과는 복구 불가능하게 삭제됩니다.",
  },
  {
    id: "item-4",
    question: "오류가 발생했는데 어떻게 하죠?",
    answer:
      "서비스 이용 중 오류가 발생했다면, 고객센터 이메일(help@jjhome.com)으로 오류 화면을 캡쳐하여 보내주시거나, '1:1 문의'를 통해 내용을 남겨주시면 신속하게 처리해드리겠습니다.",
  },
];

// ✅ 1. 공지사항에 표시할 임시 데이터 추가
const noticeData = [
  { id: 1, title: "[안내] 개인정보 처리방침 개정 안내", date: "2025.06.10" },
  {
    id: 2,
    title: "[이벤트] 신규 가입 회원 대상 3,000 포인트 지급 이벤트",
    date: "2025.06.01",
  },
  {
    id: 3,
    title:
      "[점검] 서버 안정화 작업을 위한 시스템 점검 안내 (06/15 02:00 ~ 04:00)",
    date: "2025.05.28",
  },
  { id: 4, title: "[오픈] jjhome 운세 서비스 정식 오픈!", date: "2025.05.25" },
];

/**
 * 공지사항 및 자주 묻는 질문(FAQ)을 포함하는 문의사항 페이지.
 */
const InquiryPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 text-text-light">
      <div className="text-center mb-12">
        <h1 className="text-h1-xl sm:text-4xl font-bold">고객센터</h1>
        <p className="text-body-md text-text-muted mt-2">
          무엇을 도와드릴까요?
        </p>
      </div>

      <div className="space-y-12">
        {/* FAQ 섹션 */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-left">
            자주 묻는 질문 (FAQ)
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full bg-background-sub rounded-lg p-2"
          >
            {faqData.map((faq) => (
              <AccordionItem value={faq.id} key={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ✅ 2. 공지사항 섹션 추가 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-left">공지사항</h2>
            <a
              href="#"
              className="text-sm text-text-muted hover:text-accent-gold"
            >
              더보기 &gt;
            </a>
          </div>
          <div className="bg-background-sub rounded-lg p-4">
            <ul className="space-y-4">
              {noticeData.map((notice) => (
                <li
                  key={notice.id}
                  className="flex justify-between items-center pb-2 border-b border-b-white/5 last:border-b-0"
                >
                  <a
                    href="#"
                    className="hover:text-accent-gold transition-colors truncate pr-4"
                  >
                    {notice.title}
                  </a>
                  <span className="text-sm text-text-muted flex-shrink-0">
                    {notice.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InquiryPage;
