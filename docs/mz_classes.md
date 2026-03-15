# RPGツクールMZ クラス一覧

> このドキュメントは、RPGツクールMZ v1.10.0 のコアスクリプトに含まれる全クラスの
> リファレンスです。プラグイン開発時に参照することを目的としています。
> ⭐ マークはプラグイン開発で特に重要なクラスを示します。

## ファイル構成

| ファイル | カテゴリ | クラス数 |
|---|---|---|
| `rmmz_core.js` | 描画・入力・音声の基盤 | 15 |
| `rmmz_managers.js` | データ管理・シーン管理 | 13 |
| `rmmz_objects.js` | ゲームロジック (Game_\*) | 31 |
| `rmmz_scenes.js` | 画面遷移 (Scene_\*) | 21 |
| `rmmz_sprites.js` | スプライト表示 (Sprite_\*) | 22 |
| `rmmz_windows.js` | ウィンドウUI (Window_\*) | 41 |

## グローバル変数

### データベース変数 (`$data*`)

ゲーム起動時にJSONファイルから読み込まれる読み取り専用のデータベース。

| 変数名 | ソース | 説明 |
|---|---|---|
| `$dataActors` | Actors.json | アクターデータ配列 |
| `$dataClasses` | Classes.json | 職業データ配列 |
| `$dataSkills` | Skills.json | スキルデータ配列 |
| `$dataItems` | Items.json | アイテムデータ配列 |
| `$dataWeapons` | Weapons.json | 武器データ配列 |
| `$dataArmors` | Armors.json | 防具データ配列 |
| `$dataEnemies` | Enemies.json | 敵キャラクターデータ配列 |
| `$dataTroops` | Troops.json | 敵グループデータ配列 |
| `$dataStates` | States.json | ステートデータ配列 |
| `$dataAnimations` | Animations.json | アニメーションデータ配列 |
| `$dataTilesets` | Tilesets.json | タイルセットデータ配列 |
| `$dataCommonEvents` | CommonEvents.json | コモンイベントデータ配列 |
| `$dataSystem` | System.json | システムデータ |
| `$dataMapInfos` | MapInfos.json | マップ情報データ配列 |
| `$dataMap` | Map*NNN*.json | 現在のマップデータ |

### ゲームオブジェクト変数 (`$game*`)

ゲームの実行状態を保持するオブジェクト。多くはセーブデータに含まれる。

| 変数名 | 型 | セーブ | 説明 |
|---|---|---|---|
| `$gameTemp` | `Game_Temp` | ✗ | 一時データ |
| `$gameSystem` | `Game_System` | ✓ | システムデータ（BGM、勝利回数等） |
| `$gameScreen` | `Game_Screen` | ✓ | 画面エフェクト（色調、フラッシュ等） |
| `$gameTimer` | `Game_Timer` | ✓ | タイマー |
| `$gameMessage` | `Game_Message` | ✗ | メッセージウィンドウの状態 |
| `$gameSwitches` | `Game_Switches` | ✓ | スイッチ |
| `$gameVariables` | `Game_Variables` | ✓ | 変数 |
| `$gameSelfSwitches` | `Game_SelfSwitches` | ✓ | セルフスイッチ |
| `$gameActors` | `Game_Actors` | ✓ | アクター管理 |
| `$gameParty` | `Game_Party` | ✓ | パーティ（メンバー、アイテム、所持金） |
| `$gameTroop` | `Game_Troop` | ✗ | 現在の敵グループ |
| `$gameMap` | `Game_Map` | ✓ | 現在のマップ |
| `$gamePlayer` | `Game_Player` | ✓ | プレイヤーキャラクター |

## プラグイン開発パターン

### メソッドのオーバーライド（エイリアス方式）

MZプラグインでは、既存メソッドを拡張する際に以下のパターンを使用する：

```js
const _OriginalClass_methodName = OriginalClass.prototype.methodName;
OriginalClass.prototype.methodName = function() {
    _OriginalClass_methodName.call(this);
    // 追加処理
};
```

引数がある場合：

```js
const _Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    _Game_Actor_setup.call(this, actorId);
    this._customProperty = 0;
};
```

### プラグインパラメータの取得

```js
const pluginName = "MyPlugin";
const parameters = PluginManager.parameters(pluginName);
const myParam = Number(parameters["paramName"] || 0);
```

### プラグインコマンドの登録 (MZ固有)

```js
PluginManager.registerCommand(pluginName, "commandName", args => {
    const value = Number(args.value);
    // 処理
});
```

### メモ欄(Note)の利用

データベースのメモ欄に記載されたメタデータは `meta` プロパティでアクセスできる：

```js
// メモ欄に <CustomTag:100> と書いた場合
const value = $dataActors[actorId].meta.CustomTag; // "100" (文字列)
```

---

## Core

RPGツクールMZのコアエンジンを構成する基本クラス群です。 ( `rmmz_core.js` )

### Utils

ユーティリティメソッドを定義する静的クラス。

- **ソースファイル**: `rmmz_core.js`

#### 静的プロパティ
- `RPGMAKER_NAME` — RPGツクールの名前。現在のバージョンでは "MZ"。
- `RPGMAKER_VERSION` — RPGツクールのバージョン。

#### 静的メソッド
- `checkRMVersion(version)` — 現在のRPGツクールのバージョンが指定されたバージョン以上かどうかを確認する。
- `isOptionValid(name)` — クエリストリングにオプションが含まれているかを確認する。
- `isNwjs()` — プラットフォームがNW.jsかどうかを確認する。
- `isMobileDevice()` — プラットフォームがモバイルデバイスかどうかを確認する。
- `isMobileSafari()` — ブラウザがMobile Safariかどうかを確認する。
- `isAndroidChrome()` — ブラウザがAndroid Chromeかどうかを確認する。
- `isLocal()` — ブラウザがローカルファイルにアクセスしているかを確認する。
- `canUseWebGL()` — ブラウザがWebGLをサポートしているかを確認する。
- `canUseWebAudioAPI()` — ブラウザがWeb Audio APIをサポートしているかを確認する。
- `canUseCssFontLoading()` — ブラウザがCSS Font Loadingをサポートしているかを確認する。
- `canUseIndexedDB()` — ブラウザがIndexedDBをサポートしているかを確認する。
- `canPlayOgg()` — ブラウザがoggファイルを再生できるかを確認する。
- `canPlayWebm()` — ブラウザがwebmファイルを再生できるかを確認する。
- `encodeURI(str)` — スラッシュをエスケープせずにURIコンポーネントをエンコードする。
- `extractFileName(filename)` — サブフォルダを含まないファイル名を取得する。
- `escapeHtml(str)` — HTML用の特殊文字をエスケープする。
- `containsArabic(str)` — 文字列にアラビア文字が含まれているかを確認する。
- `setEncryptionInfo(hasImages, hasAudio, key)` — 暗号化に関する情報を設定する。
- `hasEncryptedImages()` — ゲーム内の画像ファイルが暗号化されているかを確認する。
- `hasEncryptedAudio()` — ゲーム内の音声ファイルが暗号化されているかを確認する。
- `decryptArrayBuffer(source)` — 暗号化されたデータを復号する。

### Graphics

グラフィック処理を実行する静的クラス。

- **ソースファイル**: `rmmz_core.js`

#### 静的プロパティ
- `app` — PIXI.Application オブジェクト。
- `effekseer` — Effekseer のコンテキストオブジェクト。
- `width` — ゲーム画面の幅。
- `height` — ゲーム画面の高さ。
- `defaultScale` — ゲーム画面のデフォルトのズームスケール。

#### 静的メソッド
- `initialize()` — グラフィックシステムを初期化する。
- `setTickHandler(handler)` — tickイベント用のハンドラを登録する。
- `startGameLoop()` — ゲームループを開始する。
- `stopGameLoop()` — ゲームループを停止する。
- `setStage(stage)` — 描画するステージ(Stage)オブジェクトを設定する。
- `startLoading()` — ローディングスピナーを表示する。
- `endLoading()` — ローディングスピナーを消去する。
- `printError(name, message, error)` — 画面にエラーテキストを表示する。
- `showRetryButton(retry)` — リソースの再読み込みを試行するボタンを表示する。
- `eraseError()` — ローディングエラーのテキストを消去する。
- `pageToCanvasX(x)` — ページ上のX座標をキャンバス領域上のX座標に変換する。
- `pageToCanvasY(y)` — ページ上のY座標をキャンバス領域上のY座標に変換する。
- `isInsideCanvas(x, y)` — 指定されたポイントがゲームキャンバスの領域内にあるかを確認する。
- `showScreen()` — ゲーム画面を表示する。
- `hideScreen()` — ゲーム画面を隠す。
- `resize(width, height)` — ゲーム画面のサイズを変更する。

### Point

ポイント(座標)クラス。PIXI.Point を継承。

- **ソースファイル**: `rmmz_core.js`
- **継承**: `PIXI.Point` → **Point**

### Rectangle

矩形クラス。PIXI.Rectangle を継承。

- **ソースファイル**: `rmmz_core.js`
- **継承**: `PIXI.Rectangle` → **Rectangle**

### Bitmap

画像を表す基本オブジェクト。

- **ソースファイル**: `rmmz_core.js`

#### 静的メソッド
- `load(url)` — 画像ファイルを読み込む。
- `snap(stage)` — ゲーム画面のスナップショットを取得する。

#### プロパティ
- `url` — 画像ファイルのURL（読み取り専用）。
- `baseTexture` — ベーステクスチャ (PIXI.BaseTexture)。
- `image` — ビットマップ画像。
- `canvas` — ビットマップキャンバス。
- `context` — ビットマップキャンバスの2Dコンテキスト。
- `width` — ビットマップの幅。
- `height` — ビットマップの高さ。
- `rect` — ビットマップの矩形領域。
- `smooth` — 平滑化スケーリングが適用されているかどうか。
- `paintOpacity` — 描画オブジェクトの不透明度（0〜255の範囲）。

#### インスタンスメソッド
- `isReady()` — ビットマップが描画準備完了かどうかを確認する。
- `isError()` — 読み込みエラーが発生したかどうかを確認する。
- `destroy()` — ビットマップを破棄する。
- `resize(width, height)` — ビットマップのサイズを変更する。
- `blt(source, sx, sy, sw, sh, dx, dy, dw?, dh?)` — ブロック転送（画像の一部コピー）を実行する。
- `getPixel(x, y)` — 指定された座標のピクセルの色(16進数文字列)を返す。
- `getAlphaPixel(x, y)` — 指定された座標のアルファ(透明度)ピクセル値を返す。
- `clearRect(x, y, width, height)` — 指定された矩形領域をクリアする。
- `clear()` — ビットマップ全体をクリアする。
- `fillRect(x, y, width, height, color)` — 指定された矩形領域を塗りつぶす。
- `fillAll(color)` — ビットマップ全体を塗りつぶす。
- `strokeRect(x, y, width, height, color)` — 指定された矩形の枠線を描画する。
- `gradientFillRect(x, y, width, height, color1, color2, vertical)` — グラデーションで矩形を描画する。
- `drawCircle(x, y, radius, color)` — 円形のビットマップを描画する。
- `drawText(text, x, y, maxWidth, lineHeight, align)` — ビットマップにアウトラインテキストを描画する。
- `measureTextWidth(text)` — 指定されたテキストの幅を返す。
- `addLoadListener(listener)` — ビットマップが読み込まれた時に呼び出されるコールバック関数を追加する。
- `retry()` — 画像の再読み込みを試みる。

### Sprite

ゲーム画面に描画される基本オブジェクト。

- **ソースファイル**: `rmmz_core.js`
- **継承**: `PIXI.Sprite` → **Sprite**

#### プロパティ
- `bitmap` — スプライトの画像 (Bitmapオブジェクト)。
- `width` — 拡大率を適用しないスプライトの幅。
- `height` — 拡大率を適用しないスプライトの高さ。
- `opacity` — スプライトの不透明度 (0〜255)。
- `blendMode` — スプライトに適用されるブレンドモード。

#### インスタンスメソッド
- `destroy()` — スプライトを破棄する。
- `update()` — 毎フレーム、スプライトを更新する。
- `hide()` — スプライトを「非表示状態」にする。
- `show()` — スプライトの「非表示状態」を解除する。
- `updateVisibility()` — スプライトの「非表示状態」を実際の可視状態に反映する。
- `move(x, y)` — x座標とy座標を一度に設定する。
- `setFrame(x, y, width, height)` — スプライトが表示するビットマップの矩形領域を設定する。
- `setHue(hue)` — 色相回転値を設定する。
- `getBlendColor()` — スプライトのブレンドカラーを取得する。
- `setBlendColor(color)` — スプライトのブレンドカラーを設定する。
- `getColorTone()` — スプライトのカラートーン(色調)を取得する。
- `setColorTone(tone)` — スプライトのカラートーン(色調)を設定する。

### Tilemap

2Dタイルベースのゲームマップを表示するタイルマップ。

- **ソースファイル**: `rmmz_core.js`

#### プロパティ
- `width` — タイルマップの幅。
- `height` — タイルマップの高さ。

#### インスタンスメソッド
- `destroy()` — タイルマップを破棄する。
- `setData(width, height, data)` — タイルマップのデータ配列を設定する。
- `isReady()` — タイルセットが描画準備完了かどうかを確認する。
- `update()` — 毎フレーム、タイルマップを更新する。
- `setBitmaps(bitmaps)` — タイルセットとして使用するビットマップの配列を設定する。
- `refresh()` — タイルマップ全体を強制的に再描画する。
- `updateTransform()` — このコンテナのすべての子要素のトランスフォームを更新する。

### TilingSprite

タイリング画像（繰り返し表示）用のスプライトオブジェクト。

- **ソースファイル**: `rmmz_core.js`

#### プロパティ
- `bitmap` — タイリングスプライトの画像。
- `opacity` — タイリングスプライトの不透明度 (0〜255)。

#### インスタンスメソッド
- `destroy()` — タイリングスプライトを破棄する。
- `update()` — 毎フレーム、タイリングスプライトを更新する。
- `move(x, y, width, height)` — x, y, width, heightを一度に設定する。
- `setFrame(x, y, width, height)` — 使用する画像の領域を指定する。
- `updateTransform()` — 子のトランスフォームを更新する。

### ScreenSprite

ゲーム画面全体を覆うスプライト（フラッシュや画面の色調変更用など）。

- **ソースファイル**: `rmmz_core.js`

#### プロパティ
- `opacity` — スプライトの不透明度 (0〜255)。

#### インスタンスメソッド
- `destroy()` — スクリーンスプライトを破棄する。
- `setBlack()` — 色を黒に設定する。
- `setWhite()` — 色を白に設定する。
- `setColor(r, g, b)` — RGB値で色を設定する。

### Window

ゲーム内のウィンドウ。

- **ソースファイル**: `rmmz_core.js`
- **継承**: `PIXI.Container` → **Window**

#### プロパティ
- `windowskin` — ウィンドウスキンとして使用される画像。
- `contents` — ウィンドウのコンテンツ（テキスト等）に使用されるビットマップ。
- `contentsBack` — ウィンドウのコンテンツ背景に使用されるビットマップ。
- `width` — ウィンドウの幅 (ピクセル単位)。
- `height` — ウィンドウの高さ (ピクセル単位)。
- `padding` — フレームとコンテンツの間のパディングサイズ。
- `margin` — ウィンドウ背景の余白サイズ。
- `opacity` — コンテンツを含まないウィンドウ自体の不透明度 (0〜255)。
- `backOpacity` — ウィンドウ背景の不透明度 (0〜255)。
- `contentsOpacity` — ウィンドウコンテンツの不透明度 (0〜255)。
- `openness` — ウィンドウの開度合い (0=閉〜255=開)。
- `innerWidth` — コンテンツエリア（内側）の幅 (ピクセル単位)。
- `innerHeight` — コンテンツエリア（内側）の高さ (ピクセル単位)。
- `innerRect` — コンテンツエリアの矩形領域。

#### インスタンスメソッド
- `destroy()` — ウィンドウを破棄する。
- `update()` — 毎フレーム、ウィンドウを更新する。
- `move(x, y, width, height)` — x, y, width, heightを一度に設定する。
- `isOpen()` — ウィンドウが完全に開いているか (openness == 255) を確認する。
- `isClosed()` — ウィンドウが完全に閉じているか (openness == 0) を確認する。
- `setCursorRect(x, y, width, height)` — コマンドカーソルの位置を設定する。
- `moveCursorBy(x, y)` — 指定された量だけカーソル位置を移動する。
- `moveInnerChildrenBy(x, y)` — 指定された量だけ内部の子要素を移動する。
- `setTone(r, g, b)` — 背景の色調を変更する。
- `addChildToBack(child)` — 背景とコンテンツの間に子要素を追加する。
- `addInnerChild(child)` — クライアントエリアに子要素を追加する。
- `updateTransform()` — 描画のためにトランスフォームを更新する。
- `drawShape(graphics)` — ウィンドウの形状をPIXI.Graphicsオブジェクトに描画する。

### WindowLayer

ゲームウィンドウを含むレイヤー（重なりなどを制御）。

- **ソースファイル**: `rmmz_core.js`

#### インスタンスメソッド
- `update()` — 毎フレーム、ウィンドウレイヤーを更新する。
- `render(renderer)` — WebGLレンダラを使用してオブジェクトを描画する。

### Weather

雨、嵐、雪を表示する天候エフェクト。

- **ソースファイル**: `rmmz_core.js`

#### インスタンスメソッド
- `destroy()` — 天候エフェクトを破棄する。
- `update()` — 毎フレーム、天候状態を更新する。

### ColorFilter

WebGL用のカラーフィルター（色調変更などに使用）。

- **ソースファイル**: `rmmz_core.js`

#### インスタンスメソッド
- `setHue(hue)` — 色相回転値を設定する。
- `setColorTone(tone)` — カラートーン(色調)を設定する。
- `setBlendColor(color)` — ブレンドカラーを設定する。
- `setBrightness(brightness)` — 明るさを設定する。

### Stage

表示ツリーのルートオブジェクト。

- **ソースファイル**: `rmmz_core.js`

#### インスタンスメソッド
- `destroy()` — ステージを破棄する。

### WebAudio

Web Audio APIのオーディオオブジェクト。

- **ソースファイル**: `rmmz_core.js`

#### 静的メソッド
- `initialize()` — オーディオシステムを初期化する。
- `setMasterVolume(value)` — すべてのオーディオのマスターボリュームを設定する。

#### プロパティ
- `url` — 音声ファイルのURL。
- `volume` — オーディオの音量。
- `pitch` — オーディオのピッチ(再生速度/音程)。
- `pan` — オーディオのパン(左右の定位)。

#### インスタンスメソッド
- `clear()` — オーディオデータをクリアする。
- `isReady()` — 再生準備完了かどうかを確認する。
- `isError()` — 読み込みエラーが発生したかどうかを確認する。
- `isPlaying()` — 再生中かどうかを確認する。
- `play(loop, offset)` — オーディオを再生する。
- `stop()` — オーディオを停止する。
- `destroy()` — オーディオを破棄する。
- `fadeIn(duration)` — フェードインを実行する。
- `fadeOut(duration)` — フェードアウトを実行する。
- `seek()` — シーク位置(再生位置)を取得する。
- `addLoadListener(listener)` — 読み込み完了時のコールバック関数を追加する。
- `addStopListener(listener)` — 再生停止時のコールバック関数を追加する。
- `retry()` — オーディオパラメータの再読み込みを試みる。

### Video

ビデオの再生を処理する静的クラス。

- **ソースファイル**: `rmmz_core.js`

#### 静的メソッド
- `initialize(width, height)` — ビデオシステムを初期化する。
- `resize(width, height)` — ビデオの表示サイズを変更する。
- `play(src)` — ビデオの再生を開始する。
- `isPlaying()` — ビデオが再生中かどうかを確認する。
- `setVolume(volume)` — ビデオの音量を設定する。

### Input

キーボードとゲームパッドからの入力データを処理する静的クラス。

- **ソースファイル**: `rmmz_core.js`

#### 静的プロパティ
- `keyRepeatWait` — キーリピートが始まるまでの待機時間（フレーム数）。
- `keyRepeatInterval` — キーリピートの間隔（フレーム数）。
- `keyMapper` — 仮想キーコードからマップされたキー名に変換するハッシュテーブル。
- `gamepadMapper` — ゲームパッドのボタンからマップされたキー名に変換するハッシュテーブル。
- `dir4` — 4方向の入力値をテンキーの数値 (下=2,左=4,右=6,上=8) またはニュートラル(0)として返す。
- `dir8` — 8方向の入力値をテンキーの数値またはニュートラル(0)として返す。
- `date` — 最後の入力が行われた時間（ミリ秒）。

#### 静的メソッド
- `initialize()` — 入力システムを初期化する。
- `clear()` — すべての入力データをクリアする。
- `update()` — 入力データをフレーム毎に更新する。
- `isPressed(keyName)` — キーが現在押されているかどうかを確認する。
- `isTriggered(keyName)` — キーが「ちょうど押された瞬間」かどうかを確認する。
- `isRepeated(keyName)` — キーが押された瞬間、またはキーリピートが発生したかを確認する。
- `isLongPressed(keyName)` — キーが長押しされているかどうかを確認する。

### TouchInput

マウスとタッチスクリーンからの入力データを処理する静的クラス。

- **ソースファイル**: `rmmz_core.js`

#### 静的プロパティ
- `keyRepeatWait` — 疑似キーリピートが始まるまでの待機時間（フレーム数）。
- `keyRepeatInterval` — 疑似キーリピートの間隔（フレーム数）。
- `moveThreshold` — 移動したと判定するピクセル数のしきい値。
- `wheelX` — 水平方向のスクロール量。
- `wheelY` — 垂直方向のスクロール量。
- `x` — 最後のタッチイベントにおけるキャンバス領域上のX座標。
- `y` — 最後のタッチイベントにおけるキャンバス領域上のY座標。
- `date` — 最後の入力が行われた時間（ミリ秒）。

#### 静的メソッド
- `initialize()` — タッチシステムを初期化する。
- `clear()` — すべてのタッチデータをクリアする。
- `update()` — タッチデータをフレーム毎に更新する。
- `isClicked()` — 同じ位置で押されて離された(クリックされた)かを確認する。
- `isPressed()` — 現在押されているかどうかを確認する。
- `isTriggered()` — 「ちょうど押された瞬間」かどうかを確認する。
- `isRepeated()` — 押された瞬間、または疑似キーリピートが発生したかを確認する。
- `isLongPressed()` — 長押しされているかどうかを確認する。
- `isCancelled()` — 右マウスボタンがちょうど押されたかを確認する。
- `isMoved()` — マウスまたは指が移動したかどうかを確認する。
- `isHovered()` — ボタンを押さずにマウスが移動(ホバー)したかを確認する。
- `isReleased()` — ボタンまたはタッチが離されたかを確認する。

### JsonEx

オブジェクト情報を含む独自拡張JSONを処理する静的クラス (セーブデータのシリアライズ等に使用)。

- **ソースファイル**: `rmmz_core.js`

#### 静的プロパティ
- `maxDepth` — オブジェクトをパースする最大深度。

#### 静的メソッド
- `stringify(object)` — オブジェクトを型情報(@クラス名など)を含めたJSON文字列に変換する。
- `parse(json)` — JSON文字列をパースし、対応するクラスインスタンスのオブジェクトを再構築する。
- `makeDeepCopy(object)` — 指定されたオブジェクトのディープコピーを作成する。

---

## Managers

データ管理・シーン管理・リソース管理を行うマネージャークラス群です。すべて静的クラスです。 ( `rmmz_managers.js` )

### DataManager ⭐

データベースとゲームオブジェクトを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `loadGlobalInfo()` — グローバル情報（セーブファイル一覧）を読み込む。
- `removeInvalidGlobalInfo()` — 無効なグローバル情報を削除する。
- `saveGlobalInfo()` — グローバル情報を保存する。
- `isGlobalInfoLoaded()` — グローバル情報の読み込みが完了したかを確認する。
- `loadDatabase()` — ゲームデータベースを読み込む。
- `loadDataFile(name, src)` — 指定されたデータファイルを読み込む。
- `onXhrLoad(xhr, name, src, url)` — XHRリクエスト成功時のコールバック。
- `onXhrError(name, src, url)` — XHRリクエスト失敗時のコールバック。
- `isDatabaseLoaded()` — データベースの読み込みが完了したかを確認する。
- `loadMapData(mapId)` — 指定されたマップIDのマップデータを読み込む。
- `makeEmptyMap()` — 空のマップデータを作成する。
- `isMapLoaded()` — マップデータの読み込みが完了したかを確認する。
- `onLoad(object)` — データ読み込み完了時にメタデータを抽出する。
- `isMapObject(object)` — オブジェクトがマップデータかどうかを判定する。
- `extractArrayMetadata(array)` — 配列内の各要素からメタデータを抽出する。
- `extractMetadata(data)` — メモ欄からメタデータ（metaプロパティ）を抽出する。
- `checkError()` — 読み込みエラーが発生していないかをチェックする。
- `isBattleTest()` — 戦闘テストモードかどうかを確認する。
- `isEventTest()` — イベントテストモードかどうかを確認する。
- `isTitleSkip()` — タイトルスキップモードかどうかを確認する。
- `isSkill(item)` — アイテムがスキルかどうかを判定する。
- `isItem(item)` — アイテムが通常アイテムかどうかを判定する。
- `isWeapon(item)` — アイテムが武器かどうかを判定する。
- `isArmor(item)` — アイテムが防具かどうかを判定する。
- `createGameObjects()` — 全てのゲームオブジェクト($game*)を生成する。
- `setupNewGame()` — ニューゲームをセットアップする。
- `setupBattleTest()` — 戦闘テストをセットアップする。
- `setupEventTest()` — イベントテストをセットアップする。
- `isAnySavefileExists()` — セーブファイルが1つ以上存在するかを確認する。
- `latestSavefileId()` — 最新のセーブファイルIDを返す。
- `earliestSavefileId()` — 最も古いセーブファイルIDを返す。
- `emptySavefileId()` — 空きのセーブファイルIDを返す。
- `loadAllSavefileImages()` — 全セーブファイルの画像を読み込む。
- `loadSavefileImages(info)` — 指定されたセーブファイル情報から画像を読み込む。
- `maxSavefiles()` — セーブファイルの最大数を返す（デフォルト: 20）。
- `savefileInfo(savefileId)` — 指定されたセーブファイルIDの情報を返す。
- `savefileExists(savefileId)` — 指定されたセーブファイルが存在するかを確認する。
- `saveGame(savefileId)` — ゲームデータを保存する。Promiseを返す。
- `loadGame(savefileId)` — セーブデータを読み込む。Promiseを返す。
- `makeSavename(savefileId)` — セーブファイルIDからファイル名を生成する。
- `selectSavefileForNewGame()` — ニューゲーム用のセーブファイルIDを選択する。
- `makeSavefileInfo()` — セーブファイル用の情報オブジェクトを作成する。
- `makeSaveContents()` — セーブデータの内容オブジェクトを作成する。
- `extractSaveContents(contents)` — セーブデータの内容からゲームオブジェクトを復元する。
- `correctDataErrors()` — セーブデータのデータエラーを修正する。

### ConfigManager ⭐

設定データを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的プロパティ

- `alwaysDash`
- `commandRemember` — 「Remember」コマンドのハンドラ。
- `touchUI`

#### 静的メソッド

- `load()` — 設定データを読み込む。
- `save()` — 設定データを保存する。
- `isLoaded()` — 設定データの読み込みが完了したかを確認する。
- `makeData()` — 設定データオブジェクトを作成する。
- `applyData(config)` — 設定データを適用する。
- `readFlag(config, name, defaultValue)` — 設定データからフラグ値を読み取る。
- `readVolume(config, name)` — 設定データから音量値を読み取る。

