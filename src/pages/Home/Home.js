import AppStore from "../../store/AppStore.js";

import {
  createElement,
  formatDate,
  truncateText,
} from "../../utils/helpers.js";

function Home() {
  // Singleton 패턴으로 PostManager 인스턴스 가져오기
  const store = new AppStore();
  const postManager = store.getPostManager();

  // 현재 데이터 가져오기
  const posts = postManager.getAllPosts();
  const stats = postManager.getStats();
  const globalState = store.getGlobalState();

  // 게시글 목록 렌더링
  function renderPosts(posts) {
    if (posts.length === 0) {
      return `
        <div class="no-posts">
          <h3>게시글이 없습니다</h3>
          <p>첫 번째 게시글을 작성해보세요!</p>
        </div>
      `;
    }

    return posts
      .map(
        (post) => `
      <article class="post-card" data-post-id="${post.id}">
        <header class="post-header">
          <h3 class="post-title">${post.title}</h3>
          <div class="post-meta">
            <span class="post-author">✍️ ${post.author}</span>
            <span class="post-date">🕒 ${formatDate(post.createdAt)}</span>
          </div>
        </header>
        
        <div class="post-content">
          <p>${truncateText(post.content, 120)}</p>
        </div>
        
        <footer class="post-footer">
          <div class="post-stats">
            <span class="stat-item views">👁️ ${post.views || 0}</span>
            <span class="stat-item likes">❤️ ${post.likes || 0}</span>
            <span class="stat-item comments">💬 ${
              post.comments?.length || 0
            }</span>
          </div>
          <div class="post-actions">
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
      </article>
    `
      )
      .join("");
  }

  // 메인 템플릿 리터럴 반환
  const element = createElement(`
    <div class="board-page">
      <!-- Header Section -->
      <header class="board-header">
        <div class="header-content">
          <h1>📝 개발자 게시판</h1>
          <p class="header-subtitle">함께 성장하는 개발 커뮤니티</p>
        </div>
        <div class="board-stats">
          <div class="stat-card">
            <span class="stat-number">${stats.totalPosts}</span>
            <span class="stat-label">총 게시글</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${stats.totalViews}</span>
            <span class="stat-label">총 조회수</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${stats.totalLikes}</span>
            <span class="stat-label">총 좋아요</span>
          </div>
        </div>
      </header>

      <!-- Controls Section -->
      <section class="board-controls">
        <div class="controls-left">
          <div class="control-group">
            <label for="sort-select">🔄 정렬:</label>
            <select id="sort-select" class="select-control">
              <option value="latest" ${
                globalState.sortBy === "latest" ? "selected" : ""
              }>최신순</option>
              <option value="mostViewed" ${
                globalState.sortBy === "mostViewed" ? "selected" : ""
              }>조회수순</option>
              <option value="mostLiked" ${
                globalState.sortBy === "mostLiked" ? "selected" : ""
              }>좋아요순</option>
              <option value="titleAsc" ${
                globalState.sortBy === "titleAsc" ? "selected" : ""
              }>제목순</option>
            </select>
          </div>
          
          <div class="control-group">
            <label for="filter-select">🔍 필터:</label>
            <select id="filter-select" class="select-control">
              <option value="all" ${
                globalState.filterBy === "all" ? "selected" : ""
              }>전체</option>
              <option value="today" ${
                globalState.filterBy === "today" ? "selected" : ""
              }>오늘</option>
              <option value="thisWeek" ${
                globalState.filterBy === "thisWeek" ? "selected" : ""
              }>이번 주</option>
              <option value="popular" ${
                globalState.filterBy === "popular" ? "selected" : ""
              }>인기글</option>
            </select>
          </div>

          <div class="control-group">
            <input 
              type="text" 
              id="search-input" 
              placeholder="제목, 내용, 작성자 검색..." 
              class="search-input"
            />
            <button id="search-btn" class="btn btn-search">🔍</button>
          </div>
        </div>

        <div class="controls-right">
          <button id="new-post-btn" class="btn btn-primary">
            ✍️ 새 글 작성
          </button>
          <button id="refresh-btn" class="btn btn-secondary">
            🔄 새로고침
          </button>
        </div>
      </section>

      <!-- Posts Section -->
      <main class="board-content">
        <div id="post-container" class="post-list">
          ${renderPosts(posts)}
        </div>
      </main>

      <!-- Footer Section -->
      <footer class="board-footer">
        <div class="footer-info">
          <p>💡 <strong>Tip:</strong> 게시글을 클릭하면 자세한 내용을 볼 수 있습니다.</p>
          <p>현재 테마: ${globalState.theme} | 정렬: ${
    globalState.sortBy
  } | 필터: ${globalState.filterBy}</p>
        </div>
      </footer>
    </div>
  `);

  // 이벤트 리스너 설정
  setupEventListeners(element, postManager, store);

  return element;
}

