# 講義音声ノートAI

## 概要
このアプリは、講義の音声ファイルを入力すると、
AI（Gemini API）を使って以下を自動生成するWebアプリです。

- 文字起こし
- 要約
- 要点抽出

---

## 使用技術
- HTML / CSS / JavaScript
- Gemini API（Google）

---

## セットアップ方法

### 1. フォルダを開く
VSCodeでプロジェクトフォルダを開く

### 2. Live Serverで起動
index.htmlを右クリック → Open with Live Server

### 3. APIキー設定
1. APIキー入力欄にキーを入力
2. 「保存」ボタンを押す
（localStorageに保存されます）

### 4. 使い方
1. 音声ファイルを選択
2. 「解析する」ボタンをクリック
3. 結果が3つに分かれて表示される

---

## 注意点
- インターネット接続が必要
- Gemini APIキーが必要