#### プロパティ

- `bgmVolume`
- `bgsVolume`
- `meVolume`
- `seVolume`

### StorageManager

セーブデータの保存を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `isLocalMode()` — ローカルファイルモード（NW.js）かどうかを確認する。
- `saveObject(saveName, object)` — オブジェクトをJSON→ZIP変換して保存する。Promiseを返す。
- `loadObject(saveName)` — 保存データを読み込みZIP→JSONからオブジェクトに復元する。
- `objectToJson(object)` — オブジェクトをJSON文字列に変換する。
- `jsonToObject(json)` — JSON文字列をオブジェクトに変換する。
- `jsonToZip(json)` — JSON文字列をZIP圧縮する。
- `zipToJson(zip)` — ZIP圧縮データをJSON文字列に展開する。
- `saveZip(saveName, zip)` — ZIP圧縮データを保存する。
- `loadZip(saveName)` — ZIP圧縮データを読み込む。
- `exists(saveName)` — 指定されたセーブ名のファイルが存在するかを確認する。
- `remove(saveName)` — 指定されたセーブ名のファイルを削除する。
- `saveToLocalFile(saveName, zip)` — ローカルファイルに保存する。
- `loadFromLocalFile(saveName)` — ローカルファイルから読み込む。
- `localFileExists(saveName)` — ローカルファイルが存在するかを確認する。
- `removeLocalFile(saveName)` — ローカルファイルを削除する。
- `saveToForage(saveName, zip)` — localForageに保存する（ブラウザ用）。
- `loadFromForage(saveName)` — localForageから読み込む。
- `forageExists(saveName)` — localForageにデータが存在するかを確認する。
- `removeForage(saveName)` — localForageからデータを削除する。
- `updateForageKeys()` — localForageのキー一覧を更新する。
- `forageKeysUpdated()` — localForageのキー更新が完了したかを確認する。
- `fsMkdir(path)` — ディレクトリを作成する。
- `fsRename(oldPath, newPath)` — ファイル名を変更する。
- `fsUnlink(path)` — ファイルを削除する。
- `fsReadFile(path)` — ファイルを読み込む。
- `fsWriteFile(path, data)` — ファイルに書き込む。
- `fileDirectoryPath()` — セーブファイルのディレクトリパスを返す。
- `filePath(saveName)` — セーブファイルのフルパスを返す。
- `forageKey(saveName)` — localForage用のキー文字列を返す。
- `forageTestKey()` — localForageテスト用のキー文字列を返す。

### FontManager

フォントファイルの読み込みを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `load(family, filename)` — フォントファイルを読み込む。
- `isReady()` — すべてのフォントの読み込みが完了したかを確認する。
- `startLoading(family, url)` — フォントの読み込みを開始する。
- `throwLoadError(family)` — フォント読み込みエラーを投げる。
- `makeUrl(filename)` — フォントファイルのURLを生成する。

### ImageManager ⭐

画像の読み込み・Bitmapオブジェクトの作成・保持を行う静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的プロパティ

- `standardIconWidth` — 標準アイコン表示幅。
- `standardIconHeight` — 標準アイコン表示高さ。
- `standardFaceWidth` — 標準顔画像表示幅。
- `standardFaceHeight` — 標準顔画像表示高さ。

#### 静的メソッド

- `getIconSize()` — アイコンサイズ情報を取得する。
- `getFaceSize()` — 顔画像サイズ情報を取得する。
- `loadAnimation(filename)` — img/animations/ からアニメーション画像を読み込む。
- `loadBattleback1(filename)` — img/battlebacks1/ から戦闘背景1を読み込む。
- `loadBattleback2(filename)` — img/battlebacks2/ から戦闘背景2を読み込む。
- `loadEnemy(filename)` — img/enemies/ から敵画像を読み込む。
- `loadCharacter(filename)` — img/characters/ からキャラクター画像を読み込む。
- `loadFace(filename)` — img/faces/ から顔画像を読み込む。
- `loadParallax(filename)` — img/parallaxes/ から遠景画像を読み込む。
- `loadPicture(filename)` — img/pictures/ からピクチャ画像を読み込む。
- `loadSvActor(filename)` — img/sv_actors/ からSVアクター画像を読み込む。
- `loadSvEnemy(filename)` — img/sv_enemies/ からSV敵画像を読み込む。
- `loadSystem(filename)` — img/system/ からシステム画像を読み込む。
- `loadTileset(filename)` — img/tilesets/ からタイルセット画像を読み込む。
- `loadTitle1(filename)` — img/titles1/ からタイトル背景画像1を読み込む。
- `loadTitle2(filename)` — img/titles2/ からタイトル背景画像2を読み込む。
- `loadBitmap(folder, filename)` — 指定されたURLからビットマップ画像を読み込む。
- `loadBitmapFromUrl(url)` — URLから直接ビットマップを読み込む。
- `clear()` — 全ての画像キャッシュをクリアする。
- `isReady()` — 全ての画像の読み込みが完了したかを確認する。
- `throwLoadError(bitmap)` — 画像読み込みエラーを投げる。
- `isObjectCharacter(filename)` — オブジェクトキャラクター画像かどうかを判定する（!プレフィックス）。
- `isBigCharacter(filename)` — 大型キャラクター画像かどうかを判定する（$プレフィックス）。
- `isZeroParallax(filename)` — ゼロ遠景かどうかを判定する。

#### プロパティ

- `iconWidth` — アイコンの幅（ピクセル）。
- `iconHeight` — アイコンの高さ（ピクセル）。
- `faceWidth` — 顔画像の幅（ピクセル）。
- `faceHeight` — 顔画像の高さ（ピクセル）。

### EffectManager

Effekseerエフェクトの読み込みを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `load(filename)` — Effekseerのエフェクトファイルを読み込む。
- `startLoading(url)` — エフェクトの読み込みを開始する。
- `clear()` — 全てのエフェクトキャッシュをクリアする。
- `onLoad(/*url*/)` — エフェクト読み込み完了時のコールバック。
- `onError(url)` — エフェクト読み込みエラー時のコールバック。
- `makeUrl(filename)` — エフェクトファイルのURLを生成する。
- `checkErrors()` — エフェクトの読み込みエラーをチェックする。
- `throwLoadError(url)` — エフェクト読み込みエラーを投げる。
- `isReady()` — 全てのエフェクトの読み込みが完了したかを確認する。

### AudioManager ⭐

BGM・BGS・ME・SEの再生を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `playBgm(bgm, pos)` — BGMを再生する。
- `replayBgm(bgm)` — 保存されたBGMを再開する。
- `isCurrentBgm(bgm)` — 指定されたBGMが現在再生中かを確認する。
- `updateBgmParameters(bgm)` — BGMのパラメータ（音量・ピッチ・パン）を更新する。
- `updateCurrentBgm(bgm, pos)` — 現在のBGM情報を更新する。
- `stopBgm()` — BGMを停止する。
- `fadeOutBgm(duration)` — BGMをフェードアウトする。
- `fadeInBgm(duration)` — BGMをフェードインする。
- `playBgs(bgs, pos)` — BGSを再生する。
- `replayBgs(bgs)` — 保存されたBGSを再開する。
- `isCurrentBgs(bgs)` — 指定されたBGSが現在再生中かを確認する。
- `updateBgsParameters(bgs)` — BGSのパラメータを更新する。
- `updateCurrentBgs(bgs, pos)` — 現在のBGS情報を更新する。
- `stopBgs()` — BGSを停止する。
- `fadeOutBgs(duration)` — BGSをフェードアウトする。
- `fadeInBgs(duration)` — BGSをフェードインする。
- `playMe(me)` — MEを再生する。
- `updateMeParameters(me)` — MEのパラメータを更新する。
- `fadeOutMe(duration)` — MEをフェードアウトする。
- `stopMe()` — MEを停止する。
- `playSe(se)` — SEを再生する。
- `updateSeParameters(buffer, se)` — SEのパラメータを更新する。
- `cleanupSe()` — 再生完了したSEバッファをクリーンアップする。
- `stopSe()` — 全てのSEを停止する。
- `playStaticSe(se)` — 静的SE（常に新規バッファ）を再生する。
- `loadStaticSe(se)` — 静的SE用のバッファを事前に読み込む。
- `isStaticSe(se)` — 指定されたSEが静的SEかを確認する。
- `stopAll()` — 全てのオーディオを停止する。
- `saveBgm()` — 現在のBGM情報を保存用オブジェクトとして返す。
- `saveBgs()` — 現在のBGS情報を保存用オブジェクトとして返す。
- `makeEmptyAudioObject()` — 空のオーディオオブジェクトを作成する。
- `createBuffer(folder, name)` — WebAudioバッファを作成する。
- `updateBufferParameters(buffer, configVolume, audio)` — バッファの音量・ピッチ・パンを更新する。
- `audioFileExt()`
- `checkErrors()` — オーディオの読み込みエラーをチェックする。
- `throwLoadError(webAudio)` — オーディオ読み込みエラーを投げる。

#### プロパティ

- `bgmVolume`
- `bgsVolume`
- `meVolume`
- `seVolume`

### SoundManager

データベースで定義された効果音を再生する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `preloadImportantSounds()` — 重要な効果音を事前に読み込む。
- `loadSystemSound(n)` — システム効果音を読み込む。
- `playSystemSound(n)` — システム効果音を再生する。
- `playCursor()` — カーソル移動音を再生する。
- `playOk()` — 決定音を再生する。
- `playCancel()` — キャンセル音を再生する。
- `playBuzzer()` — ブザー音を再生する。
- `playEquip()` — 装備音を再生する。
- `playSave()` — セーブ音を再生する。
- `playLoad()` — ロード音を再生する。
- `playBattleStart()` — 戦闘開始音を再生する。
- `playEscape()` — 逃走音を再生する。
- `playEnemyAttack()` — 敵の攻撃音を再生する。
- `playEnemyDamage()` — 敵のダメージ音を再生する。
- `playEnemyCollapse()` — 敵の消滅音を再生する。
- `playBossCollapse1()` — ボスの消滅音1を再生する。
- `playBossCollapse2()` — ボスの消滅音2を再生する。
- `playActorDamage()` — アクターのダメージ音を再生する。
- `playActorCollapse()` — アクターの戦闘不能音を再生する。
- `playRecovery()` — 回復音を再生する。
- `playMiss()` — ミス音を再生する。
- `playEvasion()` — 回避音を再生する。
- `playMagicEvasion()` — 魔法回避音を再生する。
- `playReflection()` — 反射音を再生する。
- `playShop()` — ショップ音を再生する。
- `playUseItem()` — アイテム使用音を再生する。
- `playUseSkill()` — スキル使用音を再生する。

### TextManager ⭐

用語やメッセージを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `basic(basicId)` — 基本用語を取得する（例: レベル、HP、MP等）。
- `param(paramId)` — パラメータ名を取得する。
- `command(commandId)` — コマンド名を取得する。
- `message(messageId)` — メッセージテキストを取得する。
- `getter(method, param)` — 用語のgetterプロパティを定義するユーティリティ。

#### プロパティ

- `currencyUnit`

### ColorManager ⭐

ウィンドウカラーを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `loadWindowskin()` — ウィンドウスキン画像を読み込む。
- `textColor(n)` — テキストカラー番号に対応する色を返す。
- `normalColor()` — 通常テキストの色を返す。
- `systemColor()` — システムカラーを返す。
- `crisisColor()` — 危機時（HPが少ない等）の色を返す。
- `deathColor()` — 戦闘不能時の色を返す。
- `gaugeBackColor()` — ゲージの背景色を返す。
- `hpGaugeColor1()` — HPゲージのグラデーション色1を返す。
- `hpGaugeColor2()` — HPゲージのグラデーション色2を返す。
- `mpGaugeColor1()` — MPゲージのグラデーション色1を返す。
- `mpGaugeColor2()` — MPゲージのグラデーション色2を返す。
- `mpCostColor()` — MP消費量の色を返す。
- `powerUpColor()` — 能力上昇の色を返す。
- `powerDownColor()` — 能力低下の色を返す。
- `ctGaugeColor1()` — CTゲージのグラデーション色1を返す。
- `ctGaugeColor2()` — CTゲージのグラデーション色2を返す。
- `tpGaugeColor1()` — TPゲージのグラデーション色1を返す。
- `tpGaugeColor2()` — TPゲージのグラデーション色2を返す。
- `tpCostColor()` — TP消費量の色を返す。
- `pendingColor()` — 保留中の色を返す。
- `hpColor(actor)` — アクターのHP状態に応じた色を返す。
- `mpColor(/*actor*/)` — MPの色を返す。
- `tpColor(/*actor*/)` — TPの色を返す。
- `paramchangeTextColor(change)` — パラメータ変化値に応じた色（上昇=緑/低下=赤）を返す。
- `damageColor(colorType)` — ダメージ表示の色を返す（種類別）。
- `outlineColor()` — テキストのアウトライン色を返す。
- `dimColor1()` — 暗転の色1を返す。
- `dimColor2()` — 暗転の色2を返す。
- `itemBackColor1()` — アイテム背景の色1を返す。
- `itemBackColor2()` — アイテム背景の色2を返す。

### SceneManager ⭐

シーン遷移を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `run(sceneClass)` — ゲームを起動し、メインループを開始する。
- `initialize()` — シーンマネージャを初期化する。
- `checkBrowser()` — ブラウザの互換性を確認する。
- `checkPluginErrors()` — プラグインのエラーをチェックする。
- `initGraphics()` — グラフィックシステムを初期化する。
- `initAudio()` — オーディオシステムを初期化する。
- `initVideo()` — ビデオシステムを初期化する。
- `initInput()` — 入力システムを初期化する。
- `setupEventHandlers()` — エラーハンドラやリサイズイベント等を設定する。
- `update(deltaTime)` — フレーム毎にシーンを更新する（メインループ）。
- `determineRepeatNumber(deltaTime)` — フレーム補間の繰り返し回数を決定する。
- `terminate()` — ゲームを終了する。
- `onError(event)` — エラー発生時のハンドラ。
- `onReject(event)` — Promise拒否時のハンドラ。
- `onUnload()` — ページアンロード時のハンドラ。
- `onKeyDown(event)` — キー押下時のハンドラ（F5リロード等）。
- `reloadGame()` — ゲームをリロードする。
- `showDevTools()` — 開発者ツールを表示する。
- `catchException(e)` — 例外をキャッチして画面にエラー表示する。
- `catchNormalError(e)` — 通常エラーを処理する。
- `catchLoadError(e)` — 読み込みエラーを処理する。
- `catchUnknownError(e)` — 不明なエラーを処理する。
- `updateMain()` — シーンの変更・更新のメイン処理。
- `updateFrameCount()` — フレームカウントを更新する。
- `updateInputData()` — 入力データ（Input, TouchInput）を更新する。
- `updateEffekseer()` — Effekseerの更新処理。
- `changeScene()` — 次のシーンへの切り替え処理。
- `updateScene()` — 現在のシーンのupdate()を呼び出す。
- `isGameActive()` — ゲームウィンドウがアクティブかを確認する。
- `onSceneTerminate()` — Scene Terminate時のコールバック。
- `onSceneCreate()` — Scene Create時のコールバック。
- `onBeforeSceneStart()` — シーン開始前のコールバック。
- `onSceneStart()` — Scene Start時のコールバック。
- `isSceneChanging()` — シーン遷移中かどうかを確認する。
- `isCurrentSceneBusy()` — 現在のシーンがビジー状態かを確認する。
- `isNextScene(sceneClass)` — 次のシーンが指定されたクラスかを確認する。
- `isPreviousScene(sceneClass)` — 前のシーンが指定されたクラスかを確認する。
- `goto(sceneClass)` — 指定されたシーンクラスに直接遷移する（スタッククリア）。
- `push(sceneClass)` — 指定されたシーンクラスをスタックに積んで遷移する。
- `pop()` — シーンスタックから1つ戻る。
- `exit()` — ゲームを終了する。
- `clearStack()` — シーンスタックをクリアする。
- `stop()` — シーンの更新を停止する。
- `prepareNextScene()` — 次のシーンの準備を行う。
- `snap()` — 現在の画面のスナップショットを取得する。
- `snapForBackground()` — 背景用に現在の画面をスナップショットとして保存する。
- `backgroundBitmap()` — 背景用のスナップショットビットマップを返す。
- `resume()` — シーンの更新を再開する。

### BattleManager ⭐

戦闘進行を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `setup(troopId, canEscape, canLose)` — 戦闘をセットアップする（敵グループID、逃走可否、敗北可否）。
- `initMembers()` — メンバー変数を初期化する。
- `isTpb()` — タイムプログレスバトル（TPB）モードかを確認する。
- `isActiveTpb()` — アクティブTPBモードかを確認する。
- `isBattleTest()` — 戦闘テストモードかを確認する。
- `setBattleTest(battleTest)` — 戦闘テストモードを設定する。
- `setEventCallback(callback)` — 戦闘終了時のイベントコールバックを設定する。
- `setLogWindow(logWindow)` — 戦闘ログウィンドウを設定する。
- `setSpriteset(spriteset)` — 戦闘スプライトセットを設定する。
- `onEncounter()` — Encounter時のコールバック。
- `ratePreemptive()`
- `rateSurprise()`
- `saveBgmAndBgs()` — Bgm And Bgsを保存する。
- `playBattleBgm()` — 戦闘BGMを再生する。
- `playVictoryMe()` — Victory Meを再生する。
- `playDefeatMe()` — Defeat Meを再生する。
- `replayBgmAndBgs()`
- `makeEscapeRatio()` — Escape Ratioを作成する。
- `update(timeActive)` — 戦闘進行を毎フレーム更新する。
- `updatePhase(timeActive)` — 現在のフェーズに応じた更新処理。
- `updateEvent()` — 戦闘イベントの更新処理。
- `updateEventMain()` — 戦闘イベントのメイン更新処理。
- `isBusy()` — 戦闘がビジー状態（アニメーションやメッセージ表示中等）かを確認する。
- `updateTpbInput()` — Tpb Inputを更新する。
- `checkTpbInputClose()` — Tpb Input Closeをチェックする。
- `checkTpbInputOpen()` — Tpb Input Openをチェックする。
- `isPartyTpbInputtable()` — Party Tpb Inputtableかどうかを確認する。
- `needsActorInputCancel()` — Actor Input Cancelが必要かを確認する。
- `isTpbMainPhase()` — Tpb Main Phaseかどうかを確認する。
- `isInputting()` — Inputtingかどうかを確認する。
- `isInTurn()` — In Turnかどうかを確認する。
- `isTurnEnd()` — Turn Endかどうかを確認する。
- `isAborting()` — Abortingかどうかを確認する。
- `isBattleEnd()` — Battle Endかどうかを確認する。
- `canEscape()` — Escapeが可能かを確認する。
- `canLose()` — Loseが可能かを確認する。
- `isEscaped()` — 逃走済みかを確認する。
- `actor()` — アクターオブジェクトを返す。
- `startBattle()` — 戦闘を開始する。
- `displayStartMessages()` — Start Messagesを表示する。
- `startInput()` — 入力フェーズを開始する。
- `inputtingAction()`
- `selectNextCommand()` — Next Commandを選択する。
- `selectNextActor()` — Next Actorを選択する。
- `selectPreviousCommand()` — Previous Commandを選択する。
- `selectPreviousActor()` — Previous Actorを選択する。
- `changeCurrentActor(forward)` — Current Actorを変更する。
- `startActorInput()` — Actor Inputを開始する。
- `finishActorInput()`
- `cancelActorInput()`
- `updateStart()` — Startを更新する。
- `startTurn()` — ターンを開始する。
- `updateTurn(timeActive)` — ターンの更新処理。
- `updateTpb()` — Tpbを更新する。
- `updateAllTpbBattlers()` — All Tpb Battlersを更新する。
- `updateTpbBattler(battler)` — Tpb Battlerを更新する。
- `checkTpbTurnEnd()` — Tpb Turn Endをチェックする。
- `processTurn()` — Turnを処理する。
- `endBattlerActions(battler)` — Battler Actionsを終了する。
- `endTurn()` — ターンを終了する。
- `updateTurnEnd()` — ターン終了の更新処理。
- `endAllBattlersTurn()` — All Battlers Turnを終了する。
- `displayBattlerStatus(battler, current)` — Battler Statusを表示する。
- `getNextSubject()` — 次にアクションを実行するバトラーを取得する。
- `allBattleMembers()` — 戦闘に参加する全バトラーの配列を返す。
- `makeActionOrders()` — アクションの実行順序を決定する。
- `startAction()` — アクション実行を開始する。
- `updateAction()` — アクション実行の更新処理。
- `endAction()` — アクションを終了する。
- `invokeAction(subject, target)` — 対象にアクションを適用する。
- `invokeNormalAction(subject, target)` — 通常アクションを実行する。
- `invokeCounterAttack(subject, target)` — 反撃を実行する。
- `invokeMagicReflection(subject, target)` — 魔法反射を実行する。
- `applySubstitute(target)` — 身代わりを適用する。
- `checkSubstitute(target)` — 身代わり発動条件を確認する。
- `isActionForced()` — Action Forcedかどうかを確認する。
- `forceAction(battler)`
- `processForcedAction()` — Forced Actionを処理する。
- `abort()` — 戦闘を中断する。
- `checkBattleEnd()` — 戦闘終了条件を確認する。
- `checkAbort()` — 戦闘中断条件を確認する。
- `processVictory()` — 勝利処理を実行する。
- `processEscape()` — 逃走処理を実行する。
- `onEscapeSuccess()` — 逃走成功時の処理。
- `onEscapeFailure()` — 逃走失敗時の処理。
- `processPartyEscape()` — Party Escapeを処理する。
- `processAbort()` — 戦闘中断処理を実行する。
- `processDefeat()` — 敗北処理を実行する。
- `endBattle(result)` — Battleを終了する。
- `updateBattleEnd()` — Battle Endを更新する。
- `makeRewards()` — 戦闘報酬を作成する。
- `displayVictoryMessage()` — 勝利メッセージを表示する。
- `displayDefeatMessage()` — 敗北メッセージを表示する。
- `displayEscapeSuccessMessage()` — 逃走成功メッセージを表示する。
- `displayEscapeFailureMessage()` — 逃走失敗メッセージを表示する。
- `displayRewards()` — 報酬（経験値、ゴールド、アイテム）を表示する。
- `displayExp()` — 獲得経験値を表示する。
- `displayGold()` — 獲得ゴールドを表示する。
- `displayDropItems()` — 獲得アイテムを表示する。
- `gainRewards()` — 報酬を実際に獲得する。
- `gainExp()` — 経験値を獲得する。
- `gainGold()` — ゴールドを獲得する。
- `gainDropItems()` — ドロップアイテムをパーティに追加する。

### PluginManager ⭐

プラグインを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `setup(plugins)` — プラグインリストを読み込みセットアップする。
- `parameters(name)` — 指定されたプラグイン名のパラメータオブジェクトを返す。
- `setParameters(name, parameters)` — プラグインのパラメータを設定する。
- `loadScript(filename)` — プラグインスクリプトファイルを読み込む。
- `onError(e)` — プラグイン読み込みエラー時のコールバック。
- `makeUrl(filename)` — プラグインファイルのURLを生成する。
- `checkErrors()` — プラグインの読み込みエラーをチェックする。
- `throwLoadError(url)` — プラグイン読み込みエラーを投げる。
- `registerCommand(pluginName, commandName, func)` — プラグインコマンドを登録する。
- `callCommand(self, pluginName, commandName, args)` — 登録されたプラグインコマンドを呼び出す。

---

## Objects

ゲームロジックを構成する `Game_*` クラス群です。セーブデータとして保存されるものが多いです。 ( `rmmz_objects.js` )

### Game_Temp ⭐

セーブデータに含まれない一時データ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `isPlaytest()` — プレイテストモードかどうかを確認する。
- `setDestination(x, y)` — タッチ入力によるマップ上の移動先を設定する。
- `clearDestination()` — マップ上の移動先をクリアする。
- `isDestinationValid()` — 移動先が有効かどうかを確認する。
- `destinationX()` — 移動先のX座標を返す。
- `destinationY()` — 移動先のY座標を返す。
- `setTouchState(target, state)` — タッチ状態（対象と状態）を設定する。
- `clearTouchState()` — タッチ状態をクリアする。
- `touchTarget()` — タッチ対象を返す。
- `touchState()` — タッチ状態を返す。
- `requestBattleRefresh()` — 戦闘画面のリフレッシュを要求する。
- `clearBattleRefreshRequest()` — 戦闘リフレッシュ要求をクリアする。
- `isBattleRefreshRequested()` — 戦闘リフレッシュが要求されているかを確認する。
- `reserveCommonEvent(commonEventId)` — コモンイベントの実行を予約する。
- `retrieveCommonEvent()` — 予約されたコモンイベントを取り出す。
- `clearCommonEventReservation()` — コモンイベントの予約をクリアする。
- `isCommonEventReserved()` — コモンイベントが予約されているかを確認する。
- `retrieveAnimation()` — 要求されたアニメーション情報を取り出す。
- `requestBalloon(target, balloonId)` — フキダシアイコンの表示を要求する。
- `retrieveBalloon()` — 要求されたフキダシ情報を取り出す。
- `lastActionData(type)` — 最後のアクション情報を取得する。
- `setLastActionData(type, value)` — 最後のアクション情報を設定する。
- `setLastUsedSkillId(skillID)` — 最後に使用したスキルIDを設定する。
- `setLastUsedItemId(itemID)` — 最後に使用したアイテムIDを設定する。
- `setLastSubjectActorId(actorID)` — 最後の行動主体のアクターIDを設定する。
- `setLastSubjectEnemyIndex(enemyIndex)` — 最後の行動主体の敵インデックスを設定する。
- `setLastTargetActorId(actorID)` — 最後の対象アクターIDを設定する。
- `setLastTargetEnemyIndex(enemyIndex)` — 最後の対象敵インデックスを設定する。

### Game_System ⭐

