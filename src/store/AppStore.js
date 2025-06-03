import PostManager from "../modules/PostManager.js";

class AppStore {
  static #instance = null;
  #postManager = null;

  constructor() {
    if (AppStore.#instance) {
      return AppStore.#instance;
    }

    this.#postManager = new PostManager();
    this.#postManager.initDummyData();

    AppStore.#instance = this;
  }

  getPostManager() {
    return this.#postManager;
  }

  #globalState = {
    currentUser: null,
    theme: "light",
    sortBy: "latest",
    filterBy: "all",
  };

  getGlobalState() {
    return { ...this.#globalState };
  }

  updateGlobalState(updates) {
    this.#globalState = { ...this.#globalState, ...updates };
  }
}

export default AppStore;
