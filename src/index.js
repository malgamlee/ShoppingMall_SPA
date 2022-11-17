import { app } from "./app.js";

const appEl = document.getElementById("page");

app(appEl);
window.addEventListener("popstate", () => {
  app(appEl);
});
