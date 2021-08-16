const enabled = document.getElementById("enabled");
const width = document.getElementById("width");
const height = document.getElementById("height");
const obtain_current = document.getElementById("obtain_current");
const save = document.getElementById("save");

save.addEventListener("click", () => {
  chrome.storage.sync.set({
    enabled: enabled.checked,
  });
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    {
      enabled: false,
    },
    (prefs) => {
      console.log("prefs.enabled: " + prefs.enables);
      enabled.checked = prefs.enabled;
    }
  );
});
