import { routes } from "./routes.js";

export default class Router {
  constructor(appContainer) {
    this.routes = routes;
    this.appContainer = appContainer;
    console.log("Router 생성됨:", { appContainer, routes }); // 디버그 로그
  }

  init() {
    console.log("Router 초기화 시작"); // 디버그 로그

    // 이벤트 리스너 등록
    window.addEventListener("popstate", () => this.handleRoute());
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.href);
      }
    });

    // 첫 번째 라우트 처리
    this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;
    console.log("현재 경로:", path); // 디버그 로그

    const route = this.routes[path] || this.routes["/404"] || this.routes["/"];
    console.log("찾은 라우트:", route); // 디버그 로그

    if (!route) {
      console.error("라우트를 찾을 수 없습니다:", path);
      this.appContainer.innerHTML = "<div>페이지를 찾을 수 없습니다.</div>";
      return;
    }

    try {
      console.log("라우트 컴포넌트 로딩 중..."); // 디버그 로그
      const component = await route();
      console.log("컴포넌트 로드 완료:", component); // 디버그 로그

      if (component) {
        this.appContainer.innerHTML = "";
        this.appContainer.appendChild(component);
        console.log("컴포넌트 렌더링 완료"); // 디버그 로그
      } else {
        console.error("컴포넌트가 null 또는 undefined입니다");
        this.appContainer.innerHTML = "<div>컴포넌트 로드 실패</div>";
      }
    } catch (error) {
      console.error("라우트 처리 중 오류:", error);
      this.appContainer.innerHTML = `
        <div class="error-page">
          <h1>오류가 발생했습니다</h1>
          <p>${error.message}</p>
          <pre>${error.stack}</pre>
        </div>
      `;
    }
  }

  navigateTo(url) {
    window.history.pushState(null, null, url);
    this.handleRoute();
  }
}
