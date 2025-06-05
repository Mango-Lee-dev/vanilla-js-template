import { renderStats } from "./StatRenderer.js";
import { renderSortControl } from "./ControlRenderer.js";
import { renderFilterControl } from "./ControlRenderer.js";
import { renderSearchControl } from "./ControlRenderer.js";
import { renderActionButtons } from "./ControlRenderer.js";
import { renderPosts } from "./PostRender.js";

export const renderHeader = (stats) => `
  <header class="flex w-full flex-col gap-2 items-center justify-center">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-extrabold">📝 개발자 게시판</h1>
      <p class="text-sm text-gray-500">함께 성장하는 개발 커뮤니티</p>
    </div>
    <div class="w-full flex items-start flex-col justify-center">
      ${renderStats(stats)}
    </div>
  </header>
`;

export const renderControlsSection = (globalState) => `
  <section class="flex w-full flex-col gap-5 items-start justify-center">
    <div class="flex w-full flex-col gap-2 items-start justify-center">
      ${renderSortControl(globalState)}
      ${renderFilterControl(globalState)}
      ${renderSearchControl()}
    </div>
    ${renderActionButtons()}
  </section>
`;

export const renderMainContent = (posts) => `
  <main class="flex w-full flex-col gap-5 py-[50px]">
    <div id="post-container" class="flex flex-col gap-5">
      ${renderPosts(posts)}
    </div>
  </main>
`;

export const renderFooter = (globalState) => `
  <footer class="board-footer">
    <div class="footer-info">
      <p>💡 <strong>Tip:</strong> 게시글을 클릭하면 자세한 내용을 볼 수 있습니다.</p>
      <p>현재 테마: ${globalState.theme} | 정렬: ${globalState.sortBy} | 필터: ${globalState.filterBy}</p>
    </div>
  </footer>
`;
