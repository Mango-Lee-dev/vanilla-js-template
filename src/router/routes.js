export const routes = {
  "/": async () => {
    try {
      const { default: Home } = await import("../pages/Home/Home.js");
      const homeElement = Home();
      return homeElement;
    } catch (error) {
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
