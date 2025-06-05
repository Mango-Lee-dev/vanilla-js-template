export const renderSelectOptions = (options, selectedValue) =>
  options
    .map(
      ({ value, label }) =>
        `<option value="${value}" ${
          selectedValue === value ? "selected" : ""
        }>${label}</option>`
    )
    .join("");

export const renderSortControl = (globalState) => {
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

export const renderFilterControl = (globalState) => {
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

export const renderSearchControl = () => `
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

export const renderActionButtons = () => `
  <div class="controls-right">
    <button id="new-post-btn" class="btn btn-primary">
      ✍️ 새 글 작성
    </button>
    <button id="refresh-btn" class="btn btn-secondary">
      🔄 새로고침
    </button>
  </div>
`;
