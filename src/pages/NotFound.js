import { createElement } from "../utils/helpers.js";

export default function NotFound() {
  return createElement(`
    <div class="page not-found-page">
      <h1>404 - Page Not Found</h1>
    </div>
  `);
}
