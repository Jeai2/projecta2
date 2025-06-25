// src/hooks/use-media-query.ts (새 파일)

import { useState, useEffect } from "react";

/**
 * 미디어 쿼리 문자열을 받아 화면 크기 변경을 감지하는 커스텀 훅.
 * @param query - 예: "(min-width: 1024px)"
 * @returns 쿼리 조건 충족 여부를 boolean 값으로 반환.
 */
export function useMediaQuery(query: string): boolean {
  // 1. 미디어 쿼리 매칭 상태를 저장할 state
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 2. 컴포넌트가 마운트될 때, 현재 화면 크기가 쿼리와 일치하는지 확인
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // 3. 화면 크기가 변경될 때마다 상태를 업데이트하는 리스너 등록
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);

    // 4. 컴포넌트가 언마운트될 때, 리스너를 정리하여 메모리 누수 방지
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}
