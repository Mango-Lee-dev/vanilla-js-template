import AppStore from "../../store/AppStore.js";
import {
  createElement,
  formatDate,
  truncateText,
} from "../../utils/helpers.js";

// 상수 분리
const CONSTANTS = {
  TRUNCATE_LENGTH: 120,
  ANIMATION_DURATION: 150,
  MESSAGES: {
    NO_POSTS: "게시글이 없습니다",
    NO_POSTS_DESC: "첫 번째 게시글을 작성해보세요!",
    NO_RESULTS: "검색 결과가 없습니다",
    SEARCH_PLACEHOLDER: "검색어를 입력해주세요.",
  },
};

// 렌더링 함수들
const renderEmptyState = (title, description) => `
  <div class="no-posts">
    <h3>${title}</h3>
    <p>${description}</p>
  </div>
`;

const renderNoSearchResults = (query) => `
  <div class="no-results">
    <h3>${CONSTANTS.MESSAGES.NO_RESULTS}</h3>
    <p>"${query}"에 대한 게시글을 찾을 수 없습니다.</p>
    <button onclick="location.reload()" class="btn btn-primary">전체 목록 보기</button>
  </div>
`;

const renderPostHeader = (post) => `
  <header class="flex w-full justify-between">
    <h3 class="text-xl font-bold">${post.title}</h3>
    <div class="flex gap-2">
      <span class="text-sm text-gray-500">✍️ ${post.author}</span>
      <span class="text-sm text-gray-500">🕒 ${formatDate(
        post.createdAt
      )}</span>
    </div>
  </header>
`;

const renderPostContent = (post) => `
  <div class="post-content">
    <p>${truncateText(post.content, CONSTANTS.TRUNCATE_LENGTH)}</p>
  </div>
`;

const renderPostFooter = (post) => `
    <footer class="post-footer">
      <div class="post-stats">
        <span class="stat-item views">👁️ ${post.views || 0}</span>
        <span class="stat-item likes">❤️ ${post.likes || 0}</span>
        <span class="stat-item comments">💬 ${post.comments?.length || 0}</span>
      </div>
      <div class="w-full flex flex-row items-start justify-center gap-2">
        <button class="btn btn-like" data-post-id="${
          post.id
        }" data-action="like">
          👍 좋아요
        </button>
        <button class="btn btn-secondary" data-post-id="${
          post.id
        }" data-action="view">
          자세히 보기
        </button>
      </div>
  </footer>
`;

const renderPost = (post) => `
  <article class="flex w-full flex-col gap-2 items-start justify-center" data-post-id="${
    post.id
  }">
    ${renderPostHeader(post)}
    ${renderPostContent(post)}
    ${renderPostFooter(post)}
  </article>
`;

const renderPosts = (posts) => {
  if (posts.length === 0) {
    return renderEmptyState(
      CONSTANTS.MESSAGES.NO_POSTS,
      CONSTANTS.MESSAGES.NO_POSTS_DESC
    );
  }
  return posts.map(renderPost).join("");
};

const renderStats = (stats) => {
  const statItems = [
    { label: "총 게시글", value: stats.totalPosts },
    { label: "총 조회수", value: stats.totalViews },
    { label: "총 좋아요", value: stats.totalLikes },
  ];

  return statItems
    .map(
      ({ label, value }) => `
    <div class="stat-card">
      <span class="stat-number">${value}</span>
      <span class="stat-label">${label}</span>
    </div>
  `
    )
    .join("");
};

const renderSelectOptions = (options, selectedValue) =>
  options
    .map(
      ({ value, label }) =>
        `<option value="${value}" ${
          selectedValue === value ? "selected" : ""
        }>${label}</option>`
    )
    .join("");

const renderSortControl = (globalState) => {
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "mostViewed", label: "조회수순" },
    { value: "mostLiked", label: "좋아요순" },
    { value: "titleAsc", label: "제목순" },
  ];

  return `
    <div class="flex w-full flex-col gap-2 items-start justify-center">
      <label for="sort-select">🔄 정렬:</label>
      <select id="sort-select" class="select-control">
        ${renderSelectOptions(sortOptions, globalState.sortBy)}
      </select>
    </div>
  `;
};

