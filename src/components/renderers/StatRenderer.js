import { CONSTANTS } from "../../lib/constants/home.js";

export const renderEmptyState = (title, description) => `
  <div class="no-posts">
    <h3>${title}</h3>
    <p>${description}</p>
  </div>
`;

export const renderNoSearchResults = (query) => `
  <div class="no-results">
    <h3>${CONSTANTS.MESSAGES.NO_RESULTS}</h3>
    <p>"${query}"에 대한 게시글을 찾을 수 없습니다.</p>
    <button onclick="location.reload()" class="btn btn-primary">전체 목록 보기</button>
  </div>
`;

export const renderStats = (stats) => {
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
