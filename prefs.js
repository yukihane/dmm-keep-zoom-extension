const enabled = document.getElementById("enabled");
const width = document.getElementById("width");
const height = document.getElementById("height");
const obtain_current = document.getElementById("obtain_current");
const save = document.getElementById("save");

obtain_current.addEventListener("click", () => {
  console.log("clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      "obtain-current-value",
      function (response) {
        width.value = response ? response.width : "";
        height.value = response ? response.height : "";
      }
    );
  });
});

save.addEventListener("click", () => {
  chrome.storage.sync.set({
    enabled: enabled.checked,
    width: width.value,
    height: height.value,
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    {
      enabled: false,
      width: "",
      height: "",
    },
    (prefs) => {
      enabled.checked = prefs.enabled;
      width.value = prefs.width;
      height.value = prefs.height;
    }
  );
});