システムデータ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `isJapanese()` — ロケールが日本語かを確認する。
- `isChinese()` — ロケールが中国語かを確認する。
- `isKorean()` — ロケールが韓国語かを確認する。
- `isCJK()` — ロケールがCJK（日中韓）かを確認する。
- `isRussian()` — ロケールがロシア語かを確認する。
- `isSideView()` — サイドビュー戦闘かを確認する。
- `isAutosaveEnabled()` — オートセーブが有効かを確認する。
- `isMessageSkipEnabled()` — メッセージスキップが有効かを確認する。
- `isSaveEnabled()` — セーブが許可されているかを確認する。
- `disableSave()` — セーブを禁止する。
- `enableSave()` — セーブを許可する。
- `isMenuEnabled()` — メニューが許可されているかを確認する。
- `disableMenu()` — メニューを禁止する。
- `enableMenu()` — メニューを許可する。
- `isEncounterEnabled()` — エンカウントが有効かを確認する。
- `disableEncounter()` — エンカウントを無効にする。
- `enableEncounter()` — エンカウントを有効にする。
- `isFormationEnabled()` — 隊列変更が許可されているかを確認する。
- `disableFormation()` — 隊列変更を禁止する。
- `enableFormation()` — 隊列変更を許可する。
- `battleCount()` — 戦闘回数を返す。
- `winCount()` — 勝利回数を返す。
- `escapeCount()` — 逃走回数を返す。
- `saveCount()` — セーブ回数を返す。
- `versionId()` — バージョンIDを返す。
- `savefileId()` — 現在のセーブファイルIDを返す。
- `setSavefileId(savefileId)` — セーブファイルIDを設定する。
- `windowTone()` — ウィンドウカラートーンを返す。
- `setWindowTone(value)` — ウィンドウカラートーンを設定する。
- `battleBgm()` — 戦闘BGMを返す。
- `setBattleBgm(value)` — 戦闘BGMを設定する。
- `victoryMe()` — 勝利MEを返す。
- `setVictoryMe(value)` — 勝利MEを設定する。
- `defeatMe()` — 敗北MEを返す。
- `setDefeatMe(value)` — 敗北MEを設定する。
- `onBattleStart()` — 戦闘開始時に呼ばれる（戦闘回数カウント）。
- `onBattleWin()` — 戦闘勝利時に呼ばれる（勝利回数カウント）。
- `onBattleEscape()` — 戦闘逃走時に呼ばれる（逃走回数カウント）。
- `onBeforeSave()` — セーブ前に呼ばれる（フレーム数・BGM等を保存）。
- `onAfterLoad()` — ロード後に呼ばれる（フレーム数・BGM等を復元）。
- `playtime()` — プレイ時間を秒で返す。
- `playtimeText()` — プレイ時間を "HH:MM:SS" 形式の文字列で返す。
- `saveBgm()` — 現在のBGMを保存する。
- `replayBgm()` — 保存したBGMを再生する。
- `saveWalkingBgm()` — 移動時のBGMを保存する。
- `replayWalkingBgm()` — 保存した移動時BGMを再生する。
- `saveWalkingBgm2()` — マップ指定のBGMを移動時BGMとして保存する。
- `mainFontFace()` — メインフォント名を返す。
- `numberFontFace()` — 数値用フォント名を返す。
- `mainFontSize()` — メインフォントサイズを返す。
- `windowPadding()` — ウィンドウのパディングサイズを返す（デフォルト: 12）。
- `windowOpacity()` — ウィンドウの不透明度を返す。

### Game_Timer

タイマー用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `update(sceneActive)` — タイマーを毎フレーム更新する。
- `start(count)` — タイマーを開始する（フレーム数指定）。
- `stop()` — タイマーを停止する。
- `isWorking()` — タイマーが動作中かを確認する。
- `seconds()` — 残り秒数を返す。
- `frames()` — 残りフレーム数を返す。
- `onExpire()` — タイマー満了時のコールバック（デフォルト: 戦闘中断）。

### Game_Message ⭐

テキストや選択肢などを表示するメッセージウィンドウの状態を管理するクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `clear()` — メッセージ状態をクリアする。
- `choices()` — 選択肢の配列を返す。
- `speakerName()` — 話者名を返す。
- `faceName()` — 顔画像のファイル名を返す。
- `faceIndex()` — 顔画像のインデックスを返す。
- `background()` — メッセージウィンドウの背景タイプを返す。
- `positionType()` — メッセージウィンドウの位置タイプを返す。
- `choiceDefaultType()` — 選択肢のデフォルトタイプを返す。
- `choiceCancelType()` — 選択肢のキャンセルタイプを返す。
- `choiceBackground()` — 選択肢の背景タイプを返す。
- `choicePositionType()` — 選択肢の位置タイプを返す。
- `numInputVariableId()` — 数値入力の変数IDを返す。
- `numInputMaxDigits()` — 数値入力の最大桁数を返す。
- `itemChoiceVariableId()` — アイテム選択の変数IDを返す。
- `itemChoiceItypeId()` — アイテム選択のアイテムタイプIDを返す。
- `scrollMode()` — スクロールモードかを確認する。
- `scrollSpeed()` — スクロール速度を返す。
- `scrollNoFast()` — スクロール早送り無効かを返す。
- `add(text)` — テキスト行を追加する。
- `setSpeakerName(speakerName)` — 話者名を設定する。
- `setFaceImage(faceName, faceIndex)` — 顔画像を設定する。
- `setBackground(background)` — 背景タイプを設定する。
- `setPositionType(positionType)` — 位置タイプを設定する。
- `setChoices(choices, defaultType, cancelType)` — 選択肢を設定する。
- `setChoiceBackground(background)` — 選択肢の背景タイプを設定する。
- `setChoicePositionType(positionType)` — 選択肢の位置タイプを設定する。
- `setNumberInput(variableId, maxDigits)` — 数値入力を設定する。
- `setItemChoice(variableId, itemType)` — アイテム選択を設定する。
- `setScroll(speed, noFast)` — スクロールモードを設定する。
- `setChoiceCallback(callback)` — 選択肢のコールバック関数を設定する。
- `onChoice(n)` — 選択肢が選ばれた時のコールバックを呼び出す。
- `hasText()` — テキストがあるかを確認する。
- `isChoice()` — 選択肢表示中かを確認する。
- `isNumberInput()` — 数値入力中かを確認する。
- `isItemChoice()` — アイテム選択中かを確認する。
- `isBusy()` — メッセージウィンドウがビジー状態かを確認する。
- `newPage()` — 新しいページを追加する。
- `allText()` — 全テキストを結合して返す。
- `isRTL()` — テキストが右から左（RTL）かを確認する。

### Game_Switches

スイッチ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `clear()` — 全スイッチをクリアする。
- `value(switchId)` — 指定されたスイッチIDの値を返す。
- `setValue(switchId, value)` — 指定されたスイッチIDの値を設定する。
- `onChange()` — スイッチ変更時のコールバック（マップリフレッシュ要求）。

### Game_Variables

変数用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `clear()` — 全変数をクリアする。
- `value(variableId)` — 指定された変数IDの値を返す。
- `setValue(variableId, value)` — 指定された変数IDの値を設定する。
- `onChange()` — 変数変更時のコールバック（マップリフレッシュ要求）。

### Game_SelfSwitches

セルフスイッチ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `clear()` — 全セルフスイッチをクリアする。
- `value(key)` — 指定されたキーのセルフスイッチ値を返す。
- `setValue(key, value)` — 指定されたキーのセルフスイッチ値を設定する。
- `onChange()` — セルフスイッチ変更時のコールバック。

### Game_Screen ⭐

色調変更やフラッシュなどの画面エフェクトデータ用のクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `clear()` — 全画面エフェクトをクリアする。
- `onBattleStart()` — 戦闘開始時にフェードとフラッシュをクリアする。
- `brightness()` — 画面の明るさを返す。
- `tone()` — 画面の色調を返す。
- `flashColor()` — フラッシュの色を返す。
- `shake()` — 画面の揺れ量を返す。
- `zoomX()` — ズームのX座標を返す。
- `zoomY()` — ズームのY座標を返す。
- `zoomScale()` — ズームの拡大率を返す。
- `weatherType()` — 天候の種類を返す。
- `weatherPower()` — 天候の強さを返す。
- `picture(pictureId)` — 指定されたIDのピクチャを返す。
- `realPictureId(pictureId)` — 実際のピクチャIDを返す（戦闘時はオフセット付き）。
- `clearFade()` — Fadeをクリアする。
- `clearTone()` — Toneをクリアする。
- `clearFlash()` — Flashをクリアする。
- `clearShake()` — Shakeをクリアする。
- `clearZoom()` — Zoomをクリアする。
- `clearWeather()` — Weatherをクリアする。
- `clearPictures()` — Picturesをクリアする。
- `eraseBattlePictures()` — Battle Picturesを消去する。
- `maxPictures()`
- `startFadeOut(duration)` — フェードアウトを開始する。
- `startFadeIn(duration)` — フェードインを開始する。
- `startTint(tone, duration)` — 画面の色調変更を開始する。
- `startFlash(color, duration)` — 画面フラッシュを開始する。
- `startShake(power, speed, duration)` — 画面の揺れを開始する。
- `startZoom(x, y, scale, duration)` — ズームを開始する。
- `setZoom(x, y, scale)` — ズームを即座に設定する。
- `changeWeather(type, power, duration)` — 天候を変更する。
- `update()` — 毎フレーム画面エフェクトを更新する。
- `updateFadeOut()` — フェードアウトを更新する。
- `updateFadeIn()` — フェードインを更新する。
- `updateTone()` — 色調変更を更新する。
- `updateFlash()` — フラッシュを更新する。
- `updateShake()` — 画面の揺れを更新する。
- `updateZoom()` — ズームを更新する。
- `updateWeather()` — 天候を更新する。
- `updatePictures()` — ピクチャを更新する。
- `startFlashForDamage()` — ダメージ用のフラッシュを開始する。
- `rotatePicture(pictureId, speed)` — ピクチャを回転する。
- `tintPicture(pictureId, tone, duration)` — ピクチャの色調を変更する。
- `erasePicture(pictureId)` — ピクチャを消去する。

### Game_Picture

ピクチャ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `name()` — 名前を返す。
- `origin()`
- `x()`
- `y()`
- `scaleX()`
- `scaleY()`
- `opacity()`
- `blendMode()`
- `tone()`
- `angle()`
- `initBasic()` — Basicを初期化する。
- `initTarget()` — Targetを初期化する。
- `initTone()` — Toneを初期化する。
- `initRotation()` — Rotationを初期化する。
- `rotate(speed)`
- `tint(tone, duration)`
- `update()` — 毎フレーム更新する。
- `updateMove()` — Moveを更新する。
- `updateTone()` — Toneを更新する。
- `updateRotation()` — Rotationを更新する。
- `applyEasing(current, target)` — Easingを適用する。
- `calcEasing(t)` — Easingを計算する。
- `easeIn(t, exponent)`
- `easeOut(t, exponent)`
- `easeInOut(t, exponent)`

### Game_Item

スキル・アイテム・武器・防具を扱うゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(item)` — 初期化する。
- `isSkill()` — Skillかどうかを確認する。
- `isItem()` — Itemかどうかを確認する。
- `isUsableItem()` — Usable Itemかどうかを確認する。
- `isWeapon()` — Weaponかどうかを確認する。
- `isArmor()` — Armorかどうかを確認する。
- `isEquipItem()` — Equip Itemかどうかを確認する。
- `isNull()` — Nullかどうかを確認する。
- `itemId()` — itemのIDを返す。
- `object()`
- `setObject(item)` — Objectを設定する。
- `setEquip(isWeapon, itemId)` — Equipを設定する。

### Game_Action ⭐

戦闘行動用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### 静的プロパティ

- `EFFECT_RECOVER_HP`
- `EFFECT_RECOVER_MP`
- `EFFECT_GAIN_TP`
- `EFFECT_ADD_STATE`
- `EFFECT_REMOVE_STATE`
- `EFFECT_ADD_BUFF`
- `EFFECT_ADD_DEBUFF`
- `EFFECT_REMOVE_BUFF`
- `EFFECT_REMOVE_DEBUFF`
- `EFFECT_SPECIAL`
- `EFFECT_GROW`
- `EFFECT_LEARN_SKILL`
- `EFFECT_COMMON_EVENT`
- `SPECIAL_EFFECT_ESCAPE`
- `HITTYPE_CERTAIN`
- `HITTYPE_PHYSICAL`
- `HITTYPE_MAGICAL`

#### インスタンスメソッド

- `initialize(subject, forcing)` — 初期化する。
- `clear()` — クリアする。
- `setSubject(subject)` — Subjectを設定する。
- `subject()`
- `friendsUnit()`
- `opponentsUnit()`
- `setEnemyAction(action)` — Enemy Actionを設定する。
- `setAttack()` — Attackを設定する。
- `setGuard()` — Guardを設定する。
- `setSkill(skillId)` — Skillを設定する。
- `setItem(itemId)` — Itemを設定する。
- `setItemObject(object)` — Item Objectを設定する。
- `setTarget(targetIndex)` — Targetを設定する。
- `item()` — 現在選択中の項目を返す。
- `isSkill()` — Skillかどうかを確認する。
- `isItem()` — Itemかどうかを確認する。
- `numRepeats()`
- `checkItemScope(list)` — Item Scopeをチェックする。
- `isForOpponent()` — For Opponentかどうかを確認する。
- `isForFriend()` — For Friendかどうかを確認する。
- `isForEveryone()` — For Everyoneかどうかを確認する。
- `isForAliveFriend()` — For Alive Friendかどうかを確認する。
- `isForDeadFriend()` — For Dead Friendかどうかを確認する。
- `isForUser()` — For Userかどうかを確認する。
- `isForOne()` — For Oneかどうかを確認する。
- `isForRandom()` — For Randomかどうかを確認する。
- `isForAll()` — For Allかどうかを確認する。
- `needsSelection()` — Selectionが必要かを確認する。
- `numTargets()`
- `checkDamageType(list)` — Damage Typeをチェックする。
- `isHpEffect()` — Hp Effectかどうかを確認する。
- `isMpEffect()` — Mp Effectかどうかを確認する。
- `isDamage()` — Damageかどうかを確認する。
- `isRecover()` — Recoverかどうかを確認する。
- `isDrain()` — Drainかどうかを確認する。
- `isHpRecover()` — Hp Recoverかどうかを確認する。
- `isMpRecover()` — Mp Recoverかどうかを確認する。
- `isCertainHit()` — Certain Hitかどうかを確認する。
- `isPhysical()` — Physicalかどうかを確認する。
- `isMagical()` — Magicalかどうかを確認する。
- `isAttack()` — Attackかどうかを確認する。
- `isGuard()` — Guardかどうかを確認する。
- `isMagicSkill()` — Magic Skillかどうかを確認する。
- `decideRandomTarget()`
- `setConfusion()` — Confusionを設定する。
- `prepare()`
- `isValid()` — Validかどうかを確認する。
- `speed()`
- `makeTargets()` — Targetsを作成する。
- `repeatTargets(targets)`
- `confusionTarget()`
- `targetsForEveryone()`
- `targetsForOpponents()`
- `targetsForFriends()`
- `randomTargets(unit)`
- `targetsForDead(unit)`
- `targetsForAlive(unit)`
- `targetsForDeadAndAlive(unit)`
- `evaluate()`
- `itemTargetCandidates()`
- `evaluateWithTarget(target)`
- `testApply(target)`
- `testLifeAndDeath(target)`
- `hasItemAnyValidEffects(target)` — Item Any Valid Effectsを持っているかを確認する。
- `testItemEffect(target, effect)`
- `itemCnt(target)`
- `itemMrf(target)`
- `itemHit(/*target*/)`
- `itemEva(target)`
- `itemCri(target)`
- `apply(target)`
- `makeDamageValue(target, critical)` — Damage Valueを作成する。
- `evalDamageFormula(target)` — Damage Formulaを評価する。
- `calcElementRate(target)` — Element Rateを計算する。
- `elementsMaxRate(target, elements)` — elements Maxの倍率を返す。
- `applyCritical(damage)` — Criticalを適用する。
- `applyVariance(damage, variance)` — Varianceを適用する。
- `applyGuard(damage, target)` — Guardを適用する。
- `executeDamage(target, value)` — Damageを実行する。
- `executeHpDamage(target, value)` — Hp Damageを実行する。
- `executeMpDamage(target, value)` — Mp Damageを実行する。
- `gainDrainedHp(value)` — Drained Hpを獲得する。
- `gainDrainedMp(value)` — Drained Mpを獲得する。
- `applyItemEffect(target, effect)` — Item Effectを適用する。
- `itemEffectRecoverHp(target, effect)`
- `itemEffectRecoverMp(target, effect)`
- `itemEffectGainTp(target, effect)`
- `itemEffectAddState(target, effect)`
- `itemEffectAddAttackState(target, effect)`
- `itemEffectAddNormalState(target, effect)`
- `itemEffectRemoveState(target, effect)`
- `itemEffectAddBuff(target, effect)`
- `itemEffectAddDebuff(target, effect)`
- `itemEffectRemoveBuff(target, effect)`
- `itemEffectRemoveDebuff(target, effect)`
- `itemEffectSpecial(target, effect)`
- `itemEffectGrow(target, effect)`
- `itemEffectLearnSkill(target, effect)`
- `itemEffectCommonEvent(/*target, effect*/)`
- `makeSuccess(target)` — Successを作成する。
- `applyItemUserEffect(/*target*/)` — Item User Effectを適用する。
- `lukEffectRate(target)` — luk Effectの倍率を返す。
- `applyGlobal()` — Globalを適用する。
- `updateLastUsed()` — Last Usedを更新する。
- `updateLastSubject()` — Last Subjectを更新する。
- `updateLastTarget(target)` — Last Targetを更新する。

### Game_ActionResult

戦闘行動の結果用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `clear()` — クリアする。
- `addedStateObjects()`
- `removedStateObjects()`
- `isStatusAffected()` — Status Affectedかどうかを確認する。
- `isHit()` — Hitかどうかを確認する。
- `isStateAdded(stateId)` — State Addedかどうかを確認する。
- `pushAddedState(stateId)`
- `isStateRemoved(stateId)` — State Removedかどうかを確認する。
- `pushRemovedState(stateId)`
- `isBuffAdded(paramId)` — Buff Addedかどうかを確認する。
- `pushAddedBuff(paramId)`
- `isDebuffAdded(paramId)` — Debuff Addedかどうかを確認する。
- `pushAddedDebuff(paramId)`
- `isBuffRemoved(paramId)` — Buff Removedかどうかを確認する。
- `pushRemovedBuff(paramId)`

### Game_BattlerBase ⭐

Game_Battlerのスーパークラス。主にパラメータ計算を行う。

- **ソースファイル**: `rmmz_objects.js`


#### 静的プロパティ

- `TRAIT_ELEMENT_RATE`
- `TRAIT_DEBUFF_RATE`
- `TRAIT_STATE_RATE`
- `TRAIT_STATE_RESIST`
- `TRAIT_PARAM`
- `TRAIT_XPARAM`
- `TRAIT_SPARAM`
- `TRAIT_ATTACK_ELEMENT`
- `TRAIT_ATTACK_STATE`
- `TRAIT_ATTACK_SPEED`
- `TRAIT_ATTACK_TIMES`
- `TRAIT_ATTACK_SKILL`
- `TRAIT_STYPE_ADD`
- `TRAIT_STYPE_SEAL`
- `TRAIT_SKILL_ADD`
- `TRAIT_SKILL_SEAL`
- `TRAIT_EQUIP_WTYPE`
- `TRAIT_EQUIP_ATYPE`
- `TRAIT_EQUIP_LOCK`
- `TRAIT_EQUIP_SEAL`
- `TRAIT_SLOT_TYPE`
- `TRAIT_ACTION_PLUS`
- `TRAIT_SPECIAL_FLAG`
- `TRAIT_COLLAPSE_TYPE`
- `TRAIT_PARTY_ABILITY`
- `FLAG_ID_AUTO_BATTLE`
- `FLAG_ID_GUARD`
- `FLAG_ID_SUBSTITUTE`
- `FLAG_ID_PRESERVE_TP`
- `ICON_BUFF_START`
- `ICON_DEBUFF_START`

#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `clearParamPlus()` — Param Plusをクリアする。
- `clearStates()` — Statesをクリアする。
- `eraseState(stateId)` — Stateを消去する。
- `isStateAffected(stateId)` — State Affectedかどうかを確認する。
- `isDeathStateAffected()` — Death State Affectedかどうかを確認する。
- `deathStateId()` — death StateのIDを返す。
- `resetStateCounts(stateId)` — State Countsをリセットする。
- `isStateExpired(stateId)` — State Expiredかどうかを確認する。
- `updateStateTurns()` — State Turnsを更新する。
- `clearBuffs()` — Buffsをクリアする。
- `eraseBuff(paramId)` — Buffを消去する。
- `buffLength()`
- `buff(paramId)`
- `isBuffAffected(paramId)` — Buff Affectedかどうかを確認する。
- `isDebuffAffected(paramId)` — Debuff Affectedかどうかを確認する。
- `isBuffOrDebuffAffected(paramId)` — Buff Or Debuff Affectedかどうかを確認する。
- `isMaxBuffAffected(paramId)` — Max Buff Affectedかどうかを確認する。
- `isMaxDebuffAffected(paramId)` — Max Debuff Affectedかどうかを確認する。
- `increaseBuff(paramId)`
- `decreaseBuff(paramId)`
- `overwriteBuffTurns(paramId, turns)`
- `isBuffExpired(paramId)` — Buff Expiredかどうかを確認する。
- `updateBuffTurns()` — Buff Turnsを更新する。
- `die()`
- `revive()`
- `states()`
- `stateIcons()`
- `buffIcons()`
- `buffIconIndex(buffLevel, paramId)`
- `allIcons()`
- `traitObjects()`
- `allTraits()`
- `traits(code)`
- `traitsWithId(code, id)` — traits WithのIDを返す。
- `traitsPi(code, id)`
- `traitsSum(code, id)`
- `traitsSumAll(code)`
- `traitsSet(code)`
- `paramBase(/*paramId*/)`
- `paramPlus(paramId)`
- `paramBasePlus(paramId)`
- `paramMin(paramId)`
- `paramMax(/*paramId*/)`
- `paramRate(paramId)` — paramの倍率を返す。
- `paramBuffRate(paramId)` — param Buffの倍率を返す。
- `param(paramId)` — 指定されたパラメータIDの値を返す。
- `xparam(xparamId)` — 追加パラメータの値を返す。
- `sparam(sparamId)` — 特殊パラメータの値を返す。
- `elementRate(elementId)` — elementの倍率を返す。
- `debuffRate(paramId)` — debuffの倍率を返す。
- `stateRate(stateId)` — stateの倍率を返す。
- `stateResistSet()`
- `isStateResist(stateId)` — State Resistかどうかを確認する。
- `attackElements()`
- `attackStates()`
- `attackStatesRate(stateId)` — attack Statesの倍率を返す。
- `attackSpeed()`
- `attackTimesAdd()`
- `attackSkillId()` — attack SkillのIDを返す。
- `addedSkillTypes()`
- `isSkillTypeSealed(stypeId)` — Skill Type Sealedかどうかを確認する。
- `addedSkills()`
- `isSkillSealed(skillId)` — Skill Sealedかどうかを確認する。
- `isEquipWtypeOk(wtypeId)` — Equip Wtype Okかどうかを確認する。
- `isEquipAtypeOk(atypeId)` — Equip Atype Okかどうかを確認する。
- `isEquipTypeLocked(etypeId)` — Equip Type Lockedかどうかを確認する。
- `isEquipTypeSealed(etypeId)` — Equip Type Sealedかどうかを確認する。
- `slotType()`
- `isDualWield()` — Dual Wieldかどうかを確認する。
- `actionPlusSet()`
- `specialFlag(flagId)`
- `collapseType()`
- `partyAbility(abilityId)`
- `isAutoBattle()` — Auto Battleかどうかを確認する。
- `isGuard()` — Guardかどうかを確認する。
- `isSubstitute()` — Substituteかどうかを確認する。
- `isPreserveTp()` — Preserve Tpかどうかを確認する。
- `addParam(paramId, value)` — Paramを追加する。
- `setHp(hp)` — Hpを設定する。
- `setMp(mp)` — Mpを設定する。
- `setTp(tp)` — Tpを設定する。
- `maxTp()`
- `refresh()` — 再描画・更新する。
- `recoverAll()`
- `hpRate()` — hpの倍率を返す。
- `mpRate()` — mpの倍率を返す。
- `tpRate()` — tpの倍率を返す。
- `hide()` — 非表示にする。
- `appear()`
- `isHidden()` — Hiddenかどうかを確認する。
- `isAppeared()` — Appearedかどうかを確認する。
- `isDead()` — 戦闘不能かを確認する。
- `isAlive()` — 生存しているかを確認する。
- `isDying()` — 瀕死かを確認する。
- `isRestricted()` — Restrictedかどうかを確認する。
- `canInput()` — 入力可能かを確認する。
- `canMove()` — 行動可能かを確認する。
- `isConfused()` — Confusedかどうかを確認する。
- `confusionLevel()`
- `isActor()` — アクターかを確認する。
- `isEnemy()` — 敵かを確認する。
- `sortStates()`
- `restriction()`
- `addNewState(stateId)` — New Stateを追加する。
- `onRestrict()` — Restrict時のコールバック。
- `mostImportantStateText()` — most Important Stateテキストを返す。
- `stateMotionIndex()`
- `stateOverlayIndex()`
- `isSkillWtypeOk(/*skill*/)` — Skill Wtype Okかどうかを確認する。
- `skillMpCost(skill)`
- `skillTpCost(skill)`
- `canPaySkillCost(skill)` — Pay Skill Costが可能かを確認する。
- `paySkillCost(skill)`
- `isOccasionOk(item)` — Occasion Okかどうかを確認する。
- `meetsUsableItemConditions(item)`
- `meetsSkillConditions(skill)`
- `meetsItemConditions(item)`
- `canUse(item)` — Useが可能かを確認する。
- `canEquip(item)` — Equipが可能かを確認する。
- `canEquipWeapon(item)` — Equip Weaponが可能かを確認する。
- `canEquipArmor(item)` — Equip Armorが可能かを確認する。
- `guardSkillId()` — guard SkillのIDを返す。
- `canAttack()` — Attackが可能かを確認する。
- `canGuard()` — Guardが可能かを確認する。

### Game_Battler ⭐

Game_ActorとGame_Enemyのスーパークラス。スプライトやアクション関連のメソッドを含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → **Game_Battler**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `clearDamagePopup()` — Damage Popupをクリアする。
- `clearWeaponAnimation()` — Weapon Animationをクリアする。
- `clearEffect()` — Effectをクリアする。
- `clearMotion()` — Motionをクリアする。
- `requestEffect(effectType)` — Effectを要求する。
- `requestMotion(motionType)` — Motionを要求する。
- `requestMotionRefresh()` — Motion Refreshを要求する。
- `cancelMotionRefresh()`
- `select()` — 選択する。
- `deselect()` — 選択を解除する。
- `isDamagePopupRequested()` — Damage Popup Requestedかどうかを確認する。
- `isEffectRequested()` — Effect Requestedかどうかを確認する。
- `isMotionRequested()` — Motion Requestedかどうかを確認する。
- `isWeaponAnimationRequested()` — Weapon Animation Requestedかどうかを確認する。
- `isMotionRefreshRequested()` — Motion Refresh Requestedかどうかを確認する。
- `isSelected()` — Selectedかどうかを確認する。
- `effectType()`
- `motionType()`
- `weaponImageId()` — weapon ImageのIDを返す。
- `startDamagePopup()` — Damage Popupを開始する。
- `shouldPopupDamage()` — Popup Damageすべきかを確認する。
- `startWeaponAnimation(weaponImageId)` — Weapon Animationを開始する。
- `action(index)`
- `setAction(index, action)` — Actionを設定する。
- `numActions()`
- `clearActions()` — Actionsをクリアする。
- `result()`
- `clearResult()` — Resultをクリアする。
- `clearTpbChargeTime()` — Tpb Charge Timeをクリアする。
- `applyTpbPenalty()` — Tpb Penaltyを適用する。
- `initTpbChargeTime(advantageous)` — Tpb Charge Timeを初期化する。
- `tpbChargeTime()`
- `startTpbCasting()` — Tpb Castingを開始する。
- `startTpbAction()` — Tpb Actionを開始する。
- `isTpbCharged()` — Tpb Chargedかどうかを確認する。
- `isTpbReady()` — Tpb Readyかどうかを確認する。
- `isTpbTimeout()` — Tpb Timeoutかどうかを確認する。
- `updateTpb()` — Tpbを更新する。
- `updateTpbChargeTime()` — Tpb Charge Timeを更新する。
- `updateTpbCastTime()` — Tpb Cast Timeを更新する。
- `updateTpbAutoBattle()` — Tpb Auto Battleを更新する。
- `updateTpbIdleTime()` — Tpb Idle Timeを更新する。
- `tpbAcceleration()`
- `tpbRelativeSpeed()`
- `tpbSpeed()`
- `tpbBaseSpeed()`
- `tpbRequiredCastTime()`
- `onTpbCharged()` — Tpb Charged時のコールバック。
- `shouldDelayTpbCharge()` — Delay Tpb Chargeすべきかを確認する。
- `finishTpbCharge()`
- `isTpbTurnEnd()` — Tpb Turn Endかどうかを確認する。
- `initTpbTurn()` — Tpb Turnを初期化する。
- `startTpbTurn()` — Tpb Turnを開始する。
- `makeTpbActions()` — Tpb Actionsを作成する。
- `onTpbTimeout()` — Tpb Timeout時のコールバック。
- `turnCount()`
- `canInput()` — 入力可能かを確認する。
- `refresh()` — 再描画・更新する。
- `addState(stateId)` — Stateを追加する。
- `isStateAddable(stateId)` — State Addableかどうかを確認する。
- `isStateRestrict(stateId)` — State Restrictかどうかを確認する。
- `onRestrict()` — Restrict時のコールバック。
- `removeState(stateId)` — Stateを削除する。
- `escape()`
- `addBuff(paramId, turns)` — Buffを追加する。
- `addDebuff(paramId, turns)` — Debuffを追加する。
- `removeBuff(paramId)` — Buffを削除する。
- `removeBattleStates()` — Battle Statesを削除する。
- `removeAllBuffs()` — All Buffsを削除する。
- `removeStatesAuto(timing)` — States Autoを削除する。
- `removeBuffsAuto()` — Buffs Autoを削除する。
- `removeStatesByDamage()` — States By Damageを削除する。
- `makeActionTimes()` — Action Timesを作成する。
- `makeActions()` — Actionsを作成する。
- `speed()`
- `makeSpeed()` — Speedを作成する。
- `currentAction()`
- `removeCurrentAction()` — Current Actionを削除する。
- `setLastTarget(target)` — Last Targetを設定する。
- `forceAction(skillId, targetIndex)`
- `useItem(item)`
- `consumeItem(item)`
- `gainHp(value)` — Hpを獲得する。
- `gainMp(value)` — Mpを獲得する。
- `gainTp(value)` — Tpを獲得する。
- `gainSilentTp(value)` — Silent Tpを獲得する。
- `initTp()` — Tpを初期化する。
- `clearTp()` — Tpをクリアする。
- `chargeTpByDamage(damageRate)`
- `regenerateHp()`
- `maxSlipDamage()`
- `regenerateMp()`
- `regenerateTp()`
- `regenerateAll()`
- `onBattleStart(advantageous)` — Battle Start時のコールバック。
- `onAllActionsEnd()` — All Actions End時のコールバック。
- `onTurnEnd()` — Turn End時のコールバック。
- `onBattleEnd()` — Battle End時のコールバック。
- `onDamage(value)` — Damage時のコールバック。
- `setActionState(actionState)` — Action Stateを設定する。
- `isUndecided()` — Undecidedかどうかを確認する。
- `isInputting()` — Inputtingかどうかを確認する。
- `isWaiting()` — Waitingかどうかを確認する。
- `isActing()` — Actingかどうかを確認する。
- `isChanting()` — Chantingかどうかを確認する。
- `isGuardWaiting()` — Guard Waitingかどうかを確認する。
- `performActionStart(action)` — Action Startの演出を実行する。
- `performAction(/*action*/)` — Actionの演出を実行する。
- `performActionEnd()` — Action Endの演出を実行する。
- `performDamage()` — Damageの演出を実行する。
- `performMiss()` — Missの演出を実行する。
- `performRecovery()` — Recoveryの演出を実行する。
- `performEvasion()` — Evasionの演出を実行する。
- `performMagicEvasion()` — Magic Evasionの演出を実行する。
- `performCounter()` — Counterの演出を実行する。
- `performReflection()` — Reflectionの演出を実行する。
- `performSubstitute(/*target*/)` — Substituteの演出を実行する。
- `performCollapse()` — Collapseの演出を実行する。

### Game_Actor ⭐

アクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Actor**


#### プロパティ

- `level` — レベルを返す。

#### インスタンスメソッド

- `initialize(actorId)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `setup(actorId)` — セットアップする。
- `actorId()` — actorのIDを返す。
- `actor()` — アクターオブジェクトを返す。
- `name()` — 名前を返す。
- `setName(name)` — Nameを設定する。
- `nickname()`
- `setNickname(nickname)` — Nicknameを設定する。
- `profile()`
- `setProfile(profile)` — Profileを設定する。
- `characterName()` — characterの名前を返す。
- `characterIndex()`
- `faceName()` — faceの名前を返す。
- `faceIndex()`
- `battlerName()` — battlerの名前を返す。
- `clearStates()` — Statesをクリアする。
- `eraseState(stateId)` — Stateを消去する。
- `resetStateCounts(stateId)` — State Countsをリセットする。
- `initImages()` — Imagesを初期化する。
- `expForLevel(level)`
- `initExp()` — Expを初期化する。
- `currentExp()`
- `currentLevelExp()`
- `nextLevelExp()`
- `nextRequiredExp()`
- `maxLevel()`
- `isMaxLevel()` — Max Levelかどうかを確認する。
- `initSkills()` — Skillsを初期化する。
- `initEquips(equips)` — Equipsを初期化する。
- `equipSlots()`
- `equips()` — 装備品の配列を返す。
- `weapons()` — 装備中の武器の配列を返す。
- `armors()` — 装備中の防具の配列を返す。
- `hasWeapon(weapon)` — Weaponを持っているかを確認する。
- `hasArmor(armor)` — Armorを持っているかを確認する。
- `isEquipChangeOk(slotId)` — Equip Change Okかどうかを確認する。
- `changeEquip(slotId, item)` — Equipを変更する。
- `forceChangeEquip(slotId, item)`
- `tradeItemWithParty(newItem, oldItem)`
- `changeEquipById(etypeId, itemId)` — Equip By Idを変更する。
- `isEquipped(item)` — Equippedかどうかを確認する。
- `discardEquip(item)`
- `releaseUnequippableItems(forcing)`
- `clearEquipments()` — Equipmentsをクリアする。
- `optimizeEquipments()`
- `bestEquipItem(slotId)`
- `calcEquipItemPerformance(item)` — Equip Item Performanceを計算する。
- `isSkillWtypeOk(skill)` — Skill Wtype Okかどうかを確認する。
- `isWtypeEquipped(wtypeId)` — Wtype Equippedかどうかを確認する。
- `refresh()` — 再描画・更新する。
- `hide()` — 非表示にする。
- `isActor()` — アクターかを確認する。
- `friendsUnit()`
- `opponentsUnit()`
- `index()` — 現在のインデックスを返す。
- `isBattleMember()` — Battle Memberかどうかを確認する。
- `isFormationChangeOk()` — Formation Change Okかどうかを確認する。
- `currentClass()`
- `isClass(gameClass)` — Classかどうかを確認する。
- `skillTypes()`
- `skills()` — 使用可能なスキルの配列を返す。
- `usableSkills()`
- `traitObjects()`
- `attackElements()`
- `hasNoWeapons()` — No Weaponsを持っているかを確認する。
- `bareHandsElementId()` — bare Hands ElementのIDを返す。
- `paramBase(paramId)`
- `paramPlus(paramId)`
- `attackAnimationId1()`
- `attackAnimationId2()`
- `bareHandsAnimationId()` — bare Hands AnimationのIDを返す。
- `changeExp(exp, show)` — Expを変更する。
- `levelUp()`
- `levelDown()`
- `findNewSkills(lastSkills)` — New Skillsを検索する。
- `displayLevelUp(newSkills)` — Level Upを表示する。
- `gainExp(exp)` — Expを獲得する。
- `finalExpRate()` — final Expの倍率を返す。
- `benchMembersExpRate()` — bench Members Expの倍率を返す。
- `shouldDisplayLevelUp()` — Display Level Upすべきかを確認する。
- `changeLevel(level, show)` — Levelを変更する。
- `learnSkill(skillId)`
- `forgetSkill(skillId)`
- `isLearnedSkill(skillId)` — Learned Skillかどうかを確認する。
- `hasSkill(skillId)` — Skillを持っているかを確認する。
- `changeClass(classId, keepExp)` — Classを変更する。
- `setFaceImage(faceName, faceIndex)` — Face Imageを設定する。
- `setBattlerImage(battlerName)` — Battler Imageを設定する。
- `isSpriteVisible()` — Sprite Visibleかどうかを確認する。
- `performActionStart(action)` — Action Startの演出を実行する。
- `performAction(action)` — Actionの演出を実行する。
- `performActionEnd()` — Action Endの演出を実行する。
- `performAttack()` — Attackの演出を実行する。
- `performDamage()` — Damageの演出を実行する。
- `performEvasion()` — Evasionの演出を実行する。
- `performMagicEvasion()` — Magic Evasionの演出を実行する。
- `performCounter()` — Counterの演出を実行する。
- `performCollapse()` — Collapseの演出を実行する。
- `performVictory()` — Victoryの演出を実行する。
- `performEscape()` — Escapeの演出を実行する。
- `makeActionList()` — Action Listを作成する。
- `makeAutoBattleActions()` — Auto Battle Actionsを作成する。
- `makeConfusionActions()` — Confusion Actionsを作成する。
- `makeActions()` — Actionsを作成する。
- `onPlayerWalk()` — Player Walk時のコールバック。
- `updateStateSteps(state)` — State Stepsを更新する。
- `showAddedStates()` — Added Statesを表示する。
- `showRemovedStates()` — Removed Statesを表示する。
- `stepsForTurn()`
- `turnEndOnMap()`
- `checkFloorEffect()` — Floor Effectをチェックする。
- `executeFloorDamage()` — Floor Damageを実行する。
- `basicFloorDamage()`
- `maxFloorDamage()`
- `performMapDamage()` — Map Damageの演出を実行する。
- `clearActions()` — Actionsをクリアする。
- `inputtingAction()`
- `selectNextCommand()` — Next Commandを選択する。
- `selectPreviousCommand()` — Previous Commandを選択する。
- `lastSkill()`
- `lastMenuSkill()`
- `setLastMenuSkill(skill)` — Last Menu Skillを設定する。
- `lastBattleSkill()`
- `setLastBattleSkill(skill)` — Last Battle Skillを設定する。
- `lastCommandSymbol()`
- `setLastCommandSymbol(symbol)` — Last Command Symbolを設定する。
- `testEscape(item)`
- `meetsUsableItemConditions(item)`
- `onEscapeFailure()` — Escape Failure時のコールバック。

