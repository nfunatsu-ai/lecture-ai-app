function saveApiKey() {
  const key = document.getElementById("apiKey").value;
  localStorage.setItem("gemini_api_key", key);
  alert("APIキーを保存しました");
}

// ページ読み込み時に復元
window.onload = function() {
  const savedKey = localStorage.getItem("gemini_api_key");
  if (savedKey) {
    document.getElementById("apiKey").value = savedKey;
  }
};

async function analyzeAudio() {
  const apiKey = localStorage.getItem("gemini_api_key");
  const fileInput = document.getElementById("audioFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("音声ファイルを選択してください");
    return;
  }

  const maxSize = 10 * 1024 * 1024; // 10MB

  if (file.size > maxSize) {
    alert("ファイルサイズが大きすぎます（10MB以下にしてください）");
    return;
  }

  if (!apiKey) {
    alert("APIキーを入力してください");
    return;
  }

  if (!file) {
    alert("音声ファイルを選択してください");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function() {
    const base64Audio = reader.result.split(",")[1];

    const prompt = `
    この音声ファイルを日本語で文字起こししてください。
    その後、以下を出力してください：

    【文字起こし】
    （ここに内容）

    【要約】
     ・3〜5行で簡潔に書くこと
     ・1行は短くすること
     ・余計な説明は入れないこと

    【要点】
    ・必ず箇条書き（「・」を使用）
    ・3〜5個に分けること
    ・1項目は短いフレーズ＋説明にすること
    `;

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=" + apiKey,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: file.type,
                    data: base64Audio
                  }
                }
              ]
            }]
          })
        }
      );

      if (!response.ok) {
        alert("通信エラーが発生しました（ステータス: " + response.status + "）");
         return;
      }
      
      const data = await response.json();
      console.log(data);

      if (!data.candidates) {
        alert("APIエラー");
        return;
      }

      const result = data.candidates[0].content.parts[0].text;

      // とりあえず全部表示
      const transcript = result.split("【要約】")[0].replace("【文字起こし】", "").trim();
      const summary = result.split("【要約】")[1]?.split("【要点】")[0].trim();
      const keypoints = result.split("【要点】")[1]?.trim();

      document.getElementById("transcript").textContent = transcript || "";
      document.getElementById("summary").textContent = summary || "";
      document.getElementById("keypoints").textContent = keypoints || "";
           

    } catch (error) {
        console.error(error);

        if (error.name === "TypeError") {
           alert("ネットワークエラーが発生しました（通信環境を確認してください）");
        } else {
          alert("予期しないエラーが発生しました");
        }
      }
  };

  reader.readAsDataURL(file);
}

function copyText(id) {
  const text = document.getElementById(id).innerText;

  if (!text) {
    alert("コピーする内容がありません");
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => alert("コピーしました！"));
}

function downloadText(id, filename) {
  const text = document.getElementById(id).innerText;

  if (!text) {
    alert("ダウンロードする内容がありません");
    return;
  }

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  URL.revokeObjectURL(link.href);
}
