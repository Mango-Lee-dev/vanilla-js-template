import Router from "./router/Router.js";

class App {
  constructor() {
    this.appContainer = document.getElementById("app");

    if (!this.appContainer) {
      return;
    }

    this.router = new Router(this.appContainer);
  }

  init() {
    try {
      if (!this.router) {
        return;
      }

      this.router.init();
      setTimeout(() => {
        this.hideLoading();
      }, 100);
    } catch (error) {
      console.error("App 초기화 중 오류:", error);
      this.showError(error);
    }
  }

  hideLoading() {
    const loading = document.getElementById("loading");

    if (loading) {
      loading.style.display = "none";
    } else {
      console.warn("로딩 요소를 찾을 수 없습니다");
    }
  }

  showError(error) {
    if (this.appContainer) {
      this.appContainer.innerHTML = `
        <div class="app-error">
          <h1>애플리케이션 오류</h1>
          <p>${error.message}</p>
          <button onclick="location.reload()">새로고침</button>
        </div>
      `;
    }
    this.hideLoading();
  }
}

export default App;
