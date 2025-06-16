import { FortuneBookCard } from "@/components/ui/common/FortuneBookCard"; // ✅ 1. 방금 만든 카드 부품을 가져온다.

// ✅ 2. 보관함에 표시할 임시 데이터. 실제로는 로그인된 사용자의 정보를 기반으로 서버에서 받아오게 된다.
const mockArchiveData = [
  {
    id: 1,
    imageUrl: "https://placehold.co/192x288/D1B681/1B1F2A?text=SAJU", // 황금색 책 표지
    title: "나의 2025년 종합사주",
    author: "(주)사주너머",
    savedDate: "2025.06.12",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/192x288/A0B2E6/1B1F2A?text=LOVE", // 라벤더색 책 표지
    title: "그 사람과의 애정운세",
    author: "(주)사주너머",
    savedDate: "2025.06.10",
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/192x288/6B7280/1B1F2A?text=WEALTH", // 회색 책 표지
    title: "나의 평생 재물운",
    author: "(주)사주너머",
    savedDate: "2025.05.28",
  },
];

/**
 * 유료로 구매한 운세 결과를 보관하고 다시 볼 수 있는 페이지.
 */
const FortuneArchivePage = () => {
  // '다시보기' 버튼 클릭 시 실행될 임시 함수
  const handleViewFortune = (title: string) => {
    alert(`'${title}' 운세 결과 페이지로 이동합니다.`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 text-text-light">
      <div className="text-left mb-12">
        <h1 className="text-h1-xl sm:text-4xl font-bold">운세 보관함</h1>
        <p className="text-body-md text-text-muted mt-2">
          내가 본 운세 결과를 이곳에서 다시 확인할 수 있습니다.
        </p>
      </div>

      {/* ✅ 3. 운세 책 카드 목록을 조립한다. */}
      <div className="space-y-6">
        {mockArchiveData.length > 0 ? (
          mockArchiveData.map((item) => (
            <FortuneBookCard
              key={item.id}
              imageUrl={item.imageUrl}
              title={item.title}
              author={item.author}
              savedDate={item.savedDate}
              onViewClick={() => handleViewFortune(item.title)}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-background-sub rounded-lg">
            <p className="text-text-muted">보관된 운세가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FortuneArchivePage;
