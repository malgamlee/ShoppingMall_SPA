import { app } from "./app";

const appEl = document.getElementById("page");

app(appEl);
window.addEventListener("popstate", () => {
  app(appEl);
});
