import { routes } from "./routes.js";

export default class Router {
  constructor(appContainer) {
    this.routes = routes;
    this.appContainer = appContainer;
  }

  init() {
    window.addEventListener("popstate", () => this.handleRoute());
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.href);
      }
    });
    this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;

    const route = this.routes[path] || this.routes["/"] || this.routes["/404"];

    if (!route) {
      console.error("라우트를 찾을 수 없습니다:", path);
      this.appContainer.innerHTML = "<div>페이지를 찾을 수 없습니다.</div>";
      return;
    }

    try {
      const component = await route();

      if (component) {
        this.appContainer.innerHTML = "";
        this.appContainer.appendChild(component);
      } else {
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
