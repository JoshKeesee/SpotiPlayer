document.addEventListener("DOMContentLoaded", init, false);
function init() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
}