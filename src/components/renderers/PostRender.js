import { CONSTANTS } from "../../lib/constants/home";
import { formatDate } from "../../lib/utils/helpers";

export const renderPostHeader = (post) => `
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

export const renderPostContent = (post) => `
  <div class="post-content">
    <p>${truncateText(post.content, CONSTANTS.TRUNCATE_LENGTH)}</p>
  </div>
`;

export const renderPostFooter = (post) => `
  <footer class="post-footer">
    <div class="post-stats">
      <span class="stat-item views">👁️ ${post.views || 0}</span>
      <span class="stat-item likes">❤️ ${post.likes || 0}</span>
      <span class="stat-item comments">💬 ${post.comments?.length || 0}</span>
    </div>
    <div class="w-full flex flex-row items-start justify-center gap-2">
      <button class="btn btn-like" data-post-id="${post.id}" data-action="like">
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

export const renderPost = (post) => `
  <article class="flex w-full flex-col gap-2 items-start justify-center border-2 border-gray-300 bg-gray-100 rounded-md p-4" data-post-id="${
    post.id
  }">
    ${renderPostHeader(post)}
    ${renderPostContent(post)}
    ${renderPostFooter(post)}
  </article>
`;

export const renderPosts = (posts) => {
  if (posts.length === 0) {
    return renderEmptyState(
      CONSTANTS.MESSAGES.NO_POSTS,
      CONSTANTS.MESSAGES.NO_POSTS_DESC
    );
  }
  return posts.map(renderPost).join("");
};
