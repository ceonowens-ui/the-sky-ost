/* =====================================================================
 * CHANCE – I'M SORRY · LINE Flex Message 產生器（單一事實來源）
 * ---------------------------------------------------------------------
 * - 瀏覽器：<script src="src/line/flex-message.js"> 後用
 *     window.buildImSorryFlex("https://chance1228.com")
 * - Node：node src/line/flex-message.js > src/line/im-sorry-flex-message.json
 *   （im-sorry-flex-message.json 是本檔的產物，改內容請改這裡再重新產生）
 *
 * 設計對應黑白液態玻璃卡：深色 bubble、白字、淺色主按鈕。
 * 所有動作都是 uri action，不自動播放、不自動傳送。
 * ===================================================================== */
(function (root) {
  "use strict";

  function buildImSorryFlex(baseUrl) {
    var SITE = (baseUrl || "https://chance1228.com").replace(/\/$/, "");
    var PAGE = SITE + "/im-sorry/";
    var INK = "#F2F0ED";
    var MUTED = "#9C9894";
    var BG = "#0B0709";

    return {
      type: "flex",
      altText: "CHANCE – I'M SORRY | New Single",
      contents: {
        type: "bubble",
        size: "mega",
        hero: {
          type: "image",
          url: SITE + "/assets/im-sorry-cover.jpg",
          size: "full",
          aspectRatio: "3:4",
          aspectMode: "cover",
          action: { type: "uri", label: "Open single", uri: PAGE }
        },
        body: {
          type: "box",
          layout: "vertical",
          backgroundColor: BG,
          paddingAll: "20px",
          spacing: "sm",
          contents: [
            { type: "text", text: "CHANCE", color: MUTED, size: "xs", weight: "bold" },
            { type: "text", text: "I'M SORRY", color: INK, size: "xxl", weight: "bold" },
            { type: "text", text: "New Single · Listen Now", color: MUTED, size: "sm" }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: BG,
          paddingAll: "16px",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#E8E4DF",
              height: "sm",
              action: { type: "uri", label: "Listen now", uri: PAGE + "?autoplay=0" }
            },
            {
              type: "button",
              style: "secondary",
              color: "#26211F",
              height: "sm",
              action: {
                type: "uri", label: "Add to Home",
                uri: SITE + "/install/?release=im-sorry&openExternalBrowser=1"
              }
            },
            {
              type: "text",
              text: "chance1228.com",
              color: MUTED, size: "xxs", align: "center", margin: "md",
              action: { type: "uri", label: "chance1228.com", uri: SITE + "/" }
            }
          ]
        },
        styles: {
          body: { backgroundColor: BG },
          footer: { backgroundColor: BG }
        }
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { buildImSorryFlex: buildImSorryFlex };
    if (require.main === module) {
      process.stdout.write(JSON.stringify(buildImSorryFlex(process.argv[2]), null, 2) + "\n");
    }
  }
  root.buildImSorryFlex = buildImSorryFlex;
})(typeof window !== "undefined" ? window : globalThis);