const renderFilterControl = (globalState) => {
  const filterOptions = [
    { value: "all", label: "전체" },
    { value: "today", label: "오늘" },
    { value: "thisWeek", label: "이번 주" },
    { value: "popular", label: "인기글" },
  ];

  return `
    <div class="control-group">
      <label for="filter-select">🔍 필터:</label>
      <select id="filter-select" class="select-control">
        ${renderSelectOptions(filterOptions, globalState.filterBy)}
      </select>
    </div>
  `;
};

const renderSearchControl = () => `
  <div class="control-group">
    <input 
      type="text" 
      id="search-input" 
      placeholder="제목, 내용, 작성자 검색..." 
      class="search-input"
    />
    <button id="search-btn" class="btn btn-search">🔍</button>
  </div>
`;

const renderActionButtons = () => `
  <div class="controls-right">
    <button id="new-post-btn" class="btn btn-primary">
      ✍️ 새 글 작성
    </button>
    <button id="refresh-btn" class="btn btn-secondary">
      🔄 새로고침
    </button>
  </div>
`;

const renderHeader = (stats) => `
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

const renderControlsSection = (globalState) => `
  <section class="flex w-full flex-col gap-5 items-start justify-center">
    <div class="flex w-full flex-col gap-2 items-start justify-center">
      ${renderSortControl(globalState)}
      ${renderFilterControl(globalState)}
      ${renderSearchControl()}
    </div>
    ${renderActionButtons()}
  </section>
`;

const renderMainContent = (posts) => `
  <main class="flex w-full flex-col gap-5 py-[50px]">
    <div id="post-container" class="flex flex-col gap-5">
      ${renderPosts(posts)}
    </div>
  </main>
`;

const renderFooter = (globalState) => `
  <footer class="board-footer">
    <div class="footer-info">
      <p>💡 <strong>Tip:</strong> 게시글을 클릭하면 자세한 내용을 볼 수 있습니다.</p>
      <p>현재 테마: ${globalState.theme} | 정렬: ${globalState.sortBy} | 필터: ${globalState.filterBy}</p>
    </div>
  </footer>