### Game_Enemy ⭐

敵キャラクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Enemy**


#### インスタンスメソッド

- `initialize(enemyId, x, y)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `setup(enemyId, x, y)` — セットアップする。
- `isEnemy()` — 敵かを確認する。
- `friendsUnit()`
- `opponentsUnit()`
- `index()` — 現在のインデックスを返す。
- `isBattleMember()` — Battle Memberかどうかを確認する。
- `enemyId()` — enemyのIDを返す。
- `enemy()` — 敵オブジェクトを返す。
- `traitObjects()`
- `paramBase(paramId)`
- `exp()`
- `gold()`
- `makeDropItems()` — Drop Itemsを作成する。
- `dropItemRate()` — drop Itemの倍率を返す。
- `itemObject(kind, dataId)`
- `isSpriteVisible()` — Sprite Visibleかどうかを確認する。
- `screenX()`
- `screenY()`
- `battlerName()` — battlerの名前を返す。
- `battlerHue()`
- `originalName()` — originalの名前を返す。
- `name()` — 名前を返す。
- `isLetterEmpty()` — Letter Emptyかどうかを確認する。
- `setLetter(letter)` — Letterを設定する。
- `setPlural(plural)` — Pluralを設定する。
- `performActionStart(action)` — Action Startの演出を実行する。
- `performAction(action)` — Actionの演出を実行する。
- `performActionEnd()` — Action Endの演出を実行する。
- `performDamage()` — Damageの演出を実行する。
- `performCollapse()` — Collapseの演出を実行する。
- `transform(enemyId)`
- `meetsCondition(action)`
- `meetsTurnCondition(param1, param2)`
- `meetsHpCondition(param1, param2)`
- `meetsMpCondition(param1, param2)`
- `meetsStateCondition(param)`
- `meetsPartyLevelCondition(param)`
- `meetsSwitchCondition(param)`
- `isActionValid(action)` — Action Validかどうかを確認する。
- `selectAction(actionList, ratingZero)` — Actionを選択する。
- `selectAllActions(actionList)` — All Actionsを選択する。
- `makeActions()` — Actionsを作成する。

### Game_Actors

アクター配列のラッパークラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `actor(actorId)` — アクターオブジェクトを返す。

### Game_Unit

Game_PartyとGame_Troopのスーパークラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `inBattle()`
- `members()` — メンバーの配列を返す。
- `aliveMembers()`
- `deadMembers()`
- `movableMembers()`
- `clearActions()` — Actionsをクリアする。
- `agility()`
- `tgrSum()`
- `randomTarget()`
- `randomDeadTarget()`
- `smoothTarget(index)` — Targetをスムーズに変更する。
- `smoothDeadTarget(index)` — Dead Targetをスムーズに変更する。
- `clearResults()` — Resultsをクリアする。
- `onBattleStart(advantageous)` — Battle Start時のコールバック。
- `onBattleEnd()` — Battle End時のコールバック。
- `makeActions()` — Actionsを作成する。
- `select(activeMember)` — 選択する。
- `isAllDead()` — All Deadかどうかを確認する。
- `substituteBattler(target)`
- `tpbBaseSpeed()`
- `tpbReferenceTime()`
- `updateTpb()` — Tpbを更新する。

### Game_Party ⭐

パーティ用のゲームオブジェクトクラス。所持金やアイテムなどの情報を含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_Unit` → **Game_Party**


#### 静的プロパティ

- `ABILITY_ENCOUNTER_HALF`
- `ABILITY_ENCOUNTER_NONE`
- `ABILITY_CANCEL_SURPRISE`
- `ABILITY_RAISE_PREEMPTIVE`
- `ABILITY_GOLD_DOUBLE`
- `ABILITY_DROP_ITEM_DOUBLE`

#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initAllItems()` — All Itemsを初期化する。
- `exists()`
- `size()`
- `isEmpty()` — Emptyかどうかを確認する。
- `members()` — メンバーの配列を返す。
- `allMembers()`
- `battleMembers()`
- `hiddenBattleMembers()`
- `allBattleMembers()`
- `maxBattleMembers()`
- `leader()` — リーダーを返す。
- `removeInvalidMembers()` — Invalid Membersを削除する。
- `reviveBattleMembers()`
- `items()` — アイテムの配列を返す。
- `weapons()` — 装備中の武器の配列を返す。
- `armors()` — 装備中の防具の配列を返す。
- `equipItems()`
- `allItems()`
- `itemContainer(item)`
- `setupStartingMembers()` — Starting Membersをセットアップする。
- `name()` — 名前を返す。
- `setupBattleTest()` — Battle Testをセットアップする。
- `setupBattleTestMembers()` — Battle Test Membersをセットアップする。
- `setupBattleTestItems()` — Battle Test Itemsをセットアップする。
- `highestLevel()`
- `addActor(actorId)` — Actorを追加する。
- `removeActor(actorId)` — Actorを削除する。
- `gold()`
- `gainGold(amount)` — Goldを獲得する。
- `loseGold(amount)` — Goldを失う。
- `maxGold()`
- `steps()`
- `increaseSteps()`
- `numItems(item)`
- `maxItems(/*item*/)` — 項目の最大数を返す。
- `hasMaxItems(item)` — Max Itemsを持っているかを確認する。
- `hasItem(item, includeEquip)` — Itemを持っているかを確認する。
- `isAnyMemberEquipped(item)` — Any Member Equippedかどうかを確認する。
- `gainItem(item, amount, includeEquip)` — Itemを獲得する。
- `discardMembersEquip(item, amount)`
- `loseItem(item, amount, includeEquip)` — Itemを失う。
- `consumeItem(item)`
- `canUse(item)` — Useが可能かを確認する。
- `canInput()` — 入力可能かを確認する。
- `isAllDead()` — All Deadかどうかを確認する。
- `isEscaped()` — Escapedかどうかを確認する。
- `onPlayerWalk()` — Player Walk時のコールバック。
- `menuActor()`
- `setMenuActor(actor)` — Menu Actorを設定する。
- `makeMenuActorNext()` — Menu Actor Nextを作成する。
- `makeMenuActorPrevious()` — Menu Actor Previousを作成する。
- `targetActor()`
- `setTargetActor(actor)` — Target Actorを設定する。
- `lastItem()`
- `setLastItem(item)` — Last Itemを設定する。
- `swapOrder(index1, index2)`
- `charactersForSavefile()`
- `facesForSavefile()`
- `partyAbility(abilityId)`
- `hasEncounterHalf()` — Encounter Halfを持っているかを確認する。
- `hasEncounterNone()` — Encounter Noneを持っているかを確認する。
- `hasCancelSurprise()` — Cancel Surpriseを持っているかを確認する。
- `hasRaisePreemptive()` — Raise Preemptiveを持っているかを確認する。
- `hasGoldDouble()` — Gold Doubleを持っているかを確認する。
- `hasDropItemDouble()` — Drop Item Doubleを持っているかを確認する。
- `ratePreemptive(troopAgi)`
- `rateSurprise(troopAgi)`
- `performVictory()` — Victoryの演出を実行する。
- `performEscape()` — Escapeの演出を実行する。
- `removeBattleStates()` — Battle Statesを削除する。
- `requestMotionRefresh()` — Motion Refreshを要求する。
- `onEscapeFailure()` — Escape Failure時のコールバック。

### Game_Troop ⭐

敵グループおよび戦闘関連データ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_Unit` → **Game_Troop**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `isEventRunning()` — Event Runningかどうかを確認する。
- `updateInterpreter()` — Interpreterを更新する。
- `turnCount()`
- `members()` — メンバーの配列を返す。
- `clear()` — クリアする。
- `troop()`
- `setup(troopId)` — セットアップする。
- `makeUniqueNames()` — Unique Namesを作成する。
- `updatePluralFlags()` — Plural Flagsを更新する。
- `letterTable()`
- `enemyNames()`
- `meetsConditions(page)`
- `setupBattleEvent()` — Battle Eventをセットアップする。
- `increaseTurn()`
- `expTotal()`
- `goldTotal()`
- `goldRate()` — goldの倍率を返す。
- `makeDropItems()` — Drop Itemsを作成する。
- `isTpbTurnEnd()` — Tpb Turn Endかどうかを確認する。

### Game_Map ⭐

マップ用のゲームオブジェクトクラス。スクロールや通行判定の機能を含む。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setup(mapId)` — セットアップする。
- `isEventRunning()` — Event Runningかどうかを確認する。
- `tileWidth()` — tileの幅を返す。
- `tileHeight()` — tileの高さを返す。
- `bushDepth()`
- `mapId()` — mapのIDを返す。
- `tilesetId()` — tilesetのIDを返す。
- `displayX()` — Xを表示する。
- `displayY()` — Yを表示する。
- `parallaxName()` — parallaxの名前を返す。
- `battleback1Name()` — battleback1の名前を返す。
- `battleback2Name()` — battleback2の名前を返す。
- `requestRefresh()` — Refreshを要求する。
- `isNameDisplayEnabled()` — Name Display Enabledかどうかを確認する。
- `disableNameDisplay()` — Name Displayを無効にする。
- `enableNameDisplay()` — Name Displayを有効にする。
- `createVehicles()` — Vehiclesを作成する。
- `refereshVehicles()`
- `vehicles()`
- `vehicle(type)`
- `boat()`
- `ship()`
- `airship()`
- `setupEvents()` — Eventsをセットアップする。
- `events()`
- `event(eventId)`
- `eraseEvent(eventId)` — Eventを消去する。
- `autorunCommonEvents()`
- `parallelCommonEvents()`
- `setupScroll()` — Scrollをセットアップする。
- `setupParallax()` — Parallaxをセットアップする。
- `setupBattleback()` — Battlebackをセットアップする。
- `setDisplayPos(x, y)` — Display Posを設定する。
- `parallaxOx()`
- `parallaxOy()`
- `tileset()`
- `tilesetFlags()`
- `displayName()` — Nameを表示する。
- `width()`
- `height()`
- `data()`
- `isLoopHorizontal()` — Loop Horizontalかどうかを確認する。
- `isLoopVertical()` — Loop Verticalかどうかを確認する。
- `isDashDisabled()` — Dash Disabledかどうかを確認する。
- `encounterList()`
- `encounterStep()`
- `isOverworld()` — Overworldかどうかを確認する。
- `screenTileX()`
- `screenTileY()`
- `adjustX(x)`
- `adjustY(y)`
- `roundX(x)`
- `roundY(y)`
- `xWithDirection(x, d)`
- `yWithDirection(y, d)`
- `roundXWithDirection(x, d)`
- `roundYWithDirection(y, d)`
- `deltaX(x1, x2)`
- `deltaY(y1, y2)`
- `distance(x1, y1, x2, y2)`
- `canvasToMapX(x)`
- `canvasToMapY(y)`
- `autoplay()`
- `refreshIfNeeded()` — If Neededを再描画する。
- `refresh()` — 再描画・更新する。
- `refreshTileEvents()` — Tile Eventsを再描画する。
- `eventsXy(x, y)`
- `eventsXyNt(x, y)`
- `tileEventsXy(x, y)`
- `eventIdXy(x, y)`
- `scrollDown(distance)` — 下にスクロールする。
- `scrollLeft(distance)`
- `scrollRight(distance)`
- `scrollUp(distance)` — 上にスクロールする。
- `isValid(x, y)` — Validかどうかを確認する。
- `checkPassage(x, y, bit)` — Passageをチェックする。
- `tileId(x, y, z)` — tileのIDを返す。
- `layeredTiles(x, y)`
- `allTiles(x, y)`
- `autotileType(x, y, z)`
- `isPassable(x, y, d)` — Passableかどうかを確認する。
- `isBoatPassable(x, y)` — Boat Passableかどうかを確認する。
- `isShipPassable(x, y)` — Ship Passableかどうかを確認する。
- `isAirshipLandOk(x, y)` — Airship Land Okかどうかを確認する。
- `checkLayeredTilesFlags(x, y, bit)` — Layered Tiles Flagsをチェックする。
- `isLadder(x, y)` — Ladderかどうかを確認する。
- `isBush(x, y)` — Bushかどうかを確認する。
- `isCounter(x, y)` — Counterかどうかを確認する。
- `isDamageFloor(x, y)` — Damage Floorかどうかを確認する。
- `terrainTag(x, y)`
- `regionId(x, y)` — regionのIDを返す。
- `startScroll(direction, distance, speed)` — Scrollを開始する。
- `isScrolling()` — Scrollingかどうかを確認する。
- `update(sceneActive)` — 毎フレーム更新する。
- `updateScroll()` — Scrollを更新する。
- `scrollDistance()`
- `doScroll(direction, distance)`
- `updateEvents()` — Eventsを更新する。
- `updateVehicles()` — Vehiclesを更新する。
- `updateParallax()` — Parallaxを更新する。
- `changeTileset(tilesetId)` — Tilesetを変更する。
- `changeParallax(name, loopX, loopY, sx, sy)` — Parallaxを変更する。
- `updateInterpreter()` — Interpreterを更新する。
- `unlockEvent(eventId)`
- `setupStartingEvent()` — Starting Eventをセットアップする。
- `setupTestEvent()` — Test Eventをセットアップする。
- `setupStartingMapEvent()` — Starting Map Eventをセットアップする。
- `setupAutorunCommonEvent()` — Autorun Common Eventをセットアップする。
- `isAnyEventStarting()` — Any Event Startingかどうかを確認する。

### Game_CommonEvent

