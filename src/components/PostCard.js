export const PostCard = (function () {
  const defaultOptions = {
    showAuthor: true,
    showDate: true,
    showStats: true,
    truncateContent: true,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR");
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const createCardElement = (post, options) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "post-card";

    cardDiv.dataset.postId = post.id;

    const titleElement = options.showAuthor
      ? `<span class="post-author">${post.author}</span>`
      : "";

    const dateElement = options.showDate
      ? `<span class="post-date">${formatDate(post.createdAt)}</span>`
      : "";

    const statsElement = options.showStats
      ? `<div class="post-stats">
        <span class="views">👁 ${post.views || 0}</span>
        <span class="likes">❤️ ${post.likes || 0}</span>
      </div>`
      : "";

    cardDiv.innerHTML = `
      <div class="post-header">
        <h3 class="post-title">${post.title}</h3>
        <div class="post-meta">
          ${titleElement}
          ${dateElement}
        </div>
      </div>
      <div class="post-content">
        ${truncateText(post.content, options.truncateContent)}
      </div>
      <div class="post-footer">
        ${statsElement}
        <button class="btn-like" data-post-id="${post.id}">좋아요</button>
      </div>
    `;

    return cardDiv;
  };

  const addEventListeners = (cardElement, callbacks) => {
    cardElement.addEventListener("click", (e) => {
      if (e.target.matches(".btn-like")) {
        const postId = e.target.dataset.postId;
        if (callbacks.onLike) {
          callbacks.onLike(postId);
        }
      } else {
        const postId = cardElement.dataset.postId;
        if (callbacks.onCardClick) {
          callbacks.onCardClick(postId);
        }
      }
    });
  };

  return {
    create(post, options = {}, callbacks = {}) {
      const mergedOptions = { ...defaultOptions, ...options };
      const cardElement = createCardElement(post, mergedOptions);
      addEventListeners(cardElement, callbacks);
      return cardElement;
    },
    createList(posts, options = {}, callbacks = {}) {
      const listContainer = document.createElement("div");
      listContainer.className = "post-list";

      posts.forEach((post) => {
        const card = this.create(post, options, callbacks);
        listContainer.appendChild(card);
      });
      return listContainer;
    },
    updateStats(cardElement, post) {
      const viewsEl = cardElement.querySelector(".views");
      const likesEl = cardElement.querySelector(".likes");

      if (viewsEl) viewsEl.textContent = `👁 ${post.views || 0}`;
      if (likesEl) likesEl.textContent = `❤️ ${post.likes || 0}`;
    },
  };
})();

export default PostCard;