`;

// 유틸리티 함수들
const showError = (message) => alert(message);

const animateButton = (button) => {
  button.style.transform = "scale(1.1)";
  setTimeout(() => {
    button.style.transform = "scale(1)";
  }, CONSTANTS.ANIMATION_DURATION);
};

const updateStats = (element, postManager) => {
  const stats = postManager.getStats();
  const statCards = element.querySelectorAll(".stat-card .stat-number");

  if (statCards.length >= 3) {
    statCards[0].textContent = stats.totalPosts;
    statCards[1].textContent = stats.totalViews;
    statCards[2].textContent = stats.totalLikes;
  }
};

const getNewPostData = () => {
  const title = prompt("📝 제목을 입력하세요:");
  if (!title?.trim()) return null;

  const content = prompt("📄 내용을 입력하세요:");
  if (!content?.trim()) return null;

  const author = prompt("✍️ 작성자명을 입력하세요 (선택사항):") || "익명";

  return { title, content, author };
};

const getSearchQuery = (element) => {
  const searchInput = element.querySelector("#search-input");
  const query = searchInput.value.trim();

  if (!query) {
    alert(CONSTANTS.MESSAGES.SEARCH_PLACEHOLDER);
    return null;
  }

  return query;
};

// 이벤트 핸들러 함수들
const createEventHandlers = (element, postManager, store) => {
  const handleLikePost = (postId, buttonElement) => {
    try {
      const newLikes = postManager.likePost(postId);

      // UI 즉시 업데이트
      const likesElement = buttonElement
        .closest(".post-card")
        .querySelector(".likes");
      if (likesElement) {
        likesElement.textContent = `❤️ ${newLikes}`;
      }

      updateStats(element, postManager);
      animateButton(buttonElement);

      console.log(`게시글 ${postId} 좋아요! (총 ${newLikes}개)`);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleViewPost = (postId) => {
    try {
      const post = postManager.getPost(postId);

      // 조회수 증가 반영
      const viewsElement = element.querySelector(
        `[data-post-id="${postId}"] .views`
      );
      if (viewsElement) {
        viewsElement.textContent = `👁️ ${post.views}`;
      }

      updateStats(element, postManager);

      console.log(`게시글 ${postId} 조회:`, post);
      alert(
        `게시글 조회:\n\n제목: ${post.title}\n내용: ${post.content}\n작성자: ${post.author}`
      );
    } catch (error) {
      showError(error.message);
    }
  };

  const handleNewPost = () => {
    const postData = getNewPostData();
    if (!postData) return;

    try {
      const newPostId = postManager.addPost(postData);
      console.log("새 게시글 작성됨:", newPostId);
      location.reload();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleSearch = () => {
    const query = getSearchQuery(element);
    if (!query) return;

    try {
      const searchResults = postManager.searchPosts(query);
      console.log(`"${query}" 검색 결과:`, searchResults);

      const postContainer = element.querySelector("#post-container");
      postContainer.innerHTML =
        searchResults.length === 0
          ? renderNoSearchResults(query)
          : renderPosts(searchResults);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleRefresh = () => location.reload();

  return {
    handleLikePost,
    handleViewPost,
    handleNewPost,
    handleSearch,
    handleRefresh,
  };
};

// 이벤트 리스너 설정
const setupEventListeners = (element, postManager, store) => {
  const handlers = createEventHandlers(element, postManager, store);

  const handleClick = (e) => {
    const { target } = e;
    const action = target.dataset.action;
    const postId = target.dataset.postId;

    // 액션 기반 이벤트 처리
    if (action === "like") {
      handlers.handleLikePost(postId, target);
    } else if (action === "view") {
      handlers.handleViewPost(postId);
    }
    // ID 기반 이벤트 처리
    else if (target.id === "new-post-btn") {
      handlers.handleNewPost();
    } else if (target.id === "search-btn") {
      handlers.handleSearch();
    } else if (target.id === "refresh-btn") {
      handlers.handleRefresh();
    }
    // 포스트 카드 클릭 (버튼이 아닌 경우)
    else if (target.closest(".post-card") && !target.matches("button")) {
      const card = target.closest(".post-card");
      handlers.handleViewPost(card.dataset.postId);
    }
  };

  const handleChange = (e) => {
    const { target } = e;

    if (target.id === "sort-select") {
      store.updateGlobalState({ sortBy: target.value });
      console.log("정렬 변경:", target.value);
      postManager.sortPosts(target.value);
    } else if (target.id === "filter-select") {
      store.updateGlobalState({ filterBy: target.value });
      console.log("필터 변경:", target.value);
      // TODO: 실제 필터 로직 구현
    }
  };

  const handleKeypress = (e) => {
    if (e.key === "Enter" && e.target.id === "search-input") {
      handlers.handleSearch();
    }
  };

  // 이벤트 리스너 등록
  element.addEventListener("click", handleClick);
  element.addEventListener("change", handleChange);
  element.addEventListener("keypress", handleKeypress);
};

// 메인 Home 함수
function Home() {
  const store = new AppStore();
  const postManager = store.getPostManager();

  const posts = postManager.getAllPosts();
  const stats = postManager.getStats();
  const globalState = store.getGlobalState();

  // PostManager의 변경사항을 구독
  const unsubscribe = postManager.subscribe((updatedPosts) => {
    const postContainer = document.getElementById("post-container");
    if (postContainer) {
      postContainer.innerHTML = renderPosts(updatedPosts);
    }
  });

  // 페이지 언로드 시 구독 해제
  window.addEventListener("unload", () => {
    unsubscribe();
  });

  // 메인 템플릿 생성
  const element = createElement(`
    <div class="flex flex-col gap-5 w-full max-w-[1280px] mx-auto items-center justify-center py-[50px]">
      ${renderHeader(stats)}
      ${renderControlsSection(globalState)}
      ${renderMainContent(posts)}
      ${renderFooter(globalState)}
    </div>
  `);

  // 이벤트 리스너 설정
  setupEventListeners(element, postManager, store);

  return element;
}

export default Home;