コモンイベント用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(commonEventId)` — 初期化する。
- `event()`
- `list()`
- `refresh()` — 再描画・更新する。
- `isActive()` — アクティブかどうかを確認する。
- `update()` — 毎フレーム更新する。

### Game_CharacterBase ⭐

Game_Characterのスーパークラス。座標や画像などの基本情報を扱う。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `pos(x, y)`
- `posNt(x, y)`
- `moveSpeed()` — Speedに移動する。
- `setMoveSpeed(moveSpeed)` — Move Speedを設定する。
- `moveFrequency()` — Frequencyに移動する。
- `setMoveFrequency(moveFrequency)` — Move Frequencyを設定する。
- `opacity()`
- `setOpacity(opacity)` — Opacityを設定する。
- `blendMode()`
- `setBlendMode(blendMode)` — Blend Modeを設定する。
- `isNormalPriority()` — Normal Priorityかどうかを確認する。
- `setPriorityType(priorityType)` — Priority Typeを設定する。
- `isMoving()` — Movingかどうかを確認する。
- `isJumping()` — Jumpingかどうかを確認する。
- `jumpHeight()` — jumpの高さを返す。
- `isStopping()` — Stoppingかどうかを確認する。
- `checkStop(threshold)` — Stopをチェックする。
- `resetStopCount()` — Stop Countをリセットする。
- `realMoveSpeed()`
- `distancePerFrame()`
- `isDashing()` — Dashingかどうかを確認する。
- `isDebugThrough()` — Debug Throughかどうかを確認する。
- `straighten()`
- `reverseDir(d)`
- `canPass(x, y, d)` — Passが可能かを確認する。
- `canPassDiagonally(x, y, horz, vert)` — Pass Diagonallyが可能かを確認する。
- `isMapPassable(x, y, d)` — Map Passableかどうかを確認する。
- `isCollidedWithCharacters(x, y)` — Collided With Charactersかどうかを確認する。
- `isCollidedWithEvents(x, y)` — Collided With Eventsかどうかを確認する。
- `isCollidedWithVehicles(x, y)` — Collided With Vehiclesかどうかを確認する。
- `setPosition(x, y)` — Positionを設定する。
- `copyPosition(character)`
- `locate(x, y)`
- `direction()`
- `setDirection(d)` — Directionを設定する。
- `isTile()` — Tileかどうかを確認する。
- `isObjectCharacter()` — Object Characterかどうかを確認する。
- `shiftY()`
- `scrolledX()`
- `scrolledY()`
- `screenX()`
- `screenY()`
- `screenZ()`
- `isNearTheScreen()` — Near The Screenかどうかを確認する。
- `update()` — 毎フレーム更新する。
- `updateStop()` — Stopを更新する。
- `updateJump()` — Jumpを更新する。
- `updateMove()` — Moveを更新する。
- `updateAnimation()` — Animationを更新する。
- `animationWait()`
- `updateAnimationCount()` — Animation Countを更新する。
- `updatePattern()` — Patternを更新する。
- `maxPattern()`
- `pattern()`
- `setPattern(pattern)` — Patternを設定する。
- `isOriginalPattern()` — Original Patternかどうかを確認する。
- `resetPattern()` — Patternをリセットする。
- `refreshBushDepth()` — Bush Depthを再描画する。
- `isOnLadder()` — On Ladderかどうかを確認する。
- `isOnBush()` — On Bushかどうかを確認する。
- `terrainTag()`
- `regionId()` — regionのIDを返す。
- `increaseSteps()`
- `tileId()` — tileのIDを返す。
- `characterName()` — characterの名前を返す。
- `characterIndex()`
- `setTileImage(tileId)` — Tile Imageを設定する。
- `checkEventTriggerTouchFront(d)` — Event Trigger Touch Frontをチェックする。
- `checkEventTriggerTouch(/*x, y*/)` — Event Trigger Touchをチェックする。
- `isMovementSucceeded(/*x, y*/)` — Movement Succeededかどうかを確認する。
- `setMovementSuccess(success)` — Movement Successを設定する。
- `moveStraight(d)` — Straightに移動する。
- `moveDiagonally(horz, vert)` — Diagonallyに移動する。
- `jump(xPlus, yPlus)`
- `hasWalkAnime()` — Walk Animeを持っているかを確認する。
- `setWalkAnime(walkAnime)` — Walk Animeを設定する。
- `hasStepAnime()` — Step Animeを持っているかを確認する。
- `setStepAnime(stepAnime)` — Step Animeを設定する。
- `isDirectionFixed()` — Direction Fixedかどうかを確認する。
- `setDirectionFix(directionFix)` — Direction Fixを設定する。
- `isThrough()` — Throughかどうかを確認する。
- `setThrough(through)` — Throughを設定する。
- `isTransparent()` — Transparentかどうかを確認する。
- `bushDepth()`
- `setTransparent(transparent)` — Transparentを設定する。
- `startAnimation()` — Animationを開始する。
- `startBalloon()` — Balloonを開始する。
- `isAnimationPlaying()` — Animation Playingかどうかを確認する。
- `isBalloonPlaying()` — Balloon Playingかどうかを確認する。
- `endAnimation()` — Animationを終了する。
- `endBalloon()` — Balloonを終了する。

### Game_Character ⭐

Game_Player・Game_Follower・Game_Vehicle・Game_Eventのスーパークラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → **Game_Character**


#### 静的プロパティ

- `ROUTE_END`
- `ROUTE_MOVE_DOWN`
- `ROUTE_MOVE_LEFT`
- `ROUTE_MOVE_RIGHT`
- `ROUTE_MOVE_UP`
- `ROUTE_MOVE_LOWER_L`
- `ROUTE_MOVE_LOWER_R`
- `ROUTE_MOVE_UPPER_L`
- `ROUTE_MOVE_UPPER_R`
- `ROUTE_MOVE_RANDOM`
- `ROUTE_MOVE_TOWARD`
- `ROUTE_MOVE_AWAY`
- `ROUTE_MOVE_FORWARD`
- `ROUTE_MOVE_BACKWARD`
- `ROUTE_JUMP`
- `ROUTE_WAIT`
- `ROUTE_TURN_DOWN`
- `ROUTE_TURN_LEFT`
- `ROUTE_TURN_RIGHT`
- `ROUTE_TURN_UP`
- `ROUTE_TURN_90D_R`
- `ROUTE_TURN_90D_L`
- `ROUTE_TURN_180D`
- `ROUTE_TURN_90D_R_L`
- `ROUTE_TURN_RANDOM`
- `ROUTE_TURN_TOWARD`
- `ROUTE_TURN_AWAY`
- `ROUTE_SWITCH_ON`
- `ROUTE_SWITCH_OFF`
- `ROUTE_CHANGE_SPEED`
- `ROUTE_CHANGE_FREQ`
- `ROUTE_WALK_ANIME_ON`
- `ROUTE_WALK_ANIME_OFF`
- `ROUTE_STEP_ANIME_ON`
- `ROUTE_STEP_ANIME_OFF`
- `ROUTE_DIR_FIX_ON`
- `ROUTE_DIR_FIX_OFF`
- `ROUTE_THROUGH_ON`
- `ROUTE_THROUGH_OFF`
- `ROUTE_TRANSPARENT_ON`
- `ROUTE_TRANSPARENT_OFF`
- `ROUTE_CHANGE_IMAGE`
- `ROUTE_CHANGE_OPACITY`
- `ROUTE_CHANGE_BLEND_MODE`
- `ROUTE_PLAY_SE`
- `ROUTE_SCRIPT`

#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `memorizeMoveRoute()`
- `restoreMoveRoute()`
- `isMoveRouteForcing()` — Move Route Forcingかどうかを確認する。
- `setMoveRoute(moveRoute)` — Move Routeを設定する。
- `forceMoveRoute(moveRoute)`
- `updateStop()` — Stopを更新する。
- `updateRoutineMove()` — Routine Moveを更新する。
- `processMoveCommand(command)` — Move Commandを処理する。
- `deltaXFrom(x)`
- `deltaYFrom(y)`
- `moveRandom()` — Randomに移動する。
- `moveTowardCharacter(character)` — Toward Characterに移動する。
- `moveAwayFromCharacter(character)` — Away From Characterに移動する。
- `turnTowardCharacter(character)`
- `turnAwayFromCharacter(character)`
- `turnTowardPlayer()`
- `turnAwayFromPlayer()`
- `moveTowardPlayer()` — Toward Playerに移動する。
- `moveAwayFromPlayer()` — Away From Playerに移動する。
- `moveForward()` — Forwardに移動する。
- `moveBackward()` — Backwardに移動する。
- `processRouteEnd()` — Route Endを処理する。
- `advanceMoveRouteIndex()`
- `turnRight90()`
- `turnLeft90()`
- `turn180()`
- `turnRightOrLeft90()`
- `turnRandom()`
- `swap(character)`
- `findDirectionTo(goalX, goalY)` — Direction Toを検索する。
- `searchLimit()`

### Game_Player ⭐

プレイヤーキャラクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Player**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `clearTransferInfo()` — Transfer Infoをクリアする。
- `followers()`
- `refresh()` — 再描画・更新する。
- `isStopping()` — Stoppingかどうかを確認する。
- `reserveTransfer(mapId, x, y, d, fadeType)`
- `setupForNewGame()` — For New Gameをセットアップする。
- `requestMapReload()` — Map Reloadを要求する。
- `isTransferring()` — Transferringかどうかを確認する。
- `newMapId()` — new MapのIDを返す。
- `fadeType()`
- `performTransfer()` — Transferの演出を実行する。
- `isMapPassable(x, y, d)` — Map Passableかどうかを確認する。
- `vehicle()`
- `isInBoat()` — In Boatかどうかを確認する。
- `isInShip()` — In Shipかどうかを確認する。
- `isInAirship()` — In Airshipかどうかを確認する。
- `isInVehicle()` — In Vehicleかどうかを確認する。
- `isNormal()` — Normalかどうかを確認する。
- `isDashing()` — Dashingかどうかを確認する。
- `isDebugThrough()` — Debug Throughかどうかを確認する。
- `isCollided(x, y)` — Collidedかどうかを確認する。
- `centerX()`
- `centerY()`
- `center(x, y)`
- `locate(x, y)`
- `increaseSteps()`
- `makeEncounterCount()` — Encounter Countを作成する。
- `makeEncounterTroopId()` — Encounter Troop Idを作成する。
- `meetsEncounterConditions(encounter)`
- `executeEncounter()` — Encounterを実行する。
- `startMapEvent(x, y, triggers, normal)` — Map Eventを開始する。
- `moveByInput()` — By Inputに移動する。
- `canMove()` — 行動可能かを確認する。
- `getInputDirection()` — Input Directionを取得する。
- `executeMove(direction)` — Moveを実行する。
- `update(sceneActive)` — 毎フレーム更新する。
- `updateDashing()` — Dashingを更新する。
- `isDashButtonPressed()` — Dash Button Pressedかどうかを確認する。
- `updateScroll(lastScrolledX, lastScrolledY)` — Scrollを更新する。
- `updateVehicle()` — Vehicleを更新する。
- `updateVehicleGetOn()` — Vehicle Get Onを更新する。
- `updateVehicleGetOff()` — Vehicle Get Offを更新する。
- `updateNonmoving(wasMoving, sceneActive)` — Nonmovingを更新する。
- `triggerAction()`
- `triggerButtonAction()`
- `triggerTouchAction()`
- `triggerTouchActionD1(x1, y1)`
- `triggerTouchActionD2(x2, y2)`
- `triggerTouchActionD3(x2, y2)`
- `updateEncounterCount()` — Encounter Countを更新する。
- `canEncounter()` — Encounterが可能かを確認する。
- `encounterProgressValue()`
- `checkEventTriggerHere(triggers)` — Event Trigger Hereをチェックする。
- `checkEventTriggerThere(triggers)` — Event Trigger Thereをチェックする。
- `checkEventTriggerTouch(x, y)` — Event Trigger Touchをチェックする。
- `canStartLocalEvents()` — Start Local Eventsが可能かを確認する。
- `getOnOffVehicle()` — On Off Vehicleを取得する。
- `getOnVehicle()` — On Vehicleを取得する。
- `getOffVehicle()` — Off Vehicleを取得する。
- `forceMoveForward()`
- `isOnDamageFloor()` — On Damage Floorかどうかを確認する。
- `moveStraight(d)` — Straightに移動する。
- `moveDiagonally(horz, vert)` — Diagonallyに移動する。
- `jump(xPlus, yPlus)`
- `showFollowers()` — Followersを表示する。
- `hideFollowers()` — Followersを非表示にする。
- `gatherFollowers()`
- `areFollowersGathering()`
- `areFollowersGathered()`

### Game_Follower

隊列歩行のフォロワー用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Follower**


#### インスタンスメソッド

- `initialize(memberIndex)` — 初期化する。
- `refresh()` — 再描画・更新する。
- `actor()` — アクターオブジェクトを返す。
- `isVisible()` — Visibleかどうかを確認する。
- `isGathered()` — Gatheredかどうかを確認する。
- `update()` — 毎フレーム更新する。
- `chaseCharacter(character)`

### Game_Followers

フォロワー配列のラッパークラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setup()` — セットアップする。
- `isVisible()` — Visibleかどうかを確認する。
- `show()` — 表示する。
- `hide()` — 非表示にする。
- `data()`
- `reverseData()`
- `follower(index)`
- `refresh()` — 再描画・更新する。
- `update()` — 毎フレーム更新する。
- `updateMove()` — Moveを更新する。
- `jumpAll()`
- `synchronize(x, y, d)`
- `gather()`
- `areGathering()`
- `visibleFollowers()`
- `areMoving()`
- `areGathered()`
- `isSomeoneCollided(x, y)` — Someone Collidedかどうかを確認する。

### Game_Vehicle

乗り物用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Vehicle**


#### インスタンスメソッド

- `initialize(type)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `isBoat()` — Boatかどうかを確認する。
- `isShip()` — Shipかどうかを確認する。
- `isAirship()` — Airshipかどうかを確認する。
- `resetDirection()` — Directionをリセットする。
- `initMoveSpeed()` — Move Speedを初期化する。
- `vehicle()`
- `loadSystemSettings()` — System Settingsを読み込む。
- `refresh()` — 再描画・更新する。
- `setLocation(mapId, x, y)` — Locationを設定する。
- `pos(x, y)`
- `isMapPassable(x, y, d)` — Map Passableかどうかを確認する。
- `getOn()` — Onを取得する。
- `getOff()` — Offを取得する。
- `setBgm(bgm)` — Bgmを設定する。
- `playBgm()` — Bgmを再生する。
- `syncWithPlayer()`
- `screenY()`
- `shadowX()`
- `shadowY()`
- `shadowOpacity()`
- `canMove()` — 行動可能かを確認する。
- `update()` — 毎フレーム更新する。
- `updateAirship()` — Airshipを更新する。
- `updateAirshipAltitude()` — Airship Altitudeを更新する。
- `maxAltitude()`
- `isLowest()` — Lowestかどうかを確認する。
- `isHighest()` — Highestかどうかを確認する。
- `isTakeoffOk()` — Takeoff Okかどうかを確認する。
- `isLandOk(x, y, d)` — Land Okかどうかを確認する。

### Game_Event ⭐

イベント用のゲームオブジェクトクラス。イベントページの切り替え機能を含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Event**


#### インスタンスメソッド

- `initialize(mapId, eventId)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `eventId()` — eventのIDを返す。
- `event()`
- `page()`
- `list()`
- `isCollidedWithCharacters(x, y)` — Collided With Charactersかどうかを確認する。
- `isCollidedWithEvents(x, y)` — Collided With Eventsかどうかを確認する。
- `isCollidedWithPlayerCharacters(x, y)` — Collided With Player Charactersかどうかを確認する。
- `lock()`
- `unlock()`
- `updateStop()` — Stopを更新する。
- `updateSelfMovement()` — Self Movementを更新する。
- `stopCountThreshold()` — Count Thresholdを停止する。
- `moveTypeRandom()` — Type Randomに移動する。
- `moveTypeTowardPlayer()` — Type Toward Playerに移動する。
- `isNearThePlayer()` — Near The Playerかどうかを確認する。
- `moveTypeCustom()` — Type Customに移動する。
- `isStarting()` — Startingかどうかを確認する。
- `clearStartingFlag()` — Starting Flagをクリアする。
- `isTriggerIn(triggers)` — Trigger Inかどうかを確認する。
- `start()` — 開始する。
- `erase()`
- `refresh()` — 再描画・更新する。
- `findProperPageIndex()` — Proper Page Indexを検索する。
- `meetsConditions(page)`
- `setupPage()` — Pageをセットアップする。
- `clearPageSettings()` — Page Settingsをクリアする。
- `setupPageSettings()` — Page Settingsをセットアップする。
- `isOriginalPattern()` — Original Patternかどうかを確認する。
- `resetPattern()` — Patternをリセットする。
- `checkEventTriggerTouch(x, y)` — Event Trigger Touchをチェックする。
- `checkEventTriggerAuto()` — Event Trigger Autoをチェックする。
- `update()` — 毎フレーム更新する。
- `updateParallel()` — Parallelを更新する。
- `locate(x, y)`
- `forceMoveRoute(moveRoute)`

### Game_Interpreter ⭐

