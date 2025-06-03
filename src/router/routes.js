import Home from "../pages/Home/Home.js"; // 이 줄을 추가!

export const routes = {
  "/": async () => {
    console.log("Home 컴포넌트 로딩 시도...");
    try {
      // Dynamic import 사용
      const { default: Home } = await import("../pages/Home/Home.js");
      console.log("Home 모듈 로드 완료:", Home);
      const homeElement = Home();
      console.log("Home 엘리먼트 생성 완료:", homeElement);
      return homeElement;
    } catch (error) {
      console.error("Home 컴포넌트 로드 실패:", error);
      throw error;
    }
  },

  "/404": async () => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div class="not-found">
        <h1>404 - 페이지를 찾을 수 없습니다</h1>
        <p>요청하신 페이지가 존재하지 않습니다.</p>
        <a href="/" data-link>홈으로 돌아가기</a>
      </div>
    `;
    return element;
  },
};
