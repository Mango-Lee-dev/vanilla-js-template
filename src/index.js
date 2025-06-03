import App from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    const app = new App();

    if (app) {
      app.init();
    } else {
      console.error("App 인스턴스 생성 실패");
    }
  } catch (error) {
    console.error("앱 초기화 실패:", error);
    const appContainer = document.getElementById("app");
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="critical-error">
          <h1>앱을 시작할 수 없습니다</h1>
          <p>콘솔을 확인해주세요: ${error.message}</p>
          <button onclick="location.reload()">다시 시도</button>
        </div>
      `;
    }
  }
});