// 이벤트 리스너 설정 함수
function setupEventListeners(element, postManager, store) {
  // 이벤트 위임을 통한 통합 이벤트 처리
  element.addEventListener("click", handleClick);
  element.addEventListener("change", handleChange);
  element.addEventListener("keypress", handleKeypress);

  function handleClick(e) {
    const { target } = e;
    const action = target.dataset.action;
    const postId = target.dataset.postId;

    switch (action) {
      case "like":
        handleLikePost(postId, target);
        break;
      case "view":
        handleViewPost(postId);
        break;
      default:
        if (target.id === "new-post-btn") {
          handleNewPost();
        } else if (target.id === "search-btn") {
          handleSearch();
        } else if (target.id === "refresh-btn") {
          handleRefresh();
        } else if (target.closest(".post-card") && !target.matches("button")) {
          const card = target.closest(".post-card");
          handleViewPost(card.dataset.postId);
        }
    }
  }

  function handleChange(e) {
    const { target } = e;

    if (target.id === "sort-select") {
      store.updateGlobalState({ sortBy: target.value });
      console.log("정렬 변경:", target.value);
      // TODO: 실제 정렬 로직 구현
    } else if (target.id === "filter-select") {
      store.updateGlobalState({ filterBy: target.value });
      console.log("필터 변경:", target.value);
      // TODO: 실제 필터 로직 구현
    }
  }

  function handleKeypress(e) {
    if (e.key === "Enter" && e.target.id === "search-input") {
      handleSearch();
    }
  }

  // 개별 액션 핸들러들
  function handleLikePost(postId, buttonElement) {
    try {
      const newLikes = postManager.likePost(postId);

      // UI 즉시 업데이트
      const likesElement = buttonElement
        .closest(".post-card")
        .querySelector(".likes");
      likesElement.textContent = `❤️ ${newLikes}`;

      // 전체 통계 업데이트
      updateStats();

      // 피드백 효과
      buttonElement.style.transform = "scale(1.1)";
      setTimeout(() => {
        buttonElement.style.transform = "scale(1)";
      }, 150);

      console.log(`게시글 ${postId} 좋아요! (총 ${newLikes}개)`);
    } catch (error) {
      alert(error.message);
    }
  }

  function handleViewPost(postId) {
    try {
      const post = postManager.getPost(postId);

      // 조회수 증가 반영
      const viewsElement = element.querySelector(
        `[data-post-id="${postId}"] .views`
      );
      if (viewsElement) {
        viewsElement.textContent = `👁️ ${post.views}`;
      }

      updateStats();

      console.log(`게시글 ${postId} 조회:`, post);
      // TODO: 상세 페이지로 이동 또는 모달 표시
      alert(
        `게시글 조회:\n\n제목: ${post.title}\n내용: ${post.content}\n작성자: ${post.author}`
      );
    } catch (error) {
      alert(error.message);
    }
  }

  function handleNewPost() {
    const title = prompt("📝 제목을 입력하세요:");
    if (!title?.trim()) return;

    const content = prompt("📄 내용을 입력하세요:");
    if (!content?.trim()) return;

    const author = prompt("✍️ 작성자명을 입력하세요 (선택사항):") || "익명";

    try {
      const newPostId = postManager.addPost({ title, content, author });
      console.log("새 게시글 작성됨:", newPostId);

      // 페이지 새로고침 (실제로는 리렌더링)
      location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleSearch() {
    const searchInput = element.querySelector("#search-input");
    const query = searchInput.value.trim();

    if (!query) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      const searchResults = postManager.searchPosts(query);
      console.log(`"${query}" 검색 결과:`, searchResults);

      // 검색 결과로 게시글 목록 업데이트
      const postContainer = element.querySelector("#post-container");
      postContainer.innerHTML = renderPosts(searchResults);

      // 검색 결과 피드백
      if (searchResults.length === 0) {
        postContainer.innerHTML = `
          <div class="no-results">
            <h3>검색 결과가 없습니다</h3>
            <p>"${query}"에 대한 게시글을 찾을 수 없습니다.</p>
            <button onclick="location.reload()" class="btn btn-primary">전체 목록 보기</button>
          </div>
        `;
      }
    } catch (error) {
      alert(error.message);
    }
  }

  function handleRefresh() {
    location.reload();
  }

  function updateStats() {
    const stats = postManager.getStats();
    const statCards = element.querySelectorAll(".stat-card .stat-number");

    if (statCards.length >= 3) {
      statCards[0].textContent = stats.totalPosts;
      statCards[1].textContent = stats.totalViews;
      statCards[2].textContent = stats.totalLikes;
    }
  }

  // 내부 함수로 renderPosts를 다시 정의 (검색에서 사용)
  function renderPosts(posts) {
    if (posts.length === 0) {
      return `
        <div class="no-posts">
          <h3>게시글이 없습니다</h3>
          <p>첫 번째 게시글을 작성해보세요!</p>
        </div>
      `;
    }

    return posts
      .map(
        (post) => `
      <article class="post-card" data-post-id="${post.id}">
        <header class="post-header">
          <h3 class="post-title">${post.title}</h3>
          <div class="post-meta">
            <span class="post-author">✍️ ${post.author}</span>
            <span class="post-date">🕒 ${formatDate(post.createdAt)}</span>
          </div>
        </header>
        
        <div class="post-content">
          <p>${truncateText(post.content, 120)}</p>
        </div>
        
        <footer class="post-footer">
          <div class="post-stats">
            <span class="stat-item views">👁️ ${post.views || 0}</span>
            <span class="stat-item likes">❤️ ${post.likes || 0}</span>
            <span class="stat-item comments">💬 ${
              post.comments?.length || 0
            }</span>
          </div>
          <div class="post-actions">
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
      </article>
    `
      )
      .join("");
  }
}

export default Home;
