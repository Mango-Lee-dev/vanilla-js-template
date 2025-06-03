class PostManager {
  #posts = [];
  #currentId = 1;
  #subscribers = [];

  // Private methods
  #generateId() {
    return this.#currentId++;
  }

  #findPostIndex(id) {
    return this.#posts.findIndex((post) => post.id === id);
  }

  #notifySubscribers() {
    this.#subscribers.forEach((callback) => callback([...this.#posts]));
  }

  #validatePost(post) {
    if (!post.title || post.title.trim() === "") {
      throw new Error("제목은 필수 요소 입니다.");
    }

    if (!post.content || post.content.trim() === "") {
      throw new Error("내용은 필수 요소 입니다.");
    }

    if (post.title.length > 100) {
      throw new Error("제목은 100자 이하여야 합니다.");
    }
  }

  // Public methods
  getAllPosts() {
    return [...this.#posts];
  }

  getPost(id) {
    const post = this.#posts.find((post) => post.id === parseInt(id));
    if (!post) {
      throw new Error("존재하지 않는 포스트 입니다.");
    }
    post.views = (post.views || 0) + 1;
    this.#notifySubscribers();
    return { ...post };
  }

  addPost(postData) {
    this.#validatePost(postData);
    const newPost = {
      id: this.#generateId(),
      title: postData.title.trim(),
      content: postData.content.trim(),
      author: postData.author || "익명",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: [],
    };

    this.#posts.unshift(newPost);
    this.#notifySubscribers();
    return newPost.id;
  }

  updatePost(id, postData) {
    const index = this.#findPostIndex(parseInt(id));
    if (index === -1) {
      throw new Error("존재하지 않는 포스트 입니다.");
    }

    const updatedPost = {
      ...this.#posts[index],
      ...postData,
      updatedAt: new Date().toISOString(),
    };

    this.#validatePost(updatedPost);
    this.#posts[index] = updatedPost;
    this.#notifySubscribers();
    return true;
  }

  deletePost(id) {
    const index = this.#findPostIndex(parseInt(id));
    if (index === -1) {
      throw new Error("존재하지 않는 포스트 입니다.");
    }

    this.#posts.splice(index, 1);
    this.#notifySubscribers();
    return true;
  }

  likePost(id) {
    const post = this.#posts.find((post) => post.id === parseInt(id));
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.#notifySubscribers();
      return post.likes;
    }
    throw new Error("존재하지 않는 포스트 입니다.");
  }

  subscribe(callback) {
    this.#subscribers.push(callback);
    return () => {
      const index = this.#subscribers.indexOf(callback);
      if (index > -1) {
        this.#subscribers.splice(index, 1);
      }
    };
  }

  searchPosts(query) {
    const lowerKeyword = query.toLowerCase();
    return this.#posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerKeyword) ||
        post.content.toLowerCase().includes(lowerKeyword) ||
        post.author.toLowerCase().includes(lowerKeyword)
    );
  }

  // 통계 정보
  getStats() {
    return {
      totalPosts: this.#posts.length,
      totalViews: this.#posts.reduce((sum, post) => sum + (post.views || 0), 0),
      totalLikes: this.#posts.reduce((sum, post) => sum + (post.likes || 0), 0),
      mostViewedPost: this.#posts.reduce(
        (max, post) => ((post.views || 0) > (max.views || 0) ? post : max),
        this.#posts[0] || null
      ),
    };
  }

  // 개발용 더미 데이터
  initDummyData() {
    if (this.#posts.length === 0) {
      this.addPost({
        title: "게시판에 오신 것을 환영합니다!",
        content:
          "이곳은 자유롭게 의견을 나누는 공간입니다. 정중한 언어 사용을 부탁드립니다.",
        author: "관리자",
      });

      this.addPost({
        title: "JavaScript 클래스와 Private Fields",
        content:
          "ES2022에서 도입된 private fields(#)를 사용하면 진정한 캡슐화를 구현할 수 있습니다. 이전의 convention 기반 접근법보다 훨씬 안전합니다.",
        author: "개발자",
      });

      this.addPost({
        title: "게시판 기능 안내",
        content:
          "새 글 작성, 좋아요, 검색, 정렬, 필터링 기능을 지원합니다. 마크다운 문법도 곧 지원될 예정입니다.",
        author: "운영자",
      });

      this.addPost({
        title: "모던 웹 개발 트렌드",
        content:
          "React, Vue, Angular 같은 프레임워크도 좋지만, Vanilla JavaScript의 기초를 탄탄히 하는 것이 중요합니다.",
        author: "시니어개발자",
      });

      // 조회수와 좋아요 임의 설정
      this.#posts[1].views = 25;
      this.#posts[1].likes = 7;
      this.#posts[2].views = 18;
      this.#posts[2].likes = 3;
      this.#posts[3].views = 12;
      this.#posts[3].likes = 5;
    }
  }
}

export default PostManager;