イベントコマンドを実行するインタプリタ。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(depth)` — 初期化する。
- `checkOverflow()` — Overflowをチェックする。
- `clear()` — クリアする。
- `setup(list, eventId)` — セットアップする。
- `loadImages()` — Imagesを読み込む。
- `eventId()` — eventのIDを返す。
- `isOnCurrentMap()` — On Current Mapかどうかを確認する。
- `setupReservedCommonEvent()` — Reserved Common Eventをセットアップする。
- `isRunning()` — Runningかどうかを確認する。
- `update()` — 毎フレーム更新する。
- `updateChild()` — Childを更新する。
- `updateWait()` — Waitを更新する。
- `updateWaitCount()` — Wait Countを更新する。
- `updateWaitMode()` — Wait Modeを更新する。
- `setWaitMode(waitMode)` — Wait Modeを設定する。
- `wait(duration)`
- `fadeSpeed()`
- `executeCommand()` — Commandを実行する。
- `checkFreeze()` — Freezeをチェックする。
- `terminate()` — 終了処理を行う。
- `skipBranch()`
- `currentCommand()`
- `nextEventCode()`
- `iterateActorId(param, callback)` — iterate ActorのIDを返す。
- `iterateActorEx(param1, param2, callback)`
- `iterateActorIndex(param, callback)`
- `iterateEnemyIndex(param, callback)`
- `iterateBattler(param1, param2, callback)`
- `character(param)`
- `changeHp(target, value, allowDeath)` — Hpを変更する。
- `command101(params)`
- `command102(params)`
- `setupChoices(params)` — Choicesをセットアップする。
- `command402(params)`
- `command403()`
- `command103(params)`
- `setupNumInput(params)` — Num Inputをセットアップする。
- `command104(params)`
- `setupItemChoice(params)` — Item Choiceをセットアップする。
- `command105(params)`
- `command108(params)`
- `command109()`
- `command111(params)`
- `command411()`
- `command112()`
- `command413()`
- `command113()`
- `command115()`
- `command117(params)`
- `setupChild(list, eventId)` — Childをセットアップする。
- `command118()`
- `command119(params)`
- `jumpTo(index)`
- `command121(params)`
- `command122(params)`
- `gameDataOperand(type, param1, param2)`
- `command123(params)`
- `command124(params)`
- `command125(params)`
- `command126(params)`
- `command127(params)`
- `command128(params)`
- `command129(params)`
- `command132(params)`
- `command133(params)`
- `command134(params)`
- `command135(params)`
- `command136(params)`
- `command137(params)`
- `command138(params)`
- `command139(params)`
- `command140(params)`
- `command201(params)`
- `command202(params)`
- `command203(params)`
- `command204(params)`
- `command205(params)`
- `command206()`
- `command211(params)`
- `command212(params)`
- `command213(params)`
- `command214()`
- `command216(params)`
- `command217()`
- `command221()`
- `command222()`
- `command223(params)`
- `command224(params)`
- `command225(params)`
- `command230(params)`
- `command231(params)`
- `command232(params)`
- `picturePoint(params)`
- `command233(params)`
- `command234(params)`
- `command235(params)`
- `command236(params)`
- `command241(params)`
- `command242(params)`
- `command243()`
- `command244()`
- `command245(params)`
- `command246(params)`
- `command249(params)`
- `command250(params)`
- `command251()`
- `command261(params)`
- `videoFileExt()`
- `command281(params)`
- `command282(params)`
- `command283(params)`
- `command284(params)`
- `command285(params)`
- `command301(params)`
- `command601()`
- `command602()`
- `command603()`
- `command302(params)`
- `command303(params)`
- `command311(params)`
- `command312(params)`
- `command326(params)`
- `command313(params)`
- `command314(params)`
- `command315(params)`
- `command316(params)`
- `command317(params)`
- `command318(params)`
- `command319(params)`
- `command320(params)`
- `command321(params)`
- `command322(params)`
- `command323(params)`
- `command324(params)`
- `command325(params)`
- `command331(params)`
- `command332(params)`
- `command342(params)`
- `command333(params)`
- `command334(params)`
- `command335(params)`
- `command336(params)`
- `command337(params)`
- `command339(params)`
- `command340()`
- `command351()`
- `command352()`
- `command353()`
- `command354()`
- `command355()`
- `command356(params)`
- `pluginCommand()`
- `command357(params)`

---

## Scenes

画面遷移を管理する `Scene_*` クラス群です。各画面が1つのシーンクラスに対応します。 ( `rmmz_scenes.js` )

### Scene_Base ⭐

ゲーム内の全シーンのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → **Scene_Base**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `isActive()` — アクティブかどうかを確認する。
- `isReady()` — 準備完了かどうかを確認する。
- `start()` — 開始する。
- `update()` — 毎フレーム更新する。
- `stop()` — 停止する。
- `isStarted()` — 開始済みかどうかを確認する。
- `isBusy()` — ビジー状態かどうかを確認する。
- `isFading()` — Fadingかどうかを確認する。
- `terminate()` — 終了処理を行う。
- `createWindowLayer()` — Window Layerを作成する。
- `addWindow(window)` — Windowを追加する。
- `startFadeIn(duration, white)` — Fade Inを開始する。
- `startFadeOut(duration, white)` — Fade Outを開始する。
- `createColorFilter()` — Color Filterを作成する。
- `updateColorFilter()` — Color Filterを更新する。
- `updateFade()` — Fadeを更新する。
- `updateChildren()` — Childrenを更新する。
- `popScene()`
- `checkGameover()` — Gameoverをチェックする。
- `fadeOutAll()`
- `fadeSpeed()`
- `slowFadeSpeed()`
- `scaleSprite(sprite)`
- `centerSprite(sprite)`
- `isBottomHelpMode()` — Bottom Help Modeかどうかを確認する。
- `isBottomButtonMode()` — Bottom Button Modeかどうかを確認する。
- `isRightInputMode()` — Right Input Modeかどうかを確認する。
- `mainCommandWidth()` — main Commandの幅を返す。
- `buttonAreaTop()`
- `buttonAreaBottom()`
- `buttonAreaHeight()` — button Areaの高さを返す。
- `buttonY()`
- `calcWindowHeight(numLines, selectable)` — calc Windowの高さを返す。
- `requestAutosave()` — Autosaveを要求する。
- `isAutosaveEnabled()` — Autosave Enabledかどうかを確認する。
- `executeAutosave()` — Autosaveを実行する。
- `onAutosaveSuccess()` — Autosave Success時のコールバック。
- `onAutosaveFailure()` — Autosave Failure時のコールバック。

### Scene_Boot ⭐

ゲーム全体の初期化を行うシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Boot**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `isReady()` — 準備完了かどうかを確認する。
- `onDatabaseLoaded()` — Database Loaded時のコールバック。
- `setEncryptionInfo()` — Encryption Infoを設定する。
- `loadSystemImages()` — System Imagesを読み込む。
- `loadPlayerData()` — Player Dataを読み込む。
- `loadGameFonts()` — Game Fontsを読み込む。
- `isPlayerDataLoaded()` — Player Data Loadedかどうかを確認する。
- `start()` — 開始する。
- `startNormalGame()` — Normal Gameを開始する。
- `resizeScreen()`
- `adjustBoxSize()`
- `adjustWindow()` — ウィンドウを返す。
- `screenScale()`
- `updateDocumentTitle()` — Document Titleを更新する。
- `checkPlayerLocation()` — Player Locationをチェックする。

### Scene_Splash

スプラッシュ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Splash**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `start()` — 開始する。
- `update()` — 毎フレーム更新する。
- `stop()` — 停止する。
- `createBackground()` — Backgroundを作成する。
- `adjustBackground()`
- `isEnabled()` — Enabledかどうかを確認する。
- `initWaitCount()` — Wait Countを初期化する。
- `updateWaitCount()` — Wait Countを更新する。
- `checkSkip()` — Skipをチェックする。
- `gotoTitle()` — Titleに遷移する。

### Scene_Title ⭐

タイトル画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Title**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `start()` — 開始する。
- `update()` — 毎フレーム更新する。
- `isBusy()` — ビジー状態かどうかを確認する。
- `terminate()` — 終了処理を行う。
- `createBackground()` — Backgroundを作成する。
- `createForeground()` — Foregroundを作成する。
- `drawGameTitle()` — Game Titleを描画する。
- `adjustBackground()`
- `createCommandWindow()` — Command Windowを作成する。
- `commandWindowRect()` — 「Window Rect」コマンドのハンドラ。
- `commandNewGame()` — 「New Game」コマンドのハンドラ。
- `commandContinue()` — 「Continue」コマンドのハンドラ。
- `commandOptions()` — 「Options」コマンドのハンドラ。
- `playTitleMusic()` — Title Musicを再生する。

### Scene_Message

Scene_MapとScene_Battleのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Message**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `isMessageWindowClosing()` — Message Window Closingかどうかを確認する。
- `createAllWindows()` — All Windowsを作成する。
- `createMessageWindow()` — Message Windowを作成する。
- `messageWindowRect()` — message Windowの矩形領域を返す。
- `createScrollTextWindow()` — Scroll Text Windowを作成する。
- `scrollTextWindowRect()` — scroll Text Windowの矩形領域を返す。
- `createGoldWindow()` — Gold Windowを作成する。
- `goldWindowRect()` — gold Windowの矩形領域を返す。
- `createNameBoxWindow()` — Name Box Windowを作成する。
- `createChoiceListWindow()` — Choice List Windowを作成する。
- `createNumberInputWindow()` — Number Input Windowを作成する。
- `createEventItemWindow()` — Event Item Windowを作成する。
- `eventItemWindowRect()` — event Item Windowの矩形領域を返す。
- `associateWindows()`
- `cancelMessageWait()`

### Scene_Map ⭐

マップ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Map**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `isReady()` — 準備完了かどうかを確認する。
- `onMapLoaded()` — Map Loaded時のコールバック。
- `onTransfer()` — Transfer時のコールバック。
- `start()` — 開始する。
- `onTransferEnd()` — Transfer End時のコールバック。
- `shouldAutosave()` — Autosaveすべきかを確認する。
- `update()` — 毎フレーム更新する。
- `updateMainMultiply()` — Main Multiplyを更新する。
- `updateMain()` — Mainを更新する。
- `isPlayerActive()` — Player Activeかどうかを確認する。
- `isFastForward()` — Fast Forwardかどうかを確認する。
- `stop()` — 停止する。
- `isBusy()` — ビジー状態かどうかを確認する。
- `terminate()` — 終了処理を行う。
- `needsFadeIn()` — Fade Inが必要かを確認する。
- `needsSlowFadeOut()` — Slow Fade Outが必要かを確認する。
- `updateWaitCount()` — Wait Countを更新する。
- `updateDestination()` — Destinationを更新する。
- `updateMenuButton()` — Menu Buttonを更新する。
- `hideMenuButton()` — Menu Buttonを非表示にする。
- `updateMapNameWindow()` — Map Name Windowを更新する。
- `isMenuEnabled()` — Menu Enabledかどうかを確認する。
- `isMapTouchOk()` — Map Touch Okかどうかを確認する。
- `processMapTouch()` — Map Touchを処理する。
- `isAnyButtonPressed()` — Any Button Pressedかどうかを確認する。
- `onMapTouch()` — Map Touch時のコールバック。
- `isSceneChangeOk()` — Scene Change Okかどうかを確認する。
- `updateScene()` — Sceneを更新する。
- `createDisplayObjects()` — Display Objectsを作成する。
- `createSpriteset()` — Spritesetを作成する。
- `createAllWindows()` — All Windowsを作成する。
- `createMapNameWindow()` — Map Name Windowを作成する。
- `mapNameWindowRect()` — map Name Windowの矩形領域を返す。
- `createButtons()` — Buttonsを作成する。
- `createMenuButton()` — Menu Buttonを作成する。
- `updateTransferPlayer()` — Transfer Playerを更新する。
- `updateEncounter()` — Encounterを更新する。
- `updateCallMenu()` — Call Menuを更新する。
- `isMenuCalled()` — Menu Calledかどうかを確認する。
- `callMenu()`
- `updateCallDebug()` — Call Debugを更新する。
- `isDebugCalled()` — Debug Calledかどうかを確認する。
- `fadeInForTransfer()`
- `fadeOutForTransfer()`
- `launchBattle()`
- `stopAudioOnBattleStart()` — Audio On Battle Startを停止する。
- `startEncounterEffect()` — Encounter Effectを開始する。
- `updateEncounterEffect()` — Encounter Effectを更新する。
- `snapForBattleBackground()`
- `startFlashForEncounter(duration)` — Flash For Encounterを開始する。
- `encounterEffectSpeed()`

### Scene_MenuBase ⭐

すべてのメニュー系シーンのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_MenuBase**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `update()` — 毎フレーム更新する。
- `helpAreaTop()`
- `helpAreaBottom()`
- `helpAreaHeight()` — help Areaの高さを返す。
- `mainAreaTop()`
- `mainAreaBottom()`
- `mainAreaHeight()` — main Areaの高さを返す。
- `actor()` — アクターオブジェクトを返す。
- `updateActor()` — Actorを更新する。
- `createBackground()` — Backgroundを作成する。
- `setBackgroundOpacity(opacity)` — Background Opacityを設定する。
- `createHelpWindow()` — Help Windowを作成する。
- `helpWindowRect()` — help Windowの矩形領域を返す。
- `createButtons()` — Buttonsを作成する。
- `needsCancelButton()` — Cancel Buttonが必要かを確認する。
- `createCancelButton()` — Cancel Buttonを作成する。
- `needsPageButtons()` — Page Buttonsが必要かを確認する。
- `createPageButtons()` — Page Buttonsを作成する。
- `updatePageButtons()` — Page Buttonsを更新する。
- `arePageButtonsEnabled()`
- `nextActor()`
- `previousActor()`
- `onActorChange()` — Actor Change時のコールバック。

### Scene_Menu ⭐

メニュー画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Menu**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `helpAreaHeight()` — help Areaの高さを返す。
- `create()` — 作成する。
- `start()` — 開始する。
- `createCommandWindow()` — Command Windowを作成する。
- `commandWindowRect()` — 「Window Rect」コマンドのハンドラ。
- `createGoldWindow()` — Gold Windowを作成する。
- `goldWindowRect()` — gold Windowの矩形領域を返す。
- `createStatusWindow()` — Status Windowを作成する。
- `statusWindowRect()` — status Windowの矩形領域を返す。
- `commandItem()` — 「Item」コマンドのハンドラ。
- `commandPersonal()` — 「Personal」コマンドのハンドラ。
- `commandFormation()` — 「Formation」コマンドのハンドラ。
- `commandOptions()` — 「Options」コマンドのハンドラ。
- `commandSave()` — 「Save」コマンドのハンドラ。
- `commandGameEnd()` — 「Game End」コマンドのハンドラ。
- `onPersonalOk()` — Personal Ok時のコールバック。
- `onPersonalCancel()` — Personal Cancel時のコールバック。
- `onFormationOk()` — Formation Ok時のコールバック。
- `onFormationCancel()` — Formation Cancel時のコールバック。

### Scene_ItemBase

Scene_ItemとScene_Skillのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_ItemBase**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `createActorWindow()` — Actor Windowを作成する。
- `actorWindowRect()` — actor Windowの矩形領域を返す。
- `item()` — 現在選択中の項目を返す。
- `user()`
- `isCursorLeft()` — Cursor Leftかどうかを確認する。
- `showActorWindow()` — Actor Windowを表示する。
- `hideActorWindow()` — Actor Windowを非表示にする。
- `isActorWindowActive()` — Actor Window Activeかどうかを確認する。
- `onActorOk()` — Actor Ok時のコールバック。
- `onActorCancel()` — Actor Cancel時のコールバック。
- `determineItem()`
- `useItem()`
- `activateItemWindow()` — ウィンドウを返す。
- `itemTargetActors()`
- `canUse()` — Useが可能かを確認する。
- `isItemEffectsValid()` — Item Effects Validかどうかを確認する。
- `applyItem()` — Itemを適用する。
- `checkCommonEvent()` — Common Eventをチェックする。

### Scene_Item

アイテム画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Item**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `createCategoryWindow()` — Category Windowを作成する。
- `categoryWindowRect()` — category Windowの矩形領域を返す。
- `createItemWindow()` — Item Windowを作成する。
- `itemWindowRect()` — item Windowの矩形領域を返す。
- `user()`
- `onCategoryOk()` — Category Ok時のコールバック。
- `onItemOk()` — Item Ok時のコールバック。
- `onItemCancel()` — Item Cancel時のコールバック。
- `playSeForItem()` — Se For Itemを再生する。
- `useItem()`

### Scene_Skill

スキル画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Skill**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `start()` — 開始する。
- `createSkillTypeWindow()` — Skill Type Windowを作成する。
- `skillTypeWindowRect()` — skill Type Windowの矩形領域を返す。
- `createStatusWindow()` — Status Windowを作成する。
- `statusWindowRect()` — status Windowの矩形領域を返す。
- `createItemWindow()` — Item Windowを作成する。
- `itemWindowRect()` — item Windowの矩形領域を返す。
- `needsPageButtons()` — Page Buttonsが必要かを確認する。
- `arePageButtonsEnabled()`
- `refreshActor()` — Actorを再描画する。
- `user()`
- `commandSkill()` — 「Skill」コマンドのハンドラ。
- `onItemOk()` — Item Ok時のコールバック。
- `onItemCancel()` — Item Cancel時のコールバック。
- `playSeForItem()` — Se For Itemを再生する。
- `useItem()`
- `onActorChange()` — Actor Change時のコールバック。

### Scene_Equip

装備画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Equip**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `createStatusWindow()` — Status Windowを作成する。
- `statusWindowRect()` — status Windowの矩形領域を返す。
- `createCommandWindow()` — Command Windowを作成する。
- `commandWindowRect()` — 「Window Rect」コマンドのハンドラ。
- `createSlotWindow()` — Slot Windowを作成する。
- `slotWindowRect()` — slot Windowの矩形領域を返す。
- `createItemWindow()` — Item Windowを作成する。
- `itemWindowRect()` — item Windowの矩形領域を返す。
- `statusWidth()` — statusの幅を返す。
- `needsPageButtons()` — Page Buttonsが必要かを確認する。
- `arePageButtonsEnabled()`
- `refreshActor()` — Actorを再描画する。
- `commandEquip()` — 「Equip」コマンドのハンドラ。
- `commandOptimize()` — 「Optimize」コマンドのハンドラ。
- `commandClear()` — 「Clear」コマンドのハンドラ。
- `onSlotOk()` — Slot Ok時のコールバック。
- `onSlotCancel()` — Slot Cancel時のコールバック。
- `onItemOk()` — Item Ok時のコールバック。
- `executeEquipChange()` — Equip Changeを実行する。
- `onItemCancel()` — Item Cancel時のコールバック。
- `onActorChange()` — Actor Change時のコールバック。
- `hideItemWindow()` — Item Windowを非表示にする。

### Scene_Status

ステータス画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Status**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `helpAreaHeight()` — help Areaの高さを返す。
- `createProfileWindow()` — Profile Windowを作成する。
- `profileWindowRect()` — profile Windowの矩形領域を返す。
- `createStatusWindow()` — Status Windowを作成する。
- `statusWindowRect()` — status Windowの矩形領域を返す。
- `createStatusParamsWindow()` — Status Params Windowを作成する。
- `statusParamsWindowRect()` — status Params Windowの矩形領域を返す。
- `createStatusEquipWindow()` — Status Equip Windowを作成する。
- `statusEquipWindowRect()` — status Equip Windowの矩形領域を返す。
- `statusParamsWidth()` — status Paramsの幅を返す。
- `statusParamsHeight()` — status Paramsの高さを返す。
- `profileHeight()` — profileの高さを返す。
- `start()` — 開始する。
- `needsPageButtons()` — Page Buttonsが必要かを確認する。
- `refreshActor()` — Actorを再描画する。
- `onActorChange()` — Actor Change時のコールバック。

### Scene_Options

オプション画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Options**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `terminate()` — 終了処理を行う。
- `createOptionsWindow()` — Options Windowを作成する。
- `optionsWindowRect()` — options Windowの矩形領域を返す。
- `maxCommands()`
- `maxVisibleCommands()`

### Scene_File

Scene_SaveとScene_Loadのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_File**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `helpAreaHeight()` — help Areaの高さを返す。
- `start()` — 開始する。
- `savefileId()` — savefileのIDを返す。
- `isSavefileEnabled(savefileId)` — Savefile Enabledかどうかを確認する。
- `createHelpWindow()` — Help Windowを作成する。
- `helpWindowRect()` — help Windowの矩形領域を返す。
- `createListWindow()` — List Windowを作成する。
- `listWindowRect()` — list Windowの矩形領域を返す。
- `mode()`
- `needsAutosave()` — Autosaveが必要かを確認する。
- `activateListWindow()` — ウィンドウを返す。
- `helpWindowText()` — help Windowテキストを返す。
- `firstSavefileId()` — first SavefileのIDを返す。
- `onSavefileOk()` — Savefile Ok時のコールバック。

### Scene_Save

セーブ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Save**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `mode()`
- `helpWindowText()` — help Windowテキストを返す。
- `firstSavefileId()` — first SavefileのIDを返す。
- `onSavefileOk()` — Savefile Ok時のコールバック。
- `executeSave(savefileId)` — Saveを実行する。
- `onSaveSuccess()` — Save Success時のコールバック。
- `onSaveFailure()` — Save Failure時のコールバック。

### Scene_Load

ロード画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Load**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `terminate()` — 終了処理を行う。
- `mode()`
- `helpWindowText()` — help Windowテキストを返す。
- `firstSavefileId()` — first SavefileのIDを返す。
- `onSavefileOk()` — Savefile Ok時のコールバック。
- `executeLoad(savefileId)` — Loadを実行する。
- `onLoadSuccess()` — Load Success時のコールバック。
- `onLoadFailure()` — Load Failure時のコールバック。
- `reloadMapIfUpdated()`

### Scene_GameEnd

ゲーム終了画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_GameEnd**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `stop()` — 停止する。
- `createBackground()` — Backgroundを作成する。
- `createCommandWindow()` — Command Windowを作成する。
- `commandWindowRect()` — 「Window Rect」コマンドのハンドラ。
- `commandToTitle()` — 「To Title」コマンドのハンドラ。

### Scene_Shop

ショップ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Shop**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `prepare(goods, purchaseOnly)`
- `create()` — 作成する。
- `createGoldWindow()` — Gold Windowを作成する。
- `goldWindowRect()` — gold Windowの矩形領域を返す。
- `createCommandWindow()` — Command Windowを作成する。
- `commandWindowRect()` — 「Window Rect」コマンドのハンドラ。
- `createDummyWindow()` — Dummy Windowを作成する。
- `dummyWindowRect()` — dummy Windowの矩形領域を返す。
- `createNumberWindow()` — Number Windowを作成する。
- `numberWindowRect()` — number Windowの矩形領域を返す。
- `createStatusWindow()` — Status Windowを作成する。
- `statusWindowRect()` — status Windowの矩形領域を返す。
- `createBuyWindow()` — Buy Windowを作成する。
- `buyWindowRect()` — buy Windowの矩形領域を返す。
- `createCategoryWindow()` — Category Windowを作成する。
- `categoryWindowRect()` — category Windowの矩形領域を返す。
- `createSellWindow()` — Sell Windowを作成する。
- `sellWindowRect()` — sell Windowの矩形領域を返す。
- `statusWidth()` — statusの幅を返す。
- `activateBuyWindow()` — ウィンドウを返す。
- `activateSellWindow()` — ウィンドウを返す。
- `commandBuy()` — 「Buy」コマンドのハンドラ。
- `commandSell()` — 「Sell」コマンドのハンドラ。
- `onBuyOk()` — Buy Ok時のコールバック。
- `onBuyCancel()` — Buy Cancel時のコールバック。
- `onCategoryOk()` — Category Ok時のコールバック。
- `onCategoryCancel()` — Category Cancel時のコールバック。
- `onSellOk()` — Sell Ok時のコールバック。
- `onSellCancel()` — Sell Cancel時のコールバック。
- `onNumberOk()` — Number Ok時のコールバック。
- `onNumberCancel()` — Number Cancel時のコールバック。
- `doBuy(number)`
- `doSell(number)`
- `endNumberInput()` — Number Inputを終了する。
- `maxBuy()`
- `maxSell()`
- `money()`
- `currencyUnit()`
- `buyingPrice()`
- `sellingPrice()`

### Scene_Name

名前入力画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Name**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `prepare(actorId, maxLength)`
- `create()` — 作成する。
- `start()` — 開始する。
- `createEditWindow()` — Edit Windowを作成する。
- `editWindowRect()` — edit Windowの矩形領域を返す。
- `createInputWindow()` — Input Windowを作成する。
- `inputWindowRect()` — input Windowの矩形領域を返す。
- `onInputOk()` — Input Ok時のコールバック。

### Scene_Debug

デバッグ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Debug**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `needsCancelButton()` — Cancel Buttonが必要かを確認する。
- `createRangeWindow()` — Range Windowを作成する。
- `rangeWindowRect()` — range Windowの矩形領域を返す。
- `createEditWindow()` — Edit Windowを作成する。
- `editWindowRect()` — edit Windowの矩形領域を返す。
- `createDebugHelpWindow()` — Debug Help Windowを作成する。
- `debugHelpWindowRect()` — debug Help Windowの矩形領域を返す。
- `onRangeOk()` — Range Ok時のコールバック。
- `onEditCancel()` — Edit Cancel時のコールバック。
- `refreshHelpWindow()` — Help Windowを再描画する。
- `helpText()` — helpテキストを返す。

### Scene_Battle ⭐

戦闘画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Battle**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `start()` — 開始する。
- `update()` — 毎フレーム更新する。
- `updateVisibility()` — Visibilityを更新する。
- `updateBattleProcess()` — Battle Processを更新する。
- `isTimeActive()` — Time Activeかどうかを確認する。
- `isAnyInputWindowActive()` — Any Input Window Activeかどうかを確認する。
- `changeInputWindow()` — Input Windowを変更する。
- `stop()` — 停止する。
- `terminate()` — 終了処理を行う。
- `shouldAutosave()` — Autosaveすべきかを確認する。
- `needsSlowFadeOut()` — Slow Fade Outが必要かを確認する。
- `updateLogWindowVisibility()` — Log Window Visibilityを更新する。
- `updateStatusWindowVisibility()` — Status Window Visibilityを更新する。
- `shouldOpenStatusWindow()` — Open Status Windowすべきかを確認する。
- `updateStatusWindowPosition()` — Status Window Positionを更新する。
- `statusWindowX()`
- `updateInputWindowVisibility()` — Input Window Visibilityを更新する。
- `needsInputWindowChange()` — Input Window Changeが必要かを確認する。
- `updateCancelButton()` — Cancel Buttonを更新する。
- `createDisplayObjects()` — Display Objectsを作成する。
- `createSpriteset()` — Spritesetを作成する。
- `createAllWindows()` — All Windowsを作成する。
- `createLogWindow()` — Log Windowを作成する。
- `logWindowRect()` — log Windowの矩形領域を返す。
- `createStatusWindow()` — Status Windowを作成する。
- `statusWindowRect()` — status Windowの矩形領域を返す。
- `createPartyCommandWindow()` — Party Command Windowを作成する。
- `partyCommandWindowRect()` — party Command Windowの矩形領域を返す。
- `createActorCommandWindow()` — Actor Command Windowを作成する。
- `actorCommandWindowRect()` — actor Command Windowの矩形領域を返す。
- `createHelpWindow()` — Help Windowを作成する。
- `helpWindowRect()` — help Windowの矩形領域を返す。
- `createSkillWindow()` — Skill Windowを作成する。
- `skillWindowRect()` — skill Windowの矩形領域を返す。
- `createItemWindow()` — Item Windowを作成する。
- `itemWindowRect()` — item Windowの矩形領域を返す。
- `createActorWindow()` — Actor Windowを作成する。
- `actorWindowRect()` — actor Windowの矩形領域を返す。
- `createEnemyWindow()` — Enemy Windowを作成する。
- `enemyWindowRect()` — enemy Windowの矩形領域を返す。
- `helpAreaTop()`
- `helpAreaBottom()`
- `helpAreaHeight()` — help Areaの高さを返す。
- `buttonAreaTop()`
- `windowAreaHeight()` — window Areaの高さを返す。
- `createButtons()` — Buttonsを作成する。
- `createCancelButton()` — Cancel Buttonを作成する。
- `closeCommandWindows()`
- `hideSubInputWindows()` — Sub Input Windowsを非表示にする。
- `startPartyCommandSelection()` — Party Command Selectionを開始する。
- `commandFight()` — 「Fight」コマンドのハンドラ。
- `commandEscape()` — 「Escape」コマンドのハンドラ。
- `startActorCommandSelection()` — Actor Command Selectionを開始する。
- `commandAttack()` — 「Attack」コマンドのハンドラ。
- `commandSkill()` — 「Skill」コマンドのハンドラ。
- `commandGuard()` — 「Guard」コマンドのハンドラ。
- `commandItem()` — 「Item」コマンドのハンドラ。
- `commandCancel()` — 「Cancel」コマンドのハンドラ。
- `selectNextCommand()` — Next Commandを選択する。
- `selectPreviousCommand()` — Previous Commandを選択する。
- `startActorSelection()` — Actor Selectionを開始する。
- `onActorOk()` — Actor Ok時のコールバック。
- `onActorCancel()` — Actor Cancel時のコールバック。
- `startEnemySelection()` — Enemy Selectionを開始する。
- `onEnemyOk()` — Enemy Ok時のコールバック。
- `onEnemyCancel()` — Enemy Cancel時のコールバック。
- `onSkillOk()` — Skill Ok時のコールバック。
- `onSkillCancel()` — Skill Cancel時のコールバック。
- `onItemOk()` — Item Ok時のコールバック。
- `onItemCancel()` — Item Cancel時のコールバック。
- `onSelectAction()` — Select Action時のコールバック。
- `endCommandSelection()` — Command Selectionを終了する。

### Scene_Gameover

ゲームオーバー画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Gameover**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 作成する。
- `start()` — 開始する。
- `update()` — 毎フレーム更新する。
- `stop()` — 停止する。
- `terminate()` — 終了処理を行う。
- `playGameoverMusic()` — Gameover Musicを再生する。
- `createBackground()` — Backgroundを作成する。
- `adjustBackground()`
- `isTriggered()` — Triggeredかどうかを確認する。
- `gotoTitle()` — Titleに遷移する。

---

## Sprites

ゲーム画面に描画されるスプライトの `Sprite_*` / `Spriteset_*` クラス群です。 ( `rmmz_sprites.js` )

### Sprite_Clickable ⭐

クリック処理機能を持つスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Clickable**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `update()` — 毎フレーム更新する。
- `processTouch()` — Touchを処理する。
- `isPressed()` — Pressedかどうかを確認する。
- `isClickEnabled()` — Click Enabledかどうかを確認する。
- `isBeingTouched()` — Being Touchedかどうかを確認する。
- `hitTest(x, y)`
- `onMouseEnter()` — Mouse Enter時のコールバック。
- `onMouseExit()` — Mouse Exit時のコールバック。
- `onPress()` — Press時のコールバック。
- `onClick()` — Click時のコールバック。

### Sprite_Button

ボタン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Button**


#### インスタンスメソッド

- `initialize(buttonType)` — 初期化する。
- `setupFrames()` — Framesをセットアップする。
- `blockWidth()` — blockの幅を返す。
- `blockHeight()` — blockの高さを返す。
- `loadButtonImage()` — Button Imageを読み込む。
- `buttonData()`
- `update()` — 毎フレーム更新する。
- `checkBitmap()` — Bitmapをチェックする。
- `updateFrame()` — Frameを更新する。
- `updateOpacity()` — Opacityを更新する。
- `setColdFrame(x, y, width, height)` — Cold Frameを設定する。
- `setHotFrame(x, y, width, height)` — Hot Frameを設定する。
- `setClickHandler(method)` — Click Handlerを設定する。
- `onClick()` — Click時のコールバック。

### Sprite_Character ⭐

キャラクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Character**


#### インスタンスメソッド

- `initialize(character)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `setCharacter(character)` — Characterを設定する。
- `checkCharacter(character)` — Characterをチェックする。
- `update()` — 毎フレーム更新する。
- `updateVisibility()` — Visibilityを更新する。
- `isTile()` — Tileかどうかを確認する。
- `isObjectCharacter()` — Object Characterかどうかを確認する。
- `isEmptyCharacter()` — Empty Characterかどうかを確認する。
- `tilesetBitmap(tileId)`
- `updateBitmap()` — Bitmapを更新する。
- `isImageChanged()` — Image Changedかどうかを確認する。
- `setTileBitmap()` — Tile Bitmapを設定する。
- `setCharacterBitmap()` — Character Bitmapを設定する。
- `updateFrame()` — Frameを更新する。
- `updateTileFrame()` — Tile Frameを更新する。
- `updateCharacterFrame()` — Character Frameを更新する。
- `characterBlockX()`
- `characterBlockY()`
- `characterPatternX()`
- `characterPatternY()`
- `patternWidth()` — patternの幅を返す。
- `patternHeight()` — patternの高さを返す。
- `updateHalfBodySprites()` — Half Body Spritesを更新する。
- `createHalfBodySprites()` — Half Body Spritesを作成する。
- `updatePosition()` — Positionを更新する。
- `updateOther()` — Otherを更新する。

### Sprite_Battler ⭐

Sprite_ActorとSprite_Enemyのスーパークラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Battler**


#### インスタンスメソッド

- `initialize(battler)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `setBattler(battler)` — Battlerを設定する。
- `checkBattler(battler)` — Battlerをチェックする。
- `mainSprite()`
- `setHome(x, y)` — Homeを設定する。
- `update()` — 毎フレーム更新する。
- `updateVisibility()` — Visibilityを更新する。
- `updateMain()` — Mainを更新する。
- `updateBitmap()` — Bitmapを更新する。
- `updateFrame()` — Frameを更新する。
- `updateMove()` — Moveを更新する。
- `updatePosition()` — Positionを更新する。
- `updateDamagePopup()` — Damage Popupを更新する。
- `updateSelectionEffect()` — Selection Effectを更新する。
- `setupDamagePopup()` — Damage Popupをセットアップする。
- `createDamageSprite()` — Damage Spriteを作成する。
- `destroyDamageSprite(sprite)`
- `damageOffsetX()`
- `damageOffsetY()`
- `startMove(x, y, duration)` — Moveを開始する。
- `onMoveEnd()` — Move End時のコールバック。
- `isEffecting()` — Effectingかどうかを確認する。
- `isMoving()` — Movingかどうかを確認する。
- `inHomePosition()`
- `onMouseEnter()` — Mouse Enter時のコールバック。
- `onPress()` — Press時のコールバック。
- `onClick()` — Click時のコールバック。

### Sprite_Actor ⭐

アクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Actor**


#### インスタンスメソッド

- `initialize(battler)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `mainSprite()`
- `createMainSprite()` — Main Spriteを作成する。
- `createShadowSprite()` — Shadow Spriteを作成する。
- `createWeaponSprite()` — Weapon Spriteを作成する。
- `createStateSprite()` — State Spriteを作成する。
- `setBattler(battler)` — Battlerを設定する。
- `moveToStartPosition()` — To Start Positionに移動する。
- `setActorHome(index)` — Actor Homeを設定する。
- `update()` — 毎フレーム更新する。
- `updateShadow()` — Shadowを更新する。
- `updateMain()` — Mainを更新する。
- `setupMotion()` — Motionをセットアップする。
- `setupWeaponAnimation()` — Weapon Animationをセットアップする。
- `startMotion(motionType)` — Motionを開始する。
- `updateTargetPosition()` — Target Positionを更新する。
- `shouldStepForward()` — Step Forwardすべきかを確認する。
- `updateBitmap()` — Bitmapを更新する。
- `updateFrame()` — Frameを更新する。
- `updateMove()` — Moveを更新する。
- `updateMotion()` — Motionを更新する。
- `updateMotionCount()` — Motion Countを更新する。
- `motionSpeed()`
- `refreshMotion()` — Motionを再描画する。
- `startEntryMotion()` — Entry Motionを開始する。
- `stepForward()`
- `stepBack()`
- `retreat()`
- `onMoveEnd()` — Move End時のコールバック。
- `damageOffsetX()`
- `damageOffsetY()`

### Sprite_Enemy ⭐

敵キャラクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Enemy**


#### インスタンスメソッド

