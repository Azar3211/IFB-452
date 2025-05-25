function showLoader() {
  document.getElementById("loaderOverlay").classList.remove("hidden");
}
function hideLoader() {
  document.getElementById("loaderOverlay").classList.add("hidden");
}
export { showLoader, hideLoader };