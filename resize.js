chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "obtain-current-value") {
    const canvas = document.querySelector("#viewport0 > canvas");
    if (!canvas) {
      sendResponse(null);
    } else {
      console.log("W: " + canvas.clientWidth + ", H: " + canvas.clientHeight);
      sendResponse({ width: canvas.clientWidth, height: canvas.clientHeight });
    }
  }
});

// 変更を監視するノードを選択
const targetNode = document.body;

// (変更を監視する) オブザーバーのオプション
const config = { attributes: false, childList: true, subtree: true };

// https://stackoverflow.com/a/175787/4506703 より
const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

// 変更が発見されたときに実行されるコールバック関数
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.target.id === "viewer") {
      if (mutation.addedNodes) {
        const renderer = Array.from(mutation.addedNodes).filter(
          (element, index) => {
            return element.id === "renderer";
          }
        );
        if (renderer.length) {
          const canvases = [
            renderer[0].querySelector("#viewport0 > canvas"),
            renderer[0].querySelector("#viewport1 > canvas"),
          ];
          const sizes = canvases.map((e) => [e, e.offsetWidth, e.offsetHeight]);
          sizes.forEach((e) => {
            console.log(e[1]);
            console.log(e[2]);
            const resizeObserver = new MutationObserver((entries) => {
              for (entry of entries) {
                chrome.storage.sync.get(
                  {
                    enabled: false,
                    width: "",
                    height: "",
                  },
                  (prefs) => {
                    console.log(JSON.stringify(prefs));
                    if (
                      prefs.enabled &&
                      isNumeric(prefs.width) &&
                      isNumeric(prefs.height)
                    ) {
                      entry.target.style.width =
                        "" + parseInt(prefs.width) + "px";
                      entry.target.style.height =
                        "" + parseInt(prefs.height) + "px";
                    }
                  }
                );
              }
            });
            resizeObserver.observe(e[0], {
              attributes: true,
              attributeFilter: ["style"],
            });
          });
        }
      }
    }
  }
};

// コールバック関数に結びつけられたオブザーバーのインスタンスを生成
const observer = new MutationObserver(callback);

// 対象ノードの設定された変更の監視を開始
observer.observe(targetNode, config);

// document.addEventListener("load", () => {
//   const canvas = document.querySelector("#viewport0 > canvas");
//   console.log(!!canvas);

//   if (canvas) {
//     const resizeObserver = new ResizeObserver((entries) =>
//       console.log("Body height changed:", entries[0].target.clientHeight)
//     );

//     resizeObserver.observe(canvas);
//   }
// });