- `initialize(battler)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `createStateIconSprite()` — State Icon Spriteを作成する。
- `setBattler(battler)` — Battlerを設定する。
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — Bitmapを更新する。
- `loadBitmap(name)` — Bitmapを読み込む。
- `setHue(hue)` — Hueを設定する。
- `updateFrame()` — Frameを更新する。
- `updatePosition()` — Positionを更新する。
- `updateStateSprite()` — State Spriteを更新する。
- `initVisibility()` — Visibilityを初期化する。
- `setupEffect()` — Effectをセットアップする。
- `startEffect(effectType)` — Effectを開始する。
- `startAppear()` — Appearを開始する。
- `startDisappear()` — Disappearを開始する。
- `startWhiten()` — Whitenを開始する。
- `startBlink()` — Blinkを開始する。
- `startCollapse()` — Collapseを開始する。
- `startBossCollapse()` — Boss Collapseを開始する。
- `startInstantCollapse()` — Instant Collapseを開始する。
- `updateEffect()` — Effectを更新する。
- `isEffecting()` — Effectingかどうかを確認する。
- `revertToNormal()`
- `updateWhiten()` — Whitenを更新する。
- `updateBlink()` — Blinkを更新する。
- `updateAppear()` — Appearを更新する。
- `updateDisappear()` — Disappearを更新する。
- `updateCollapse()` — Collapseを更新する。
- `updateBossCollapse()` — Boss Collapseを更新する。
- `updateInstantCollapse()` — Instant Collapseを更新する。
- `damageOffsetX()`
- `damageOffsetY()`

### Sprite_Animation

アニメーション表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Animation**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `destroy(options)` — 破棄する。
- `update()` — 毎フレーム更新する。
- `canStart()` — Startが可能かを確認する。
- `shouldWaitForPrevious()` — Wait For Previousすべきかを確認する。
- `updateEffectGeometry()` — Effect Geometryを更新する。
- `updateMain()` — Mainを更新する。
- `processSoundTimings()` — Sound Timingsを処理する。
- `processFlashTimings()` — Flash Timingsを処理する。
- `checkEnd()` — Endをチェックする。
- `updateFlash()` — Flashを更新する。
- `isPlaying()` — 再生中かどうかを確認する。
- `setRotation(x, y, z)` — Rotationを設定する。
- `setProjectionMatrix(renderer)` — Projection Matrixを設定する。
- `setCameraMatrix(/*renderer*/)` — Camera Matrixを設定する。
- `setViewport(renderer)` — Viewportを設定する。
- `targetPosition(renderer)`
- `targetSpritePosition(sprite)`
- `resetViewport(renderer)` — Viewportをリセットする。
- `onBeforeRender(renderer)` — Before Render時のコールバック。
- `onAfterRender(renderer)` — After Render時のコールバック。

### Sprite_AnimationMV

旧フォーマット(MV形式)のアニメーション表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_AnimationMV**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `setupRate()` — Rateをセットアップする。
- `setupDuration()` — Durationをセットアップする。
- `update()` — 毎フレーム更新する。
- `updateFlash()` — Flashを更新する。
- `updateScreenFlash()` — Screen Flashを更新する。
- `absoluteX()`
- `absoluteY()`
- `updateHiding()` — Hidingを更新する。
- `isPlaying()` — 再生中かどうかを確認する。
- `loadBitmaps()` — Bitmapsを読み込む。
- `isReady()` — 準備完了かどうかを確認する。
- `createCellSprites()` — Cell Spritesを作成する。
- `createScreenFlashSprite()` — Screen Flash Spriteを作成する。
- `updateMain()` — Mainを更新する。
- `updatePosition()` — Positionを更新する。
- `updateFrame()` — Frameを更新する。
- `currentFrameIndex()`
- `updateAllCellSprites(frame)` — All Cell Spritesを更新する。
- `updateCellSprite(sprite, cell)` — Cell Spriteを更新する。
- `processTimingData(timing)` — Timing Dataを処理する。
- `startFlash(color, duration)` — Flashを開始する。
- `startScreenFlash(color, duration)` — Screen Flashを開始する。
- `startHiding(duration)` — Hidingを開始する。
- `onEnd()` — End時のコールバック。

### Sprite_Battleback

戦闘背景画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `TilingSprite` → **Sprite_Battleback**


#### インスタンスメソッド

- `initialize(type)` — 初期化する。
- `adjustPosition()`
- `battleback1Bitmap()`
- `battleback2Bitmap()`
- `battleback1Name()` — battleback1の名前を返す。
- `battleback2Name()` — battleback2の名前を返す。
- `overworldBattleback1Name()` — overworld Battleback1の名前を返す。
- `overworldBattleback2Name()` — overworld Battleback2の名前を返す。
- `normalBattleback1Name()` — normal Battleback1の名前を返す。
- `normalBattleback2Name()` — normal Battleback2の名前を返す。
- `terrainBattleback1Name(type)` — terrain Battleback1の名前を返す。
- `terrainBattleback2Name(type)` — terrain Battleback2の名前を返す。
- `defaultBattleback1Name()` — default Battleback1の名前を返す。
- `defaultBattleback2Name()` — default Battleback2の名前を返す。
- `shipBattleback1Name()` — ship Battleback1の名前を返す。
- `shipBattleback2Name()` — ship Battleback2の名前を返す。
- `autotileType(z)`

### Sprite_Damage

ダメージポップアップ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Damage**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — 破棄する。
- `setup(target)` — セットアップする。
- `setupCriticalEffect()` — Critical Effectをセットアップする。
- `fontFace()`
- `fontSize()`
- `damageColor()` — 色を返す。
- `outlineColor()` — 色を返す。
- `outlineWidth()` — outlineの幅を返す。
- `createMiss()` — Missを作成する。
- `createDigits(value)` — Digitsを作成する。
- `createChildSprite(width, height)` — Child Spriteを作成する。
- `createBitmap(width, height)` — Bitmapを作成する。
- `update()` — 毎フレーム更新する。
- `updateChild(sprite)` — Childを更新する。
- `updateFlash()` — Flashを更新する。
- `updateOpacity()` — Opacityを更新する。
- `isPlaying()` — 再生中かどうかを確認する。

### Sprite_Gauge ⭐

ステータスゲージ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Gauge**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `destroy(options)` — 破棄する。
- `createBitmap()` — Bitmapを作成する。
- `bitmapWidth()` — bitmapの幅を返す。
- `bitmapHeight()` — bitmapの高さを返す。
- `textHeight()` — textの高さを返す。
- `gaugeHeight()` — gaugeの高さを返す。
- `gaugeX()`
- `labelY()`
- `labelFontFace()`
- `labelFontSize()`
- `valueFontFace()`
- `valueFontSize()`
- `setup(battler, statusType)` — セットアップする。
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — Bitmapを更新する。
- `updateTargetValue(value, maxValue)` — Target Valueを更新する。
- `smoothness()`
- `updateGaugeAnimation()` — Gauge Animationを更新する。
- `updateFlashing()` — Flashingを更新する。
- `flashingColor1()` — 色を返す。
- `flashingColor2()` — 色を返す。
- `isValid()` — Validかどうかを確認する。
- `currentValue()`
- `currentMaxValue()`
- `label()`
- `gaugeBackColor()` — 色を返す。
- `gaugeColor1()` — 色を返す。
- `gaugeColor2()` — 色を返す。
- `labelColor()` — 色を返す。
- `labelOutlineColor()` — 色を返す。
- `labelOutlineWidth()` — label Outlineの幅を返す。
- `valueColor()` — 色を返す。
- `valueOutlineColor()` — 色を返す。
- `valueOutlineWidth()` — value Outlineの幅を返す。
- `redraw()`
- `drawGauge()` — Gaugeを描画する。
- `drawGaugeRect(x, y, width, height)` — Gauge Rectを描画する。
- `gaugeRate()` — gaugeの倍率を返す。
- `drawLabel()` — Labelを描画する。
- `setupLabelFont()` — Label Fontをセットアップする。
- `measureLabelWidth()` — measure Labelの幅を返す。
- `labelOpacity()`
- `drawValue()` — Valueを描画する。
- `setupValueFont()` — Value Fontをセットアップする。

### Sprite_Name

名前表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Name**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `destroy(options)` — 破棄する。
- `createBitmap()` — Bitmapを作成する。
- `bitmapWidth()` — bitmapの幅を返す。
- `bitmapHeight()` — bitmapの高さを返す。
- `fontFace()`
- `fontSize()`
- `setup(battler)` — セットアップする。
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — Bitmapを更新する。
- `name()` — 名前を返す。
- `textColor()` — 色を返す。
- `outlineColor()` — 色を返す。
- `outlineWidth()` — outlineの幅を返す。
- `redraw()`
- `setupFont()` — Fontをセットアップする。

### Sprite_StateIcon

ステートアイコン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_StateIcon**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `loadBitmap()` — Bitmapを読み込む。
- `setup(battler)` — セットアップする。
- `update()` — 毎フレーム更新する。
- `animationWait()`
- `updateIcon()` — Iconを更新する。
- `shouldDisplay()` — Displayすべきかを確認する。
- `updateFrame()` — Frameを更新する。

### Sprite_StateOverlay

ステートのオーバーレイ画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_StateOverlay**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `loadBitmap()` — Bitmapを読み込む。
- `setup(battler)` — セットアップする。
- `update()` — 毎フレーム更新する。
- `animationWait()`
- `updatePattern()` — Patternを更新する。
- `updateFrame()` — Frameを更新する。

### Sprite_Weapon

攻撃時の武器画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Weapon**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `setup(weaponImageId)` — セットアップする。
- `update()` — 毎フレーム更新する。
- `animationWait()`
- `updatePattern()` — Patternを更新する。
- `loadBitmap()` — Bitmapを読み込む。
- `updateFrame()` — Frameを更新する。
- `isPlaying()` — 再生中かどうかを確認する。

### Sprite_Balloon

フキダシアイコン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Balloon**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `loadBitmap()` — Bitmapを読み込む。
- `setup(targetSprite, balloonId)` — セットアップする。
- `update()` — 毎フレーム更新する。
- `updatePosition()` — Positionを更新する。
- `updateFrame()` — Frameを更新する。
- `speed()`
- `waitTime()`
- `frameIndex()`
- `isPlaying()` — 再生中かどうかを確認する。

### Sprite_Picture

ピクチャ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Picture**


#### インスタンスメソッド

- `initialize(pictureId)` — 初期化する。
- `picture()`
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — Bitmapを更新する。
- `updateOrigin()` — Originを更新する。
- `updatePosition()` — Positionを更新する。
- `updateScale()` — Scaleを更新する。
- `updateTone()` — Toneを更新する。
- `updateOther()` — Otherを更新する。
- `loadBitmap()` — Bitmapを読み込む。

### Sprite_Timer

タイマー表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Timer**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — 破棄する。
- `createBitmap()` — Bitmapを作成する。
- `fontFace()`
- `fontSize()`
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — Bitmapを更新する。
- `redraw()`
- `timerText()` — timerテキストを返す。
- `updatePosition()` — Positionを更新する。
- `updateVisibility()` — Visibilityを更新する。

### Sprite_Destination

タッチ入力の目的地表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Destination**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — 破棄する。
- `update()` — 毎フレーム更新する。
- `createBitmap()` — Bitmapを作成する。
- `updatePosition()` — Positionを更新する。
- `updateAnimation()` — Animationを更新する。

### Spriteset_Base ⭐

Spriteset_MapとSpriteset_Battleのスーパークラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Spriteset_Base**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — 破棄する。
- `loadSystemImages()` — System Imagesを読み込む。
- `createLowerLayer()` — Lower Layerを作成する。
- `createUpperLayer()` — Upper Layerを作成する。
- `update()` — 毎フレーム更新する。
- `createBaseSprite()` — Base Spriteを作成する。
- `createBaseFilters()` — Base Filtersを作成する。
- `createPictures()` — Picturesを作成する。
- `pictureContainerRect()` — picture Containerの矩形領域を返す。
- `createTimer()` — Timerを作成する。
- `createOverallFilters()` — Overall Filtersを作成する。
- `updateBaseFilters()` — Base Filtersを更新する。
- `updateOverallFilters()` — Overall Filtersを更新する。
- `updatePosition()` — Positionを更新する。
- `findTargetSprite(/*target*/)` — Target Spriteを検索する。
- `updateAnimations()` — Animationsを更新する。
- `processAnimationRequests()` — Animation Requestsを処理する。
- `createAnimation(request)` — Animationを作成する。
- `isMVAnimation(animation)` — M V Animationかどうかを確認する。
- `makeTargetSprites(targets)` — Target Spritesを作成する。
- `lastAnimationSprite()`
- `isAnimationForEach(animation)` — Animation For Eachかどうかを確認する。
- `animationBaseDelay()`
- `animationNextDelay()`
- `animationShouldMirror(target)`
- `removeAnimation(sprite)` — Animationを削除する。
- `removeAllAnimations()` — All Animationsを削除する。
- `isAnimationPlaying()` — Animation Playingかどうかを確認する。

### Spriteset_Map ⭐

マップ画面のスプライトセット。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Map**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — 破棄する。
- `loadSystemImages()` — System Imagesを読み込む。
- `createLowerLayer()` — Lower Layerを作成する。
- `update()` — 毎フレーム更新する。
- `hideCharacters()` — Charactersを非表示にする。
- `createParallax()` — Parallaxを作成する。
- `createTilemap()` — Tilemapを作成する。
- `loadTileset()` — Tilesetを読み込む。
- `createCharacters()` — Charactersを作成する。
- `createShadow()` — Shadowを作成する。
- `createDestination()` — Destinationを作成する。
- `createWeather()` — Weatherを作成する。
- `updateTileset()` — Tilesetを更新する。
- `updateParallax()` — Parallaxを更新する。
- `updateTilemap()` — Tilemapを更新する。
- `updateShadow()` — Shadowを更新する。
- `updateWeather()` — Weatherを更新する。
- `updateBalloons()` — Balloonsを更新する。
- `processBalloonRequests()` — Balloon Requestsを処理する。
- `createBalloon(request)` — Balloonを作成する。
- `removeBalloon(sprite)` — Balloonを削除する。
- `removeAllBalloons()` — All Balloonsを削除する。
- `findTargetSprite(target)` — Target Spriteを検索する。
- `animationBaseDelay()`

### Spriteset_Battle ⭐

戦闘画面のスプライトセット。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Battle**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `loadSystemImages()` — System Imagesを読み込む。
- `createLowerLayer()` — Lower Layerを作成する。
- `createBackground()` — Backgroundを作成する。
- `createBattleback()` — Battlebackを作成する。
- `createBattleField()` — Battle Fieldを作成する。
- `battleFieldOffsetY()`
- `update()` — 毎フレーム更新する。
- `updateBattleback()` — Battlebackを更新する。
- `createEnemies()` — Enemiesを作成する。
- `compareEnemySprite(a, b)`
- `createActors()` — Actorsを作成する。
- `updateActors()` — Actorsを更新する。
- `findTargetSprite(target)` — Target Spriteを検索する。
- `battlerSprites()`
- `isEffecting()` — Effectingかどうかを確認する。
- `isAnyoneMoving()` — Anyone Movingかどうかを確認する。
- `isBusy()` — ビジー状態かどうかを確認する。

---

## Windows

ゲーム内UI用の `Window_*` クラス群です。 ( `rmmz_windows.js` )

### Window_Base ⭐

ゲーム内の全ウィンドウのスーパークラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → **Window_Base**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `destroy(options)` — 破棄する。
- `checkRectObject(rect)` — Rect Objectをチェックする。
- `lineHeight()` — 行の高さを返す。
- `itemWidth()` — 項目の幅を返す。
- `itemHeight()` — 項目の高さを返す。
- `itemPadding()` — 項目のパディングを返す。
- `baseTextRect()` — base Textの矩形領域を返す。
- `loadWindowskin()` — Windowskinを読み込む。
- `updatePadding()` — Paddingを更新する。
- `updateBackOpacity()` — Back Opacityを更新する。
- `fittingHeight(numLines)` — fittingの高さを返す。
- `updateTone()` — Toneを更新する。
- `createContents()` — Contentsを作成する。
- `destroyContents()`
- `contentsWidth()` — コンテンツの幅を返す。
- `contentsHeight()` — コンテンツの高さを返す。
- `resetFontSettings()` — Font Settingsをリセットする。
- `resetTextColor()` — Text Colorをリセットする。
- `update()` — 毎フレーム更新する。
- `updateOpen()` — Openを更新する。
- `updateClose()` — Closeを更新する。
- `open()` — 開く。
- `close()` — 閉じる。
- `isOpening()` — 開いている途中かどうかを確認する。
- `isClosing()` — 閉じている途中かどうかを確認する。
- `show()` — 表示する。
- `hide()` — 非表示にする。
- `activate()` — アクティブにする。
- `deactivate()` — 非アクティブにする。
- `systemColor()` — 色を返す。
- `translucentOpacity()`
- `changeTextColor(color)` — Text Colorを変更する。
- `changeOutlineColor(color)` — Outline Colorを変更する。
- `changePaintOpacity(enabled)` — Paint Opacityを変更する。
- `drawRect(x, y, width, height)` — Rectを描画する。
- `drawText(text, x, y, maxWidth, align)` — Textを描画する。
- `textWidth(text)` — textの幅を返す。
- `drawTextEx(text, x, y, width)` — Text Exを描画する。
- `textSizeEx(text)`
- `createTextState(text, x, y, width)` — Text Stateを作成する。
- `processAllText(textState)` — All Textを処理する。
- `flushTextState(textState)`
- `createTextBuffer(rtl)` — Text Bufferを作成する。
- `convertEscapeCharacters(text)`
- `actorName(n)` — actorの名前を返す。
- `partyMemberName(n)` — party Memberの名前を返す。
- `processCharacter(textState)` — Characterを処理する。
- `processControlCharacter(textState, c)` — Control Characterを処理する。
- `processNewLine(textState)` — New Lineを処理する。
- `obtainEscapeCode(textState)`
- `obtainEscapeParam(textState)`
- `processEscapeCharacter(code, textState)` — Escape Characterを処理する。
- `processColorChange(colorIndex)` — Color Changeを処理する。
- `processDrawIcon(iconIndex, textState)` — Draw Iconを処理する。
- `makeFontBigger()` — Font Biggerを作成する。
- `makeFontSmaller()` — Font Smallerを作成する。
- `calcTextHeight(textState)` — calc Textの高さを返す。
- `maxFontSizeInLine(line)`
- `drawIcon(iconIndex, x, y)` — Iconを描画する。
- `drawItemName(item, x, y, width)` — Item Nameを描画する。
- `drawCurrencyValue(value, unit, x, y, width)` — Currency Valueを描画する。
- `setBackgroundType(type)` — Background Typeを設定する。
- `showBackgroundDimmer()` — Background Dimmerを表示する。
- `createDimmerSprite()` — Dimmer Spriteを作成する。
- `hideBackgroundDimmer()` — Background Dimmerを非表示にする。
- `updateBackgroundDimmer()` — Background Dimmerを更新する。
- `refreshDimmerBitmap()` — Dimmer Bitmapを再描画する。
- `playCursorSound()` — Cursor Soundを再生する。
- `playOkSound()` — Ok Soundを再生する。
- `playBuzzerSound()` — Buzzer Soundを再生する。

### Window_Scrollable

スクロール機能を持つウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Scrollable**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `clearScrollStatus()` — Scroll Statusをクリアする。
- `scrollX()`
- `scrollY()`
- `scrollBaseX()`
- `scrollBaseY()`
- `scrollTo(x, y)`
- `scrollBy(x, y)`
- `smoothScrollTo(x, y)` — Scroll Toをスムーズに変更する。
- `smoothScrollBy(x, y)` — Scroll Byをスムーズに変更する。
- `setScrollAccel(x, y)` — Scroll Accelを設定する。
- `overallWidth()` — overallの幅を返す。
- `overallHeight()` — overallの高さを返す。
- `maxScrollX()`
- `maxScrollY()`
- `scrollBlockWidth()` — scroll Blockの幅を返す。
- `scrollBlockHeight()` — scroll Blockの高さを返す。
- `smoothScrollDown(n)` — Scroll Downをスムーズに変更する。
- `smoothScrollUp(n)` — Scroll Upをスムーズに変更する。
- `update()` — 毎フレーム更新する。
- `processWheelScroll()` — Wheel Scrollを処理する。
- `processTouchScroll()` — Touch Scrollを処理する。
- `isWheelScrollEnabled()` — Wheel Scroll Enabledかどうかを確認する。
- `isTouchScrollEnabled()` — Touch Scroll Enabledかどうかを確認する。
- `isScrollEnabled()` — Scroll Enabledかどうかを確認する。
- `isTouchedInsideFrame()` — Touched Inside Frameかどうかを確認する。
- `onTouchScrollStart()` — Touch Scroll Start時のコールバック。
- `onTouchScroll()` — Touch Scroll時のコールバック。
- `onTouchScrollEnd()` — Touch Scroll End時のコールバック。
- `updateSmoothScroll()` — Smooth Scrollを更新する。
- `updateScrollAccel()` — Scroll Accelを更新する。
- `updateArrows()` — Arrowsを更新する。
- `updateOrigin()` — Originを更新する。
- `updateScrollBase(baseX, baseY)` — Scroll Baseを更新する。
- `paint()` — 描画する。

### Window_Selectable ⭐

項目選択機能を持つウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → **Window_Selectable**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `index()` — 現在のインデックスを返す。
- `cursorFixed()`
- `setCursorFixed(cursorFixed)` — Cursor Fixedを設定する。
- `cursorAll()`
- `setCursorAll(cursorAll)` — Cursor Allを設定する。
- `maxCols()` — 列数を返す。
- `maxItems()` — 項目の最大数を返す。
- `colSpacing()` — 列の間隔を返す。
- `rowSpacing()` — 行の間隔を返す。
- `itemWidth()` — 項目の幅を返す。
- `itemHeight()` — 項目の高さを返す。
- `contentsHeight()` — コンテンツの高さを返す。
- `maxRows()` — 行数を返す。
- `overallHeight()` — overallの高さを返す。
- `activate()` — アクティブにする。
- `deactivate()` — 非アクティブにする。
- `select(index)` — 選択する。
- `forceSelect(index)`
- `smoothSelect(index)` — Selectをスムーズに変更する。
- `deselect()` — 選択を解除する。
- `reselect()` — 再選択する。
- `row()`
- `topRow()` — 最上行のインデックスを返す。
- `maxTopRow()` — 最上行の最大値を返す。
- `setTopRow(row)` — Top Rowを設定する。
- `maxPageRows()` — 1ページの最大行数を返す。
- `maxPageItems()` — 1ページの最大項目数を返す。
- `maxVisibleItems()` — 表示可能な最大項目数を返す。
- `isHorizontal()` — Horizontalかどうかを確認する。
- `topIndex()` — 最上行の項目インデックスを返す。
- `itemRect(index)` — itemの矩形領域を返す。
- `itemRectWithPadding(index)`
- `itemLineRect(index)` — item Lineの矩形領域を返す。
- `setHelpWindow(helpWindow)` — Help Windowを設定する。
- `showHelpWindow()` — Help Windowを表示する。
- `hideHelpWindow()` — Help Windowを非表示にする。
- `setHandler(symbol, method)` — Handlerを設定する。
- `isHandled(symbol)` — Handledかどうかを確認する。
- `callHandler(symbol)`
- `isOpenAndActive()` — Open And Activeかどうかを確認する。
- `isCursorMovable()` — Cursor Movableかどうかを確認する。
- `cursorDown(wrap)` — カーソルを下に移動する。
- `cursorUp(wrap)` — カーソルを上に移動する。
- `cursorRight(wrap)` — カーソルを右に移動する。
- `cursorLeft(wrap)` — カーソルを左に移動する。
- `cursorPagedown()` — カーソルを次のページに移動する。
- `cursorPageup()` — カーソルを前のページに移動する。
- `isScrollEnabled()` — Scroll Enabledかどうかを確認する。
- `update()` — 毎フレーム更新する。
- `processCursorMove()` — Cursor Moveを処理する。
- `processHandling()` — Handlingを処理する。
- `processTouch()` — Touchを処理する。
- `isHoverEnabled()` — Hover Enabledかどうかを確認する。
- `onTouchSelect(trigger)` — Touch Select時のコールバック。
- `onTouchOk()` — Touch Ok時のコールバック。
- `onTouchCancel()` — Touch Cancel時のコールバック。
- `hitIndex()`
- `hitTest(x, y)`
- `isTouchOkEnabled()` — Touch Ok Enabledかどうかを確認する。
- `isOkEnabled()` — Ok Enabledかどうかを確認する。
- `isCancelEnabled()` — Cancel Enabledかどうかを確認する。
- `isOkTriggered()` — Ok Triggeredかどうかを確認する。
- `isCancelTriggered()` — Cancel Triggeredかどうかを確認する。
- `processOk()` — Okを処理する。
- `callOkHandler()`
- `processCancel()` — Cancelを処理する。
- `callCancelHandler()`
- `processPageup()` — Pageupを処理する。
- `processPagedown()` — Pagedownを処理する。
- `updateInputData()` — Input Dataを更新する。
- `ensureCursorVisible(smooth)` — Cursor Visibleを保証する。
- `callUpdateHelp()`
- `updateHelp()` — Helpを更新する。
- `setHelpWindowItem(item)` — Help Window Itemを設定する。
- `isCurrentItemEnabled()` — Current Item Enabledかどうかを確認する。
- `drawAllItems()` — All Itemsを描画する。
- `drawItem(/*index*/)` — Itemを描画する。
- `clearItem(index)` — Itemをクリアする。
- `drawItemBackground(index)` — Item Backgroundを描画する。
- `drawBackgroundRect(rect)` — Background Rectを描画する。
- `redrawItem(index)`
- `redrawCurrentItem()`
- `refresh()` — 再描画・更新する。
- `paint()` — 描画する。
- `refreshCursor()` — Cursorを再描画する。
- `refreshCursorForAll()` — Cursor For Allを再描画する。

### Window_Command ⭐

コマンド選択ウィンドウの基底クラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Command**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — 項目の最大数を返す。
- `clearCommandList()` — Command Listをクリアする。
- `makeCommandList()` — Command Listを作成する。
- `commandName(index)` — 「Name」コマンドのハンドラ。
- `commandSymbol(index)` — 「Symbol」コマンドのハンドラ。
- `isCommandEnabled(index)` — Command Enabledかどうかを確認する。
- `currentData()`
- `isCurrentItemEnabled()` — Current Item Enabledかどうかを確認する。
- `currentSymbol()`
- `currentExt()`
- `findSymbol(symbol)` — Symbolを検索する。
- `selectSymbol(symbol)` — Symbolを選択する。
- `findExt(ext)` — Extを検索する。
- `selectExt(ext)` — Extを選択する。
- `drawItem(index)` — Itemを描画する。
- `itemTextAlign()`
- `isOkEnabled()` — Ok Enabledかどうかを確認する。
- `callOkHandler()`
- `refresh()` — 再描画・更新する。

### Window_HorzCommand

横並びコマンド選択ウィンドウの基底クラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_HorzCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 列数を返す。
- `itemTextAlign()`

### Window_Help

ヘルプテキスト表示用のウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Help**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setText(text)` — Textを設定する。
- `clear()` — クリアする。
- `setItem(item)` — Itemを設定する。
- `refresh()` — 再描画・更新する。

### Window_Gold

所持金表示用のウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Gold**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `colSpacing()` — 列の間隔を返す。
- `refresh()` — 再描画・更新する。
- `value()`
- `currencyUnit()`
- `open()` — 開く。

### Window_StatusBase ⭐

アクターステータス表示ウィンドウのスーパークラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_StatusBase**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `loadFaceImages()` — Face Imagesを読み込む。
- `refresh()` — 再描画・更新する。
- `hideAdditionalSprites()` — Additional Spritesを非表示にする。
- `placeActorName(actor, x, y)` — place Actorの名前を返す。
- `placeStateIcon(actor, x, y)`
- `placeGauge(actor, type, x, y)`
- `createInnerSprite(key, spriteClass)` — Inner Spriteを作成する。
- `placeTimeGauge(actor, x, y)`
- `placeBasicGauges(actor, x, y)`
- `gaugeLineHeight()` — gauge Lineの高さを返す。
- `drawActorCharacter(actor, x, y)` — Actor Characterを描画する。
- `drawActorName(actor, x, y, width)` — Actor Nameを描画する。
- `drawActorClass(actor, x, y, width)` — Actor Classを描画する。
- `drawActorNickname(actor, x, y, width)` — Actor Nicknameを描画する。
- `drawActorLevel(actor, x, y)` — Actor Levelを描画する。
- `drawActorIcons(actor, x, y, width)` — Actor Iconsを描画する。
- `drawActorSimpleStatus(actor, x, y)` — Actor Simple Statusを描画する。
- `actorSlotName(actor, index)` — actor Slotの名前を返す。

### Window_MenuCommand

メニュー画面のコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_MenuCommand**


#### 静的メソッド

- `initCommandPosition()` — Command Positionを初期化する。

#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — Command Listを作成する。
- `addMainCommands()` — Main Commandsを追加する。
- `addFormationCommand()` — Formation Commandを追加する。
- `addOriginalCommands()` — Original Commandsを追加する。
- `addOptionsCommand()` — Options Commandを追加する。
- `addSaveCommand()` — Save Commandを追加する。
- `addGameEndCommand()` — Game End Commandを追加する。
- `needsCommand(name)` — Commandが必要かを確認する。
- `areMainCommandsEnabled()`
- `isFormationEnabled()` — Formation Enabledかどうかを確認する。
- `isOptionsEnabled()` — Options Enabledかどうかを確認する。
- `isSaveEnabled()` — Save Enabledかどうかを確認する。
- `isGameEndEnabled()` — Game End Enabledかどうかを確認する。
- `processOk()` — Okを処理する。
- `selectLast()` — Lastを選択する。

### Window_MenuStatus

メニュー画面のパーティメンバーステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_MenuStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — 項目の最大数を返す。
- `numVisibleRows()`
- `itemHeight()` — 項目の高さを返す。
- `actor(index)` — アクターオブジェクトを返す。
- `drawItem(index)` — Itemを描画する。
- `drawPendingItemBackground(index)` — Pending Item Backgroundを描画する。
- `drawItemImage(index)` — Item Imageを描画する。
- `drawItemStatus(index)` — Item Statusを描画する。
- `processOk()` — Okを処理する。
- `isCurrentItemEnabled()` — Current Item Enabledかどうかを確認する。
- `selectLast()` — Lastを選択する。
- `formationMode()`
- `setFormationMode(formationMode)` — Formation Modeを設定する。
- `pendingIndex()`
- `setPendingIndex(index)` — Pending Indexを設定する。

### Window_MenuActor

アイテム・スキル画面の対象アクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → `Window_MenuStatus` → **Window_MenuActor**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `processOk()` — Okを処理する。
- `selectLast()` — Lastを選択する。
- `selectForItem(item)` — For Itemを選択する。

### Window_ItemCategory

アイテム・ショップ画面のアイテムカテゴリ選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ItemCategory**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 列数を返す。
- `update()` — 毎フレーム更新する。
- `makeCommandList()` — Command Listを作成する。
- `needsCommand(name)` — Commandが必要かを確認する。
- `setItemWindow(itemWindow)` — Item Windowを設定する。
- `needsSelection()` — Selectionが必要かを確認する。

### Window_ItemList

