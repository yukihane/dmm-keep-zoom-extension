console.log("hello");

// 変更を監視するノードを選択
const targetNode = document.body;

// (変更を監視する) オブザーバーのオプション
const config = { attributes: false, childList: true, subtree: true };

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
          const sizes = canvases.map((e) => [e, e.style.width, e.style.height]);
          sizes.forEach((e) => {
            const config = { attributes: true, attributeFilter: ["style"] };
            const resizeObserver = new MutationObserver((entries) => {
              for (entry of entries) {
                  entry.target.style.width = "2560px";
                  entry.target.style.height = "1762px";
                console.log(e[1]);
                console.log(e[2]);
              }
            });
            resizeObserver.observe(e[0], config);
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

document.addEventListener("load", () => {
  const canvas = document.querySelector("#viewport0 > canvas");
  console.log(!!canvas);

  if (canvas) {
    const resizeObserver = new ResizeObserver((entries) =>
      console.log("Body height changed:", entries[0].target.clientHeight)
    );

    resizeObserver.observe(canvas);
  }
});