アイテム画面のアイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ItemList**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setCategory(category)` — Categoryを設定する。
- `maxCols()` — 列数を返す。
- `colSpacing()` — 列の間隔を返す。
- `maxItems()` — 項目の最大数を返す。
- `item()` — 現在選択中の項目を返す。
- `itemAt(index)` — 指定インデックスの項目を返す。
- `isCurrentItemEnabled()` — Current Item Enabledかどうかを確認する。
- `includes(item)`
- `needsNumber()` — Numberが必要かを確認する。
- `isEnabled(item)` — Enabledかどうかを確認する。
- `makeItemList()` — Item Listを作成する。
- `selectLast()` — Lastを選択する。
- `drawItem(index)` — Itemを描画する。
- `numberWidth()` — numberの幅を返す。
- `drawItemNumber(item, x, y, width)` — Item Numberを描画する。
- `updateHelp()` — Helpを更新する。
- `refresh()` — 再描画・更新する。

### Window_SkillType

スキル画面のスキルタイプ選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_SkillType**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `makeCommandList()` — Command Listを作成する。
- `update()` — 毎フレーム更新する。
- `setSkillWindow(skillWindow)` — Skill Windowを設定する。
- `selectLast()` — Lastを選択する。

### Window_SkillStatus

スキル画面のスキル使用者ステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_SkillStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `refresh()` — 再描画・更新する。

### Window_SkillList

スキル画面のスキル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SkillList**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `setStypeId(stypeId)` — Stype Idを設定する。
- `maxCols()` — 列数を返す。
- `colSpacing()` — 列の間隔を返す。
- `maxItems()` — 項目の最大数を返す。
- `item()` — 現在選択中の項目を返す。
- `itemAt(index)` — 指定インデックスの項目を返す。
- `isCurrentItemEnabled()` — Current Item Enabledかどうかを確認する。
- `includes(item)`
- `isEnabled(item)` — Enabledかどうかを確認する。
- `makeItemList()` — Item Listを作成する。
- `selectLast()` — Lastを選択する。
- `drawItem(index)` — Itemを描画する。
- `costWidth()` — costの幅を返す。
- `drawSkillCost(skill, x, y, width)` — Skill Costを描画する。
- `updateHelp()` — Helpを更新する。
- `refresh()` — 再描画・更新する。

### Window_EquipStatus

装備画面のパラメータ変化表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `colSpacing()` — 列の間隔を返す。
- `refresh()` — 再描画・更新する。
- `setTempActor(tempActor)` — Temp Actorを設定する。
- `drawAllParams()` — All Paramsを描画する。
- `drawItem(x, y, paramId)` — Itemを描画する。
- `drawParamName(x, y, paramId)` — Param Nameを描画する。
- `drawCurrentParam(x, y, paramId)` — Current Paramを描画する。
- `drawRightArrow(x, y)` — Right Arrowを描画する。
- `drawNewParam(x, y, paramId)` — New Paramを描画する。
- `rightArrowWidth()` — right Arrowの幅を返す。
- `paramWidth()` — paramの幅を返す。
- `paramX()`
- `paramY(index)`

### Window_EquipCommand

装備画面のコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_EquipCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 列数を返す。
- `makeCommandList()` — Command Listを作成する。

### Window_EquipSlot

装備画面の装備スロット選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipSlot**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `update()` — 毎フレーム更新する。
- `maxItems()` — 項目の最大数を返す。
- `item()` — 現在選択中の項目を返す。
- `itemAt(index)` — 指定インデックスの項目を返す。
- `drawItem(index)` — Itemを描画する。
- `slotNameWidth()` — slot Nameの幅を返す。
- `isEnabled(index)` — Enabledかどうかを確認する。
- `isCurrentItemEnabled()` — Current Item Enabledかどうかを確認する。
- `setStatusWindow(statusWindow)` — Status Windowを設定する。
- `setItemWindow(itemWindow)` — Item Windowを設定する。
- `updateHelp()` — Helpを更新する。

### Window_EquipItem

装備画面の装備品選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EquipItem**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 列数を返す。
- `colSpacing()` — 列の間隔を返す。
- `setActor(actor)` — Actorを設定する。
- `setSlotId(slotId)` — Slot Idを設定する。
- `includes(item)`
- `etypeId()` — etypeのIDを返す。
- `isEnabled(/*item*/)` — Enabledかどうかを確認する。
- `selectLast()` — Lastを選択する。
- `setStatusWindow(statusWindow)` — Status Windowを設定する。
- `updateHelp()` — Helpを更新する。
- `playOkSound()` — Ok Soundを再生する。

### Window_Status

ステータス画面の詳細ステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_Status**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `refresh()` — 再描画・更新する。
- `drawBlock1()` — Block1を描画する。
- `block1Y()`
- `drawBlock2()` — Block2を描画する。
- `block2Y()`
- `drawBasicInfo(x, y)` — Basic Infoを描画する。
- `drawExpInfo(x, y)` — Exp Infoを描画する。
- `expTotalValue()`
- `expNextValue()`

### Window_StatusParams

ステータス画面のパラメータ表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusParams**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `maxItems()` — 項目の最大数を返す。
- `itemHeight()` — 項目の高さを返す。
- `drawItem(index)` — Itemを描画する。
- `drawItemBackground(/*index*/)` — Item Backgroundを描画する。

### Window_StatusEquip

ステータス画面の装備品表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusEquip**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — Actorを設定する。
- `maxItems()` — 項目の最大数を返す。
- `itemHeight()` — 項目の高さを返す。
- `drawItem(index)` — Itemを描画する。
- `drawItemBackground(/*index*/)` — Item Backgroundを描画する。

### Window_Options

オプション画面の設定変更ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_Options**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — Command Listを作成する。
- `addGeneralOptions()` — General Optionsを追加する。
- `addVolumeOptions()` — Volume Optionsを追加する。
- `drawItem(index)` — Itemを描画する。
- `statusWidth()` — statusの幅を返す。
- `statusText(index)` — statusテキストを返す。
- `isVolumeSymbol(symbol)` — Volume Symbolかどうかを確認する。
- `booleanStatusText(value)` — boolean Statusテキストを返す。
- `volumeStatusText(value)` — volume Statusテキストを返す。
- `processOk()` — Okを処理する。
- `cursorRight()` — カーソルを右に移動する。
- `cursorLeft()` — カーソルを左に移動する。
- `changeVolume(symbol, forward, wrap)` — Volumeを変更する。
- `volumeOffset()`
- `changeValue(symbol, value)` — Valueを変更する。
- `getConfigValue(symbol)` — Config Valueを取得する。
- `setConfigValue(symbol, volume)` — Config Valueを設定する。

### Window_SavefileList

セーブ・ロード画面のセーブファイル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SavefileList**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setMode(mode, autosave)` — Modeを設定する。
- `maxItems()` — 項目の最大数を返す。
- `numVisibleRows()`
- `itemHeight()` — 項目の高さを返す。
- `drawItem(index)` — Itemを描画する。
- `indexToSavefileId(index)` — index To SavefileのIDを返す。
- `savefileIdToIndex(savefileId)`
- `isEnabled(savefileId)` — Enabledかどうかを確認する。
- `savefileId()` — savefileのIDを返す。
- `selectSavefile(savefileId)` — Savefileを選択する。
- `drawTitle(savefileId, x, y)` — Titleを描画する。
- `drawContents(info, rect)` — Contentsを描画する。
- `drawPartyCharacters(info, x, y)` — Party Charactersを描画する。
- `drawPlaytime(info, x, y, width)` — Playtimeを描画する。
- `playOkSound()` — Ok Soundを再生する。

### Window_ShopCommand

ショップ画面の売買選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ShopCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setPurchaseOnly(purchaseOnly)` — Purchase Onlyを設定する。
- `maxCols()` — 列数を返す。
- `makeCommandList()` — Command Listを作成する。

### Window_ShopBuy

ショップ画面の購入アイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopBuy**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setupGoods(shopGoods)` — Goodsをセットアップする。
- `maxItems()` — 項目の最大数を返す。
- `item()` — 現在選択中の項目を返す。
- `itemAt(index)` — 指定インデックスの項目を返す。
- `setMoney(money)` — Moneyを設定する。
- `isCurrentItemEnabled()` — Current Item Enabledかどうかを確認する。
- `price(item)`
- `isEnabled(item)` — Enabledかどうかを確認する。
- `refresh()` — 再描画・更新する。
- `makeItemList()` — Item Listを作成する。
- `goodsToItem(goods)`
- `drawItem(index)` — Itemを描画する。
- `priceWidth()` — priceの幅を返す。
- `setStatusWindow(statusWindow)` — Status Windowを設定する。
- `updateHelp()` — Helpを更新する。

### Window_ShopSell

ショップ画面の売却アイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_ShopSell**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `isEnabled(item)` — Enabledかどうかを確認する。

### Window_ShopNumber

ショップ画面の売買個数入力ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopNumber**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `isScrollEnabled()` — Scroll Enabledかどうかを確認する。
- `number()`
- `setup(item, max, price)` — セットアップする。
- `setCurrencyUnit(currencyUnit)` — Currency Unitを設定する。
- `createButtons()` — Buttonsを作成する。
- `placeButtons()`
- `totalButtonWidth()` — total Buttonの幅を返す。
- `buttonSpacing()`
- `refresh()` — 再描画・更新する。
- `drawCurrentItemName()` — Current Item Nameを描画する。
- `drawMultiplicationSign()` — Multiplication Signを描画する。
- `multiplicationSign()`
- `multiplicationSignX()`
- `drawNumber()` — Numberを描画する。
- `drawHorzLine()` — Horz Lineを描画する。
- `drawTotalPrice()` — Total Priceを描画する。
- `itemNameY()`
- `totalPriceY()`
- `buttonY()`
- `cursorWidth()` — cursorの幅を返す。
- `cursorX()`
- `maxDigits()`
- `update()` — 毎フレーム更新する。
- `playOkSound()` — Ok Soundを再生する。
- `processNumberChange()` — Number Changeを処理する。
- `changeNumber(amount)` — Numberを変更する。
- `itemRect()` — itemの矩形領域を返す。
- `isTouchOkEnabled()` — Touch Ok Enabledかどうかを確認する。
- `onButtonUp()` — Button Up時のコールバック。
- `onButtonUp2()` — Button Up2時のコールバック。
- `onButtonDown()` — Button Down時のコールバック。
- `onButtonDown2()` — Button Down2時のコールバック。
- `onButtonOk()` — Button Ok時のコールバック。

### Window_ShopStatus

ショップ画面の所持数・アクター装備状況表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_ShopStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `refresh()` — 再描画・更新する。
- `setItem(item)` — Itemを設定する。
- `isEquipItem()` — Equip Itemかどうかを確認する。
- `drawPossession(x, y)` — Possessionを描画する。
- `drawEquipInfo(x, y)` — Equip Infoを描画する。
- `statusMembers()`
- `pageSize()`
- `maxPages()`
- `drawActorEquipInfo(x, y, actor)` — Actor Equip Infoを描画する。
- `paramId()` — paramのIDを返す。
- `currentEquippedItem(actor, etypeId)`
- `update()` — 毎フレーム更新する。
- `updatePage()` — Pageを更新する。
- `isPageChangeEnabled()` — Page Change Enabledかどうかを確認する。
- `isPageChangeRequested()` — Page Change Requestedかどうかを確認する。
- `changePage()` — Pageを変更する。

### Window_NameEdit

名前入力画面のアクター名編集ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_NameEdit**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setup(actor, maxLength)` — セットアップする。
- `name()` — 名前を返す。
- `restoreDefault()`
- `add(ch)`
- `back()`
- `faceWidth()` — faceの幅を返す。
- `charWidth()` — charの幅を返す。
- `left()`
- `itemRect(index)` — itemの矩形領域を返す。
- `underlineRect(index)` — underlineの矩形領域を返す。
- `underlineColor()` — 色を返す。
- `drawUnderline(index)` — Underlineを描画する。
- `drawChar(index)` — Charを描画する。
- `refresh()` — 再描画・更新する。

### Window_NameInput

名前入力画面の文字選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NameInput**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setEditWindow(editWindow)` — Edit Windowを設定する。
- `table()`
- `maxCols()` — 列数を返す。
- `maxItems()` — 項目の最大数を返す。
- `itemWidth()` — 項目の幅を返す。
- `groupSpacing()`
- `character()`
- `isPageChange()` — Page Changeかどうかを確認する。
- `isOk()` — Okかどうかを確認する。
- `itemRect(index)` — itemの矩形領域を返す。
- `drawItem(index)` — Itemを描画する。
- `updateCursor()` — Cursorを更新する。
- `isCursorMovable()` — Cursor Movableかどうかを確認する。
- `cursorDown(wrap)` — カーソルを下に移動する。
- `cursorUp(wrap)` — カーソルを上に移動する。
- `cursorRight(wrap)` — カーソルを右に移動する。
- `cursorLeft(wrap)` — カーソルを左に移動する。
- `cursorPagedown()` — カーソルを次のページに移動する。
- `cursorPageup()` — カーソルを前のページに移動する。
- `processCursorMove()` — Cursor Moveを処理する。
- `processHandling()` — Handlingを処理する。
- `isCancelEnabled()` — Cancel Enabledかどうかを確認する。
- `processCancel()` — Cancelを処理する。
- `processJump()` — Jumpを処理する。
- `processBack()` — Backを処理する。
- `processOk()` — Okを処理する。
- `onNameAdd()` — Name Add時のコールバック。
- `onNameOk()` — Name Ok時のコールバック。

### Window_NameBox

メッセージウィンドウ上部の話者名表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_NameBox**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setMessageWindow(messageWindow)` — Message Windowを設定する。
- `setName(name)` — Nameを設定する。
- `clear()` — クリアする。
- `start()` — 開始する。
- `updatePlacement()` — Placementを更新する。
- `updateBackground()` — Backgroundを更新する。
- `windowWidth()` — windowの幅を返す。
- `windowHeight()` — windowの高さを返す。
- `refresh()` — 再描画・更新する。

### Window_ChoiceList

イベントコマンド「選択肢の表示」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ChoiceList**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setMessageWindow(messageWindow)` — Message Windowを設定する。
- `createCancelButton()` — Cancel Buttonを作成する。
- `start()` — 開始する。
- `update()` — 毎フレーム更新する。
- `updateCancelButton()` — Cancel Buttonを更新する。
- `selectDefault()` — Defaultを選択する。
- `updatePlacement()` — Placementを更新する。
- `updateBackground()` — Backgroundを更新する。
- `placeCancelButton()`
- `windowX()`
- `windowY()`
- `windowWidth()` — windowの幅を返す。
- `windowHeight()` — windowの高さを返す。
- `numVisibleRows()`
- `maxLines()`
- `maxChoiceWidth()` — max Choiceの幅を返す。
- `makeCommandList()` — Command Listを作成する。
- `drawItem(index)` — Itemを描画する。
- `isCancelEnabled()` — Cancel Enabledかどうかを確認する。
- `needsCancelButton()` — Cancel Buttonが必要かを確認する。
- `callOkHandler()`
- `callCancelHandler()`

### Window_NumberInput

イベントコマンド「数値入力の処理」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NumberInput**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setMessageWindow(messageWindow)` — Message Windowを設定する。
- `start()` — 開始する。
- `updatePlacement()` — Placementを更新する。
- `windowWidth()` — windowの幅を返す。
- `windowHeight()` — windowの高さを返す。
- `maxCols()` — 列数を返す。
- `maxItems()` — 項目の最大数を返す。
- `itemWidth()` — 項目の幅を返す。
- `itemRect(index)` — itemの矩形領域を返す。
- `isScrollEnabled()` — Scroll Enabledかどうかを確認する。
- `isHoverEnabled()` — Hover Enabledかどうかを確認する。
- `createButtons()` — Buttonsを作成する。
- `placeButtons()`
- `totalButtonWidth()` — total Buttonの幅を返す。
- `buttonSpacing()`
- `buttonY()`
- `update()` — 毎フレーム更新する。
- `processDigitChange()` — Digit Changeを処理する。
- `changeDigit(up)` — Digitを変更する。
- `isTouchOkEnabled()` — Touch Ok Enabledかどうかを確認する。
- `isOkEnabled()` — Ok Enabledかどうかを確認する。
- `isCancelEnabled()` — Cancel Enabledかどうかを確認する。
- `processOk()` — Okを処理する。
- `drawItem(index)` — Itemを描画する。
- `onButtonUp()` — Button Up時のコールバック。
- `onButtonDown()` — Button Down時のコールバック。
- `onButtonOk()` — Button Ok時のコールバック。

### Window_EventItem

イベントコマンド「アイテム選択の処理」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EventItem**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setMessageWindow(messageWindow)` — Message Windowを設定する。
- `createCancelButton()` — Cancel Buttonを作成する。
- `start()` — 開始する。
- `update()` — 毎フレーム更新する。
- `updateCancelButton()` — Cancel Buttonを更新する。
- `updatePlacement()` — Placementを更新する。
- `placeCancelButton()`
- `includes(item)`
- `needsNumber()` — Numberが必要かを確認する。
- `isEnabled(/*item*/)` — Enabledかどうかを確認する。
- `onOk()` — Ok時のコールバック。
- `onCancel()` — Cancel時のコールバック。

### Window_Message ⭐

テキストメッセージ表示用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Message**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `initMembers()` — Membersを初期化する。
- `setGoldWindow(goldWindow)` — Gold Windowを設定する。
- `setNameBoxWindow(nameBoxWindow)` — Name Box Windowを設定する。
- `setChoiceListWindow(choiceListWindow)` — Choice List Windowを設定する。
- `setNumberInputWindow(numberInputWindow)` — Number Input Windowを設定する。
- `setEventItemWindow(eventItemWindow)` — Event Item Windowを設定する。
- `clearFlags()` — Flagsをクリアする。
- `update()` — 毎フレーム更新する。
- `checkToNotClose()` — To Not Closeをチェックする。
- `synchronizeNameBox()`
- `canStart()` — Startが可能かを確認する。
- `startMessage()` — Messageを開始する。
- `newLineX(textState)`
- `updatePlacement()` — Placementを更新する。
- `updateBackground()` — Backgroundを更新する。
- `terminateMessage()`
- `updateWait()` — Waitを更新する。
- `cancelWait()`
- `updateLoading()` — Loadingを更新する。
- `updateInput()` — Inputを更新する。
- `isAnySubWindowActive()` — Any Sub Window Activeかどうかを確認する。
- `updateMessage()` — Messageを更新する。
- `shouldBreakHere(textState)` — Break Hereすべきかを確認する。
- `canBreakHere(textState)` — Break Hereが可能かを確認する。
- `onEndOfText()` — End Of Text時のコールバック。
- `startInput()` — Inputを開始する。
- `isTriggered()` — Triggeredかどうかを確認する。
- `doesContinue()`
- `areSettingsChanged()`
- `updateShowFast()` — Show Fastを更新する。
- `newPage(textState)`
- `updateSpeakerName()` — Speaker Nameを更新する。
- `loadMessageFace()` — Message Faceを読み込む。
- `drawMessageFace()` — Message Faceを描画する。
- `processControlCharacter(textState, c)` — Control Characterを処理する。
- `processNewLine(textState)` — New Lineを処理する。
- `processNewPage(textState)` — New Pageを処理する。
- `isEndOfText(textState)` — End Of Textかどうかを確認する。
- `needsNewPage(textState)` — New Pageが必要かを確認する。
- `processEscapeCharacter(code, textState)` — Escape Characterを処理する。
- `startWait(count)` — Waitを開始する。
- `startPause()` — Pauseを開始する。
- `isWaiting()` — Waitingかどうかを確認する。

### Window_ScrollText

スクロールテキスト表示用のウィンドウ。枠なし。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_ScrollText**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `update()` — 毎フレーム更新する。
- `startMessage()` — Messageを開始する。
- `refresh()` — 再描画・更新する。
- `updatePlacement()` — Placementを更新する。
- `contentsHeight()` — コンテンツの高さを返す。
- `updateMessage()` — Messageを更新する。
- `scrollSpeed()`
- `isFastForward()` — Fast Forwardかどうかを確認する。
- `fastForwardRate()` — fast Forwardの倍率を返す。
- `terminateMessage()`

### Window_MapName

マップ画面のマップ名表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_MapName**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `update()` — 毎フレーム更新する。
- `updateFadeIn()` — Fade Inを更新する。
- `updateFadeOut()` — Fade Outを更新する。
- `open()` — 開く。
- `close()` — 閉じる。
- `refresh()` — 再描画・更新する。
- `drawBackground(x, y, width, height)` — Backgroundを描画する。

### Window_BattleLog ⭐

戦闘経過表示用のウィンドウ。枠なしだがWindow_Baseを継承。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_BattleLog**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setSpriteset(spriteset)` — Spritesetを設定する。
- `maxLines()`
- `numLines()`
- `messageSpeed()`
- `isBusy()` — ビジー状態かどうかを確認する。
- `update()` — 毎フレーム更新する。
- `updateWait()` — Waitを更新する。
- `updateWaitCount()` — Wait Countを更新する。
- `updateWaitMode()` — Wait Modeを更新する。
- `setWaitMode(waitMode)` — Wait Modeを設定する。
- `callNextMethod()`
- `isFastForward()` — Fast Forwardかどうかを確認する。
- `push(methodName)`
- `clear()` — クリアする。
- `wait()`
- `waitForEffect()`
- `waitForMovement()`
- `addText(text)` — Textを追加する。
- `pushBaseLine()`
- `popBaseLine()`
- `waitForNewLine()`
- `popupDamage(target)`
- `performActionStart(subject, action)` — Action Startの演出を実行する。
- `performAction(subject, action)` — Actionの演出を実行する。
- `performActionEnd(subject)` — Action Endの演出を実行する。
- `performDamage(target)` — Damageの演出を実行する。
- `performMiss(target)` — Missの演出を実行する。
- `performRecovery(target)` — Recoveryの演出を実行する。
- `performEvasion(target)` — Evasionの演出を実行する。
- `performMagicEvasion(target)` — Magic Evasionの演出を実行する。
- `performCounter(target)` — Counterの演出を実行する。
- `performReflection(target)` — Reflectionの演出を実行する。
- `performSubstitute(substitute, target)` — Substituteの演出を実行する。
- `performCollapse(target)` — Collapseの演出を実行する。
- `showAttackAnimation(subject, targets)` — Attack Animationを表示する。
- `refresh()` — 再描画・更新する。
- `drawBackground()` — Backgroundを描画する。
- `backRect()` — backの矩形領域を返す。
- `lineRect(index)` — lineの矩形領域を返す。
- `backColor()` — 色を返す。
- `backPaintOpacity()`
- `drawLineText(index)` — Line Textを描画する。
- `startTurn()` — Turnを開始する。
- `startAction(subject, action, targets)` — Actionを開始する。
- `endAction(subject)` — Actionを終了する。
- `displayCurrentState(subject)` — Current Stateを表示する。
- `displayRegeneration(subject)` — Regenerationを表示する。
- `displayAction(subject, item)` — Actionを表示する。
- `displayItemMessage(fmt, subject, item)` — Item Messageを表示する。
- `displayCounter(target)` — Counterを表示する。
- `displayReflection(target)` — Reflectionを表示する。
- `displaySubstitute(substitute, target)` — Substituteを表示する。
- `displayActionResults(subject, target)` — Action Resultsを表示する。
- `displayFailure(target)` — Failureを表示する。
- `displayCritical(target)` — Criticalを表示する。
- `displayDamage(target)` — Damageを表示する。
- `displayMiss(target)` — Missを表示する。
- `displayEvasion(target)` — Evasionを表示する。
- `displayHpDamage(target)` — Hp Damageを表示する。
- `displayMpDamage(target)` — Mp Damageを表示する。
- `displayTpDamage(target)` — Tp Damageを表示する。
- `displayAffectedStatus(target)` — Affected Statusを表示する。
- `displayAutoAffectedStatus(target)` — Auto Affected Statusを表示する。
- `displayChangedStates(target)` — Changed Statesを表示する。
- `displayAddedStates(target)` — Added Statesを表示する。
- `displayRemovedStates(target)` — Removed Statesを表示する。
- `displayChangedBuffs(target)` — Changed Buffsを表示する。
- `displayBuffs(target, buffs, fmt)` — Buffsを表示する。
- `makeHpDamageText(target)` — Hp Damage Textを作成する。
- `makeMpDamageText(target)` — Mp Damage Textを作成する。
- `makeTpDamageText(target)` — Tp Damage Textを作成する。

### Window_PartyCommand

戦闘画面の「戦う/逃げる」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_PartyCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — Command Listを作成する。
- `setup()` — セットアップする。

### Window_ActorCommand

戦闘画面のアクターコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ActorCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — Command Listを作成する。
- `addAttackCommand()` — Attack Commandを追加する。
- `addSkillCommands()` — Skill Commandsを追加する。
- `addGuardCommand()` — Guard Commandを追加する。
- `addItemCommand()` — Item Commandを追加する。
- `setup(actor)` — セットアップする。
- `actor()` — アクターオブジェクトを返す。
- `processOk()` — Okを処理する。
- `selectLast()` — Lastを選択する。

### Window_BattleStatus ⭐

戦闘画面のパーティメンバーステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_BattleStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `extraHeight()` — extraの高さを返す。
- `maxCols()` — 列数を返す。
- `itemHeight()` — 項目の高さを返す。
- `maxItems()` — 項目の最大数を返す。
- `rowSpacing()` — 行の間隔を返す。
- `updatePadding()` — Paddingを更新する。
- `actor(index)` — アクターオブジェクトを返す。
- `selectActor(actor)` — Actorを選択する。
- `update()` — 毎フレーム更新する。
- `preparePartyRefresh()`
- `performPartyRefresh()` — Party Refreshの演出を実行する。
- `drawItem(index)` — Itemを描画する。
- `drawItemImage(index)` — Item Imageを描画する。
- `drawItemStatus(index)` — Item Statusを描画する。
- `faceRect(index)` — faceの矩形領域を返す。
- `nameX(rect)`
- `nameY(rect)`
- `stateIconX(rect)`
- `stateIconY(rect)`
- `basicGaugesX(rect)`
- `basicGaugesY(rect)`

### Window_BattleActor

戦闘画面の対象アクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → `Window_BattleStatus` → **Window_BattleActor**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `show()` — 表示する。
- `hide()` — 非表示にする。
- `select(index)` — 選択する。
- `processTouch()` — Touchを処理する。

### Window_BattleEnemy

戦闘画面の対象敵キャラクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_BattleEnemy**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 列数を返す。
- `maxItems()` — 項目の最大数を返す。
- `enemy()` — 敵オブジェクトを返す。
- `enemyIndex()`
- `drawItem(index)` — Itemを描画する。
- `show()` — 表示する。
- `hide()` — 非表示にする。
- `refresh()` — 再描画・更新する。
- `select(index)` — 選択する。
- `processTouch()` — Touchを処理する。

### Window_BattleSkill

戦闘画面のスキル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_SkillList` → **Window_BattleSkill**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `show()` — 表示する。
- `hide()` — 非表示にする。

### Window_BattleItem

戦闘画面のアイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_BattleItem**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `includes(item)`
- `show()` — 表示する。
- `hide()` — 非表示にする。

### Window_TitleCommand

タイトル画面の「ニューゲーム/コンティニュー」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_TitleCommand**


#### 静的メソッド

- `initCommandPosition()` — Command Positionを初期化する。

#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — Command Listを作成する。
- `isContinueEnabled()` — Continue Enabledかどうかを確認する。
- `processOk()` — Okを処理する。
- `selectLast()` — Lastを選択する。

### Window_GameEnd

ゲーム終了画面の「タイトルへ」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_GameEnd**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — Command Listを作成する。

### Window_DebugRange

デバッグ画面のスイッチ/変数ブロック選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugRange**


#### 静的プロパティ

- `lastTopRow`
- `lastIndex`

#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — 項目の最大数を返す。
- `update()` — 毎フレーム更新する。
- `mode(index)`
- `topId(index)` — topのIDを返す。
- `isSwitchMode(index)` — Switch Modeかどうかを確認する。
- `drawItem(index)` — Itemを描画する。
- `isCancelTriggered()` — Cancel Triggeredかどうかを確認する。
- `processCancel()` — Cancelを処理する。
- `setEditWindow(editWindow)` — Edit Windowを設定する。

### Window_DebugEdit

デバッグ画面のスイッチ/変数表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugEdit**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — 項目の最大数を返す。
- `drawItem(index)` — Itemを描画する。
- `itemName(dataId)` — itemの名前を返す。
- `itemStatus(dataId)`
- `setMode(mode)` — Modeを設定する。
- `setTopId(id)` — Top Idを設定する。
- `currentId()` — currentのIDを返す。
- `update()` — 毎フレーム更新する。
- `updateSwitch()` — Switchを更新する。
- `updateVariable()` — Variableを更新する。
- `deltaForVariable()`

---

