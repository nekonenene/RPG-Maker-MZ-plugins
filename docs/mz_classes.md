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

- `alwaysDash` — 常時ダッシュが有効かどうか。
- `commandRemember` — コマンド記憶が有効かどうか。
- `touchUI` — タッチUI表示が有効かどうか。

#### 静的メソッド

- `load()` — 設定データをストレージから読み込む。
- `save()` — 設定データをストレージに保存する。
- `isLoaded()` — 設定データの読み込みが完了したかを確認する。
- `makeData()` — 保存用の設定データオブジェクトを作成する。
- `applyData(config)` — 読み込んだ設定データを各プロパティに適用する。
- `readFlag(config, name, defaultValue)` — 設定データからブール値を読み取る。
- `readVolume(config, name)` — 設定データから音量値（0〜100）を読み取る。

#### プロパティ

- `bgmVolume` — BGMの音量（0〜100）。AudioManagerと連動。
- `bgsVolume` — BGSの音量（0〜100）。AudioManagerと連動。
- `meVolume` — MEの音量（0〜100）。AudioManagerと連動。
- `seVolume` — SEの音量（0〜100）。AudioManagerと連動。

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
- `audioFileExt()` — オーディオファイルの拡張子（".ogg" または ".m4a"）を返す。
- `checkErrors()` — オーディオの読み込みエラーをチェックする。
- `throwLoadError(webAudio)` — オーディオ読み込みエラーを投げる。

#### プロパティ

- `bgmVolume` — BGMの音量（0〜100）。設定時にBGMバッファのパラメータも更新する。
- `bgsVolume` — BGSの音量（0〜100）。設定時にBGSバッファのパラメータも更新する。
- `meVolume` — MEの音量（0〜100）。設定時にMEバッファのパラメータも更新する。
- `seVolume` — SEの音量（0〜100）。

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

- `currencyUnit` — 通貨単位の文字列（$dataSystem.currencyUnit を返す）。

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
- `onSceneTerminate()` — シーン終了時のコールバック。
- `onSceneCreate()` — シーン作成時のコールバック。
- `onBeforeSceneStart()` — シーン開始前のコールバック。
- `onSceneStart()` — シーン開始時のコールバック。
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
- `onEncounter()` — エンカウント時に先制攻撃・不意打ちの判定を行う。
- `ratePreemptive()` — 先制攻撃の確率を返す。
- `rateSurprise()` — 不意打ちの確率を返す。
- `saveBgmAndBgs()` — 現在のBGMとBGSをマップ用として保存する。
- `playBattleBgm()` — 戦闘BGMを再生し、BGSを停止する。
- `playVictoryMe()` — 勝利MEを再生する。
- `playDefeatMe()` — 敗北MEを再生する。
- `replayBgmAndBgs()` — 保存したマップのBGMとBGSを再生する。
- `makeEscapeRatio()` — 逃走成功率を計算・設定する（パーティと敵の敏捷性に基づく）。
- `update(timeActive)` — 戦闘進行を毎フレーム更新する。
- `updatePhase(timeActive)` — 現在のフェーズ（start/turn/action/turnEnd/battleEnd）に応じた更新処理を行う。
- `updateEvent()` — 戦闘中のイベント処理を更新する。強制アクションがあれば処理する。
- `updateEventMain()` — 戦闘イベントのメイン更新。インタプリタ更新・戦闘終了チェック・戦闘イベントのセットアップを行う。
- `isBusy()` — 戦闘がビジー状態（メッセージ・スプライト・ログ表示中）かを確認する。
- `updateTpbInput()` — TPBモードの入力状態を更新する。
- `checkTpbInputClose()` — TPBの入力受付を閉じるべきかチェックする。
- `checkTpbInputOpen()` — TPBの入力受付を開くべきかチェックする。
- `isPartyTpbInputtable()` — パーティがTPBモードで入力可能かを確認する。
- `needsActorInputCancel()` — 現在のアクターの入力をキャンセルする必要があるかを確認する。
- `isTpbMainPhase()` — TPBのメインフェーズ（turn/turnEnd/action）かを確認する。
- `isInputting()` — コマンド入力中かどうかを確認する。
- `isInTurn()` — ターン実行中フェーズかを確認する。
- `isTurnEnd()` — ターン終了フェーズかを確認する。
- `isAborting()` — 戦闘中断中かを確認する。
- `isBattleEnd()` — 戦闘終了フェーズかを確認する。
- `canEscape()` — 逃走可能かを確認する。
- `canLose()` — 敗北可能（敗北してもゲームオーバーにならない）かを確認する。
- `isEscaped()` — 逃走済みかを確認する。
- `actor()` — 現在コマンド入力中のアクターを返す。
- `startBattle()` — 戦闘を開始し、開始メッセージを表示する。
- `displayStartMessages()` — 戦闘開始メッセージ（敵出現・先制攻撃・不意打ち）を表示する。
- `startInput()` — コマンド入力フェーズを開始する。不意打ち時は即ターン開始。
- `inputtingAction()` — 現在入力中のアクターのアクションを返す。
- `selectNextCommand()` — 次のコマンド入力へ進む。全コマンド入力完了なら次のアクターへ。
- `selectNextActor()` — 次の入力可能なアクターを選択する。
- `selectPreviousCommand()` — 前のコマンド入力に戻る。
- `selectPreviousActor()` — 前のアクターの入力に戻る。
- `changeCurrentActor(forward)` — 現在のアクターを前後に切り替える。入力可能なアクターを検索する。
- `startActorInput()` — アクターのコマンド入力を開始する。
- `finishActorInput()` — アクターのコマンド入力を完了する。TPBではキャスト開始。
- `cancelActorInput()` — アクターのコマンド入力をキャンセルする。
- `updateStart()` — startフェーズの更新。TPBならturnフェーズへ、そうでなければ入力開始。
- `startTurn()` — ターンを開始する。ターン数を増加し、アクション順序を決定する。
- `updateTurn(timeActive)` — ターンの更新処理。次のアクション実行対象を取得して処理する。
- `updateTpb()` — TPBモードのパーティと敵グループの時間経過を更新する。
- `updateAllTpbBattlers()` — 全バトラーのTPB状態を更新する。
- `updateTpbBattler(battler)` — 個別バトラーのTPB状態（ターン終了・アクション準備完了・タイムアウト）を更新する。
- `checkTpbTurnEnd()` — TPBモードのターン終了条件をチェックする。
- `processTurn()` — 現在の行動主体のアクションを処理する。
- `endBattlerActions(battler)` — バトラーの全アクションを終了し、TPBチャージタイムをクリアする。
- `endTurn()` — ターンを終了し、turnEndフェーズに移行する。
- `updateTurnEnd()` — ターン終了フェーズの更新。TPBなら次のターンへ、そうでなければ全バトラーのターン終了処理。
- `endAllBattlersTurn()` — 全バトラーのターン終了コールバック(onTurnEnd)を呼び出し、ステータスを表示する。
- `displayBattlerStatus(battler, current)` — バトラーの自動付与ステート・現在ステート・回復量をログに表示する。
- `getNextSubject()` — アクション実行順リストから次の生存バトラーを取得する。
- `allBattleMembers()` — 戦闘に参加する全バトラー（味方+敵）の配列を返す。
- `makeActionOrders()` — 敏捷性に基づいてアクションの実行順序を決定する。
- `startAction()` — アクションの実行を開始する。アイテム使用・ログ表示を行う。
- `updateAction()` — アクション実行を更新する。ターゲットリストから順に適用する。
- `endAction()` — アクション実行を終了する。全アクション完了でバトラーの行動を終了。
- `invokeAction(subject, target)` — 対象にアクションを適用する。反撃・魔法反射の判定も行う。
- `invokeNormalAction(subject, target)` — 通常アクションを実行する。身代わり適用後にダメージ計算。
- `invokeCounterAttack(subject, target)` — 反撃を実行する（対象が行動主体に通常攻撃）。
- `invokeMagicReflection(subject, target)` — 魔法反射を実行する（魔法が行動主体に跳ね返る）。
- `applySubstitute(target)` — 身代わり可能なバトラーがいれば身代わりを適用し、実際の対象を返す。
- `checkSubstitute(target)` — 身代わり発動条件を確認する（瀕死かつ必中でない場合）。
- `isActionForced()` — 強制アクション待ちのバトラーがいるかを確認する。
- `forceAction(battler)` — バトラーの強制アクションを予約する。
- `processForcedAction()` — 予約された強制アクションを実行する。
- `abort()` — 戦闘を中断（aborting）状態にする。
- `checkBattleEnd()` — 戦闘終了条件（逃走済み・全滅・敵全滅）をチェックする。
- `checkAbort()` — 戦闘中断状態かチェックし、中断なら中断処理を実行する。
- `processVictory()` — 勝利処理（ステート解除・ME再生・報酬・経験値獲得等）を実行する。
- `processEscape()` — 逃走処理を実行する。成功率に基づいて判定し、失敗時は成功率を上げる。
- `onEscapeSuccess()` — 逃走成功時の処理（メッセージ表示・戦闘中断）。
- `onEscapeFailure()` — 逃走失敗時の処理（メッセージ表示・逃走成功率+10%・ターン開始）。
- `processPartyEscape()` — パーティ逃走処理（イベントコマンドによる逃走）。
- `processAbort()` — 戦闘中断処理（ステート解除・ログクリア・BGM復帰）を実行する。
- `processDefeat()` — 敗北処理（メッセージ表示・ME再生）を実行する。
- `endBattle(result)` — 戦闘を終了する。result: 0=勝利, 1=中断/逃走, 2=敗北。
- `updateBattleEnd()` — 戦闘終了フェーズの更新。結果に応じてシーン遷移やゲームオーバーへ。
- `makeRewards()` — 戦闘報酬（経験値・ゴールド・ドロップアイテム）を作成する。
- `displayVictoryMessage()` — 勝利メッセージを表示する。
- `displayDefeatMessage()` — 敗北メッセージを表示する。
- `displayEscapeSuccessMessage()` — 逃走成功メッセージを表示する。
- `displayEscapeFailureMessage()` — 逃走失敗メッセージを表示する。
- `displayRewards()` — 報酬（経験値・ゴールド・アイテム）のメッセージを表示する。
- `displayExp()` — 獲得経験値をメッセージ表示する。
- `displayGold()` — 獲得ゴールドをメッセージ表示する。
- `displayDropItems()` — ドロップアイテムをメッセージ表示する。
- `gainRewards()` — 報酬（経験値・ゴールド・アイテム）を実際にパーティに付与する。
- `gainExp()` — パーティ全員に経験値を付与する。
- `gainGold()` — パーティにゴールドを付与する。
- `gainDropItems()` — ドロップアイテムをパーティのインベントリに追加する。

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
- `clearFade()` — フェード状態をクリアする。
- `clearTone()` — 色調をクリアする。
- `clearFlash()` — フラッシュをクリアする。
- `clearShake()` — 画面の揺れをクリアする。
- `clearZoom()` — ズームをクリアする（等倍に戻す）。
- `clearWeather()` — 天候をクリアする（天候なしに戻す）。
- `clearPictures()` — 全ピクチャをクリアする。
- `eraseBattlePictures()` — 戦闘用ピクチャ（IDオフセット付き）を全て消去する。
- `maxPictures()` — ピクチャの最大数を返す（デフォルト: 100）。
- `startFadeOut(duration)` — フェードアウトを開始する（指定フレーム数で暗転）。
- `startFadeIn(duration)` — フェードインを開始する（指定フレーム数で明転）。
- `startTint(tone, duration)` — 画面の色調変更を開始する。
- `startFlash(color, duration)` — 画面フラッシュを開始する。
- `startShake(power, speed, duration)` — 画面の揺れを開始する。
- `startZoom(x, y, scale, duration)` — 指定座標・拡大率へのズームを開始する。
- `setZoom(x, y, scale)` — ズームを即座に設定する（アニメーションなし）。
- `changeWeather(type, power, duration)` — 天候を変更する（type: none/rain/storm/snow）。
- `update()` — 毎フレーム全画面エフェクトを更新する。
- `updateFadeOut()` — フェードアウトの進行を更新する。
- `updateFadeIn()` — フェードインの進行を更新する。
- `updateTone()` — 色調変更の進行を更新する。
- `updateFlash()` — フラッシュの進行を更新する。
- `updateShake()` — 画面の揺れの進行を更新する。
- `updateZoom()` — ズームの進行を更新する。
- `updateWeather()` — 天候の進行を更新する。
- `updatePictures()` — 全ピクチャの毎フレーム更新を行う。
- `startFlashForDamage()` — ダメージ用の赤フラッシュを開始する。
- `rotatePicture(pictureId, speed)` — ピクチャの回転速度を設定する。
- `tintPicture(pictureId, tone, duration)` — ピクチャの色調を変更する。
- `erasePicture(pictureId)` — ピクチャを消去する。

### Game_Picture

ピクチャ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `name()` — ピクチャのファイル名を返す。
- `origin()` — 原点タイプ（0:左上, 1:中央）を返す。
- `x()` — X座標を返す。
- `y()` — Y座標を返す。
- `scaleX()` — X方向の拡大率（%）を返す。
- `scaleY()` — Y方向の拡大率（%）を返す。
- `opacity()` — 不透明度（0〜255）を返す。
- `blendMode()` — ブレンドモードを返す。
- `tone()` — 色調を返す。
- `angle()` — 回転角度を返す。
- `show(name, origin, x, y, scaleX, scaleY, opacity, blendMode)` — ピクチャを表示する。
- `move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration, easingType)` — ピクチャを移動する（指定フレーム数でイージング付き）。
- `initBasic()` — 基本プロパティ（名前・座標・拡大率・不透明度・ブレンドモード）を初期化する。
- `initTarget()` — 移動先のターゲット値とイージング設定を初期化する。
- `initTone()` — 色調と色調変更の目標値を初期化する。
- `initRotation()` — 回転角度と回転速度を初期化する。
- `rotate(speed)` — 回転速度を設定する（毎フレーム speed/2 度ずつ回転）。
- `tint(tone, duration)` — 色調変更を開始する（指定フレーム数で目標色調へ遷移）。
- `update()` — 毎フレーム移動・色調・回転を更新する。
- `updateMove()` — 移動アニメーション（座標・拡大率・不透明度）を更新する。
- `updateTone()` — 色調変更アニメーションを更新する。
- `updateRotation()` — 回転アニメーションを更新する。
- `applyEasing(current, target)` — イージング関数を適用して現在値から目標値への補間を計算する。
- `calcEasing(t)` — イージングタイプに応じた補間値を計算する。
- `easeIn(t, exponent)` — Ease In（ゆっくり開始）の補間値を計算する。
- `easeOut(t, exponent)` — Ease Out（ゆっくり終了）の補間値を計算する。
- `easeInOut(t, exponent)` — Ease In Out（ゆっくり開始＆終了）の補間値を計算する。

### Game_Item

スキル・アイテム・武器・防具を扱うゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(item)` — 初期化する。itemが指定されていればそのアイテムをセットする。
- `isSkill()` — スキルかどうかを確認する。
- `isItem()` — 通常アイテムかどうかを確認する。
- `isUsableItem()` — 使用可能なアイテム（スキルまたは通常アイテム）かを確認する。
- `isWeapon()` — 武器かどうかを確認する。
- `isArmor()` — 防具かどうかを確認する。
- `isEquipItem()` — 装備品（武器または防具）かを確認する。
- `isNull()` — 未設定（空）かどうかを確認する。
- `itemId()` — アイテムIDを返す。
- `object()` — 対応するデータベースオブジェクト（$dataSkills等）を返す。未設定ならnull。
- `setObject(item)` — データベースオブジェクトからデータクラスとIDをセットする。
- `setEquip(isWeapon, itemId)` — 装備品として設定する（武器/防具とIDを直接指定）。

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

- `initialize(subject, forcing)` — 初期化する。subjectは行動主体のバトラー、forcingは強制アクションか。
- `clear()` — アクション内容をクリアする。
- `setSubject(subject)` — 行動主体のバトラーを設定する。
- `subject()` — 行動主体のバトラーを返す。
- `friendsUnit()` — 行動主体の味方ユニットを返す。
- `opponentsUnit()` — 行動主体の敵側ユニットを返す。
- `setEnemyAction(action)` — 敵の行動パターンからアクションを設定する。
- `setAttack()` — 通常攻撃をアクションとして設定する。
- `setGuard()` — 防御をアクションとして設定する。
- `setSkill(skillId)` — 指定スキルIDをアクションとして設定する。
- `setItem(itemId)` — 指定アイテムIDをアクションとして設定する。
- `setItemObject(object)` — データベースオブジェクトからアクションを設定する。
- `setTarget(targetIndex)` — 対象インデックスを設定する。
- `item()` — アクションに対応するスキルまたはアイテムのデータベースオブジェクトを返す。
- `isSkill()` — スキルアクションかを確認する。
- `isItem()` — アイテムアクションかを確認する。
- `numRepeats()` — アクションの繰り返し回数を返す。
- `checkItemScope(list)` — アイテムの範囲が指定リストに含まれるかを確認する。
- `isForOpponent()` — 敵側対象のアクションかを確認する。
- `isForFriend()` — 味方対象のアクションかを確認する。
- `isForEveryone()` — 敵味方全体対象かを確認する。
- `isForAliveFriend()` — 生存味方対象かを確認する。
- `isForDeadFriend()` — 戦闘不能味方対象かを確認する。
- `isForUser()` — 使用者自身対象かを確認する。
- `isForOne()` — 単体対象かを確認する。
- `isForRandom()` — ランダム対象かを確認する。
- `isForAll()` — 全体対象かを確認する。
- `needsSelection()` — 対象選択が必要かを確認する。
- `numTargets()` — ランダム対象の人数を返す。
- `checkDamageType(list)` — ダメージタイプが指定リストに含まれるかを確認する。
- `isHpEffect()` — HPに影響するアクションかを確認する。
- `isMpEffect()` — MPに影響するアクションかを確認する。
- `isDamage()` — ダメージアクションかを確認する。
- `isRecover()` — 回復アクションかを確認する。
- `isDrain()` — 吸収アクションかを確認する。
- `isHpRecover()` — HP回復アクションかを確認する。
- `isMpRecover()` — MP回復アクションかを確認する。
- `isCertainHit()` — 必中アクションかを確認する。
- `isPhysical()` — 物理アクションかを確認する。
- `isMagical()` — 魔法アクションかを確認する。
- `isAttack()` — 通常攻撃かを確認する。
- `isGuard()` — 防御かを確認する。
- `isMagicSkill()` — 魔法スキルかを確認する。
- `decideRandomTarget()` — ランダムに対象を決定する。
- `setConfusion()` — 混乱時のアクションを設定する。
- `prepare()` — アクション実行前の準備を行う（混乱時の対象変更等）。
- `isValid()` — アクションが有効かを確認する。
- `speed()` — アクションの速度を返す（行動順序に使用）。
- `makeTargets()` — アクションの対象リストを作成する。
- `repeatTargets(targets)` — 繰り返し回数分ターゲットを複製する。
- `confusionTarget()` — 混乱状態での対象を返す。
- `targetsForEveryone()` — 全体対象（敵+味方）の配列を返す。
- `targetsForOpponents()` — 敵側対象の配列を返す。
- `targetsForFriends()` — 味方対象の配列を返す。
- `randomTargets(unit)` — ユニットからランダムに対象を選ぶ。
- `targetsForDead(unit)` — ユニットの戦闘不能メンバーを対象として返す。
- `targetsForAlive(unit)` — ユニットの生存メンバーを対象として返す。
- `targetsForDeadAndAlive(unit)` — ユニットの全メンバー（生死問わず）を返す。
- `evaluate()` — アクションの有効度を評価する（AI用）。
- `itemTargetCandidates()` — アイテムの対象候補一覧を返す。
- `evaluateWithTarget(target)` — 特定の対象に対するアクションの有効度を評価する。
- `testApply(target)` — 対象にアクションが適用可能かをテストする。
- `testLifeAndDeath(target)` — 対象の生死状態がアクションの範囲と合致するかを確認する。
- `hasItemAnyValidEffects(target)` — 対象に有効な効果が1つでもあるかを確認する。
- `testItemEffect(target, effect)` — 個別の効果が対象に有効かをテストする。
- `itemCnt(target)` — 対象の反撃率を返す。
- `itemMrf(target)` — 対象の魔法反射率を返す。
- `itemHit(/*target*/)` — アクションの命中率を返す。
- `itemEva(target)` — 対象の回避率を返す。
- `itemCri(target)` — クリティカル率を返す。
- `apply(target)` — 対象にアクションを適用する（命中判定・ダメージ計算・効果適用）。
- `makeDamageValue(target, critical)` — ダメージ値を計算する（属性・分散・防御・クリティカル反映）。
- `evalDamageFormula(target)` — ダメージ計算式を評価する（データベースの式をevalで実行）。
- `calcElementRate(target)` — 属性有効度を計算する。
- `elementsMaxRate(target, elements)` — 複数属性の最大有効度を返す。
- `applyCritical(damage)` — クリティカル倍率（×3）を適用する。
- `applyVariance(damage, variance)` — ダメージに分散（ランダム変動）を適用する。
- `applyGuard(damage, target)` — 防御によるダメージ軽減を適用する。
- `executeDamage(target, value)` — ダメージを実行する（HPまたはMPに応じて振り分け）。
- `executeHpDamage(target, value)` — HPダメージを実行する。
- `executeMpDamage(target, value)` — MPダメージを実行する。
- `gainDrainedHp(value)` — 吸収したHPを行動主体が獲得する。
- `gainDrainedMp(value)` — 吸収したMPを行動主体が獲得する。
- `applyItemEffect(target, effect)` — アイテムの個別効果を対象に適用する。
- `itemEffectRecoverHp(target, effect)` — HP回復効果を適用する。
- `itemEffectRecoverMp(target, effect)` — MP回復効果を適用する。
- `itemEffectGainTp(target, effect)` — TP獲得効果を適用する。
- `itemEffectAddState(target, effect)` — ステート付与効果を適用する。
- `itemEffectAddAttackState(target, effect)` — 通常攻撃時のステート付与効果を適用する。
- `itemEffectAddNormalState(target, effect)` — 指定ステートの付与効果を適用する。
- `itemEffectRemoveState(target, effect)` — ステート解除効果を適用する。
- `itemEffectAddBuff(target, effect)` — バフ付与効果を適用する。
- `itemEffectAddDebuff(target, effect)` — デバフ付与効果を適用する。
- `itemEffectRemoveBuff(target, effect)` — バフ解除効果を適用する。
- `itemEffectRemoveDebuff(target, effect)` — デバフ解除効果を適用する。
- `itemEffectSpecial(target, effect)` — 特殊効果（逃走等）を適用する。
- `itemEffectGrow(target, effect)` — 成長効果（永続パラメータ上昇）を適用する。
- `itemEffectLearnSkill(target, effect)` — スキル習得効果を適用する。
- `itemEffectCommonEvent(/*target, effect*/)` — コモンイベント呼び出し効果を適用する。
- `makeSuccess(target)` — 対象のアクション結果を成功に設定する。
- `applyItemUserEffect(/*target*/)` — アイテム使用者へのTP獲得効果を適用する。
- `lukEffectRate(target)` — 運による効果補正率を返す。
- `applyGlobal()` — グローバル効果（コモンイベント予約等）を適用する。
- `updateLastUsed()` — 最後に使用したスキル/アイテムのIDを記録する。
- `updateLastSubject()` — 最後の行動主体情報を記録する。
- `updateLastTarget(target)` — 最後の対象情報を記録する。

### Game_ActionResult

戦闘行動の結果用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `clear()` — アクション結果をクリアする。
- `addedStateObjects()` — 付与されたステートのデータベースオブジェクトの配列を返す。
- `removedStateObjects()` — 解除されたステートのデータベースオブジェクトの配列を返す。
- `isStatusAffected()` — ステート・バフ・デバフに変化があったかを確認する。
- `isHit()` — アクションが命中したかを確認する。
- `isStateAdded(stateId)` — 指定ステートが付与されたかを確認する。
- `pushAddedState(stateId)` — 付与ステートリストに追加する。
- `isStateRemoved(stateId)` — 指定ステートが解除されたかを確認する。
- `pushRemovedState(stateId)` — 解除ステートリストに追加する。
- `isBuffAdded(paramId)` — 指定パラメータのバフが付与されたかを確認する。
- `pushAddedBuff(paramId)` — 付与バフリストに追加する。
- `isDebuffAdded(paramId)` — 指定パラメータのデバフが付与されたかを確認する。
- `pushAddedDebuff(paramId)` — 付与デバフリストに追加する。
- `isBuffRemoved(paramId)` — 指定パラメータのバフが解除されたかを確認する。
- `pushRemovedBuff(paramId)` — 解除バフリストに追加する。`

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
- `initMembers()` — メンバー変数を初期化する。
- `clearParamPlus()` — パラメータ加算値をクリアする。
- `clearStates()` — 全ステートをクリアする。
- `eraseState(stateId)` — 指定ステートを解除する。
- `isStateAffected(stateId)` — 指定ステートが付与されているかを確認する。
- `isDeathStateAffected()` — 戦闘不能ステートが付与されているかを確認する。
- `deathStateId()` — 戦闘不能ステートのIDを返す（デフォルト: 1）。
- `resetStateCounts(stateId)` — ステートの残りターン数をリセットする。
- `isStateExpired(stateId)` — ステートの有効期限が切れたかを確認する。
- `updateStateTurns()` — 全ステートの残りターン数を1減少させる。
- `clearBuffs()` — 全バフ・デバフをクリアする。
- `eraseBuff(paramId)` — 指定パラメータのバフ・デバフを消去する。
- `buffLength()` — バフ配列の長さ（パラメータ数: 8）を返す。
- `buff(paramId)` — 指定パラメータのバフレベルを返す（正=バフ、負=デバフ）。
- `isBuffAffected(paramId)` — 指定パラメータにバフが付与されているかを確認する。
- `isDebuffAffected(paramId)` — 指定パラメータにデバフが付与されているかを確認する。
- `isBuffOrDebuffAffected(paramId)` — 指定パラメータにバフまたはデバフが付与されているかを確認する。
- `isMaxBuffAffected(paramId)` — バフが最大段階（2段階）かを確認する。
- `isMaxDebuffAffected(paramId)` — デバフが最大段階（-2段階）かを確認する。
- `increaseBuff(paramId)` — 指定パラメータのバフレベルを1段階上げる。
- `decreaseBuff(paramId)` — 指定パラメータのバフレベルを1段階下げる。
- `overwriteBuffTurns(paramId, turns)` — バフの残りターン数を上書きする（現在値より大きい場合のみ）。
- `isBuffExpired(paramId)` — バフの有効期限が切れたかを確認する。
- `updateBuffTurns()` — 全バフの残りターン数を1減少させる。
- `die()` — 戦闘不能にする（HP=0、ステート・バフクリア）。
- `revive()` — 戦闘不能から復活する（HP=1以上に）。
- `states()` — 付与されているステートのデータベースオブジェクトの配列を返す。
- `stateIcons()` — 付与されているステートのアイコンID配列を返す。
- `buffIcons()` — バフ・デバフのアイコンID配列を返す。
- `buffIconIndex(buffLevel, paramId)` — バフレベルとパラメータIDからアイコンインデックスを返す。
- `allIcons()` — ステート+バフの全アイコンID配列を返す。
- `traitObjects()` — 特徴を持つオブジェクト（ステート等）の配列を返す。サブクラスでオーバーライド。
- `allTraits()` — 全特徴の配列を返す。
- `traits(code)` — 指定コードの特徴の配列を返す。
- `traitsWithId(code, id)` — 指定コード・IDの特徴の配列を返す。
- `traitsPi(code, id)` — 指定特徴の値を乗算で合成して返す。
- `traitsSum(code, id)` — 指定特徴の値を加算で合成して返す。
- `traitsSumAll(code)` — 指定コードの全特徴の値を合計して返す。
- `traitsSet(code)` — 指定コードの特徴のdataIdのセットを返す。
- `paramBase(/*paramId*/)` — パラメータの基本値を返す。サブクラスでオーバーライド。
- `paramPlus(paramId)` — パラメータの加算値（装備・成長等）を返す。
- `paramBasePlus(paramId)` — パラメータの基本値+加算値を返す（最小値制限付き）。
- `paramMin(paramId)` — パラメータの最小値を返す。
- `paramMax(/*paramId*/)` — パラメータの最大値を返す。
- `paramRate(paramId)` — パラメータの特徴による倍率を返す。
- `paramBuffRate(paramId)` — バフによるパラメータ倍率を返す（1段階あたり25%）。
- `param(paramId)` — 最終的なパラメータ値を返す（基本+加算×倍率×バフ倍率）。
- `xparam(xparamId)` — 追加パラメータ（命中率・回避率等）の値を返す。
- `sparam(sparamId)` — 特殊パラメータ（狙われ率・防御効果率等）の値を返す。
- `elementRate(elementId)` — 属性有効度を返す。
- `debuffRate(paramId)` — デバフ有効度を返す。
- `stateRate(stateId)` — ステート有効度を返す。
- `stateResistSet()` — ステート無効化のセットを返す。
- `isStateResist(stateId)` — 指定ステートを無効化するかを確認する。
- `attackElements()` — 通常攻撃の属性ID配列を返す。
- `attackStates()` — 通常攻撃時に付与するステートID配列を返す。
- `attackStatesRate(stateId)` — 通常攻撃時のステート付与率を返す。
- `attackSpeed()` — 通常攻撃の速度補正を返す。
- `attackTimesAdd()` — 通常攻撃の追加回数を返す。
- `attackSkillId()` — 通常攻撃に使用するスキルIDを返す。
- `addedSkillTypes()` — 追加されたスキルタイプID配列を返す。
- `isSkillTypeSealed(stypeId)` — 指定スキルタイプが封印されているかを確認する。
- `addedSkills()` — 特徴で追加されたスキルID配列を返す。
- `isSkillSealed(skillId)` — 指定スキルが封印されているかを確認する。
- `isEquipWtypeOk(wtypeId)` — 指定武器タイプを装備可能かを確認する。
- `isEquipAtypeOk(atypeId)` — 指定防具タイプを装備可能かを確認する。
- `isEquipTypeLocked(etypeId)` — 指定装備タイプがロックされているかを確認する。
- `isEquipTypeSealed(etypeId)` — 指定装備タイプが封印されているかを確認する。
- `slotType()` — スロットタイプ（0:通常, 1:二刀流）を返す。
- `isDualWield()` — 二刀流かを確認する。
- `actionPlusSet()` — 行動回数追加の確率配列を返す。
- `specialFlag(flagId)` — 指定特殊フラグが有効かを返す。
- `collapseType()` — 消滅エフェクトのタイプを返す。
- `partyAbility(abilityId)` — パーティアビリティが有効かを返す。
- `isAutoBattle()` — 自動戦闘かを確認する。
- `isGuard()` — 防御状態かを確認する。
- `isSubstitute()` — 身代わり状態かを確認する。
- `isPreserveTp()` — TP持ち越しが有効かを確認する。
- `addParam(paramId, value)` — パラメータ加算値に値を追加する。
- `setHp(hp)` — HPを設定する（0〜最大HPにクランプ）。
- `setMp(mp)` — MPを設定する（0〜最大MPにクランプ）。
- `setTp(tp)` — TPを設定する（0〜最大TPにクランプ）。
- `maxTp()` — 最大TPを返す（デフォルト: 100）。
- `refresh()` — ステート・HP・MPの状態を再計算する。
- `recoverAll()` — HP・MPを全回復し、全ステートを解除する。
- `hpRate()` — HP割合（現在HP/最大HP）を返す。
- `mpRate()` — MP割合（現在MP/最大MP）を返す。
- `tpRate()` — TP割合（現在TP/最大TP）を返す。
- `hide()` — バトラーを非表示にする。
- `appear()` — バトラーを表示する。
- `isHidden()` — 非表示状態かを確認する。
- `isAppeared()` — 表示状態かを確認する。
- `isDead()` — 戦闘不能かを確認する。
- `isAlive()` — 生存しているかを確認する。
- `isDying()` — 瀕死（HP25%以下）かを確認する。
- `isRestricted()` — 行動制約（混乱等）があるかを確認する。
- `canInput()` — コマンド入力可能かを確認する。
- `canMove()` — 行動可能（移動・攻撃等）かを確認する。
- `isConfused()` — 混乱状態かを確認する。
- `confusionLevel()` — 混乱レベルを返す（行動制約の種類に応じて1〜3）。
- `isActor()` — アクターかを確認する。
- `isEnemy()` — 敵かを確認する。
- `sortStates()` — ステートを優先度順にソートする。
- `restriction()` — 最も優先度の高い行動制約値を返す。
- `addNewState(stateId)` — 新しいステートを付与する。戦闘不能ステートなら死亡処理。
- `onRestrict()` — 行動制約が発生した時のコールバック。
- `mostImportantStateText()` — 最も優先度の高いステートのメッセージを返す。
- `stateMotionIndex()` — ステートに対応するモーションインデックスを返す。
- `stateOverlayIndex()` — ステートに対応するオーバーレイインデックスを返す。
- `isSkillWtypeOk(/*skill*/)` — スキルに必要な武器タイプを装備しているかを確認する。
- `skillMpCost(skill)` — スキルのMP消費量を計算する。
- `skillTpCost(skill)` — スキルのTP消費量を計算する。
- `canPaySkillCost(skill)` — スキルのコストを支払えるかを確認する。
- `paySkillCost(skill)` — スキルのMP・TPコストを支払う。
- `isOccasionOk(item)` — アイテムが現在の状況で使用可能かを確認する。
- `meetsUsableItemConditions(item)` — アイテム使用条件を満たすかを確認する。
- `meetsSkillConditions(skill)` — スキル使用条件を満たすかを確認する。
- `meetsItemConditions(item)` — アイテム使用条件を満たすかを確認する。
- `canUse(item)` — アイテムまたはスキルを使用可能かを確認する。
- `canEquip(item)` — 装備可能かを確認する。
- `canEquipWeapon(item)` — 武器を装備可能かを確認する。
- `canEquipArmor(item)` — 防具を装備可能かを確認する。
- `guardSkillId()` — 防御に使用するスキルIDを返す（デフォルト: 2）。
- `canAttack()` — 通常攻撃可能かを確認する。
- `canGuard()` — 防御可能かを確認する。

### Game_Battler ⭐

Game_ActorとGame_Enemyのスーパークラス。スプライトやアクション関連のメソッドを含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → **Game_Battler**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバー変数を初期化する。
- `clearDamagePopup()` — ダメージポップアップ要求をクリアする。
- `clearWeaponAnimation()` — 武器アニメーション要求をクリアする。
- `clearEffect()` — エフェクト要求をクリアする。
- `clearMotion()` — モーション要求をクリアする。
- `requestEffect(effectType)` — スプライトエフェクトを要求する。
- `requestMotion(motionType)` — スプライトモーションを要求する。
- `requestMotionRefresh()` — モーションのリフレッシュを要求する。
- `cancelMotionRefresh()` — モーションリフレッシュ要求をキャンセルする。
- `select()` — バトラーを選択状態にする。
- `deselect()` — バトラーの選択状態を解除する。
- `isDamagePopupRequested()` — ダメージポップアップが要求されているかを確認する。
- `isEffectRequested()` — エフェクトが要求されているかを確認する。
- `isMotionRequested()` — モーションが要求されているかを確認する。
- `isWeaponAnimationRequested()` — 武器アニメーションが要求されているかを確認する。
- `isMotionRefreshRequested()` — モーションリフレッシュが要求されているかを確認する。
- `isSelected()` — 選択状態かを確認する。
- `effectType()` — 要求されたエフェクトタイプを返す。
- `motionType()` — 要求されたモーションタイプを返す。
- `weaponImageId()` — 武器アニメーションの画像IDを返す。
- `startDamagePopup()` — ダメージポップアップ表示を要求する。
- `shouldPopupDamage()` — ダメージポップアップを表示すべきかを確認する。
- `startWeaponAnimation(weaponImageId)` — 武器アニメーションを開始する。
- `action(index)` — 指定インデックスのGame_Actionを返す。
- `setAction(index, action)` — 指定インデックスにアクションを設定する。
- `numActions()` — アクションの数を返す。
- `clearActions()` — 全アクションをクリアする。
- `result()` — アクション結果（Game_ActionResult）を返す。
- `clearResult()` — アクション結果をクリアする。
- `clearTpbChargeTime()` — TPBチャージタイムをクリアする。
- `applyTpbPenalty()` — TPBペナルティ（キャンセル時のチャージ減少）を適用する。
- `initTpbChargeTime(advantageous)` — TPBチャージタイムを初期化する（先制時は満タン）。
- `tpbChargeTime()` — TPBチャージタイムの値を返す。
- `startTpbCasting()` — TPBキャスト（スキル詠唱）を開始する。
- `startTpbAction()` — TPBアクション実行を開始する。
- `isTpbCharged()` — TPBチャージが完了したかを確認する。
- `isTpbReady()` — TPBアクション準備完了かを確認する。
- `isTpbTimeout()` — TPBタイムアウトかを確認する。
- `updateTpb()` — TPB状態を更新する。
- `updateTpbChargeTime()` — TPBチャージタイムを進行させる。
- `updateTpbCastTime()` — TPBキャストタイムを進行させる。
- `updateTpbAutoBattle()` — TPB自動戦闘時のアクション決定を更新する。
- `updateTpbIdleTime()` — TPBアイドルタイムを更新する。
- `tpbAcceleration()` — TPBの加速度を返す。
- `tpbRelativeSpeed()` — TPBの相対速度を返す。
- `tpbSpeed()` — TPBの速度を返す。
- `tpbBaseSpeed()` — TPBの基本速度を返す。
- `tpbRequiredCastTime()` — TPBキャストに必要な時間を返す。
- `onTpbCharged()` — TPBチャージ完了時のコールバック。
- `shouldDelayTpbCharge()` — TPBチャージを遅延すべきかを確認する。
- `finishTpbCharge()` — TPBチャージを完了する。
- `isTpbTurnEnd()` — TPBターンが終了したかを確認する。
- `initTpbTurn()` — TPBターンカウントを初期化する。
- `startTpbTurn()` — TPBターンを開始する。
- `makeTpbActions()` — TPB用アクションを作成する。
- `onTpbTimeout()` — TPBタイムアウト時のコールバック。
- `turnCount()` — ターンカウントを返す。
- `canInput()` — コマンド入力可能かを確認する（TPBチャージ完了かつ制約なし）。
- `refresh()` — ステート・バフを再計算する。
- `addState(stateId)` — ステートを付与する（有効度・無効化判定含む）。
- `isStateAddable(stateId)` — ステートを付与可能かを確認する。
- `isStateRestrict(stateId)` — ステートが行動制約により付与不可かを確認する。
- `onRestrict()` — 行動制約発生時のコールバック（アクションクリア等）。
- `removeState(stateId)` — ステートを解除する。
- `escape()` — 逃走する（戦闘不能ステートを解除して非表示に）。
- `addBuff(paramId, turns)` — バフを付与する（指定ターン数）。
- `addDebuff(paramId, turns)` — デバフを付与する（指定ターン数）。
- `removeBuff(paramId)` — バフ・デバフを解除する。
- `removeBattleStates()` — 戦闘終了時に解除されるステートを削除する。
- `removeAllBuffs()` — 全バフ・デバフを解除する。
- `removeStatesAuto(timing)` — 自動解除タイミングのステートを解除する。
- `removeBuffsAuto()` — 有効期限切れのバフを自動解除する。
- `removeStatesByDamage()` — ダメージによるステート解除を処理する。
- `makeActionTimes()` — 行動回数を計算する。
- `makeActions()` — アクションを作成する。
- `speed()` — 行動速度を返す。
- `makeSpeed()` — 行動速度を計算する。
- `currentAction()` — 現在のアクションを返す。
- `removeCurrentAction()` — 現在のアクションを削除する。
- `setLastTarget(target)` — 最後の対象を設定する。
- `forceAction(skillId, targetIndex)` — 強制アクションを設定する。
- `useItem(item)` — アイテム・スキルを使用する（コスト支払い・消費）。
- `consumeItem(item)` — アイテムを消費する（パーティの所持数を1減らす）。
- `gainHp(value)` — HPを増減する（正=回復、負=ダメージ）。
- `gainMp(value)` — MPを増減する。
- `gainTp(value)` — TPを増減する。
- `gainSilentTp(value)` — TPを増減する（ポップアップなし）。
- `initTp()` — TPをランダムに初期化する（0〜25）。
- `clearTp()` — TPを0にする。
- `chargeTpByDamage(damageRate)` — ダメージ割合に応じてTPをチャージする。
- `regenerateHp()` — HPの自動回復（スリップダメージ含む）を処理する。
- `maxSlipDamage()` — スリップダメージの最大値を返す。
- `regenerateMp()` — MPの自動回復を処理する。
- `regenerateTp()` — TPの自動回復を処理する。
- `regenerateAll()` — HP・MP・TPの全自動回復を処理する。
- `onBattleStart(advantageous)` — 戦闘開始時のコールバック（TP初期化等）。
- `onAllActionsEnd()` — 全アクション終了時のコールバック（ステート自動解除等）。
- `onTurnEnd()` — ターン終了時のコールバック（自動回復・ステート解除・バフ解除等）。
- `onBattleEnd()` — 戦闘終了時のコールバック（アクション・ステートクリア等）。
- `onDamage(value)` — ダメージを受けた時のコールバック（TPチャージ・ステート解除等）。
- `setActionState(actionState)` — 行動状態を設定する（undecided/inputting/waiting/acting）。
- `isUndecided()` — 行動未決定かを確認する。
- `isInputting()` — コマンド入力中かを確認する。
- `isWaiting()` — 待機中かを確認する。
- `isActing()` — 行動実行中かを確認する。
- `isChanting()` — 詠唱中（魔法キャスト中）かを確認する。
- `isGuardWaiting()` — 防御待機中かを確認する。
- `performActionStart(action)` — アクション開始時の演出を実行する。
- `performAction(/*action*/)` — アクション実行時の演出を実行する。
- `performActionEnd()` — アクション終了時の演出を実行する。
- `performDamage()` — ダメージ時の演出を実行する。
- `performMiss()` — ミス時の演出を実行する。
- `performRecovery()` — 回復時の演出を実行する。
- `performEvasion()` — 回避時の演出を実行する。
- `performMagicEvasion()` — 魔法回避時の演出を実行する。
- `performCounter()` — 反撃時の演出を実行する。
- `performReflection()` — 魔法反射時の演出を実行する。
- `performSubstitute(/*target*/)` — 身代わり時の演出を実行する。
- `performCollapse()` — 戦闘不能時の消滅演出を実行する。

### Game_Actor ⭐

アクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Actor**


#### プロパティ

- `level` — レベルを返す。

#### インスタンスメソッド

- `initialize(actorId)` — 初期化する。
- `initMembers()` — メンバー変数を初期化する。
- `setup(actorId)` — アクターIDでセットアップする。
- `actorId()` — アクターIDを返す。
- `actor()` — データベースのアクターオブジェクトを返す。
- `name()` — 名前を返す。
- `setName(name)` — 名前を設定する。
- `nickname()` — 二つ名を返す。
- `setNickname(nickname)` — 二つ名を設定する。
- `profile()` — プロフィールを返す。
- `setProfile(profile)` — プロフィールを設定する。
- `characterName()` — キャラクター画像のファイル名を返す。
- `characterIndex()` — キャラクター画像のインデックスを返す。
- `faceName()` — 顔画像のファイル名を返す。
- `faceIndex()` — 顔画像のインデックスを返す。
- `battlerName()` — 戦闘キャラ画像のファイル名を返す。
- `clearStates()` — 全ステートをクリアする。
- `eraseState(stateId)` — 指定ステートを解除する。
- `resetStateCounts(stateId)` — ステートの残りターン数をリセットする。
- `initImages()` — キャラクター・顔・戦闘画像を初期化する。
- `expForLevel(level)` — 指定レベルに必要な累計経験値を返す。
- `initExp()` — 経験値を初期化する。
- `currentExp()` — 現在の累計経験値を返す。
- `currentLevelExp()` — 現在レベルの必要経験値を返す。
- `nextLevelExp()` — 次のレベルの必要経験値を返す。
- `nextRequiredExp()` — 次のレベルまでの残り経験値を返す。
- `maxLevel()` — 最大レベルを返す。
- `isMaxLevel()` — 最大レベルかを確認する。
- `initSkills()` — 初期スキルを習得する。
- `initEquips(equips)` — 初期装備をセットする。
- `equipSlots()` — 装備スロットの配列を返す。
- `equips()` — 装備品の配列を返す。
- `weapons()` — 装備中の武器の配列を返す。
- `armors()` — 装備中の防具の配列を返す。
- `hasWeapon(weapon)` — 指定武器を装備しているかを確認する。
- `hasArmor(armor)` — 指定防具を装備しているかを確認する。
- `isEquipChangeOk(slotId)` — 指定スロットの装備変更が可能かを確認する。
- `changeEquip(slotId, item)` — 指定スロットの装備を変更する。
- `forceChangeEquip(slotId, item)` — 装備を強制変更する（パーティ所持数考慮なし）。
- `tradeItemWithParty(newItem, oldItem)` — パーティとアイテムを交換する（旧装備を返却、新装備を取得）。
- `changeEquipById(etypeId, itemId)` — 装備タイプとアイテムIDで装備を変更する。
- `isEquipped(item)` — 指定アイテムを装備中かを確認する。
- `discardEquip(item)` — 装備を破棄する（パーティに返却しない）。
- `releaseUnequippableItems(forcing)` — 装備不可になったアイテムを外す。
- `clearEquipments()` — 全装備を外す。
- `optimizeEquipments()` — 装備を最適化する（最強装備）。
- `bestEquipItem(slotId)` — 指定スロットの最適装備を返す。
- `calcEquipItemPerformance(item)` — 装備品の性能値を計算する。
- `isSkillWtypeOk(skill)` — スキルに必要な武器タイプを装備しているかを確認する。
- `isWtypeEquipped(wtypeId)` — 指定武器タイプを装備中かを確認する。
- `refresh()` — ステート・装備を再計算する。
- `hide()` — 非表示にする。
- `isActor()` — アクターかを確認する（常にtrue）。
- `friendsUnit()` — 味方ユニット（$gameParty）を返す。
- `opponentsUnit()` — 敵ユニット（$gameTroop）を返す。
- `index()` — パーティ内のインデックスを返す。
- `isBattleMember()` — 戦闘メンバーかを確認する。
- `isFormationChangeOk()` — 隊列変更可能かを確認する。
- `currentClass()` — 現在の職業データを返す。
- `isClass(gameClass)` — 指定職業かを確認する。
- `skillTypes()` — 使用可能なスキルタイプID配列を返す。
- `skills()` — 習得済みスキルの配列を返す。
- `usableSkills()` — 現在使用可能なスキルの配列を返す。
- `traitObjects()` — 特徴を持つオブジェクト（アクター・職業・装備・ステート）の配列を返す。
- `attackElements()` — 通常攻撃の属性ID配列を返す。
- `hasNoWeapons()` — 武器を装備していないかを確認する。
- `bareHandsElementId()` — 素手攻撃の属性IDを返す。
- `paramBase(paramId)` — レベルに応じたパラメータ基本値を返す。
- `paramPlus(paramId)` — パラメータ加算値（装備含む）を返す。
- `attackAnimationId1()` — 通常攻撃アニメーションID（武器1）を返す。
- `attackAnimationId2()` — 通常攻撃アニメーションID（武器2/二刀流）を返す。
- `bareHandsAnimationId()` — 素手攻撃のアニメーションIDを返す。
- `changeExp(exp, show)` — 経験値を変更する（レベルアップ表示制御付き）。
- `levelUp()` — レベルアップ処理を行う。
- `levelDown()` — レベルダウン処理を行う。
- `findNewSkills(lastSkills)` — レベルアップで新たに習得したスキルを検索する。
- `displayLevelUp(newSkills)` — レベルアップメッセージを表示する。
- `gainExp(exp)` — 経験値を獲得する。
- `finalExpRate()` — 最終的な経験値倍率を返す。
- `benchMembersExpRate()` — 控えメンバーの経験値倍率を返す。
- `shouldDisplayLevelUp()` — レベルアップ表示をすべきかを確認する。
- `changeLevel(level, show)` — レベルを変更する。
- `learnSkill(skillId)` — スキルを習得する。
- `forgetSkill(skillId)` — スキルを忘れる。
- `isLearnedSkill(skillId)` — スキルを習得済みかを確認する。
- `hasSkill(skillId)` — スキルを所持しているか（習得+特徴追加）を確認する。
- `changeClass(classId, keepExp)` — 職業を変更する。
- `setFaceImage(faceName, faceIndex)` — 顔画像を設定する。
- `setBattlerImage(battlerName)` — 戦闘キャラ画像を設定する。
- `isSpriteVisible()` — SV戦闘でスプライトが表示されるかを確認する。
- `performActionStart(action)` — アクション開始演出を実行する。
- `performAction(action)` — アクション演出を実行する。
- `performActionEnd()` — アクション終了演出を実行する。
- `performAttack()` — 通常攻撃演出を実行する。
- `performDamage()` — ダメージ演出を実行する。
- `performEvasion()` — 回避演出を実行する。
- `performMagicEvasion()` — 魔法回避演出を実行する。
- `performCounter()` — 反撃演出を実行する。
- `performCollapse()` — 戦闘不能演出を実行する。
- `performVictory()` — 勝利演出を実行する。
- `performEscape()` — 逃走演出を実行する。
- `makeActionList()` — 自動戦闘用アクション候補リストを作成する。
- `makeAutoBattleActions()` — 自動戦闘用アクションを作成する。
- `makeConfusionActions()` — 混乱時のアクションを作成する。
- `makeActions()` — アクションを作成する。
- `onPlayerWalk()` — プレイヤー移動時のコールバック（歩数経過ステート等）。
- `updateStateSteps(state)` — 歩数経過ステートの歩数を更新する。
- `showAddedStates()` — 付与されたステートのメッセージを表示する。
- `showRemovedStates()` — 解除されたステートのメッセージを表示する。
- `stepsForTurn()` — 1ターンあたりの歩数を返す。
- `turnEndOnMap()` — マップ上でのターン終了処理を行う。
- `checkFloorEffect()` — 床ダメージのチェックを行う。
- `executeFloorDamage()` — 床ダメージを実行する。
- `basicFloorDamage()` — 床ダメージの基本値を返す。
- `maxFloorDamage()` — 床ダメージの最大値を返す。
- `performMapDamage()` — マップ上ダメージの演出を実行する。
- `clearActions()` — 全アクションをクリアする。
- `inputtingAction()` — 現在入力中のアクションを返す。
- `selectNextCommand()` — 次のコマンド入力へ進む。
- `selectPreviousCommand()` — 前のコマンド入力に戻る。
- `lastSkill()` — 最後に使用したスキルを返す。
- `lastMenuSkill()` — メニューで最後に使用したスキルを返す。
- `setLastMenuSkill(skill)` — メニューで最後に使用したスキルを設定する。
- `lastBattleSkill()` — 戦闘で最後に使用したスキルを返す。
- `setLastBattleSkill(skill)` — 戦闘で最後に使用したスキルを設定する。
- `lastCommandSymbol()` — 最後のコマンドシンボルを返す。
- `setLastCommandSymbol(symbol)` — 最後のコマンドシンボルを設定する。
- `testEscape(item)` — アイテムが逃走効果を持つかをテストする。
- `meetsUsableItemConditions(item)` — アイテム使用条件を満たすかを確認する。
- `onEscapeFailure()` — 逃走失敗時のコールバック（TPBペナルティ適用）。

### Game_Enemy ⭐

敵キャラクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Enemy**


#### インスタンスメソッド

- `initialize(enemyId, x, y)` — 初期化する。
- `initMembers()` — メンバー変数を初期化する。
- `setup(enemyId, x, y)` — 敵IDと座標でセットアップする。
- `isEnemy()` — 敵かを確認する（常にtrue）。
- `friendsUnit()` — 味方ユニット（$gameTroop）を返す。
- `opponentsUnit()` — 敵ユニット（$gameParty）を返す。
- `index()` — 敵グループ内のインデックスを返す。
- `isBattleMember()` — 戦闘メンバーかを確認する（常にtrue）。
- `enemyId()` — 敵キャラクIDを返す。
- `enemy()` — データベースの敵オブジェクトを返す。
- `traitObjects()` — 特徴を持つオブジェクト（敵・ステート）の配列を返す。
- `paramBase(paramId)` — パラメータ基本値を返す。
- `exp()` — 獲得経験値を返す。
- `gold()` — 獲得ゴールドを返す。
- `makeDropItems()` — ドロップアイテムの配列を作成する。
- `dropItemRate()` — ドロップアイテム倍率を返す。
- `itemObject(kind, dataId)` — 種類とIDからデータベースオブジェクトを返す。
- `isSpriteVisible()` — スプライトが表示されるかを確認する（常にtrue）。
- `screenX()` — 画面上のX座標を返す。
- `screenY()` — 画面上のY座標を返す。
- `battlerName()` — バトラー画像のファイル名を返す。
- `battlerHue()` — バトラー画像の色相を返す。
- `originalName()` — 元の名前（変身前）を返す。
- `name()` — 名前（複数がいる場合は英字付き）を返す。
- `isLetterEmpty()` — 識別英字が未設定かを確認する。
- `setLetter(letter)` — 識別英字を設定する（A, B等）。
- `setPlural(plural)` — 同名の敵が複数いるかを設定する。
- `performActionStart(action)` — アクション開始演出を実行する。
- `performAction(action)` — アクション演出を実行する。
- `performActionEnd()` — アクション終了演出を実行する。
- `performDamage()` — ダメージ演出を実行する。
- `performCollapse()` — 戦闘不能演出を実行する。
- `transform(enemyId)` — 別の敵に変身する。
- `meetsCondition(action)` — 行動パターンの条件を満たすかを確認する。
- `meetsTurnCondition(param1, param2)` — ターン条件を満たすかを確認する。
- `meetsHpCondition(param1, param2)` — HP条件を満たすかを確認する。
- `meetsMpCondition(param1, param2)` — MP条件を満たすかを確認する。
- `meetsStateCondition(param)` — ステート条件を満たすかを確認する。
- `meetsPartyLevelCondition(param)` — パーティレベル条件を満たすかを確認する。
- `meetsSwitchCondition(param)` — スイッチ条件を満たすかを確認する。
- `isActionValid(action)` — 行動パターンが有効かを確認する。
- `selectAction(actionList, ratingZero)` — レーティングに基づいて行動を選択する。
- `selectAllActions(actionList)` — 全アクションスロットの行動を選択する。
- `makeActions()` — アクションを作成する。

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
- `inBattle()` — 戦闘中かを確認する。
- `members()` — メンバーの配列を返す。
- `aliveMembers()` — 生存メンバーの配列を返す。
- `deadMembers()` — 戦闘不能メンバーの配列を返す。
- `movableMembers()` — 行動可能なメンバーの配列を返す。
- `clearActions()` — 全メンバーのアクションをクリアする。
- `agility()` — ユニットの平均敏捷性を返す。
- `tgrSum()` — ユニットの狙われ率合計を返す。
- `randomTarget()` — 狙われ率に基づいてランダムに対象を選ぶ。
- `randomDeadTarget()` — 戦闘不能メンバーからランダムに対象を選ぶ。
- `smoothTarget(index)` — 指定インデックスの生存メンバーを返す（戦闘不能なら別の生存者）。
- `smoothDeadTarget(index)` — 指定インデックスの戦闘不能メンバーを返す。
- `clearResults()` — 全メンバーのアクション結果をクリアする。
- `onBattleStart(advantageous)` — 戦闘開始時のコールバック。
- `onBattleEnd()` — 戦闘終了時のコールバック。
- `makeActions()` — 全メンバーのアクションを作成する。
- `select(activeMember)` — 指定メンバーを選択状態にする。
- `isAllDead()` — 全メンバーが戦闘不能かを確認する。
- `substituteBattler(target)` — 身代わり可能なバトラーを返す。
- `tpbBaseSpeed()` — TPBの基本速度を返す。
- `tpbReferenceTime()` — TPBの参照時間を返す。
- `updateTpb()` — 全メンバーのTPBを更新する。

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
- `initAllItems()` — 全アイテム・武器・防具の所持数を初期化する。
- `exists()` — パーティが存在する（メンバーがいる）かを確認する。
- `size()` — パーティの人数を返す。
- `isEmpty()` — パーティが空かを確認する。
- `members()` — 全メンバーの配列を返す。
- `allMembers()` — 控え含む全メンバーの配列を返す。
- `battleMembers()` — 戦闘メンバーの配列を返す。
- `hiddenBattleMembers()` — 非表示の戦闘メンバーの配列を返す。
- `allBattleMembers()` — 非表示含む全戦闘メンバーの配列を返す。
- `maxBattleMembers()` — 戦闘メンバーの最大数を返す（デフォルト: 4）。
- `leader()` — リーダー（先頭メンバー）を返す。
- `removeInvalidMembers()` — 無効なメンバーを削除する。
- `reviveBattleMembers()` — 戦闘不能の戦闘メンバーをHP1で復活させる。
- `items()` — 所持アイテムの配列を返す。
- `weapons()` — 所持武器の配列を返す。
- `armors()` — 所持防具の配列を返す。
- `equipItems()` — 所持装備品（武器+防具）の配列を返す。
- `allItems()` — 全所持品（アイテム+装備品）の配列を返す。
- `itemContainer(item)` — アイテムの種類に応じた所持コンテナを返す。
- `setupStartingMembers()` — 初期メンバーをセットアップする。
- `name()` — パーティ名（リーダー名）を返す。
- `setupBattleTest()` — 戦闘テスト用のセットアップを行う。
- `setupBattleTestMembers()` — 戦闘テスト用メンバーをセットアップする。
- `setupBattleTestItems()` — 戦闘テスト用アイテムをセットアップする。
- `highestLevel()` — パーティ内の最高レベルを返す。
- `addActor(actorId)` — アクターをパーティに追加する。
- `removeActor(actorId)` — アクターをパーティから削除する。
- `gold()` — 所持金を返す。
- `gainGold(amount)` — ゴールドを獲得する。
- `loseGold(amount)` — ゴールドを失う。
- `maxGold()` — 所持金の最大値を返す。
- `steps()` — 累計歩数を返す。
- `increaseSteps()` — 歩数を1増やす。
- `numItems(item)` — 指定アイテムの所持数を返す。
- `maxItems(/*item*/)` — アイテムの最大所持数を返す（デフォルト: 99）。
- `hasMaxItems(item)` — アイテムが最大所持数かを確認する。
- `hasItem(item, includeEquip)` — アイテムを所持しているかを確認する（装備含むオプション）。
- `isAnyMemberEquipped(item)` — いずれかのメンバーが装備中かを確認する。
- `gainItem(item, amount, includeEquip)` — アイテムを獲得する。
- `discardMembersEquip(item, amount)` — メンバーの装備からアイテムを破棄する。
- `loseItem(item, amount, includeEquip)` — アイテムを失う。
- `consumeItem(item)` — 消耗アイテムを1つ消費する。
- `canUse(item)` — アイテムを使用可能かを確認する。
- `canInput()` — コマンド入力可能かを確認する。
- `isAllDead()` — 全メンバーが戦闘不能かを確認する。
- `isEscaped()` — 逃走済みかを確認する。
- `onPlayerWalk()` — プレイヤー移動時のコールバック。
- `menuActor()` — メニューで選択中のアクターを返す。
- `setMenuActor(actor)` — メニューで選択中のアクターを設定する。
- `makeMenuActorNext()` — メニューの次のアクターに切り替える。
- `makeMenuActorPrevious()` — メニューの前のアクターに切り替える。
- `targetActor()` — 対象アクターを返す。
- `setTargetActor(actor)` — 対象アクターを設定する。
- `lastItem()` — 最後に使用したアイテムを返す。
- `setLastItem(item)` — 最後に使用したアイテムを設定する。
- `swapOrder(index1, index2)` — 2人のメンバーの順序を入れ替える。
- `charactersForSavefile()` — セーブファイル用のキャラクター情報を返す。
- `facesForSavefile()` — セーブファイル用の顔画像情報を返す。
- `partyAbility(abilityId)` — パーティアビリティが有効かを確認する。
- `hasEncounterHalf()` — エンカウント半減アビリティを持つかを確認する。
- `hasEncounterNone()` — エンカウント無効アビリティを持つかを確認する。
- `hasCancelSurprise()` — 不意打ち無効アビリティを持つかを確認する。
- `hasRaisePreemptive()` — 先制攻撃率アップアビリティを持つかを確認する。
- `hasGoldDouble()` — 獲得ゴールド2倍アビリティを持つかを確認する。
- `hasDropItemDouble()` — ドロップアイテム2倍アビリティを持つかを確認する。
- `ratePreemptive(troopAgi)` — 先制攻撃率を計算する。
- `rateSurprise(troopAgi)` — 不意打ち率を計算する。
- `performVictory()` — 勝利演出を実行する。
- `performEscape()` — 逃走演出を実行する。
- `removeBattleStates()` — 戦闘終了時に解除されるステートを削除する。
- `requestMotionRefresh()` — 全メンバーのモーションリフレッシュを要求する。
- `onEscapeFailure()` — 逃走失敗時のコールバック。

### Game_Troop ⭐

敵グループおよび戦闘関連データ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_Unit` → **Game_Troop**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `isEventRunning()` — 戦闘イベントが実行中かを確認する。
- `updateInterpreter()` — 戦闘イベントのインタプリタを更新する。
- `turnCount()` — ターン数を返す。
- `members()` — 敵メンバーの配列を返す。
- `clear()` — 敵グループをクリアする。
- `troop()` — データベースの敵グループオブジェクトを返す。
- `setup(troopId)` — 敵グループIDでセットアップする。
- `makeUniqueNames()` — 同名の敵に識別英字（A, B等）を付ける。
- `updatePluralFlags()` — 同名敵複数フラグを更新する。
- `letterTable()` — 識別用英字テーブルを返す。
- `enemyNames()` — 敵の名前配列を返す（重複なし）。
- `meetsConditions(page)` — バトルイベントページの条件を満たすかを確認する。
- `setupBattleEvent()` — バトルイベントをセットアップする。
- `increaseTurn()` — ターン数を1増加させる。
- `expTotal()` — 敵グループの総経験値を返す。
- `goldTotal()` — 敵グループの総ゴールドを返す。
- `goldRate()` — ゴールド倍率を返す。
- `makeDropItems()` — 全敵のドロップアイテムをまとめて返す。
- `isTpbTurnEnd()` — TPBターンが終了したかを確認する。

### Game_Map ⭐

マップ用のゲームオブジェクトクラス。スクロールや通行判定の機能を含む。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setup(mapId)` — マップIDでセットアップする。
- `isEventRunning()` — イベントが実行中かを確認する。
- `tileWidth()` — タイルの幅（ピクセル）を返す。
- `tileHeight()` — タイルの高さ（ピクセル）を返す。
- `bushDepth()` — 茂みの深さ（ピクセル）を返す。
- `mapId()` — マップIDを返す。
- `tilesetId()` — タイルセットIDを返す。
- `displayX()` — 画面表示のX座標（タイル単位）を返す。
- `displayY()` — 画面表示のY座標（タイル単位）を返す。
- `parallaxName()` — 遠景画像のファイル名を返す。
- `battleback1Name()` — 戦闘背景1のファイル名を返す。
- `battleback2Name()` — 戦闘背景2のファイル名を返す。
- `requestRefresh()` — マップのリフレッシュを要求する。
- `isNameDisplayEnabled()` — マップ名表示が有効かを確認する。
- `disableNameDisplay()` — マップ名表示を無効にする。
- `enableNameDisplay()` — マップ名表示を有効にする。
- `createVehicles()` — 乗り物オブジェクトを作成する。
- `refereshVehicles()` — 乗り物をリフレッシュする。
- `vehicles()` — 乗り物の配列を返す。
- `vehicle(type)` — 指定タイプの乗り物を返す。
- `boat()` — 小型船を返す。
- `ship()` — 大型船を返す。
- `airship()` — 飛行船を返す。
- `setupEvents()` — マップイベントをセットアップする。
- `events()` — 全イベントの配列を返す。
- `event(eventId)` — 指定IDのイベントを返す。
- `eraseEvent(eventId)` — 指定IDのイベントを一時消去する。
- `autorunCommonEvents()` — 自動実行コモンイベントの配列を返す。
- `parallelCommonEvents()` — 並列処理コモンイベントの配列を返す。
- `setupScroll()` — スクロール状態を初期化する。
- `setupParallax()` — 遠景をセットアップする。
- `setupBattleback()` — 戦闘背景をセットアップする。
- `setDisplayPos(x, y)` — 画面表示位置を設定する。
- `parallaxOx()` — 遠景のX方向オフセットを返す。
- `parallaxOy()` — 遠景のY方向オフセットを返す。
- `tileset()` — タイルセットデータを返す。
- `tilesetFlags()` — タイルセットのフラグ配列を返す。
- `displayName()` — マップの表示名を返す。
- `width()` — マップの幅（タイル数）を返す。
- `height()` — マップの高さ（タイル数）を返す。
- `data()` — マップのタイルデータ配列を返す。
- `isLoopHorizontal()` — 横方向ループマップかを確認する。
- `isLoopVertical()` — 縦方向ループマップかを確認する。
- `isDashDisabled()` — ダッシュが無効かを確認する。
- `encounterList()` — エンカウントリストを返す。
- `encounterStep()` — エンカウント歩数を返す。
- `isOverworld()` — フィールドマップかを確認する。
- `screenTileX()` — 画面に表示されるタイル数（横）を返す。
- `screenTileY()` — 画面に表示されるタイル数（縦）を返す。
- `adjustX(x)` — ループ考慮でX座標を調整する。
- `adjustY(y)` — ループ考慮でY座標を調整する。
- `roundX(x)` — ループ考慮でX座標を丸める。
- `roundY(y)` — ループ考慮でY座標を丸める。
- `xWithDirection(x, d)` — 指定方向に1タイル移動したX座標を返す。
- `yWithDirection(y, d)` — 指定方向に1タイル移動したY座標を返す。
- `roundXWithDirection(x, d)` — ループ考慮で方向移動後のX座標を返す。
- `roundYWithDirection(y, d)` — ループ考慮で方向移動後のY座標を返す。
- `deltaX(x1, x2)` — ループ考慮で2地点間のX差分を返す。
- `deltaY(y1, y2)` — ループ考慮で2地点間のY差分を返す。
- `distance(x1, y1, x2, y2)` — 2地点間の距離を返す。
- `canvasToMapX(x)` — 画面座標をマップX座標に変換する。
- `canvasToMapY(y)` — 画面座標をマップY座標に変換する。
- `autoplay()` — マップのBGM・BGSを自動再生する。
- `refreshIfNeeded()` — リフレッシュが必要なら実行する。
- `refresh()` — マップの全イベント・乗り物をリフレッシュする。
- `refreshTileEvents()` — タイルイベントをリフレッシュする。
- `eventsXy(x, y)` — 指定座標のイベント配列を返す。
- `eventsXyNt(x, y)` — 指定座標のすり抜けでないイベント配列を返す。
- `tileEventsXy(x, y)` — 指定座標のタイルイベント配列を返す。
- `eventIdXy(x, y)` — 指定座標のイベントIDを返す。
- `scrollDown(distance)` — 下にスクロールする。
- `scrollLeft(distance)` — 左にスクロールする。
- `scrollRight(distance)` — 右にスクロールする。
- `scrollUp(distance)` — 上にスクロールする。
- `isValid(x, y)` — 座標がマップ範囲内かを確認する。
- `checkPassage(x, y, bit)` — タイルの通行フラグをチェックする。
- `tileId(x, y, z)` — 指定座標・レイヤーのタイルIDを返す。
- `layeredTiles(x, y)` — 指定座標の全レイヤータイルID配列を返す。
- `allTiles(x, y)` — 指定座標の全タイルID（オートタイル含む）配列を返す。
- `autotileType(x, y, z)` — オートタイルのタイプを返す。
- `isPassable(x, y, d)` — 指定座標・方向が通行可能かを確認する。
- `isBoatPassable(x, y)` — 小型船が通行可能かを確認する。
- `isShipPassable(x, y)` — 大型船が通行可能かを確認する。
- `isAirshipLandOk(x, y)` — 飛行船が着陸可能かを確認する。
- `checkLayeredTilesFlags(x, y, bit)` — 全レイヤータイルのフラグをチェックする。
- `isLadder(x, y)` — はしごタイルかを確認する。
- `isBush(x, y)` — 茂みタイルかを確認する。
- `isCounter(x, y)` — カウンタータイルかを確認する。
- `isDamageFloor(x, y)` — ダメージ床かを確認する。
- `terrainTag(x, y)` — 地形タグを返す。
- `regionId(x, y)` — リージョンIDを返す。
- `startScroll(direction, distance, speed)` — スクロールを開始する。
- `isScrolling()` — スクロール中かを確認する。
- `update(sceneActive)` — 毎フレーム更新する。
- `updateScroll()` — スクロールの進行を更新する。
- `scrollDistance()` — スクロール距離を返す。
- `doScroll(direction, distance)` — 指定方向にスクロールを実行する。
- `updateEvents()` — 全イベントを更新する。
- `updateVehicles()` — 全乗り物を更新する。
- `updateParallax()` — 遠景を更新する。
- `changeTileset(tilesetId)` — タイルセットを変更する。
- `changeParallax(name, loopX, loopY, sx, sy)` — 遠景を変更する。
- `updateInterpreter()` — マップイベントのインタプリタを更新する。
- `unlockEvent(eventId)` — 指定イベントのロックを解除する。
- `setupStartingEvent()` — 開始イベントをセットアップする。
- `setupTestEvent()` — テストイベントをセットアップする。
- `setupStartingMapEvent()` — 開始マップイベントをセットアップする。
- `setupAutorunCommonEvent()` — 自動実行コモンイベントをセットアップする。
- `isAnyEventStarting()` — いずれかのイベントが開始中かを確認する。

### Game_CommonEvent

コモンイベント用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(commonEventId)` — 初期化する。
- `event()` — データベースのコモンイベントデータを返す。
- `list()` — イベントコマンドリストを返す。
- `refresh()` — インタプリタをリフレッシュする。
- `isActive()` — アクティブ（実行条件を満たす）かを確認する。
- `update()` — 毎フレーム更新する。

### Game_CharacterBase ⭐

Game_Characterのスーパークラス。座標や画像などの基本情報を扱う。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバー変数を初期化する。
- `pos(x, y)` — 指定座標にいるかを確認する。
- `posNt(x, y)` — 指定座標にいるかを確認する（すり抜けでない場合）。
- `moveSpeed()` — 移動速度を返す。
- `setMoveSpeed(moveSpeed)` — 移動速度を設定する。
- `moveFrequency()` — 移動頻度を返す。
- `setMoveFrequency(moveFrequency)` — 移動頻度を設定する。
- `opacity()` — 不透明度を返す。
- `setOpacity(opacity)` — 不透明度を設定する。
- `blendMode()` — ブレンドモードを返す。
- `setBlendMode(blendMode)` — ブレンドモードを設定する。
- `isNormalPriority()` — 通常プライオリティ（キャラと同じ）かを確認する。
- `setPriorityType(priorityType)` — プライオリティタイプを設定する。
- `isMoving()` — 移動中かを確認する。
- `isJumping()` — ジャンプ中かを確認する。
- `jumpHeight()` — ジャンプの高さ（ピクセル）を返す。
- `isStopping()` — 停止中かを確認する。
- `checkStop(threshold)` — 停止カウントが閾値以上かを確認する。
- `resetStopCount()` — 停止カウントをリセットする。
- `realMoveSpeed()` — 実際の移動速度（ダッシュ補正含む）を返す。
- `distancePerFrame()` — 1フレームあたりの移動距離を返す。
- `isDashing()` — ダッシュ中かを確認する。
- `isDebugThrough()` — デバッグすり抜けが有効かを確認する。
- `straighten()` — キャラクターのパターンを正面に戻す。
- `reverseDir(d)` — 指定方向の逆方向を返す。
- `canPass(x, y, d)` — 指定座標・方向に通行可能かを確認する。
- `canPassDiagonally(x, y, horz, vert)` — 斜め方向に通行可能かを確認する。
- `isMapPassable(x, y, d)` — マップの通行判定（イベントを除く）を確認する。
- `isCollidedWithCharacters(x, y)` — 他キャラクターとの衍突を確認する。
- `isCollidedWithEvents(x, y)` — イベントとの衍突を確認する。
- `isCollidedWithVehicles(x, y)` — 乗り物との衍突を確認する。
- `setPosition(x, y)` — 座標を設定する。
- `copyPosition(character)` — 他キャラクターの座標をコピーする。
- `locate(x, y)` — 指定座標に配置する（移動カウントリセット）。
- `direction()` — 向き（2/4/6/8）を返す。
- `setDirection(d)` — 向きを設定する。
- `isTile()` — タイルキャラクターかを確認する。
- `isObjectCharacter()` — オブジェクトキャラ（!付き）かを確認する。
- `shiftY()` — Y方向の表示オフセットを返す。
- `scrolledX()` — スクロール調整後のX座標を返す。
- `scrolledY()` — スクロール調整後のY座標を返す。
- `screenX()` — 画面上のX座標（ピクセル）を返す。
- `screenY()` — 画面上のY座標（ピクセル）を返す。
- `screenZ()` — 画面上のZソート順を返す。
- `isNearTheScreen()` — 画面近くにいるかを確認する。
- `update()` — 毎フレーム更新する。
- `updateStop()` — 停止中の更新を行う。
- `updateJump()` — ジャンプの進行を更新する。
- `updateMove()` — 移動の進行を更新する。
- `updateAnimation()` — 歩行アニメーションを更新する。
- `animationWait()` — アニメーションの待ちフレーム数を返す。
- `updateAnimationCount()` — アニメーションカウントを更新する。
- `updatePattern()` — アニメーションパターンを更新する。
- `maxPattern()` — 最大パターン数を返す。
- `pattern()` — 現在のパターン番号を返す。
- `setPattern(pattern)` — パターンを設定する。
- `isOriginalPattern()` — 初期パターンかを確認する。
- `resetPattern()` — パターンを初期値にリセットする。
- `refreshBushDepth()` — 茂みの深さを再計算する。
- `isOnLadder()` — はしご上にいるかを確認する。
- `isOnBush()` — 茂みの上にいるかを確認する。
- `terrainTag()` — 現在位置の地形タグを返す。
- `regionId()` — 現在位置のリージョンIDを返す。
- `increaseSteps()` — 歩数を1増やす。
- `tileId()` — タイルキャラのタイルIDを返す。
- `characterName()` — キャラクター画像のファイル名を返す。
- `characterIndex()` — キャラクター画像のインデックスを返す。
- `setTileImage(tileId)` — タイル画像を設定する。
- `checkEventTriggerTouchFront(d)` — 前方の接触イベントトリガーをチェックする。
- `checkEventTriggerTouch(/*x, y*/)` — 接触イベントトリガーをチェックする。
- `isMovementSucceeded(/*x, y*/)` — 移動が成功したかを確認する。
- `setMovementSuccess(success)` — 移動成功フラグを設定する。
- `moveStraight(d)` — 指定方向に直線移動する。
- `moveDiagonally(horz, vert)` — 斜め方向に移動する。
- `jump(xPlus, yPlus)` — 指定オフセットにジャンプする。
- `hasWalkAnime()` — 歩行アニメが有効かを確認する。
- `setWalkAnime(walkAnime)` — 歩行アニメの有効/無効を設定する。
- `hasStepAnime()` — 足踏みアニメが有効かを確認する。
- `setStepAnime(stepAnime)` — 足踏みアニメの有効/無効を設定する。
- `isDirectionFixed()` — 向き固定かを確認する。
- `setDirectionFix(directionFix)` — 向き固定の有効/無効を設定する。
- `isThrough()` — すり抜けが有効かを確認する。
- `setThrough(through)` — すり抜けの有効/無効を設定する。
- `isTransparent()` — 透明かを確認する。
- `bushDepth()` — 茂みの深さを返す。
- `setTransparent(transparent)` — 透明の有効/無効を設定する。
- `startAnimation()` — アニメーションを開始する。
- `startBalloon()` — フキダシアイコンを開始する。
- `isAnimationPlaying()` — アニメーション再生中かを確認する。
- `isBalloonPlaying()` — フキダシアイコン再生中かを確認する。
- `endAnimation()` — アニメーションを終了する。
- `endBalloon()` — フキダシアイコンを終了する。

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
- `initMembers()` — メンバー変数を初期化する。
- `memorizeMoveRoute()` — 現在の移動ルートを記憶する。
- `restoreMoveRoute()` — 記憶した移動ルートを復元する。
- `isMoveRouteForcing()` — 移動ルート強制中かを確認する。
- `setMoveRoute(moveRoute)` — 移動ルートを設定する。
- `forceMoveRoute(moveRoute)` — 移動ルートを強制実行する。
- `updateStop()` — 停止中の更新を行う。
- `updateRoutineMove()` — 自律移動を更新する。
- `processMoveCommand(command)` — 移動コマンドを処理する。
- `deltaXFrom(x)` — 指定X座標との差分を返す。
- `deltaYFrom(y)` — 指定Y座標との差分を返す。
- `moveRandom()` — ランダムに移動する。
- `moveTowardCharacter(character)` — 指定キャラに近づく。
- `moveAwayFromCharacter(character)` — 指定キャラから遠ざかる。
- `turnTowardCharacter(character)` — 指定キャラの方を向く。
- `turnAwayFromCharacter(character)` — 指定キャラの反対を向く。
- `turnTowardPlayer()` — プレイヤーの方を向く。
- `turnAwayFromPlayer()` — プレイヤーの反対を向く。
- `moveTowardPlayer()` — プレイヤーに近づく。
- `moveAwayFromPlayer()` — プレイヤーから遠ざかる。
- `moveForward()` — 前方に移動する。
- `moveBackward()` — 後方に移動する（向きは変えず）。
- `processRouteEnd()` — 移動ルート終了を処理する。
- `advanceMoveRouteIndex()` — 移動ルートのインデックスを進める。
- `turnRight90()` — 右に90度回転する。
- `turnLeft90()` — 左に90度回転する。
- `turn180()` — 180度回転する。
- `turnRightOrLeft90()` — ランダムに左右どちらかに90度回転する。
- `turnRandom()` — ランダムな方向を向く。
- `swap(character)` — 指定キャラと位置を入れ替える。
- `findDirectionTo(goalX, goalY)` — 目標座標への最短経路の方向を探索する。
- `searchLimit()` — 経路探索の最大距離を返す。

### Game_Player ⭐

プレイヤーキャラクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Player**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバー変数を初期化する。
- `clearTransferInfo()` — 場所移動情報をクリアする。
- `followers()` — フォロワー（Game_Followers）を返す。
- `refresh()` — キャラクター画像をリフレッシュする。
- `isStopping()` — 停止中かを確認する。
- `reserveTransfer(mapId, x, y, d, fadeType)` — 場所移動を予約する。
- `setupForNewGame()` — ニューゲーム用の初期設定を行う。
- `requestMapReload()` — マップの再読み込みを要求する。
- `isTransferring()` — 場所移動中かを確認する。
- `newMapId()` — 移動先のマップIDを返す。
- `fadeType()` — フェードタイプを返す。
- `performTransfer()` — 場所移動を実行する。
- `isMapPassable(x, y, d)` — マップが通行可能かを確認する（乗り物考慮）。
- `vehicle()` — 現在乗っている乗り物を返す。
- `isInBoat()` — 小型船に乗っているかを確認する。
- `isInShip()` — 大型船に乗っているかを確認する。
- `isInAirship()` — 飛行船に乗っているかを確認する。
- `isInVehicle()` — 乗り物に乗っているかを確認する。
- `isNormal()` — 通常状態（乗り物に乗っていない）かを確認する。
- `isDashing()` — ダッシュ中かを確認する。
- `isDebugThrough()` — デバッグすり抜けが有効かを確認する。
- `isCollided(x, y)` — 指定座標で衍突するかを確認する。
- `centerX()` — 画面中央のX座標（タイル単位）を返す。
- `centerY()` — 画面中央のY座標（タイル単位）を返す。
- `center(x, y)` — 指定座標を画面中央に表示する。
- `locate(x, y)` — 指定座標に配置し、画面を中央に合わせる。
- `increaseSteps()` — 歩数を増やす（エンカウント・ステート更新含む）。
- `makeEncounterCount()` — 次のエンカウントまでの歩数を計算する。
- `makeEncounterTroopId()` — エンカウントする敵グループIDを決定する。
- `meetsEncounterConditions(encounter)` — エンカウント条件を満たすかを確認する。
- `executeEncounter()` — エンカウントを実行する。
- `startMapEvent(x, y, triggers, normal)` — 指定座標のマップイベントを開始する。
- `moveByInput()` — 入力に応じて移動する。
- `canMove()` — 移動可能かを確認する。
- `getInputDirection()` — 入力方向を取得する。
- `executeMove(direction)` — 指定方向への移動を実行する。
- `update(sceneActive)` — 毎フレーム更新する。
- `updateDashing()` — ダッシュ状態を更新する。
- `isDashButtonPressed()` — ダッシュボタンが押されているかを確認する。
- `updateScroll(lastScrolledX, lastScrolledY)` — スクロールを更新する。
- `updateVehicle()` — 乗り物の状態を更新する。
- `updateVehicleGetOn()` — 乗り物への乗車処理を更新する。
- `updateVehicleGetOff()` — 乗り物からの降車処理を更新する。
- `updateNonmoving(wasMoving, sceneActive)` — 非移動時の更新を行う。
- `triggerAction()` — 決定ボタン・タッチによるアクションをトリガーする。
- `triggerButtonAction()` — ボタンによるアクションをトリガーする。
- `triggerTouchAction()` — タッチによるアクションをトリガーする。
- `triggerTouchActionD1(x1, y1)` — 同位置のタッチアクションを処理する。
- `triggerTouchActionD2(x2, y2)` — 1タイル先のタッチアクションを処理する。
- `triggerTouchActionD3(x2, y2)` — カウンター越しのタッチアクションを処理する。
- `updateEncounterCount()` — エンカウントカウントを更新する。
- `canEncounter()` — エンカウント可能かを確認する。
- `encounterProgressValue()` — エンカウント進行値を返す。
- `checkEventTriggerHere(triggers)` — 現在地点のイベントトリガーをチェックする。
- `checkEventTriggerThere(triggers)` — 前方のイベントトリガーをチェックする。
- `checkEventTriggerTouch(x, y)` — 接触イベントトリガーをチェックする。
- `canStartLocalEvents()` — ローカルイベントを開始できるかを確認する。
- `getOnOffVehicle()` — 乗り物の乗降を切り替える。
- `getOnVehicle()` — 乗り物に乗る。
- `getOffVehicle()` — 乗り物から降りる。
- `forceMoveForward()` — 前方に強制移動する。
- `isOnDamageFloor()` — ダメージ床の上にいるかを確認する。
- `moveStraight(d)` — 直線移動する（イベントトリガーチェック付き）。
- `moveDiagonally(horz, vert)` — 斜め移動する（イベントトリガーチェック付き）。
- `jump(xPlus, yPlus)` — ジャンプする（フォロワーも同期）。
- `showFollowers()` — フォロワーを表示する。
- `hideFollowers()` — フォロワーを非表示にする。
- `gatherFollowers()` — フォロワーを集合させる。
- `areFollowersGathering()` — フォロワーが集合中かを確認する。
- `areFollowersGathered()` — フォロワーが集合完了かを確認する。`

### Game_Follower

隊列歩行のフォロワー用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Follower**


#### インスタンスメソッド

- `initialize(memberIndex)` — 初期化する。
- `refresh()` — キャラクター画像をリフレッシュする。
- `actor()` — 対応するアクターを返す。
- `isVisible()` — 表示状態かを確認する。
- `isGathered()` — 集合完了かを確認する。
- `update()` — 毎フレーム更新する。
- `chaseCharacter(character)` — 指定キャラを追尾する。

### Game_Followers

フォロワー配列のラッパークラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setup()` — フォロワーをセットアップする。
- `isVisible()` — フォロワーが表示状態かを確認する。
- `show()` — フォロワーを表示する。
- `hide()` — フォロワーを非表示にする。
- `data()` — フォロワーの配列を返す。
- `reverseData()` — フォロワーの配列を逆順で返す。
- `follower(index)` — 指定インデックスのフォロワーを返す。
- `refresh()` — 全フォロワーをリフレッシュする。
- `update()` — 毎フレーム更新する。
- `updateMove()` — フォロワーの移動を更新する。
- `jumpAll()` — 全フォロワーをジャンプさせる。
- `synchronize(x, y, d)` — 全フォロワーの座標と向きを同期する。
- `gather()` — 全フォロワーを集合させる。
- `areGathering()` — 集合中かを確認する。
- `visibleFollowers()` — 表示中のフォロワーの配列を返す。
- `areMoving()` — いずれかのフォロワーが移動中かを確認する。
- `areGathered()` — 全フォロワーが集合完了かを確認する。
- `isSomeoneCollided(x, y)` — いずれかのフォロワーが指定座標で衍突するかを確認する。

### Game_Vehicle

乗り物用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Vehicle**


#### インスタンスメソッド

- `initialize(type)` — 初期化する。
- `initMembers()` — メンバー変数を初期化する。
- `isBoat()` — 小型船かを確認する。
- `isShip()` — 大型船かを確認する。
- `isAirship()` — 飛行船かを確認する。
- `resetDirection()` — 向きを初期値にリセットする。
- `initMoveSpeed()` — 移動速度を初期化する。
- `vehicle()` — データベースの乗り物データを返す。
- `loadSystemSettings()` — システム設定から乗り物情報を読み込む。
- `refresh()` — キャラクター画像をリフレッシュする。
- `setLocation(mapId, x, y)` — 乗り物の場所を設定する。
- `pos(x, y)` — 指定座標にいるかを確認する。
- `isMapPassable(x, y, d)` — 乗り物で通行可能かを確認する。
- `getOn()` — 乗車処理を行う。
- `getOff()` — 降車処理を行う。
- `setBgm(bgm)` — 乗り物のBGMを設定する。
- `playBgm()` — 乗り物のBGMを再生する。
- `syncWithPlayer()` — プレイヤーと位置を同期する。
- `screenY()` — 画面上のY座標を返す。
- `shadowX()` — 影のX座標を返す。
- `shadowY()` — 影のY座標を返す。
- `shadowOpacity()` — 影の不透明度を返す。
- `canMove()` — 移動可能かを確認する。
- `update()` — 毎フレーム更新する。
- `updateAirship()` — 飛行船の更新を行う。
- `updateAirshipAltitude()` — 飛行船の高度を更新する。
- `maxAltitude()` — 飛行船の最大高度を返す。
- `isLowest()` — 最低高度（着地）かを確認する。
- `isHighest()` — 最高高度かを確認する。
- `isTakeoffOk()` — 離陸可能かを確認する。
- `isLandOk(x, y, d)` — 着陸可能かを確認する。

### Game_Event ⭐

イベント用のゲームオブジェクトクラス。イベントページの切り替え機能を含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Event**


#### インスタンスメソッド

- `initialize(mapId, eventId)` — 初期化する。
- `initMembers()` — メンバー変数を初期化する。
- `eventId()` — イベントIDを返す。
- `event()` — データベースのイベントデータを返す。
- `page()` — 現在のイベントページを返す。
- `list()` — 現在ページのコマンドリストを返す。
- `isCollidedWithCharacters(x, y)` — 他キャラクターとの衍突を確認する。
- `isCollidedWithEvents(x, y)` — 他イベントとの衍突を確認する。
- `isCollidedWithPlayerCharacters(x, y)` — プレイヤー・フォロワーとの衍突を確認する。
- `lock()` — イベントをロックする（プレイヤーの方を向く）。
- `unlock()` — イベントのロックを解除する。
- `updateStop()` — 停止中の更新を行う。
- `updateSelfMovement()` — 自律移動を更新する。
- `stopCountThreshold()` — 自律移動の停止カウント閾値を返す。
- `moveTypeRandom()` — ランダム移動タイプの処理を行う。
- `moveTypeTowardPlayer()` — プレイヤーに近づく移動タイプの処理を行う。
- `isNearThePlayer()` — プレイヤーの近くにいるかを確認する。
- `moveTypeCustom()` — カスタム移動タイプの処理を行う。
- `isStarting()` — イベントが開始状態かを確認する。
- `clearStartingFlag()` — 開始フラグをクリアする。
- `isTriggerIn(triggers)` — イベントのトリガーが指定リストに含まれるかを確認する。
- `start()` — イベントを開始する。
- `erase()` — イベントを一時消去する。
- `refresh()` — イベントページをリフレッシュする。
- `findProperPageIndex()` — 条件を満たす適切なページインデックスを検索する。
- `meetsConditions(page)` — ページの出現条件を満たすかを確認する。
- `setupPage()` — イベントページをセットアップする。
- `clearPageSettings()` — ページ設定をクリアする。
- `setupPageSettings()` — ページの設定（画像・移動・トリガー等）を適用する。
- `isOriginalPattern()` — 初期パターンかを確認する。
- `resetPattern()` — パターンを初期値にリセットする。
- `checkEventTriggerTouch(x, y)` — 接触イベントトリガーをチェックする。
- `checkEventTriggerAuto()` — 自動実行イベントトリガーをチェックする。
- `update()` — 毎フレーム更新する。
- `updateParallel()` — 並列処理イベントを更新する。
- `locate(x, y)` — 指定座標に配置する。
- `forceMoveRoute(moveRoute)` — 移動ルートを強制実行する。

### Game_Interpreter ⭐

イベントコマンドを実行するインタプリタ。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(depth)` — 初期化する。depthはコモンイベント呼び出しの深さ。
- `checkOverflow()` — コモンイベントの再帰呼び出しが深すぎないかチェックする。
- `clear()` — インタプリタの状態をクリアする。
- `setup(list, eventId)` — コマンドリストとイベントIDでセットアップする。
- `loadImages()` — コマンドで使用する画像を事前読み込みする。
- `eventId()` — 実行中のイベントIDを返す。
- `isOnCurrentMap()` — 現在のマップ上かを確認する。
- `setupReservedCommonEvent()` — 予約されたコモンイベントをセットアップする。
- `isRunning()` — コマンド実行中かを確認する。
- `update()` — 毎フレーム更新する。
- `updateChild()` — 子インタプリタを更新する。
- `updateWait()` — ウェイト状態を更新する。
- `updateWaitCount()` — ウェイトカウントを更新する。
- `updateWaitMode()` — ウェイトモードを更新する。
- `setWaitMode(waitMode)` — ウェイトモードを設定する。
- `wait(duration)` — 指定フレーム数ウェイトする。
- `fadeSpeed()` — フェード速度を返す。
- `executeCommand()` — 現在のコマンドを実行する。
- `checkFreeze()` — 無限ループをチェックする。
- `terminate()` — インタプリタを終了する。
- `skipBranch()` — 条件分岐をスキップする。
- `currentCommand()` — 現在のコマンドを返す。
- `nextEventCode()` — 次のイベントコードを返す。
- `iterateActorId(param, callback)` — アクターIDでイテレートする（0=全員）。
- `iterateActorEx(param1, param2, callback)` — アクターを固定値または変数で指定してイテレートする。
- `iterateActorIndex(param, callback)` — パーティインデックスでイテレートする。
- `iterateEnemyIndex(param, callback)` — 敵インデックスでイテレートする。
- `iterateBattler(param1, param2, callback)` — バトラーをイテレートする。
- `character(param)` — パラメータからキャラクターを取得する（-1=プレイヤー, 0=このイベント）。
- `changeHp(target, value, allowDeath)` — 対象のHPを変更する。
- `command101(params)` — 文章の表示。
- `command102(params)` — 選択肢の表示。
- `setupChoices(params)` — 選択肢をセットアップする。
- `command402(params)` — 選択肢の分岐[選択時]。
- `command403()` — 選択肢の分岐[キャンセル]。
- `command103(params)` — 数値入力の処理。
- `setupNumInput(params)` — 数値入力をセットアップする。
- `command104(params)` — アイテム選択の処理。
- `setupItemChoice(params)` — アイテム選択をセットアップする。
- `command105(params)` — スクロール文章の表示。
- `command108(params)` — 注釈。
- `command109()` — 条件分岐（スキップ）。
- `command111(params)` — 条件分岐。
- `command411()` — 条件分岐[それ以外]。
- `command112()` — ループ。
- `command413()` — ループの中断（以上繰り返し）。
- `command113()` — ループの中断。
- `command115()` — イベント処理の中断。
- `command117(params)` — コモンイベント呼び出し。
- `setupChild(list, eventId)` — 子インタプリタをセットアップする。
- `command118()` — ラベル。
- `command119(params)` — ラベルジャンプ。
- `jumpTo(index)` — 指定インデックスにジャンプする。
- `command121(params)` — スイッチの操作。
- `command122(params)` — 変数の操作。
- `gameDataOperand(type, param1, param2)` — ゲームデータのオペランドを取得する。
- `command123(params)` — セルフスイッチの操作。
- `command124(params)` — タイマーの操作。
- `command125(params)` — 所持金の増減。
- `command126(params)` — アイテムの増減。
- `command127(params)` — 武器の増減。
- `command128(params)` — 防具の増減。
- `command129(params)` — メンバーの入れ替え。
- `command132(params)` — 戦闘BGMの変更。
- `command133(params)` — 勝利MEの変更。
- `command134(params)` — セーブの禁止。
- `command135(params)` — メニューの禁止。
- `command136(params)` — エンカウントの禁止。
- `command137(params)` — 並び替えの禁止。
- `command138(params)` — ウィンドウカラーの変更。
- `command139(params)` — 敗北MEの変更。
- `command140(params)` — 乗り物BGMの変更。
- `command201(params)` — 場所移動。
- `command202(params)` — 乗り物の位置設定。
- `command203(params)` — イベントの位置設定。
- `command204(params)` — マップのスクロール。
- `command205(params)` — 移動ルートの設定。
- `command206()` — 乗り物の乗降。
- `command211(params)` — 透明状態の変更。
- `command212(params)` — アニメーションの表示。
- `command213(params)` — フキダシアイコンの表示。
- `command214()` — イベントの一時消去。
- `command216(params)` — 隊列歩行の変更。
- `command217()` — 隊列メンバーの集合。
- `command221()` — 画面のフェードアウト。
- `command222()` — 画面のフェードイン。
- `command223(params)` — 画面の色調変更。
- `command224(params)` — 画面のフラッシュ。
- `command225(params)` — 画面のシェイク。
- `command230(params)` — ウェイト。
- `command231(params)` — ピクチャの表示。
- `command232(params)` — ピクチャの移動。
- `picturePoint(params)` — ピクチャの座標を計算する。
- `command233(params)` — ピクチャの回転。
- `command234(params)` — ピクチャの色調変更。
- `command235(params)` — ピクチャの消去。
- `command236(params)` — 天候の設定。
- `command241(params)` — BGMの演奏。
- `command242(params)` — BGMのフェードアウト。
- `command243()` — BGMの保存。
- `command244()` — BGMの再開。
- `command245(params)` — BGSの演奏。
- `command246(params)` — BGSのフェードアウト。
- `command249(params)` — MEの演奏。
- `command250(params)` — SEの演奏。
- `command251()` — SEの停止。
- `command261(params)` — ムービーの再生。
- `videoFileExt()` — 動画ファイルの拡張子を返す。
- `command281(params)` — マップ名表示の変更。
- `command282(params)` — タイルセットの変更。
- `command283(params)` — 戦闘背景の変更。
- `command284(params)` — 遠景の変更。
- `command285(params)` — 指定位置の情報取得。
- `command301(params)` — 戦闘の処理。
- `command601()` — 戦闘の処理[勝った場合]。
- `command602()` — 戦闘の処理[逃げた場合]。
- `command603()` — 戦闘の処理[負けた場合]。
- `command302(params)` — ショップの処理。
- `command303(params)` — ショップの処理[商品追加]。
- `command311(params)` — HPの増減。
- `command312(params)` — MPの増減。
- `command326(params)` — TPの増減。
- `command313(params)` — ステートの変更。
- `command314(params)` — 全回復。
- `command315(params)` — 経験値の増減。
- `command316(params)` — レベルの増減。
- `command317(params)` — 能力値の増減。
- `command318(params)` — スキルの増減。
- `command319(params)` — 装備の変更。
- `command320(params)` — 名前の変更。
- `command321(params)` — 職業の変更。
- `command322(params)` — アクターの画像変更。
- `command323(params)` — 乗り物の画像変更。
- `command324(params)` — 二つ名の変更。
- `command325(params)` — プロフィールの変更。
- `command331(params)` — 敵キャラのHP増減。
- `command332(params)` — 敵キャラのMP増減。
- `command342(params)` — 敵キャラのTP増減。
- `command333(params)` — 敵キャラのステート変更。
- `command334(params)` — 敵キャラの全回復。
- `command335(params)` — 敵キャラの出現。
- `command336(params)` — 敵キャラの変身。
- `command337(params)` — 戦闘アニメーションの表示。
- `command339(params)` — 戦闘行動の強制。
- `command340()` — バトルの中断。
- `command351()` — メニュー画面を開く。
- `command352()` — セーブ画面を開く。
- `command353()` — ゲームオーバー。
- `command354()` — タイトル画面に戻す。
- `command355()` — スクリプト。
- `command356(params)` — プラグインコマンド（V1形式）。
- `pluginCommand()` — プラグインコマンドを実行する（旧形式・空実装）。
- `command357(params)` — プラグインコマンド（MZ形式）。

---

## Scenes

画面遷移を管理する `Scene_*` クラス群です。各画面が1つのシーンクラスに対応します。 ( `rmmz_scenes.js` )

### Scene_Base ⭐

ゲーム内の全シーンのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → **Scene_Base**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — シーンを作成する。
- `isActive()` — アクティブな（現在の）シーンかを確認する。
- `isReady()` — シーンの準備が完了したかを確認する。
- `start()` — シーンを開始する。
- `update()` — 毎フレーム更新する。
- `stop()` — シーンを停止する。
- `isStarted()` — シーンが開始済みかを確認する。
- `isBusy()` — ビジー状態（フェード中など）かを確認する。
- `isFading()` — フェードイン・フェードアウト中かを確認する。
- `terminate()` — シーンを終了・破棄する。
- `createWindowLayer()` — ウィンドウを表示するレイヤーを作成する。
- `addWindow(window)` — ウィンドウをシーンに追加する。
- `startFadeIn(duration, white)` — フェードインを開始する。
- `startFadeOut(duration, white)` — フェードアウトを開始する。
- `createColorFilter()` — カラーフィルター（色調変更用）を作成する。
- `updateColorFilter()` — カラーフィルターを更新する。
- `updateFade()` — フェード処理を更新する。
- `updateChildren()` — 子要素（スプライトなど）を更新する。
- `popScene()` — 現在のシーンを終了して前のシーンに戻る。
- `checkGameover()` — ゲームオーバー条件を満たしているかチェックする。
- `fadeOutAll()` — 音楽と画面をすべてフェードアウトする。
- `fadeSpeed()` — デフォルトのフェード速度（24フレーム）を返す。
- `slowFadeSpeed()` — 遅いフェード速度（時間をかける場合用）を返す。
- `scaleSprite(sprite)` — 画面サイズに合わせてスプライトを拡大する。
- `centerSprite(sprite)` — スプライトを画面中央に配置する。
- `isBottomHelpMode()` — ヘルプウィンドウを画面下部に配置するかを確認する。
- `isBottomButtonMode()` — タッチボタンを画面下部に配置するかを確認する。
- `isRightInputMode()` — 入力系ウィンドウを画面右側に配置するかを確認する。
- `mainCommandWidth()` — メインコマンドウィンドウの基準幅（240）を返す。
- `buttonAreaTop()` — タッチボタン領域の上端Y座標を返す。
- `buttonAreaBottom()` — タッチボタン領域の下端Y座標を返す。
- `buttonAreaHeight()` — タッチボタン領域の高さを返す（UIエリアが広い場合52）。
- `buttonY()` — タッチボタンのY座標を返す。
- `calcWindowHeight(numLines, selectable)` — 指定行数に必要なウィンドウの高さを計算する。
- `requestAutosave()` — オートセーブを要求する。
- `isAutosaveEnabled()` — オートセーブが可能かを確認する。
- `executeAutosave()` — オートセーブを実行する。
- `onAutosaveSuccess()` — オートセーブ成功時のコールバック。
- `onAutosaveFailure()` — オートセーブ失敗時のコールバック。

### Scene_Boot ⭐

ゲーム全体の初期化を行うシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Boot**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — データベースや画像のロードを開始する。
- `isReady()` — 全データファイルの読み込みが完了したかを確認する。
- `onDatabaseLoaded()` — データベース読み込み完了時のコールバック。
- `setEncryptionInfo()` — 画像・音声の暗号化情報を設定する。
- `loadSystemImages()` — システム画像（Window等）を読み込む。
- `loadPlayerData()` — セーブデータ情報を読み込み、グローバル情報を設定する。
- `loadGameFonts()` — ゲーム用フォントを読み込む。
- `isPlayerDataLoaded()` — プレイヤー情報が読み込み完了したかを確認する。
- `start()` — ブート処理を完了し、次のシーンへ遷移する。
- `startNormalGame()` — 通常のゲーム（またはタイトル）を開始する。
- `resizeScreen()` — 画面サイズを初期化・リサイズする。
- `adjustBoxSize()` — UIエリアのサイズ（Box Size）を調整する。
- `adjustWindow()` — ブラウザや画面に合わせてゲームウィンドウを調整する。
- `screenScale()` — 画面のスケール倍率を取得する。
- `updateDocumentTitle()` — ブラウザのタイトルをゲームタイトルに更新する。
- `checkPlayerLocation()` — 新規ゲーム時にプレイヤーの初期位置が存在するかチェックする。

### Scene_Splash

スプラッシュ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Splash**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — スプラッシュ画面を作成する。
- `start()` — シーンを開始する。
- `update()` — 毎フレーム更新する。
- `stop()` — シーンを停止する。
- `createBackground()` — 背景画像（MadeWithMvロゴ等）を作成する。
- `adjustBackground()` — 背景画像のサイズ・位置を調整する。
- `isEnabled()` — スプラッシュ画面が有効か（システム設定）を確認する。
- `initWaitCount()` — ウェイトカウント（表示時間）を初期化する。
- `updateWaitCount()` — ウェイトカウントを更新する。
- `checkSkip()` — タッチやクリックでスキップされたかをチェックする。
- `gotoTitle()` — タイトル画面に遷移する。

### Scene_Title ⭐

タイトル画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Title**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — タイトル画面（背景・UI）を作成する。
- `start()` — シーンを開始する。
- `update()` — 毎フレーム更新する。
- `isBusy()` — ビジー状態（フェードアウト中など）かを確認する。
- `terminate()` — シーンを終了・破棄する。
- `createBackground()` — 背景画像を作成する。
- `createForeground()` — 前景（タイトルロゴ・文字）を作成する。
- `drawGameTitle()` — 前景にゲームタイトルを描画する。
- `adjustBackground()` — 背景のサイズ・位置を画面に合わせる。
- `createCommandWindow()` — コマンドウィンドウ（ニューゲーム等）を作成する。
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す。
- `commandNewGame()` — 「ニューゲーム」選択時の処理。
- `commandContinue()` — 「コンティニュー」選択時の処理。
- `commandOptions()` — 「オプション」選択時の処理。
- `playTitleMusic()` — タイトルのBGMを再生する。

### Scene_Message

Scene_MapとScene_Battleのスーパークラス。共通するメッセージウィンドウ群を管理する。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Message**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `isMessageWindowClosing()` — メッセージウィンドウが閉じている最中かを確認する。
- `createAllWindows()` — 関連するすべてのUIウィンドウを作成する。
- `createMessageWindow()` — メッセージウィンドウを作成する。
- `messageWindowRect()` — メッセージウィンドウの矩形領域を返す。
- `createScrollTextWindow()` — スクロール文章ウィンドウを作成する。
- `scrollTextWindowRect()` — スクロール文章ウィンドウの矩形領域を返す。
- `createGoldWindow()` — 所持金ウィンドウを作成する。
- `goldWindowRect()` — 所持金ウィンドウの矩形領域を返す。
- `createNameBoxWindow()` — 名前ボックス（名前ウィンドウ）を作成する。
- `createChoiceListWindow()` — 選択肢ウィンドウを作成する。
- `createNumberInputWindow()` — 数値入力ウィンドウを作成する。
- `createEventItemWindow()` — アイテム選択ウィンドウを作成する。
- `eventItemWindowRect()` — アイテム選択ウィンドウの矩形領域を返す。
- `associateWindows()` — 各メッセージウィンドウ群をメッセージウィンドウ本体に関連付ける。
- `cancelMessageWait()` — メッセージ表示のウェイトをキャンセルする。

### Scene_Map ⭐

マップ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Map**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — マップシーン（表示オブジェクトとUI）を作成する。
- `isReady()` — マップのローディングが完了したかを確認する。
- `onMapLoaded()` — マップロード完了時のコールバック。
- `onTransfer()` — マップ移動（場所移動）が発生した時のコールバック。
- `start()` — シーンを開始する。
- `onTransferEnd()` — マップ移動完了時のオートセーブなどを処理する。
- `shouldAutosave()` — オートセーブを実行すべきかを確認する。
- `update()` — 毎フレーム更新する。
- `updateMainMultiply()` — 早送り状態に応じて`updateMain`を複数回呼ぶ。
- `updateMain()` — マップ進行（プレイヤー移動、イベント実行など）を更新する。
- `isPlayerActive()` — プレイヤーが操作可能（移動可能、イベント中ではない）かを確認する。
- `isFastForward()` — 決定ボタン長押しによるイベント早送り中かを確認する。
- `stop()` — シーンを停止する。
- `isBusy()` — メッセージ表示中やスクロール中など、ビジー状態かを確認する。
- `terminate()` — シーン終了時にイベント画像を消去するなどの破棄処理を行う。
- `needsFadeIn()` — 開始時にフェードインが必要かを確認する。
- `needsSlowFadeOut()` — 終了時に遅いフェードアウトが必要かを確認する。
- `updateWaitCount()` — バトル終了時などのウェイトカウントを更新する。
- `updateDestination()` — タッチ操作の目的地フラグを更新する。
- `updateMenuButton()` — メニュー呼び出しボタン（タッチUI）の状態を更新する。
- `hideMenuButton()` — メニュー呼び出しボタンを隠す。
- `updateMapNameWindow()` — マップ名ウィンドウを更新する。
- `isMenuEnabled()` — メニュー画面が開ける状態かを確認する。
- `isMapTouchOk()` — マップのタッチ操作（移動等）が有効かを確認する。
- `processMapTouch()` — マップ上のタッチによるプレイヤー移動を処理する。
- `isAnyButtonPressed()` — いずれかのタッチUIボタンが押されているかを確認する。
- `onMapTouch()` — マップがタッチされた時の目的地などのイベントハンドラ。
- `isSceneChangeOk()` — 他のシーンへ遷移可能な状態かを確認する。
- `updateScene()` — バトルやメニュー等のシーン遷移トリガーを監視して遷移する。
- `createDisplayObjects()` — マップグラフィック（Spriteset_Map）等を作成する。
- `createSpriteset()` — スプライトセットを作成する。
- `createAllWindows()` — ウィンドウレイヤーと全UIウィンドウを作成する。
- `createMapNameWindow()` — マップ名ウィンドウを作成する。
- `mapNameWindowRect()` — マップ名ウィンドウの矩形領域を返す。
- `createButtons()` — スマホ等向けのタッチUIボタンを作成する。
- `createMenuButton()` — メニュー呼び出しボタンを作成する。
- `updateTransferPlayer()` — プレイヤーの場所移動予約があれば実行する。
- `updateEncounter()` — ランダムエンカウントが発生するかチェックする。
- `updateCallMenu()` — メニュー呼び出し予約があればメニューへ移行する。
- `isMenuCalled()` — プレイヤーの操作でメニューが開かれたかチェックする。
- `callMenu()` — `Scene_Menu`への遷移を準備する。
- `updateCallDebug()` — デバッグ画面の呼び出し予約があれば処理する。
- `isDebugCalled()` — F9等でデバッグ画面が開かれたかチェックする。
- `fadeInForTransfer()` — 移動後のフェードインを行う。
- `fadeOutForTransfer()` — 移動前のフェードアウトを行う。
- `launchBattle()` — 戦闘（Scene_Battle）への遷移を開始する。
- `stopAudioOnBattleStart()` — エンカウント時のBGM・BGSの自動停止や引き継ぎを処理する。
- `startEncounterEffect()` — エンカウント時の画面フラッシュ・ズームなどのエフェクトを開始する。
- `updateEncounterEffect()` — エンカウントエフェクトの進行を更新する。
- `snapForBattleBackground()` — 戦闘の背景用に現在のマップ画面をキャプチャする。
- `startFlashForEncounter(duration)` — エンカウント時の画面フラッシュエフェクトを実行する。
- `encounterEffectSpeed()` — エンカウントエフェクトの速度（60）を返す。

### Scene_MenuBase ⭐

すべてのメニュー系シーン（メニュー、アイテム、スキル、装備、セーブ等）のスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_MenuBase**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 共通する背景やボタンを作成する。
- `update()` — 毎フレーム更新する。
- `helpAreaTop()` — ヘルプウィンドウ領域の上端Y座標を返す。
- `helpAreaBottom()` — ヘルプウィンドウ領域の下端Y座標を返す。
- `helpAreaHeight()` — ヘルプウィンドウ領域の高さを返す。
- `mainAreaTop()` — メイン領域の上端Y座標を返す。
- `mainAreaBottom()` — メイン領域の下端Y座標を返す。
- `mainAreaHeight()` — メイン領域の高さを返す。
- `actor()` — 現在選択中のアクターを返す。
- `updateActor()` — アクター切り替え操作があった場合にアクターを更新する。
- `createBackground()` — 背景となるぼかし画像（マップ画面のキャプチャ）を作成する。
- `setBackgroundOpacity(opacity)` — 背景画像の不透明度を設定する。
- `createHelpWindow()` — ヘルプウィンドウを作成する。
- `helpWindowRect()` — ヘルプウィンドウの矩形領域を返す。
- `createButtons()` — タッチUI用のキャンセルボタン・ページ切替ボタンを作成する。
- `needsCancelButton()` — キャンセルボタンが必要かを確認する。
- `createCancelButton()` — キャンセルボタンを作成する。
- `needsPageButtons()` — ページ切替（アクター切替）ボタンが必要かを確認する。
- `createPageButtons()` — ページ切替ボタンを作成する。
- `updatePageButtons()` — ページ切替ボタンの有効/無効状態を更新する。
- `arePageButtonsEnabled()` — ページ切替ボタンが有効か（アクターが2人以上等）を確認する。
- `nextActor()` — 次のアクターに切り替える。
- `previousActor()` — 前のアクターに切り替える。
- `onActorChange()` — アクター切り替え時の処理。
- `previousActor()`
- `onActorChange()` — Actor Change時のコールバック。

### Scene_Menu ⭐

メニュー画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Menu**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `helpAreaHeight()` — メニュー画面のヘルプ領域の高さを返す（通常0）。
- `create()` — メニュー画面の各ウィンドウを作成する。
- `start()` — シーンを開始する。
- `createCommandWindow()` — メインのコマンドウィンドウを作成する。
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す。
- `createGoldWindow()` — 所持金ウィンドウを作成する。
- `goldWindowRect()` — 所持金ウィンドウの矩形領域を返す。
- `createStatusWindow()` — パーティステータスウィンドウを作成する。
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す。
- `commandItem()` — 「アイテム」コマンド選択時の処理。
- `commandPersonal()` — 「スキル」「装備」「ステータス」など個人対象のコマンド選択時の処理。
- `commandFormation()` — 「並び替え」コマンド選択時の処理。
- `commandOptions()` — 「オプション」コマンド選択時の処理。
- `commandSave()` — 「セーブ」コマンド選択時の処理。
- `commandGameEnd()` — 「ゲーム終了」コマンド選択時の処理。
- `onPersonalOk()` — 個人コマンドでアクターを選択決定した時の処理。
- `onPersonalCancel()` — 個人コマンドでアクター選択をキャンセルした時の処理。
- `onFormationOk()` — 並び替えでメンバーを選択決定した時の処理。
- `onFormationCancel()` — 並び替えをキャンセルした時の処理。

### Scene_ItemBase

Scene_ItemとScene_Skillのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_ItemBase**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — アイテム・スキル画面共通のウィンドウ群を作成する。
- `createActorWindow()` — アイテム/スキル対象選択用のアクターウィンドウを作成する。
- `actorWindowRect()` — アクターウィンドウの矩形領域を返す。
- `item()` — 現在選択されているアイテム（またはスキル）を返す。
- `user()` — アイテム/スキルの使用者を返す（アイテム類の場合はパーティ）。
- `isCursorLeft()` — アクターウィンドウ内でカーソルが左側にあるかを確認する。
- `showActorWindow()` — アクターウィンドウを表示してアクティブにする。
- `hideActorWindow()` — アクターウィンドウを非表示にして非アクティブにする。
- `isActorWindowActive()` — アクターウィンドウがアクティブかを確認する。
- `onActorOk()` — アクターウィンドウで対象を選択決定した時の処理（使用実行）。
- `onActorCancel()` — アクターウィンドウで対象選択をキャンセルした時の処理。
- `determineItem()` — アイテム（またはスキル）を決定した時の処理（対象選択へ移行など）。
- `useItem()` — 選択されたアイテム（またはスキル）を使用する。
- `activateItemWindow()` — アイテム（またはスキル）ウィンドウをアクティブにする。
- `itemTargetActors()` — 対象となるアクターの配列を返す。
- `canUse()` — 現在の状態でアイテム（またはスキル）が使用可能かを確認する。
- `isItemEffectsValid()` — アイテム（またはスキル）の効果が対象に有効かを確認する。
- `applyItem()` — ターゲットにアイテム（またはスキル）の効果を適用する。
- `checkCommonEvent()` — 使用したアイテム/スキルにコモンイベントがある場合に予約する。

### Scene_Item

アイテム画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Item**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — アイテム画面の各種ウィンドウを作成する。
- `createCategoryWindow()` — アイテムのカテゴリカウィンドウを作成する。
- `categoryWindowRect()` — カテゴリウィンドウの矩形領域を返す。
- `createItemWindow()` — アイテムリストウィンドウを作成する。
- `itemWindowRect()` — アイテムリストウィンドウの矩形領域を返す。
- `user()` — アイテムの使用者（パーティ）を返す。
- `onCategoryOk()` — カテゴリを選択決定した時の処理。
- `onItemOk()` — アイテムを選択決定した時の処理。
- `onItemCancel()` — アイテム選択をキャンセルした時の処理。
- `playSeForItem()` — アイテム使用時の効果音を再生する。
- `useItem()` — アイテムを使用し、ウィンドウを再描画する。

### Scene_Skill

スキル画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Skill**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — スキル画面の各種ウィンドウを作成する。
- `start()` — シーンを開始し、アクター情報をリフレッシュする。
- `createSkillTypeWindow()` — スキルタイプ（魔法・必殺技等）ウィンドウを作成する。
- `skillTypeWindowRect()` — スキルタイプウィンドウの矩形領域を返す。
- `createStatusWindow()` — アクターのステータスウィンドウを作成する。
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す。
- `createItemWindow()` — スキルリストウィンドウを作成する。
- `itemWindowRect()` — スキルリストウィンドウの矩形領域を返す。
- `needsPageButtons()` — アクター切替ボタンが必要かを確認する。
- `arePageButtonsEnabled()` — アクター切替ボタンが有効かを確認する。
- `refreshActor()` — 選択されているアクターに合わせて各ウィンドウを更新する。
- `user()` — 現在のアクター（スキルの使用者）を返す。
- `commandSkill()` — スキルタイプを選択決定した時の処理。
- `onItemOk()` — スキルを選択決定した時の処理。
- `onItemCancel()` — スキル選択をキャンセルした時の処理。
- `playSeForItem()` — スキル使用時の効果音を再生する。
- `useItem()` — スキルを使用し、ステータスを再描画する。
- `onActorChange()` — アクターが切り替わった時の処理をオーバーライド。

### Scene_Equip

装備画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Equip**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 装備画面の各種ウィンドウを作成する。
- `createStatusWindow()` — ステータス（パラメータ変化）ウィンドウを作成する。
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す。
- `createCommandWindow()` — コマンド（装備・最強装備・全て外す）ウィンドウを作成する。
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す。
- `createSlotWindow()` — 装備スロットウィンドウを作成する。
- `slotWindowRect()` — 装備スロットウィンドウの矩形領域を返す。
- `createItemWindow()` — 装備品リストウィンドウを作成する。
- `itemWindowRect()` — 装備品リストウィンドウの矩形領域を返す。
- `statusWidth()` — ステータスウィンドウの幅を返す。
- `needsPageButtons()` — アクター切替ボタンが必要かを確認する。
- `arePageButtonsEnabled()` — アクター切替ボタンが有効かを確認する。
- `refreshActor()` — 選択されているアクターに合わせて各ウィンドウを更新する。
- `commandEquip()` — 「装備」コマンド選択時の処理。
- `commandOptimize()` — 「最強装備」コマンド選択時の処理。
- `commandClear()` — 「全て外す」コマンド選択時の処理。
- `onSlotOk()` — 変更する装備スロットを選択決定した時の処理。
- `onSlotCancel()` — 装備スロット選択をキャンセルした時の処理。
- `onItemOk()` — 装備するアイテムを選択決定した時の処理。
- `executeEquipChange()` — 実際の装備変更処理を実行する。
- `onItemCancel()` — 装備アイテム選択をキャンセルした時の処理。
- `onActorChange()` — アクターが切り替わった時の処理。
- `hideItemWindow()` — 装備品リストウィンドウを非表示にし、スロットをアクティブにする。

### Scene_Status

ステータス画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Status**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — ステータス画面の各種ウィンドウを作成する。
- `helpAreaHeight()` — ヘルプ領域の高さを返す（通常0）。
- `createProfileWindow()` — プロフィールウィンドウを作成する。
- `profileWindowRect()` — プロフィールウィンドウの矩形領域を返す。
- `createStatusWindow()` — アクターの基本ステータスウィンドウを作成する。
- `statusWindowRect()` — 基本ステータスウィンドウの矩形領域を返す。
- `createStatusParamsWindow()` — 能力値詳細ウィンドウを作成する。
- `statusParamsWindowRect()` — 能力値詳細ウィンドウの矩形領域を返す。
- `createStatusEquipWindow()` — 装備確認ウィンドウを作成する。
- `statusEquipWindowRect()` — 装備確認ウィンドウの矩形領域を返す。
- `statusParamsWidth()` — 能力値詳細ウィンドウの幅を返す。
- `statusParamsHeight()` — 能力値詳細ウィンドウの高さを返す。
- `profileHeight()` — プロフィールウィンドウの高さを返す。
- `start()` — シーンを開始し、アクター情報をリフレッシュする。
- `needsPageButtons()` — アクター切替ボタンが必要かを確認する。
- `refreshActor()` — 選択されているアクターに合わせて各ウィンドウを更新する。
- `onActorChange()` — アクターが切り替わった時の処理。

### Scene_Options

オプション画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Options**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — オプション画面のウィンドウを作成する。
- `terminate()` — シーン終了時に設定をセーブする。
- `createOptionsWindow()` — オプション設定ウィンドウを作成する。
- `optionsWindowRect()` — オプションウィンドウの矩形領域を返す。
- `maxCommands()`
- `maxVisibleCommands()`

### Scene_File

Scene_SaveとScene_Loadのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_File**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — セーブ・ロード画面共通のウィンドウ群を作成する。
- `helpAreaHeight()` — ヘルプ領域の高さを返す（通常0）。
- `start()` — シーンを開始する。
- `savefileId()` — 選択されているセーブファイルIDを返す。
- `isSavefileEnabled(savefileId)` — 指定されたセーブファイルが有効（操作可能）かを確認する。
- `createHelpWindow()` — ヘルプ（指示テキスト）ウィンドウを作成する。
- `helpWindowRect()` — ヘルプウィンドウの矩形領域を返す。
- `createListWindow()` — セーブファイルリストウィンドウを作成する。
- `listWindowRect()` — リストウィンドウの矩形領域を返す。
- `mode()` — 現在のモード（'save' または 'load'）を返す。
- `needsAutosave()` — オートセーブの実行が必要かを確認する。
- `activateListWindow()` — リストウィンドウをアクティブにする。
- `helpWindowText()` — ヘルプウィンドウに表示するテキストを返す。
- `firstSavefileId()` — 最初にカーソルを合わせるセーブファイルIDを返す。
- `onSavefileOk()` — セーブファイルを選択決定した時の処理。

### Scene_Save

セーブ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Save**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `mode()` — モードを 'save' として返す。
- `helpWindowText()` — ヘルプウィンドウに表示するテキスト（「どのファイルにセーブしますか？」等）を返す。
- `firstSavefileId()` — 最後にアクセスしたセーブファイルIDを返す。
- `onSavefileOk()` — セーブファイルを選択決定した時の処理。
- `executeSave(savefileId)` — 選択したIDにセーブを実行する。
- `onSaveSuccess()` — セーブ成功時のコールバック（効果音再生など）。
- `onSaveFailure()` — セーブ失敗時のコールバック（ブザー音再生など）。

### Scene_Load

ロード画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Load**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `terminate()` — シーン終了時の処理（BGMの引き継ぎなど）。
- `mode()` — モードを 'load' として返す。
- `helpWindowText()` — ヘルプウィンドウに表示するテキスト（「どのファイルをロードしますか？」等）を返す。
- `firstSavefileId()` — 最後にアクセスしたセーブファイルIDを返す。
- `onSavefileOk()` — セーブファイルを選択決定した時の処理。
- `executeLoad(savefileId)` — 選択したIDからロードを実行する。
- `onLoadSuccess()` — ロード成功時のコールバック（BGM再開・画面フェード等の処理）。
- `onLoadFailure()` — ロード失敗時のコールバック（ブザー音再生など）。
- `reloadMapIfUpdated()` — マップデータが更新されている場合に再読み込みを行う。

### Scene_GameEnd

ゲーム終了画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_GameEnd**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — ゲーム終了画面の各種ウィンドウを作成する。
- `stop()` — シーンを停止し、コマンドウィンドウを閉じる。
- `createBackground()` — 背景となるぼかし画像を作成する。
- `createCommandWindow()` — コマンド（タイトルへ・キャンセル）ウィンドウを作成する。
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す。
- `commandToTitle()` — 「タイトルへ」コマンド選択時の処理（タイトル画面へ遷移）。

### Scene_Shop

ショップ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Shop**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `prepare(goods, purchaseOnly)` — 販売品リストと購入のみフラグを準備する。
- `create()` — ショップ画面の各種ウィンドウを作成する。
- `createGoldWindow()` — 所持金ウィンドウを作成する。
- `goldWindowRect()` — 所持金ウィンドウの矩形領域を返す。
- `createCommandWindow()` — コマンド（購入・売却・やめる）ウィンドウを作成する。
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す。
- `createDummyWindow()` — メイン領域を埋めるダミーウィンドウを作成する。
- `dummyWindowRect()` — ダミーウィンドウの矩形領域を返す。
- `createNumberWindow()` — 個数入力ウィンドウを作成する。
- `numberWindowRect()` — 個数入力ウィンドウの矩形領域を返す。
- `createStatusWindow()` — 所持数・装備比較ステータスウィンドウを作成する。
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す。
- `createBuyWindow()` — 購入アイテムリストウィンドウを作成する。
- `buyWindowRect()` — 購入アイテムリストウィンドウの矩形領域を返す。
- `createCategoryWindow()` — 売却アイテムのカテゴリウィンドウを作成する。
- `categoryWindowRect()` — カテゴリウィンドウの矩形領域を返す。
- `createSellWindow()` — 売却アイテムリストウィンドウを作成する。
- `sellWindowRect()` — 売却アイテムリストウィンドウの矩形領域を返す。
- `statusWidth()` — ステータスウィンドウの幅を返す。
- `activateBuyWindow()` — 購入ウィンドウをアクティブにする。
- `activateSellWindow()` — 売却ウィンドウをアクティブにする。
- `commandBuy()` — 「購入」コマンド選択時の処理。
- `commandSell()` — 「売却」コマンド選択時の処理。
- `onBuyOk()` — 購入するアイテムを選択決定した時の処理。
- `onBuyCancel()` — 購入アイテム選択をキャンセルした時の処理。
- `onCategoryOk()` — 売却カテゴリを選択決定した時の処理。
- `onCategoryCancel()` — 売却カテゴリ選択をキャンセルした時の処理。
- `onSellOk()` — 売却するアイテムを選択決定した時の処理。
- `onSellCancel()` — 売却アイテム選択をキャンセルした時の処理。
- `onNumberOk()` — 購入・売却する個数を決定した時の処理（決済実行）。
- `onNumberCancel()` — 個数入力をキャンセルした時の処理。
- `doBuy(number)` — 指定された個数の購入決済を実行する。
- `doSell(number)` — 指定された個数の売却決済を実行する。
- `endNumberInput()` — 個数入力モードを終了し、リスト画面に戻る。
- `maxBuy()` — 選択中のアイテムの最大購入可能個数を返す。
- `maxSell()` — 選択中のアイテムの最大売却可能個数（所持数）を返す。
- `money()` — 現在の所持金を返す。
- `currencyUnit()` — 通貨単位を返す。
- `buyingPrice()` — 選択中のアイテムの購入価格を返す。
- `sellingPrice()` — 選択中のアイテムの売却価格を返す。

### Scene_Name

名前入力画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Name**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `prepare(actorId, maxLength)` — 名前変更の対象アクターと最大文字数を準備する。
- `create()` — 名前入力画面の各種ウィンドウを作成する。
- `start()` — シーンを開始し、エディットウィンドウをアクティブにする。
- `createEditWindow()` — 現在の名前を表示・編集するウィンドウを作成する。
- `editWindowRect()` — エディットウィンドウの矩形領域を返す。
- `createInputWindow()` — 文字パネル（キーボードUI）のウィンドウを作成する。
- `inputWindowRect()` — インプットウィンドウの矩形領域を返す。
- `onInputOk()` — 文字入力が完了（「決定」選択）した時の処理。

### Scene_Debug

デバッグ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Debug**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — デバッグ画面の各種ウィンドウを作成する。
- `needsCancelButton()` — キャンセルボタンが必要かを確認する。
- `createRangeWindow()` — スイッチ・変数の範囲選択ウィンドウを作成する。
- `rangeWindowRect()` — 範囲選択ウィンドウの矩形領域を返す。
- `createEditWindow()` — スイッチ・変数の詳細編集ウィンドウを作成する。
- `editWindowRect()` — 詳細編集ウィンドウの矩形領域を返す。
- `createDebugHelpWindow()` — デバッグ操作のヘルプウィンドウを作成する。
- `debugHelpWindowRect()` — ヘルプウィンドウの矩形領域を返す。
- `onRangeOk()` — 範囲を選択決定した時の処理。
- `onEditCancel()` — 編集をキャンセルした時の処理。
- `refreshHelpWindow()` — ヘルプウィンドウのテキストを再描画する。
- `helpText()` — ヘルプテキスト（操作方法の説明など）を返す。

### Scene_Battle ⭐

戦闘画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Battle**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — 戦闘画面の各種ウィンドウやスプライト（背景・バトラー等）を作成する。
- `start()` — シーンを開始し、戦闘開始エフェクト（ワイプ等）を実行する。
- `update()` — 毎フレーム更新する。
- `updateVisibility()` — 表示切り替え（メニューやメッセージ表示時のUI非表示など）を更新する。
- `updateBattleProcess()` — 戦闘の進行（BattleManagerの更新）を処理する。
- `isTimeActive()` — TPB（タイムプログレスバトル）で時間が進行中かを確認する。
- `isAnyInputWindowActive()` — コマンド入力系のウィンドウがアクティブかを確認する。
- `changeInputWindow()` — 現在行動入力中のアクターに合わせてコマンドウィンドウを切り替える。
- `stop()` — シーンを停止する。
- `terminate()` — シーン終了処理を行う。
- `shouldAutosave()` — オートセーブを実行すべきかを確認する（戦闘勝利後など）。
- `needsSlowFadeOut()` — 終了時にゆっくりフェードアウトするかを確認する。
- `updateLogWindowVisibility()` — バトルログウィンドウの表示/非表示を更新する。
- `updateStatusWindowVisibility()` — ステータスウィンドウの表示/非表示を更新する。
- `shouldOpenStatusWindow()` — ステータスウィンドウを開くべきかを確認する。
- `updateStatusWindowPosition()` — ステータスウィンドウの位置（コマンド入力時は右、以外は中央など）を更新する。
- `statusWindowX()` — ステータスウィンドウの目標X座標を計算する。
- `updateInputWindowVisibility()` — 入力ウィンドウの表示/非表示を更新する。
- `needsInputWindowChange()` — 入力ウィンドウの切り替えが必要かを確認する。
- `updateCancelButton()` — キャンセルボタンの表示状態を更新する。
- `createDisplayObjects()` — スプライトセットとウィンドウレイヤーを作成する。
- `createSpriteset()` — `Spriteset_Battle` を作成する。
- `createAllWindows()` — バトルUIの全ウィンドウを作成する。
- `createLogWindow()` — バトルログウィンドウを作成する。
- `logWindowRect()` — バトルログウィンドウの矩形領域を返す。
- `createStatusWindow()` — パーティステータスウィンドウを作成する。
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す。
- `createPartyCommandWindow()` — パーティコマンド（戦う/逃げる）ウィンドウを作成する。
- `partyCommandWindowRect()` — パーティコマンドウィンドウの矩形領域を返す。
- `createActorCommandWindow()` — アクターコマンド（攻撃/スキル等）ウィンドウを作成する。
- `actorCommandWindowRect()` — アクターコマンドウィンドウの矩形領域を返す。
- `createHelpWindow()` — ヘルプウィンドウを作成する。
- `helpWindowRect()` — ヘルプウィンドウの矩形領域を返す。
- `createSkillWindow()` — スキル選択ウィンドウを作成する。
- `skillWindowRect()` — スキル選択ウィンドウの矩形領域を返す。
- `createItemWindow()` — アイテム選択ウィンドウを作成する。
- `itemWindowRect()` — アイテム選択ウィンドウの矩形領域を返す。
- `createActorWindow()` — 対象アクター選択ウィンドウを作成する。
- `actorWindowRect()` — アクター選択ウィンドウの矩形領域を返す。
- `createEnemyWindow()` — 対象エネミー選択ウィンドウを作成する。
- `enemyWindowRect()` — エネミー選択ウィンドウの矩形領域を返す。
- `helpAreaTop()` — ヘルプ領域の上端Y座標を返す。
- `helpAreaBottom()` — ヘルプ領域の下端Y座標を返す。
- `helpAreaHeight()` — ヘルプ領域の高さを返す。
- `buttonAreaTop()` — ボタン領域の上端Y座標を返す。
- `windowAreaHeight()` — ウィンドウ領域全体の高さを返す。
- `createButtons()` — タッチUIボタンを作成する。
- `createCancelButton()` — キャンセルボタンを作成する。
- `closeCommandWindows()` — すべてのコマンド選択ウィンドウを閉じる。
- `hideSubInputWindows()` — スキルやアイテムなどサブ入力用ウィンドウを非表示にする。
- `startPartyCommandSelection()` — パーティコマンドの選択を開始する。
- `commandFight()` — パーティコマンド「戦う」選択時の処理。
- `commandEscape()` — パーティコマンド「逃げる」選択時の処理。
- `startActorCommandSelection()` — アクターコマンドの選択を開始する。
- `commandAttack()` — アクターコマンド「攻撃」選択時の処理。
- `commandSkill()` — アクターコマンド「スキル」選択時の処理（スキルウィンドウ表示）。
- `commandGuard()` — アクターコマンド「防御」選択時の処理。
- `commandItem()` — アクターコマンド「アイテム」選択時の処理（アイテムウィンドウ表示）。
- `commandCancel()` — アクターコマンドキャンセル時の処理（前のキャラに戻る、またはパーティコマンドに戻る）。
- `selectNextCommand()` — 次のアクターへのコマンド入力へ進む。
- `selectPreviousCommand()` — 前のアクターのコマンド入力へ戻る。
- `startActorSelection()` — 全体/単体回復等のためのアクター選択ウィンドウを開く。
- `onActorOk()` — アクターを選択決定した時の処理。
- `onActorCancel()` — アクター選択をキャンセルした時の処理。
- `startEnemySelection()` — 攻撃等のためのエネミー選択ウィンドウを開く。
- `onEnemyOk()` — エネミーを選択決定した時の処理。
- `onEnemyCancel()` — エネミー選択をキャンセルした時の処理。
- `onSkillOk()` — スキルを選択決定した時の処理。
- `onSkillCancel()` — スキル選択をキャンセルした時の処理。
- `onItemOk()` — アイテムを選択決定した時の処理。
- `onItemCancel()` — アイテム選択をキャンセルした時の処理。
- `onSelectAction()` — 行動（攻撃・スキル・アイテム）と対象が決定された時の確定処理。
- `endCommandSelection()` — 全員のコマンド入力が完了した後の処理。

### Scene_Gameover

ゲームオーバー画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Gameover**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `create()` — ゲームオーバー画面を作成する（背景画像等）。
- `start()` — シーンを開始する。
- `update()` — 毎フレーム更新する。
- `stop()` — シーンを停止する。
- `terminate()` — 終了処理を行う。
- `playGameoverMusic()` — ゲームオーバー用のME（ミュージックエフェクト）を再生する。
- `createBackground()` — 背景となるゲームオーバー画像を作成する。
- `adjustBackground()` — 背景画像のサイズ・位置を画面に合わせる。
- `isTriggered()` — 決定ボタンや画面タッチがされたかを確認する。
- `gotoTitle()` — タイトル画面に遷移する。

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
- `processTouch()` — タッチ・クリック等の入力を処理する。
- `isPressed()` — スプライトが押下されているかを確認する。
- `isClickEnabled()` — クリック操作が有効かを確認する（透明でないか等）。
- `isBeingTouched()` — 現在タッチされている最中かを確認する。
- `hitTest(x, y)` — 指定座標がスプライトの矩形内にあるかを判定する。
- `onMouseEnter()` — マウスカーソルが乗った（ホバー）時のコールバック。
- `onMouseExit()` — マウスカーソルが外れた時のコールバック。
- `onPress()` — 押下（プレス）された時のコールバック。
- `onClick()` — クリック（またはタップ）された時のコールバック。

### Sprite_Button

ボタン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Button**


#### インスタンスメソッド

- `initialize(buttonType)` — 指定されたボタンタイプ（cancel, pageup等）で初期化する。
- `setupFrames()` — ボタン画像内の通常時・押下時の位置フォーマットをセットアップする。
- `blockWidth()` — ボタン画像の1ブロック分の幅を返す。
- `blockHeight()` — ボタン画像の1ブロック分の高さを返す。
- `loadButtonImage()` — ボタン用のシステム画像（system/ButtonSet）を読み込む。
- `buttonData()` — 各ボタンタイプの画像上の座標情報データを返す。
- `update()` — 毎フレーム更新する。
- `checkBitmap()` — 画像のローディング完了をチェックし、完了ならフレームを設定する。
- `updateFrame()` — 押下状態などに合わせて描画フレーム（通常/押下）を更新する。
- `updateOpacity()` — ボタンの有効/無効状態等に応じて不透明度を更新する。
- `setColdFrame(x, y, width, height)` — 通常時（非押下）の切り出し矩形を設定する。
- `setHotFrame(x, y, width, height)` — 押下時の切り出し矩形を設定する。
- `setClickHandler(method)` — クリックされた時に実行されるコールバック関数を設定する。
- `onClick()` — クリック時に設定されたハンドラを実行する。

### Sprite_Character ⭐

キャラクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Character**


#### インスタンスメソッド

- `initialize(character)` — 指定されたキャラクター（Game_CharacterBase等）で初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `setCharacter(character)` — 描画対象のキャラクターオブジェクトを設定する。
- `checkCharacter(character)` — キャラクターオブジェクトが変更されたかチェックする。
- `update()` — 毎フレーム更新する。
- `updateVisibility()` — 透明状態に応じて表示/非表示を更新する。
- `isTile()` — キャラクター画像がタイルセットのものかを確認する。
- `isObjectCharacter()` — ファイル名が'!'から始まるオブジェクト系かを確認する。
- `isEmptyCharacter()` — キャラクター画像やタイルが空（なし）かを確認する。
- `tilesetBitmap(tileId)` — タイルIDから対応するタイルセット画像のBitmapを返す。
- `updateBitmap()` — キャラクターの画像名が変更された場合にBitmapを再ロードする。
- `isImageChanged()` — 画像名やインデックスが変更されたかを確認する。
- `setTileBitmap()` — タイル用のBitmapおよびフレームを設定する。
- `setCharacterBitmap()` — キャラクター歩行グラフィック等のBitmapを設定する。
- `updateFrame()` — キャラクターの向き・足踏みに合わせて切り出しフレームを更新する。
- `updateTileFrame()` — タイル画像の切り出しフレームを更新する。
- `updateCharacterFrame()` — 歩行グラフィックの切り出しフレームを更新する。
- `characterBlockX()` — 歩行グラフィック集合画像内のXブロック位置（0〜3）を返す。
- `characterBlockY()` — 歩行グラフィック集合画像内のYブロック位置（0〜1）を返す。
- `characterPatternX()` — 向き・パターンに基づくXフレームインデックスを返す。
- `characterPatternY()` — 向き・パターンに基づくYフレームインデックスを返す。
- `patternWidth()` — 1パターン（1キャラ分）の幅を返す。
- `patternHeight()` — 1パターン（1キャラ分）の高さを返す。
- `updateHalfBodySprites()` — 茂み属性（半透明表示）用の下半身スプライトを更新する。
- `createHalfBodySprites()` — 茂み表示用の下半身スプライトを作成する。
- `updatePosition()` — 画面座標およびZ座標（重ね合わせ順）を更新する。
- `updateOther()` — アニメーションやフキダシアイコン、不透明度などを更新する。

### Sprite_Battler ⭐

Sprite_ActorとSprite_Enemyのスーパークラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Battler**


#### インスタンスメソッド

- `initialize(battler)` — 指定されたバトラー（Game_Battler）で初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `setBattler(battler)` — 描画対象のバトラーオブジェクトを設定する。
- `checkBattler(battler)` — 対象バトラーが変更されていれば正しくセットする。
- `mainSprite()` — バトラー本体の画像を表示するメインスプライトを返す。
- `setHome(x, y)` — バトラーの定位置（ホームポジション）を設定する。
- `update()` — 毎フレーム更新する。
- `updateVisibility()` — 隠れ状態や戦闘不能などに合わせて表示/非表示を更新する。
- `updateMain()` — メインスプライト（バトラー画像部分）を更新する。
- `updateBitmap()` — バトラーのグラフィック変更に合わせてBitmapを更新する。
- `updateFrame()` — 切り出しフレームを更新する（サブクラスで実装）。
- `updateMove()` — 攻撃時などのステップ移動を更新する。
- `updatePosition()` — 画面座標を更新する。
- `updateDamagePopup()` — ダメージポップアップの生成・更新を行う。
- `updateSelectionEffect()` — ターゲット選択時の点滅エフェクトなどを更新する。
- `setupDamagePopup()` — バトラーのダメージ予約があれば新しいポップアップを作成する。
- `createDamageSprite()` — ダメージ処理用のポップアップスプライトを作成する。
- `destroyDamageSprite(sprite)` — 再生終了したダメージポップアップを破棄する。
- `damageOffsetX()` — ダメージポップアップのX座標のオフセット。
- `damageOffsetY()` — ダメージポップアップのY座標のオフセット。
- `startMove(x, y, duration)` — 目標座標への移動（ステップ）を開始する。
- `onMoveEnd()` — 移動が終了した時のコールバック。
- `isEffecting()` — アニメーションやポップアップなどのエフェクト再生中かを確認する。
- `isMoving()` — 目標座標に向けて移動中かを確認する。
- `inHomePosition()` — バトラーが定位置（ホームポジション）にいるかを確認する。
- `onMouseEnter()` — マウスカーソルがバトラー上に重なった時、ターゲットに選ぶ（ホバー）。
- `onPress()` — 押し続けられた時のコールバック。
- `onClick()` — クリック（タップ）された時、ターゲット選択決定を行う。

### Sprite_Actor ⭐

アクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Actor**


#### インスタンスメソッド

- `initialize(battler)` — 初期化し、各種パーツスプライトを作成する。
- `initMembers()` — メンバ変数を初期化する。
- `mainSprite()` — 武器・状態異常などをまとめる親となるメインスプライトを返す。
- `createMainSprite()` — メインスプライトを作成する。
- `createShadowSprite()` — 足元の影スプライトを作成する。
- `createWeaponSprite()` — 武器の攻撃アニメーション用スプライトを作成する。
- `createStateSprite()` — 状態異常アイコン用スプライト（Sprite_StateIcon）を作成する。
- `setBattler(battler)` — 対象となるアクターオブジェクトを設定する。
- `moveToStartPosition()` — 戦闘開始時、画面外から初期位置（ホーム）へ移動開始する。
- `setActorHome(index)` — パーティ内インデックスからホームポジションを計算して設定する。
- `update()` — 毎フレーム更新する。
- `updateShadow()` — 足元の影の表示を更新する。
- `updateMain()` — アクター本体の画像・状態を更新する。
- `setupMotion()` — 攻撃・魔法・ダメージなどのモーションをセットアップする。
- `setupWeaponAnimation()` — 武器を振るアニメーションの開始をセットアップする。
- `startMotion(motionType)` — 指定されたモーション（'walk', 'wait', 'attack' 等）を開始する。
- `updateTargetPosition()` — 移動目標位置に向かっている最中か更新する。
- `shouldStepForward()` — アクション実行前に一歩前へ出るべきかを確認する。
- `updateBitmap()` — アクター画像（[sv]アクター等）のBitmapを更新する。
- `updateFrame()` — モーションに基づく切り出しフレーム（セル）を更新する。
- `updateMove()` — ステップ移動などの座標更新を行う。
- `updateMotion()` — モーション進行の処理（ループや単発終了など）を更新する。
- `updateMotionCount()` — モーション進行のフレームカウンタを更新する。
- `motionSpeed()` — モーションの基本再生速度（12）を返す。
- `refreshMotion()` — バトラーの状態（ステート・HP等）から適切なモーションを再設定する。
- `startEntryMotion()` — 戦闘開始時の入場モーション（歩いて定位置に就く等）を開始する。
- `stepForward()` — アクション開始時などに一歩前進する移動処理を行う。
- `stepBack()` — 定位置に戻る移動処理を行う。
- `retreat()` — 逃走時の後退処理を行う。
- `onMoveEnd()` — 移動終了後、リフレッシュ等を行うコールバック。
- `damageOffsetX()` — アクター側のダメージポップアップXオフセット（-32）。
- `damageOffsetY()` — アクター側のダメージポップアップYオフセット（0）。

### Sprite_Enemy ⭐

敵キャラクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Enemy**


#### インスタンスメソッド

- `initialize(battler)` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `createStateIconSprite()` — 敵の上部に表示する状態異常アイコン（Sprite_StateIcon）を作成する。
- `setBattler(battler)` — 対象のエネミーオブジェクトを設定する。
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — エネミー画像と色相変更を合わせたBitmapを生成・更新する。
- `loadBitmap(name)` — 指定された名前のエネミー画像をロードする。
- `setHue(hue)` — 画像の色相（Hue）を設定する。
- `updateFrame()` — エネミーの切り出し領域（基本は全体）を更新する。
- `updatePosition()` — ホーム座標に戻ったり、揺れエフェクト等に合わせて座標を更新する。
- `updateStateSprite()` — 状態異常アイコンスプライトの位置（敵の頭上など）を更新する。
- `initVisibility()` — 最初から出現しているか隠れているかで可視状態を初期化する。
- `setupEffect()` — フラッシュや消滅などのエフェクトをセットアップする。
- `startEffect(effectType)` — 出現・消滅等のエフェクトを開始する。
- `startAppear()` — フェードインで出現するエフェクトを開始する。
- `startDisappear()` — フェードアウトで消滅（逃走など）するエフェクトを開始する。
- `startWhiten()` — 敵にダメージを与えた際の白フラッシュ（Whiten）を開始する。
- `startBlink()` — 状態異常時などの点滅エフェクトを開始する。
- `startCollapse()` — 通常の戦闘不能エフェクト（下に向かって縮む等）を開始する。
- `startBossCollapse()` — ボス用戦闘不能エフェクトを開始する。
- `startInstantCollapse()` — アニメーション等なしで即座に消滅する処理を開始する。
- `updateEffect()` — エフェクト（白フラッシュ・点滅・消滅等）の進行を更新する。
- `isEffecting()` — アニメーションや白フラッシュなどのエフェクト再生中かを確認する。
- `revertToNormal()` — エフェクト完了時に不透明度・色調などを通常に戻す。
- `updateWhiten()` — 白フラッシュのフェード処理を更新する。
- `updateBlink()` — 点滅のフェード処理を更新する。
- `updateAppear()` — 出現のフェード処理を更新する。
- `updateDisappear()` — 消滅のフェード処理を更新する。
- `updateCollapse()` — 通常消滅（崩れ）のエフェクト処理を更新する。
- `updateBossCollapse()` — ボス消滅のエフェクト処理を更新する。
- `updateInstantCollapse()` — 即座の消滅処理（透明にするだけ等）を行う。
- `damageOffsetX()` — エネミー側のダメージポップアップXオフセット（0）。
- `damageOffsetY()` — エネミー側のダメージポップアップYオフセット（-8）。

### Sprite_Animation

アニメーション表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Animation**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `destroy(options)` — スプライトを破棄する。
- `update()` — 毎フレーム更新する。
- `canStart()` — アニメーションデータや画像が全てロードされ、再生開始できる状態かを確認する。
- `shouldWaitForPrevious()` — 先行するアニメーションの終了を待つべきかを確認する。
- `updateEffectGeometry()` — エフェクト（Effekseer）の座標や拡大率などを更新する。
- `updateMain()` — アニメーションの進行（フレーム数）を更新する。
- `processSoundTimings()` — 現在のフレームに設定された効果音（SE）を再生する。
- `processFlashTimings()` — 現在のフレームに設定された画面・対象のフラッシュを実行する。
- `checkEnd()` — アニメーションの再生が完了したかを確認し、完了なら自身を削除する。
- `updateFlash()` — ターゲットのフラッシュ状態（色と不透明度）を更新する。
- `isPlaying()` — アニメーションが再生中かを確認する。
- `setRotation(x, y, z)` — エフェクトの回転角を設定する。
- `setProjectionMatrix(renderer)` — 3D描画用のプロジェクション行列を設定する。
- `setCameraMatrix(/*renderer*/)` — カメラ行列を設定する。
- `setViewport(renderer)` — 描画のビューポート（画面上の描画領域）を設定する。
- `targetPosition(renderer)` — 対象スプライトの画面中心座標などを計算して返す。
- `targetSpritePosition(sprite)` — 指定したスプライトの基準座標を返す。
- `resetViewport(renderer)` — ビューポートをリセットする。
- `onBeforeRender(renderer)` — 描画前のコールバック（MV互換用等）。
- `onAfterRender(renderer)` — 描画後のコールバック（ステートのリセット等）。

### Sprite_AnimationMV

旧フォーマット(MV形式)のアニメーション表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_AnimationMV**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `setupRate()` — アニメーションの更新レート（4フレームに1回等）をセットアップする。
- `setupDuration()` — アニメーションの総再生フレーム数を計算してセットアップする。
- `update()` — 毎フレーム更新し、セル画像やフラッシュを処理する。
- `updateFlash()` — 対象のフラッシュ（色や不透明度）を更新する。
- `updateScreenFlash()` — 画面全体のフラッシュ処理を更新する。
- `absoluteX()` — 画面上の絶対X座標を計算する。
- `absoluteY()` — 画面上の絶対Y座標を計算する。
- `updateHiding()` — 対象を一時的に非表示（消去エフェクト時等）にしている場合の更新処理。
- `isPlaying()` — アニメーションが再生中かを確認する。
- `loadBitmaps()` — 使用するアニメーション画像（1と2）をロードする。
- `isReady()` — 全ての画像がロード完了しているかを確認する。
- `createCellSprites()` — セル画像を描画するための子スプライト群（16個）を作成する。
- `createScreenFlashSprite()` — 画面フラッシュ用のスプライトを作成する。
- `updateMain()` — アニメーションの進行（フレーム進行、タイミングコマンド実行など）を行う。
- `updatePosition()` — 対象に合わせた座標の追従や画面位置の調整を行う。
- `updateFrame()` — 現在の進行度から現在のアニメーションフレームインデックスを決定する。
- `currentFrameIndex()` — 現在表示すべきアニメーションフレームの番号を返す。
- `updateAllCellSprites(frame)` — 現在のフレームデータに基づいて全てのセルスプライトを更新する。
- `updateCellSprite(sprite, cell)` — 1つのセルスプライトの画像切り出し、座標、拡大率、不透明度などを更新する。
- `processTimingData(timing)` — SEの再生やフラッシュなどのタイミングデータを実行する。
- `startFlash(color, duration)` — 対象のフラッシュを開始する。
- `startScreenFlash(color, duration)` — 画面全体のフラッシュを開始する。
- `startHiding(duration)` — 対象を非表示にするエフェクトを開始する。
- `onEnd()` — 再生終了時のコールバック（自身やフラッシュスプライトの破棄）。

### Sprite_Battleback

戦闘背景画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `TilingSprite` → **Sprite_Battleback**


#### インスタンスメソッド

- `initialize(type)` — 初期化し、背景のタイプ（床か壁か等）を設定する。
- `adjustPosition()` — 画面サイズや揺れエフェクトに合わせて背景位置を調整する。
- `battleback1Bitmap()` — バトル背景1（床・下部）のBitmapを生成・ロードする。
- `battleback2Bitmap()` — バトル背景2（壁・上部）のBitmapを生成・ロードする。
- `battleback1Name()` — マップや指定に応じたバトル背景1のファイル名を返す。
- `battleback2Name()` — マップや指定に応じたバトル背景2のファイル名を返す。
- `overworldBattleback1Name()` — フィールド（オーバーワールド）時のバトル背景1ファイル名を返す。
- `overworldBattleback2Name()` — フィールド時のバトル背景2ファイル名を返す。
- `normalBattleback1Name()` — 通常マップ時のバトル背景1ファイル名を返す。
- `normalBattleback2Name()` — 通常マップ時のバトル背景2ファイル名を返す。
- `terrainBattleback1Name(type)` — 地形タグに応じたバトル背景1ファイル名を返す。
- `terrainBattleback2Name(type)` — 地形タグに応じたバトル背景2ファイル名を返す。
- `defaultBattleback1Name()` — デフォルト（他が該当しない時）のバトル背景1ファイル名を返す。
- `defaultBattleback2Name()` — デフォルトのバトル背景2ファイル名を返す。
- `shipBattleback1Name()` — 船に乗っている時のバトル背景1ファイル名を返す。
- `shipBattleback2Name()` — 船に乗っている時のバトル背景2ファイル名を返す。
- `autotileType(z)` — マップ座標からオートタイルの種類を取得する（背景決定用）。

### Sprite_Damage

ダメージポップアップ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Damage**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — スプライトを破棄する。
- `setup(target)` — 対象のバトラーからダメージ結果等を受け取り表示準備をする。
- `setupCriticalEffect()` — クリティカル時のエフェクト（フラッシュ等）を予約する。
- `fontFace()` — ダメージ数字に使用するフォント名を返す。
- `fontSize()` — ダメージ数字のフォントサイズを返す。
- `damageColor()` — ダメージのテキスト色を返す（回復は緑、その他は白など）。
- `outlineColor()` — ダメージテキストの縁取りの色を返す。
- `outlineWidth()` — ダメージテキストの縁取りの太さを返す。
- `createMiss()` — 回避時の「Miss」文字スプライトを作成する。
- `createDigits(value)` — ダメージ数値の各桁のスプライトを作成・並べる。
- `createChildSprite(width, height)` — 数字や文字を描画する子スプライトを作成する。
- `createBitmap(width, height)` — 数字や文字を描画するためのBitmapを作成する。
- `update()` — 毎フレーム更新し、上に浮かぶアニメーションなどを処理する。
- `updateChild(sprite)` — 各子スプライト（数字の各桁等）の遅延表示・跳ね返り座標を更新する。
- `updateFlash()` — 会心の一撃による赤フラッシュを更新する。
- `updateOpacity()` — 再生終盤に合わせて不透明度を下げ、フェードアウトさせる。
- `isPlaying()` — ダメージポップアップが再生中かを確認する。

### Sprite_Gauge ⭐

ステータスゲージ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Gauge**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `destroy(options)` — スプライトと生成したBitmapを破棄する。
- `createBitmap()` — ゲージやラベルを描画するためのBitmapを作成する。
- `bitmapWidth()` — スプライト（ゲージ領域全体）の幅を返す。
- `bitmapHeight()` — スプライト（ゲージ領域全体）の高さを返す。
- `textHeight()` — テキスト部分の基準高さを返す。
- `gaugeHeight()` — ゲージバー本体の高さを返す。
- `gaugeX()` — ゲージバーを描画開始するX座標を返す。
- `labelY()` — ラベルや数値を描画するY座標を返す。
- `labelFontFace()` — ラベルテキストに使用するフォント名を返す。
- `labelFontSize()` — ラベルテキストのフォントサイズを返す。
- `valueFontFace()` — 数値テキストに使用するフォント名を返す。
- `valueFontSize()` — 数値テキストのフォントサイズを返す。
- `setup(battler, statusType)` — 指定されたバトラーとゲージ種類（'hp', 'mp', 'tp', 'time'）でセットアップする。
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — 値の変動等があればBitmapを再描画する。
- `updateTargetValue(value, maxValue)` — 現在目標とする値・最大値を更新し、なめらかな増減の準備をする。
- `smoothness()` — 値の変動が追いつくまでの滑らかさ（遅延フレーム数）を返す。
- `updateGaugeAnimation()` — ゲージの現在表示値を目標値に向けて徐々に近づける。
- `updateFlashing()` — TPフル等でのゲージ点滅色を更新する。
- `flashingColor1()` — 点滅開始側の色を返す。
- `flashingColor2()` — 点滅終了側の色を返す。
- `isValid()` — 対象バトラーが存在し、値が正常に取得できるかを確認する。
- `currentValue()` — 現在の対象値（HP・MP等）の現在値を返す。
- `currentMaxValue()` — 現在の対象値（HP・MP等）の最大値を返す。
- `label()` — ゲージのラベル文字（「HP」等のシステム用語）を返す。
- `gaugeBackColor()` — ゲージの背景（空き部分）の色を返す。
- `gaugeColor1()` — ゲージのグラデーション開始色を返す。
- `gaugeColor2()` — ゲージのグラデーション終了色を返す。
- `labelColor()` — ラベルテキストの文字色を返す（システムカラー等）。
- `labelOutlineColor()` — ラベルテキストの縁取り色を返す。
- `labelOutlineWidth()` — ラベルのアウトラインの太さを返す。
- `valueColor()` — 数値テキストの文字色を返す（ピンチ時は赤など）。
- `valueOutlineColor()` — 数値テキストの縁取り色を返す。
- `valueOutlineWidth()` — 数値のアウトラインの太さを返す。
- `redraw()` — 全体をクリアし、ゲージ・ラベル・数値を再描画する。
- `drawGauge()` — ゲージの背景と現在値バーのグラデーションを描画する。
- `drawGaugeRect(x, y, width, height)` — 指定矩形にゲージバーを描画する。
- `gaugeRate()` — ゲージの割合（0.0 〜 1.0）を返す。
- `drawLabel()` — ゲージの種類名（「HP」等）を描画する。
- `setupLabelFont()` — Bitmapのコンテキストにラベル用フォント設定を適用する。
- `measureLabelWidth()` — 描画予定のラベルの幅（ピクセル数）を計測して返す。
- `labelOpacity()` — ラベルの不透明度を返す（通常は不透明か半透明）。
- `drawValue()` — 現在値および最大値の数値を右に寄せて描画する。
- `setupValueFont()` — Bitmapのコンテキストに数値用フォント設定を適用する。

### Sprite_Name

名前表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Name**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `destroy(options)` — スプライトと生成したBitmapを破棄する。
- `createBitmap()` — 名前を描画するためのBitmapを作成する。
- `bitmapWidth()` — 文字列を描画する領域の幅（300等）を返す。
- `bitmapHeight()` — 文字列を描画する領域の高さを返す。
- `fontFace()` — テキストに使用するフォント名を返す。
- `fontSize()` — テキストのフォントサイズを返す。
- `setup(battler)` — 描画対象のバトラーをセットアップする。
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — アクター名が変更された等の理由で再描画が必要であればBitmapを更新する。
- `name()` — 描画する対象の「名前」を返す。
- `textColor()` — 名前の文字色を返す（通常はシステムカラー）。
- `outlineColor()` — 名前の縁取り色を返す。
- `outlineWidth()` — 名前の縁取り色の太さを返す。
- `redraw()` — 全体をクリアし、名前を再描画する。
- `setupFont()` — Bitmapのコンテキストにフォント設定を適用する。

### Sprite_StateIcon

ステートアイコン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_StateIcon**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `loadBitmap()` — アイコン画像セット（IconSet）のBitmapをロードする。
- `setup(battler)` — 対象バトラーをセットアップする。
- `update()` — 毎フレーム更新し、アイコンをアニメーション表示させる。
- `animationWait()` — 次のステートアイコンに切り替わるまでのウェイトフレーム数（40）を返す。
- `updateIcon()` — 定期的に表示インデックスを進め、描画対象のアイコンIDを更新する。
- `shouldDisplay()` — 死亡しておらずステートが存在するなど、アイコンを表示すべきかを確認する。
- `updateFrame()` — タイマー等に基づくフェード効果や、アイコン画像からの切り出しフレームを更新する。

### Sprite_StateOverlay

ステートのオーバーレイ画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_StateOverlay**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `loadBitmap()` — ステートのオーバーレイ用画像セット（system/States）をロードする。
- `setup(battler)` — 対象バトラーをセットアップする。
- `update()` — 毎フレーム更新し、アニメーションパターンの切り替え等を行う。
- `animationWait()` — 1パターンの表示フレーム数（8）を返す。
- `updatePattern()` — タイマー等に基づいてオーバーレイアニメのパターン（描画インデックス）を進める。
- `updateFrame()` — 描画対象のステートに応じて、画像からの切り出し領域を設定する。

### Sprite_Weapon

攻撃時の武器画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Weapon**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `setup(weaponImageId)` — 指定された武器画像IDでセットアップする。
- `update()` — 毎フレーム更新し、アニメーション（振り）パターンの切り替え等を行う。
- `animationWait()` — 1パターンの表示ウェイト数（基準速度などに基づく）を返す。
- `updatePattern()` — ウェイト完了ごとに武器振りのパターン（0→1→2等）を進める。
- `loadBitmap()` — 武器画像素材（system/Weapons 等）をロードする。
- `updateFrame()` — パターンや武器のインデックスに応じて切り出しフレームと座標を更新する。
- `isPlaying()` — 武器振りアニメーションが再生中かを確認する。

### Sprite_Balloon

フキダシアイコン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Balloon**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `initMembers()` — メンバ変数を初期化する。
- `loadBitmap()` — フキダシ画像データ（system/Balloon）をロードする。
- `setup(targetSprite, balloonId)` — 対象スプライトとフキダシIDを指定してセットアップする。
- `update()` — 毎フレーム更新し、アニメーションの進行や座標の追従を行う。
- `updatePosition()` — 対象スプライトの頭上に配置されるよう座標を更新する。
- `updateFrame()` — 現在のパターンに応じて切り出し領域（フレーム）を更新する。
- `speed()` — アニメーションの基本速度（8等）を返す。
- `waitTime()` — アニメーション終了前のウェイトフレーム数（12等）を返す。
- `frameIndex()` — フレーム経過時間から現在のパターン（0〜7）を計算して返す。
- `isPlaying()` — フキダシ表示が再生中かを確認する。

### Sprite_Picture

ピクチャ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Picture**


#### インスタンスメソッド

- `initialize(pictureId)` — 指定されたピクチャIDで初期化する。
- `picture()` — 対応する `Game_Picture` オブジェクトを返す。
- `update()` — 毎フレーム更新する。
- `updateBitmap()` — 表示画像名が変わった場合に画像を再ロードする。
- `updateOrigin()` — `Game_Picture` の設定に応じて原点（左上か中央か）を更新する。
- `updatePosition()` — 画面座標を更新する。
- `updateScale()` — 拡大率（X・Y）を更新する。
- `updateTone()` — 色調（Tone）および合成方法を更新する。
- `updateOther()` — 回転角や不透明度を更新する。
- `loadBitmap()` — 対象のピクチャ画像（pictures/）をロードする。

### Sprite_Timer

タイマー表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Timer**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — スプライトと生成したBitmapを破棄する。
- `createBitmap()` — タイマー文字を描画するためのBitmapを作成する。
- `fontFace()` — テキストに使用するフォント名を返す。
- `fontSize()` — タイマーテキストのフォントサイズを返す。
- `update()` — 毎フレーム更新し、画面のタイマー表示状態を反映する。
- `updateBitmap()` — `Game_Timer` からの秒数がかわっていれば再描画する。
- `redraw()` — 全体をクリアし、タイマー文字列を描画する。
- `timerText()` — 「MM:SS」形式のタイマー文字列を返す。
- `updatePosition()` — 画面上部等への座標更新を行う。
- `updateVisibility()` — `Game_Timer` が作動中か否かで表示フラグを更新する。

### Sprite_Destination

タッチ入力の目的地表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Destination**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — スプライトと生成したBitmapを破棄する。
- `update()` — 毎フレーム更新し、枠の拡大・不透明度の変化を行う。
- `createBitmap()` — マス目サイズの四角い目的地枠を描画・作成する。
- `updatePosition()` — `$gameTemp` に設定された目的地へ座標を更新する。
- `updateAnimation()` — 不透明度や拡大アニメーションの進行（フレームによる変化）を更新する。

### Spriteset_Base ⭐

Spriteset_MapとSpriteset_Battleのスーパークラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Spriteset_Base**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — アニメーション群など子要素を含めて破棄する。
- `loadSystemImages()` — UI等で共通使用されるシステム画像を事前ロードする（Window等）。
- `createLowerLayer()` — ベーススプライト等、下位レイヤー要素を作成する。
- `createUpperLayer()` — ピクチャやタイマー等、上位レイヤー要素を作成する。
- `update()` — 毎フレーム更新する。
- `createBaseSprite()` — アニメーションや天候等を載せるためのベーススプライトコンテナを作成する。
- `createBaseFilters()` — マップやバトル全体にかかるベースフィルター群を作成・適用する。
- `createPictures()` — ピクチャ表示用のコンテナスプライトと `Sprite_Picture` 群を作成する。
- `pictureContainerRect()` — ピクチャコンテナのはみ出し防止用などの矩形領域を返す。
- `createTimer()` — タイマー用の `Sprite_Timer` を作成する。
- `createOverallFilters()` — 画面全体を覆うフィルターを作成する。
- `updateBaseFilters()` — カラーフィルター等の更新を行う。
- `updateOverallFilters()` — 画面全体枠のカラーフィルター等を更新する。
- `updatePosition()` — 画面の揺れ等に合わせてベーススプライトの座標を更新する。
- `findTargetSprite(/*target*/)` — アニメーション等の対象となるスプライトを検索する。
- `updateAnimations()` — 再生中のアニメーションリストを更新（終了したものを削除）する。
- `processAnimationRequests()` — リクエストのキューに積まれたアニメーションの再生処理を開始する。
- `createAnimation(request)` — 新しい `Sprite_Animation` (または MV互換用) を作成してリストに登録する。
- `isMVAnimation(animation)` — アニメデータがMV以前の形式かどうかを確認する。
- `makeTargetSprites(targets)` — 与えられた対象から実際のスプライトインスタンス配列を生成する。
- `lastAnimationSprite()` — 直前に作成・再生開始したアニメーションスプライトを返す。
- `isAnimationForEach(animation)` — 全体アニメではなく個別に再生するタイプのアニメ設定かを確認する。
- `animationBaseDelay()` — アニメーション再生開始の基礎的な遅延を返す。
- `animationNextDelay()` — 複数ターゲット時、次ターゲットへのアニメーション再生までの遅延を返す。
- `animationShouldMirror(target)` — 敵への再生など、必要であればアニメーションを反転させるか確認する。
- `removeAnimation(sprite)` — 再生終了したアニメーションスプライトをリストから削除・破棄する。
- `removeAllAnimations()` — 現在再生中のすべてのアニメーションを削除・破棄する。
- `isAnimationPlaying()` — いずれかのアニメーションが再生中かを確認する。

### Spriteset_Map ⭐

マップ画面のスプライトセット。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Map**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `destroy(options)` — 破棄する。
- `loadSystemImages()` — タイルセットや遠景などシステム画像をロードする。
- `createLowerLayer()` — ベーススプライト等、下位レイヤー要素を作成する。
- `update()` — 毎フレーム更新する。
- `hideCharacters()` — イベントやプレイヤーなどキャラクター群を一時非表示にする。
- `createParallax()` — 遠景（パララックス）スプライトを作成する。
- `createTilemap()` — タイルマップを管理・描画する `Tilemap` オブジェクトを作成する。
- `loadTileset()` — 現在のマップのタイルセット画像群をロードする。
- `createCharacters()` — イベントやプレイヤーのスプライト群を作成する。
- `createShadow()` — 飛行時などに表示される影スプライトを作成する。
- `createDestination()` — タッップ時の目的地（`Sprite_Destination`）を作成する。
- `createWeather()` — 天候エフェクト（雨・雪など）を作成する。
- `updateTileset()` — タイルセットの変更があればタイル画像を更新する。
- `updateParallax()` — 遠景のスクロールや画像変更を更新する。
- `updateTilemap()` — タイルマップのアニメーションや座標を更新する。
- `updateShadow()` — 影の座標（プレイヤーに追従等）や透明度を更新する。
- `updateWeather()` — 天候エフェクトのアニメーションを更新する。
- `updateBalloons()` — フキダシアイコンのリストを更新する。
- `processBalloonRequests()` — リクエストキューからフキダシ再生処理を開始する。
- `createBalloon(request)` — 新しいフキダシを生成して対象キャラの上に付与する。
- `removeBalloon(sprite)` — 再生が終了したフキダシをリストから削除する。
- `removeAllBalloons()` — すべてのフキダシを削除する。
- `findTargetSprite(target)` — 指定された対象（キャラ等）に対応するスプライトを検索する。
- `animationBaseDelay()` — アニメーション再生開始の基礎的な遅延を返す。

### Spriteset_Battle ⭐

戦闘画面のスプライトセット。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Battle**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `loadSystemImages()` — 戦闘背景やアクター・敵画像などの事前ロードを行う。
- `createLowerLayer()` — バトル背景、バトラー等を描画する下位レイヤーを作成する。
- `createBackground()` — 画面全体を覆う黒い背景画像を作成する。
- `createBattleback()` — バトル背景（`Sprite_Battleback`）を作成する。
- `createBattleField()` — バトラー等を配置するためのコンテナ（バトルフィールド）を作成する。
- `battleFieldOffsetY()` — バトルフィールドのY座標のオフセット（24等）を返す。
- `update()` — 毎フレーム更新する。
- `updateBattleback()` — バトル背景のスクロールや表示などの状態を更新する。
- `createEnemies()` — 敵キャラクターのスプライト群を作成する。
- `compareEnemySprite(a, b)` — 敵スプライトのYおよびZ座標によるソート順を比較する。
- `createActors()` — パーティメンバー（アクター）のスプライト群を作成する。
- `updateActors()` — パーティメンバーの入れ替えなどに応じてスプライトを更新する。
- `findTargetSprite(target)` — アニメーション対象などとなる特定バトラーのスプライトを検索する。
- `battlerSprites()` — 敵・味方すべてのバトラースプライトを取得する。
- `isEffecting()` — いずれかのバトラーがエフェクト（ダメージ・倒れなど）再生中かを確認する。
- `isAnyoneMoving()` — いずれかのバトラーが移動中かを確認する。
- `isBusy()` — エフェクトや移動が実行中で、進行を待つべき（ビジー）かを確認する。

---

## Windows

ゲーム内UI用の `Window_*` クラス群です。 ( `rmmz_windows.js` )

### Window_Base ⭐

ゲーム内の全ウィンドウのスーパークラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → **Window_Base**


#### インスタンスメソッド

- `initialize(rect)` — 指定された矩形（Rect）でウィンドウを初期化する。
- `destroy(options)` — ウィンドウ内部の要素（コンテンツBitmap等）を破棄する。
- `checkRectObject(rect)` — 渡された矩形オブジェクトが有効かチェックする。
- `lineHeight()` — ウィンドウ内のテキスト1行の標準の高さ（通常36）を返す。
- `itemWidth()` — リスト項目の幅を返す（基本はコンテンツ領域の幅）。
- `itemHeight()` — リスト項目の高さを返す（基本は1行の高さ＋余白）。
- `itemPadding()` — 項目テキストを描画する際の左右の余白（通常8）を返す。
- `baseTextRect()` — テキストを描画可能な基本の矩形領域を返す。
- `loadWindowskin()` — ウィンドウスキン画像（system/Window）をロードする。
- `updatePadding()` — ウィンドウの枠設定に基づきパディング値（通常12など）を更新する。
- `updateBackOpacity()` — ウィンドウ背景の不透明度（通常192）を更新する。
- `fittingHeight(numLines)` — 指定した行数がぴったり収まるウィンドウの高さを計算する。
- `updateTone()` — ウィンドウスキンの色調（システム設定）を更新する。
- `createContents()` — テキストやアイコンを描画するためのコンテンツBitmap（キャンバス）を作成する。
- `destroyContents()` — コンテンツBitmapを破棄し、メモリを解放する。
- `contentsWidth()` — 描画可能なコンテンツ領域の幅を返す（幅－パディング設定値）。
- `contentsHeight()` — 描画可能なコンテンツ領域の高さを返す（高さ－パディング設定値）。
- `resetFontSettings()` — フォント名、サイズ、文字色などを初期状態にリセットする。
- `resetTextColor()` — 文字色を通常のシステムテキストカラー（白など）にリセットする。
- `update()` — 毎フレーム更新（開閉アニメーションなど）を行う。
- `updateOpen()` — ウィンドウを開くフェーズ（オープニング）のアニメーションを更新する。
- `updateClose()` — ウィンドウを閉じるフェーズ（クロージング）のアニメーションを更新する。
- `open()` — ウィンドウを開く（オープニング状態に移行させる）。
- `close()` — ウィンドウを閉じる（クロージング状態に移行させる）。
- `isOpening()` — ウィンドウが開いている途中（徐々に不透明になっている等）かを確認する。
- `isClosing()` — ウィンドウが閉じている途中かを確認する。
- `show()` — ウィンドウを表示状態（可視）にする。
- `hide()` — ウィンドウを非表示状態にする。
- `activate()` — ウィンドウをアクティブ（入力可能）にする。
- `deactivate()` — ウィンドウを非アクティブ（入力無効）にする。
- `systemColor()` — システムカラー（テキストシステムカラー等）を返す。
- `translucentOpacity()` — 半透明状態の不透明度（通常160）を返す。
- `changeTextColor(color)` — 描画文字色を指定のカラーへ変更する。
- `changeOutlineColor(color)` — 描画文字のアウトライン修飾色を変更する。
- `changePaintOpacity(enabled)` — 描画の不透明度を設定する（無効時は半透明など）。
- `drawRect(x, y, width, height)` — 指定矩形の塗りつぶし描画（選択背景等）を行う。
- `drawText(text, x, y, maxWidth, align)` — テキストを描画する。
- `textWidth(text)` — 指定テキストを描画した際のピクセル幅を計算して返す。
- `drawTextEx(text, x, y, width)` — 制御文字（\C[1], \I[2]など）を含むテキストを描画する。
- `textSizeEx(text)` — 制御文字を解析した後の実際の描画サイズ領域を計算して返す。
- `createTextState(text, x, y, width)` — テキスト解析・描画のためのTextStateオブジェクトを生成する。
- `processAllText(textState)` — TextStateに基づき、すべての文字・制御文字を順次描画処理する。
- `flushTextState(textState)` — TextStateに残った文字列を一気に描画してバッファをクリアする。
- `createTextBuffer(rtl)` — 文字を描画前にバッファ・整形するためのTextBufferオブジェクトを生成する。
- `convertEscapeCharacters(text)` — テキスト内の制御文字シーケンス（\V[1], \N[2]等）を事前展開する。
- `actorName(n)` — 指定された引数のアクター名を返す（\N[n]用）。
- `partyMemberName(n)` — パーティ内インデックスのアクター名を返す（\P[n]用）。
- `processCharacter(textState)` — テキストの1文字（または1機能）を描画・処理する。
- `processControlCharacter(textState, c)` — 各種制御文字（C, I, \{, \} など）を実行処理する。
- `processNewLine(textState)` — 改行（\n）時にX座標リセットとY座標加算を行う処理。
- `obtainEscapeCode(textState)` — 制御文字のコードアルファベット部分（'C' 等）を取得する。
- `obtainEscapeParam(textState)` — 制御文字のパラメータ部分（'[1]' の 1 等）を取得する。
- `processEscapeCharacter(code, textState)` — 対象の制御文字コード固有の処理へ分岐する。
- `processColorChange(colorIndex)` — \C[n]によるtextColorの変更処理を実行する。
- `processDrawIcon(iconIndex, textState)` — \I[n]によるアイコン描画処理を実行し、描画Xを進める。
- `makeFontBigger()` — \{ によるフォントサイズ拡大処理。
- `makeFontSmaller()` — \} によるフォントサイズ縮小処理。
- `calcTextHeight(textState)` — 改行を含むテキスト等で描画に必要なブロック高さを再計算する。
- `maxFontSizeInLine(line)` — 現在の行で使われている最大のフォントサイズを取得する。
- `drawIcon(iconIndex, x, y)` — IconSetから指定インデックスのアイコン画像を描画する。
- `drawItemName(item, x, y, width)` — アイテム・スキル等のアイコンと名前を並べて描画する。
- `drawCurrencyValue(value, unit, x, y, width)` — 所持金などの数値と通貨単位を右詰めで描画する。
- `setBackgroundType(type)` — 背景のタイプ（0:通常ウィンドウ, 1:暗め, 2:透明）を設定する。
- `showBackgroundDimmer()` — 背景タイプが「暗め（Dimmer）」の時の表示をONにする。
- `createDimmerSprite()` — 「暗め」背景用の専用グラデーションスプライトを作成する。
- `hideBackgroundDimmer()` — 「暗め」背景用のグラデーションを非表示にする。
- `updateBackgroundDimmer()` — 「暗め」背景の色調や表示状態を更新する。
- `refreshDimmerBitmap()` — ウィンドウサイズ等が変わった際、Dimmer画像を再生成する。
- `playCursorSound()` — カーソル移動時の効果音（SE）を再生する。
- `playOkSound()` — 決定時の効果音を再生する。
- `playBuzzerSound()` — エラー・無効時のブザー効果音を再生する。

### Window_Scrollable

スクロール機能を持つウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Scrollable**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `clearScrollStatus()` — 現在のスクロール座標や目標座標をリセットする。
- `scrollX()` — 現在のX方向のスクロール量（ピクセル数）を返す。
- `scrollY()` — 現在のY方向のスクロール量（ピクセル数）を返す。
- `scrollBaseX()` — スクロール計算の基点となるX座標を返す。
- `scrollBaseY()` — スクロール計算の基点となるY座標を返す。
- `scrollTo(x, y)` — 指定の座標へ即座にスクロール位置を変更する。
- `scrollBy(x, y)` — 現在地から相対的にスクロール位置を変更する。
- `smoothScrollTo(x, y)` — 指定の座標へ滑らかに（アニメーション付きで）スクロールする。
- `smoothScrollBy(x, y)` — 現在地から相対的に滑らかにスクロールする。
- `setScrollAccel(x, y)` — 加速度的な一定速度のスクロール（ホイール等）を設定する。
- `overallWidth()` — コンテンツ全体の論理的な幅を返す（スクロール限界計算用）。
- `overallHeight()` — コンテンツ全体の論理的な高さを返す（スクロール限界計算用）。
- `maxScrollX()` — X方向の最大にスクロールできる座標（上限値）を返す。
- `maxScrollY()` — Y方向の最大にスクロールできる座標（上限値）を返す。
- `scrollBlockWidth()` — 1回の操作（ページ送り等）でスクロールするピクセル幅を返す。
- `scrollBlockHeight()` — 1回の操作でスクロールするピクセル高さを返す。
- `smoothScrollDown(n)` — 下方向へ `n` ブロック分滑らかにスクロールする。
- `smoothScrollUp(n)` — 上方向へ `n` ブロック分滑らかにスクロールする。
- `update()` — 滑らかなスクロールの進行や入力受付などを毎フレーム更新する。
- `processWheelScroll()` — マウスホイール操作によるスクロールを処理する。
- `processTouchScroll()` — フリック/スワイプ等のタッチ操作によるスクロールを処理する。
- `isWheelScrollEnabled()` — マウスホイールによるスクロールが有効かを確認する。
- `isTouchScrollEnabled()` — タッチスクリーン（フリック等）によるスクロールが有効かを確認する。
- `isScrollEnabled()` — スクロール機能自体が現在有効かを確認する。
- `isTouchedInsideFrame()` — タッチ時にウィンドウ枠内かを確認する。
- `onTouchScrollStart()` — タッチスクロール操作の開始検知時に呼ばれる。
- `onTouchScroll()` — タッチスクロール（ドラッグ中）の挙動を処理する。
- `onTouchScrollEnd()` — タッチスクロールの操作終了（離す）時に呼ばれる。
- `updateSmoothScroll()` — `smoothScrollTo` 等によるアニメーション処理を計算・更新する。
- `updateScrollAccel()` — マウスホイール等による慣性/加速スクロールを計算・更新する。
- `updateArrows()` — スクロール可能な場合、上下の矢印画像をアクティブ（点滅等）に更新する。
- `updateOrigin()` — 現在のスクロール座標をコンテナの表示原点に適用する。
- `updateScrollBase(baseX, baseY)` — スクロール変化分を計算してスクロール基点値に加算・更新する。
- `paint()` — スクロール時の内部要素などの再描画処理のトリガー。

### Window_Selectable ⭐

項目選択機能を持つウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → **Window_Selectable**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `index()` — 現在カーソルが選択している項目のインデックスを返す。
- `cursorFixed()` — カーソルが固定されているか（移動不可か）を確認する。
- `setCursorFixed(cursorFixed)` — カーソルの固定状態を設定する。
- `cursorAll()` — 全体選択状態（カーソルが全項目に及ぶか）を確認する。
- `setCursorAll(cursorAll)` — 全体選択状態を設定する。
- `maxCols()` — ウィンドウ内の最大列数を返す。
- `maxItems()` — 選択項目の最大数を返す。
- `colSpacing()` — 列同士の間隔（ピクセル数）を返す。
- `rowSpacing()` — 行同士の間隔（ピクセル数）を返す。
- `itemWidth()` — 1つの項目の幅を返す。
- `itemHeight()` — 1つの項目の高さを返す。
- `contentsHeight()` — 描画可能なコンテンツ領域の全体の高さを返す。
- `maxRows()` — 項目全体の行数を計算して返す。
- `overallHeight()` — 全行を合わせたコンテンツの全高を返す（スクロール用）。
- `activate()` — ウィンドウをアクティブにし、カーソルを一番上などに合わせる。
- `deactivate()` — ウィンドウを非アクティブにし、カーソルを消す。
- `select(index)` — 指定インデックスの項目を選択状態にし、カーソルを合わせる。
- `forceSelect(index)` — スクロール位置の調整なしに指定位置を強制選択する。
- `smoothSelect(index)` — 指定インデックスへ滑らかにスクロールしつつ選択する。
- `deselect()` — 現在の選択を解除する（インデックスを -1 にする）。
- `reselect()` — 前回選択していたインデックスを再度選択状態にする。
- `row()` — 現在選択されている項目の行番号を計算して返す。
- `topRow()` — 現在画面に表示されている最も上の行番号を計算して返す。
- `maxTopRow()` — スクロール可能な最も上の行番号（最大スクロール位置）を返す。
- `setTopRow(row)` — 指定行が一番上になるようにスクロール位置を設定する。
- `maxPageRows()` — ウィンドウ内に一度に表示可能な最大行数を返す。
- `maxPageItems()` — ウィンドウ内に一度に表示可能な最大項目数を返す。
- `maxVisibleItems()` — スクロールなしで表示できる最大項目数を返す。
- `isHorizontal()` — ウィンドウが横並び（列数が項目数より多い等）の構成かを確認する。
- `topIndex()` — 現在画面に表示されている最も左上のインデックスを返す。
- `itemRect(index)` — 指定インデックスの描画用矩形領域を計算して返す。
- `itemRectWithPadding(index)` — パディングを考慮した項目の矩形領域を返す。
- `itemLineRect(index)` — テキストの描画領域（Yセンタリング等考慮）の矩形領域を返す。
- `setHelpWindow(helpWindow)` — 項目説明用などに連動するヘルプウィンドウを設定する。
- `showHelpWindow()` — 連動するヘルプウィンドウを表示する。
- `hideHelpWindow()` — 連動するヘルプウィンドウを非表示にする。
- `setHandler(symbol, method)` — 指定したコマンドシンボルの実行時ハンドラを設定する。
- `isHandled(symbol)` — 指定シンブルのハンドラが登録済みかを判定する。
- `callHandler(symbol)` — 指定シンボルのハンドラを実行する。
- `isOpenAndActive()` — ウィンドウが完全に開いており、かつアクティブかを確認する。
- `isCursorMovable()` — 現在カーソルが移動可能な状態かを確認する。
- `cursorDown(wrap)` — カーソルを1つ下（または次行）へ移動する。ループ(wrap)対応。
- `cursorUp(wrap)` — カーソルを1つ上（または前行）へ移動する。ループ(wrap)対応。
- `cursorRight(wrap)` — カーソルを1つ右へ移動する。ループ(wrap)対応。
- `cursorLeft(wrap)` — カーソルを1つ左へ移動する。ループ(wrap)対応。
- `cursorPagedown()` — ページ送り（下）を行う。
- `cursorPageup()` — ページ戻し（上）を行う。
- `isScrollEnabled()` — マウス等によるスクロール操作が可能かを確認する。
- `update()` — 毎フレーム更新し、入力と項目の選択を処理する。
- `processCursorMove()` — 入力に応じたカーソル移動処理を実行する。
- `processHandling()` — 決定やキャンセルの入力処理を実行する。
- `processTouch()` — フリックやタップなどのタッチ・マウスクリック入力を処理する。
- `isHoverEnabled()` — マウスホバーによるアイテム選択が有効かを確認する。
- `onTouchSelect(trigger)` — タップ・クリックによる項目選択処理を行う。
- `onTouchOk()` — タッチ操作での決定処理を行う。
- `onTouchCancel()` — タッチ操作でのキャンセル処理を行う（枠外タッチ等）。
- `hitIndex()` — タッチされている座標に該当する項目のインデックスを返す。
- `hitTest(x, y)` — 指定座標にある項目のインデックスを判定して返す。
- `isTouchOkEnabled()` — タッチ操作での決定（現在選択中の項目再タップ等）が有効かを確認する。
- `isOkEnabled()` — 決定入力が有効かを確認する。
- `isCancelEnabled()` — キャンセル入力が有効かを確認する。
- `isOkTriggered()` — 決定ボタンが押されたかを確認する。
- `isCancelTriggered()` — キャンセルボタンが押されたかを確認する。
- `processOk()` — 決定時の共通処理（音再生、ハンドラの呼び出しなど）を行う。
- `callOkHandler()` — 決定時のハンドラメソッドを呼び出す。
- `processCancel()` — キャンセル時の共通処理（音再生など）を行う。
- `callCancelHandler()` — キャンセル時のハンドラメソッドを呼び出す。
- `processPageup()` — PageUp時の入力処理を行う。
- `processPagedown()` — PageDown時の入力処理を行う。
- `updateInputData()` — 決定等の入力状態をチェックして更新する。
- `ensureCursorVisible(smooth)` — カーソルが画面内に収まるようスクロール位置を調整する。
- `callUpdateHelp()` — 連動するヘルプウィンドウの更新を実行する。
- `updateHelp()` — サブクラス等で実装する、ヘルプテキストの更新処理。
- `setHelpWindowItem(item)` — ヘルプウィンドウに指定のアイテム説明を表示させる。
- `isCurrentItemEnabled()` — 現在選択中の項目が選択可能（有効）かを確認する。
- `drawAllItems()` — ウィンドウ内のすべてのリスト項目を描画する。
- `drawItem(/*index*/)` — 指定インデックスの項目を描画する（サブクラス等で実装）。
- `clearItem(index)` — 指定インデックスの描画内容をクリアする。
- `drawItemBackground(index)` — 選択中の背景（明滅するカーソル背景等）を描画する。
- `drawBackgroundRect(rect)` — 指定された矩形に背景色を塗る。
- `redrawItem(index)` — 指定インデックスの項目領域をクリアして再描画する。
- `redrawCurrentItem()` — 現在選択している項目の領域を再描画する。
- `refresh()` — ウィンドウ内容をクリアし、すべての項目を再生成・再描画する。
- `paint()` — スクロール時などに内容全体を描画する。
- `refreshCursor()` — カーソルの表示位置・矩形を更新する。
- `refreshCursorForAll()` — 全体選択時用にカーソル矩形を全体サイズに更新する。

### Window_Command ⭐

コマンド選択ウィンドウの基底クラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Command**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — 追加されたコマンドの数を返す。
- `clearCommandList()` — コマンドリストをクリアする。
- `makeCommandList()` — コマンドのリストを構築する（サブクラス等で実装）。
- `commandName(index)` — 指定インデックスのコマンド名（表示名）を返す。
- `commandSymbol(index)` — 指定インデックスのコマンドに対応するシンボルを返す。
- `isCommandEnabled(index)` — 指定インデックスのコマンドが選択可能かを確認する。
- `currentData()` — 現在選択中のコマンド情報（名前・シンボル・拡張データ等）を返す。
- `isCurrentItemEnabled()` — 現在選択中のコマンドが実行可能かを確認する。
- `currentSymbol()` — 現在選択中のコマンドのシンボルを返す。
- `currentExt()` — 現在選択中のコマンドの拡張データ（Ext）を返す。
- `findSymbol(symbol)` — 指定シンボルに一致する項目のインデックスを検索して返す。
- `selectSymbol(symbol)` — 指定シンボルに一致する項目を選択状態にする。
- `findExt(ext)` — 指定拡張データに一致する項目のインデックスを検索して返す。
- `selectExt(ext)` — 指定拡張データに一致する項目を選択状態にする。
- `drawItem(index)` — 指定インデックスのコマンド名と有効/無効状態を描画する。
- `itemTextAlign()` — テキストの描画配置位置（'left', 'center', 'right'）を返す。
- `isOkEnabled()` — コマンド決定が有効かを確認する。
- `callOkHandler()` — 決定時、シンボルに対応するハンドラを優先して呼び出す。
- `refresh()` — コマンドリストを再構築して全体を再描画する。

### Window_HorzCommand

横並びコマンド選択ウィンドウの基底クラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_HorzCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 同時に表示される列数を返す（基本4）。
- `itemTextAlign()` — テキストの描画配置位置を中央揃え（'center'）で返す。

### Window_Help

ヘルプテキスト表示用のウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Help**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setText(text)` — ウィンドウに表示するテキストを設定し、更新する。
- `clear()` — 表示テキストをクリアしてウィンドウを空にする。
- `setItem(item)` — アイテムやスキルなどに設定された説明文をウィンドウに表示する。
- `refresh()` — コンテンツをクリアし、現在のテキストを描画し直す。

### Window_Gold

所持金表示用のウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Gold**


#### インスタンスメソッド

- `initialize(rect)` — 初期化し、現在の所持金を描画する。
- `colSpacing()` — 列の間隔を返す（本クラスでは使用しないが0を返す）。
- `refresh()` — ウィンドウ内容をクリアし、現在の所持金文字列を描画し直す。
- `value()` — 現在のアクター等の所持金（通常は `$gameParty.gold()`）を返す。
- `currencyUnit()` — 設定された通貨の単位（「G」など）を返す。
- `open()` — ウィンドウを開き、同時に表示内容を最新の情報にリフレッシュする。

### Window_StatusBase ⭐

アクターステータス表示ウィンドウのスーパークラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_StatusBase**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `loadFaceImages()` — パーティ全員の顔画像（顔グラフィック）を事前ロードする。
- `refresh()` — ステータスアイコン等のスプライトを非表示にし、全体を再描画する。
- `hideAdditionalSprites()` — 追加のスプライト要素（ステートアイコンなど）を一括非表示にする。
- `placeActorName(actor, x, y)` — アクターの名前表示用の `Sprite_Name` を配置する。
- `placeStateIcon(actor, x, y)` — ステート異常アイコン表示用の `Sprite_StateIcon` を配置する。
- `placeGauge(actor, type, x, y)` — HP・MP等ゲージ用の `Sprite_Gauge` を配置する。
- `createInnerSprite(key, spriteClass)` — キャッシュを確認しつつ、内部にスプライトを生成・登録する。
- `placeTimeGauge(actor, x, y)` — タイムプログレスバトル用の時間ゲージを配置する。
- `placeBasicGauges(actor, x, y)` — HP・MP等の基本的なゲージ類を一括配置する。
- `gaugeLineHeight()` — 基本的なゲージを縦に並べる時の1つあたりの行の高さを返す。
- `drawActorCharacter(actor, x, y)` — アクターの歩行グラフィックを切り出して描画する。
- `drawActorName(actor, x, y, width)` — アクターの名前文字列を直接描画する（スプライト不使用時）。
- `drawActorClass(actor, x, y, width)` — アクターの職業名を描画する。
- `drawActorNickname(actor, x, y, width)` — アクターの二つ名（ニックネーム）を描画する。
- `drawActorLevel(actor, x, y)` — アクターの現在レベル情報（「Lv 10」など）を描画する。
- `drawActorIcons(actor, x, y, width)` — 対象ステートの各アイコン画像を直接描画する（スプライト不使用時）。
- `drawActorSimpleStatus(actor, x, y)` — 名前、レベル、アイコン、職業、HPMPゲージ等の簡易ステータスを一括描画する。
- `actorSlotName(actor, index)` — 指定インデックスの装備スロット名（「武器」「盾」等）を返す。

### Window_MenuCommand

メニュー画面のコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_MenuCommand**


#### 静的メソッド

- `initCommandPosition()` — Command Positionを初期化する。

#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — メニュー画面に表示するコマンドのリストを追加・構築する。
- `addMainCommands()` — メインメニューコマンド（アイテム、スキル、装備、ステータス）を追加する。
- `addFormationCommand()` — 並び替え（並び替え）コマンドを追加する。
- `addOriginalCommands()` — オリジナルのカスタムコマンド類を追加する（空実装）。
- `addOptionsCommand()` — オプション（設定）コマンドを追加する。
- `addSaveCommand()` — セーブコマンドを追加する。
- `addGameEndCommand()` — ゲーム終了コマンドを追加する。
- `needsCommand(name)` — 指定されたコマンドをメニューに表示する設定になっているかを確認する。
- `areMainCommandsEnabled()` — メインコマンド（アイテムやスキル等）が使用可能な状態かを確認する。
- `isFormationEnabled()` — 並び替えコマンドが使用可能な状態かを確認する。
- `isOptionsEnabled()` — オプションコマンドが使用可能な状態かを確認する。
- `isSaveEnabled()` — セーブコマンドが使用可能（セーブ許可状態等）かを確認する。
- `isGameEndEnabled()` — ゲーム終了コマンドが使用可能かを確認する。
- `processOk()` — 決定処理を実行し、`Window_MenuCommand`クラス側に直近の選択位置を記録する。
- `selectLast()` — 前回メニューを閉じた時に選択していたコマンドを再選択する。

### Window_MenuStatus

メニュー画面のパーティメンバーステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_MenuStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — パーティメンバーの人数を返す。
- `numVisibleRows()` — 画面内に表示可能な行数（基本4）を返す。
- `itemHeight()` — アクター1人分の項目ごとの高さを計算して返す。
- `actor(index)` — 指定インデックスの `Game_Actor` オブジェクトを返す。
- `drawItem(index)` — 指定インデックスのアクターの画像やステータスを描画する。
- `drawPendingItemBackground(index)` — 並び替え中などで選択されている項目の背景を描画する。
- `drawItemImage(index)` — 指定インデックスのアクターの顔画像を描画する。
- `drawItemStatus(index)` — 指定インデックスのアクターの簡易ステータスを描画する。
- `processOk()` — 決定入力を処理し、並び替え機能などを実行する。
- `isCurrentItemEnabled()` — 現在選択中のアクター項目が選択可能かを確認する。
- `selectLast()` — 前回選択したアクター（インデックス）を再選択する。
- `formationMode()` — 現在が「並び替え」モードかを確認する。
- `setFormationMode(formationMode)` — 「並び替え」モードのON/OFFを設定する。
- `pendingIndex()` — 並び替えで最初に選択して保留中になったインデックスを返す。
- `setPendingIndex(index)` — 並び替えで入れ替えるアクターのインデックスを保持する。

### Window_MenuActor

アイテム・スキル画面の対象アクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → `Window_MenuStatus` → **Window_MenuActor**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `processOk()` — 対象アクターを決定し、アイテム等の使用を実行する。
- `selectLast()` — コマンド等で対象となった直近のアクターを再選択する。
- `selectForItem(item)` — 選択中のアイテム/スキルが全体対象かなどに応じ、カーソルを変化させて選択する。

### Window_ItemCategory

アイテム・ショップ画面のアイテムカテゴリ選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ItemCategory**


#### インスタンスメソッド

- `initialize(rect)` — 初期化し、コマンドリストを作成する。
- `maxCols()` — 同時に表示される列数（基本4）を返す。
- `update()` — 毎フレーム更新し、連動するアイテムリストウィンドウのカテゴリを更新する。
- `makeCommandList()` — 「アイテム」「武器」「防具」「大事なもの」のリストを構築する。
- `needsCommand(name)` — 指定カテゴリコマンドをメニューに表示する設定になっているかを確認する。
- `setItemWindow(itemWindow)` — 項目のカテゴリを通知するための `Window_ItemList` を設定する。
- `needsSelection()` — 表示する際に強制再選択が必要か（アイテムウィンドウ側の更新のため）を判定する。

### Window_ItemList

アイテム画面のアイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ItemList**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setCategory(category)` — 表示対象のカテゴリ名（'item', 'weapon', 'armor', 'keyItem'等）を設定する。
- `maxCols()` — 表示する項目の列数（基本2）を返す。
- `colSpacing()` — 列同士の間隔（基本16）を返す。
- `maxItems()` — 現在のリストにあるアイテム数を返す。
- `item()` — 現在カーソルが選択中のアイテム（データオブジェクト）を返す。
- `itemAt(index)` — 指定インデックスのアイテム（データオブジェクト）を返す。
- `isCurrentItemEnabled()` — 現在選択中のアイテムが使用可能か等を確認する。
- `includes(item)` — 引数のアイテムが現在のカテゴリに合致するかを確認する。
- `needsNumber()` — アイテムの所持個数も描画するかを確認（大事なものなら通常描く等）。
- `isEnabled(item)` — 引数のアイテムが現在使用画面で使用可能な状態かを確認する。
- `makeItemList()` — パーティの所持品から、カテゴリに合致するアイテムリストを構築する。
- `selectLast()` — 前回選択したアイテム（インデックス）を再選択する。
- `drawItem(index)` — 指定インデックスのアイテム名と所持数を描画する。
- `numberWidth()` — 所持数（「: 15」等）を描画するために確保する幅を返す。
- `drawItemNumber(item, x, y, width)` — 所持数の数値を右詰めで描画する。
- `updateHelp()` — ヘルプウィンドウに選択中のアイテムの説明文を設定する。
- `refresh()` — アイテムリストを再構築してすべて再描画する。

### Window_SkillType

スキル画面のスキルタイプ選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_SkillType**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — スキルタイプを表示する対象アクターを設定し再描画する。
- `makeCommandList()` — アクターに付与されているすべてのスキルタイプをリストに構築する。
- `update()` — 毎フレーム更新し、連動するスキルリスト等に影響を伝播させる。
- `setSkillWindow(skillWindow)` — 決定したスキルタイプを通知するための `Window_SkillList` を設定する。
- `selectLast()` — 当アクタ–が最後に選択したスキルタイプを再選択する。

### Window_SkillStatus

スキル画面のスキル使用者ステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_SkillStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — ステータスを表示するアクターを設定する。
- `refresh()` — スプライトをリフレッシュし、簡易ステータス等を描画し直す。

### Window_SkillList

スキル画面のスキル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SkillList**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — スキルリストの表示対象となるアクターを設定する。
- `setStypeId(stypeId)` — 表示するスキルタイプリストのIDを設定する。
- `maxCols()` — 表示する列数（基本2列）を返す。
- `colSpacing()` — 列間のスペース（基本16）を返す。
- `maxItems()` — 現在表示すべきスキルの総数を返す。
- `item()` — 現在選択中のスキルオブジェクトを返す。
- `itemAt(index)` — 指定インデックスのスキルオブジェクトを返す。
- `isCurrentItemEnabled()` — 現在選択中のスキルが使用可能か（MP等足りるか）確認する。
- `includes(item)` — 対象スキルが設定されたスキルタイプIDに一致するか確認する。
- `isEnabled(item)` — 対象スキルがアクターにとって現在使用可能かを確認する。
- `makeItemList()` — アクターが覚えているスキルの中から、合致するもののリストを構築する。
- `selectLast()` — 当アクターが前回選択していたスキルを再選択する。
- `drawItem(index)` — 指定インデクスのスキルのアイコン、名前、消費コストを描画する。
- `costWidth()` — MP/TP消費などの描画に必要な幅を計算して返す。
- `drawSkillCost(skill, x, y, width)` — スキルの消費MPや消費TPの数値を右詰めで別に分けて描画する。
- `updateHelp()` — ヘルプウィンドウに選択中のスキルの説明文を設定する。
- `refresh()` — スキルリストを再構築して全体を再描画する。

### Window_EquipStatus

装備画面のパラメータ変化表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — 現在の装備ステータスを表示するアクターを設定する。
- `colSpacing()` — 情報描画列の間隔（未使用）を返す。
- `refresh()` — アクター名や基本パラメータ6種を一旦すべて描画し直す。
- `setTempActor(tempActor)` — 新しい装備を装着した場合の予測用アクター（コピー）を設定する。
- `drawAllParams()` — HP/MPを除く6つの能力値パラメータすべてを描画するループ処理。
- `drawItem(x, y, paramId)` — 指定位置に1行分のパラメータ（名前・現在値・矢印・新値）を描画する。
- `drawParamName(x, y, paramId)` — パラメータのシステム名（「攻撃力」など）を描画する。
- `drawCurrentParam(x, y, paramId)` — 現在のアクターのパラメータ数値を描画する。
- `drawRightArrow(x, y)` — 変化を示す「→」の文字を描画する。
- `drawNewParam(x, y, paramId)` — 選択中の装備をプレビュー装着した際の新しいパラメータ数値を描画する。
- `rightArrowWidth()` — 矢印文字「→」を描画するための確保幅を返す。
- `paramWidth()` — パラメータ数値を描画するための確保幅を計算して返す。
- `paramX()` — パラメータ名や数値を描画する基準となるX座標を返す。
- `paramY(index)` — 描画行(インデックス)に基づくY座標を計算して返す。

### Window_EquipCommand

装備画面のコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_EquipCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 同時に表示される列数（基本3）を返す。
- `makeCommandList()` — 「装備」「最強装備」「全て外す」のコマンドリストを構築する。

### Window_EquipSlot

装備画面の装備スロット選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipSlot**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — 装備スロットを表示するアクターを設定する。
- `update()` — 毎フレーム更新し、連動するアイテムリストウィンドウ等の表示を更新する。
- `maxItems()` — 現在のアクターにおける装備スロットの種類数を返す。
- `item()` — 現在カーソルがあるスロットに装着されている装備品アイテムを返す。
- `itemAt(index)` — 指定インデックスのスロットに装着されている装備品アイテムを返す。
- `drawItem(index)` — スロット名（「武器」等）と装着中の品名を描画する。
- `slotNameWidth()` — スロット名の表示用に確保する幅を返す。
- `isEnabled(index)` — 該当スロットの装備が変更可能か（「装備固定」等でないか）を確認する。
- `isCurrentItemEnabled()` — 現在選択中のスロットの装備が変更可能かを確認する。
- `setStatusWindow(statusWindow)` — 装備変更時のプレビューを行うための `Window_EquipStatus` を設定する。
- `setItemWindow(itemWindow)` — 着脱可能な装備リストを表示する `Window_EquipItem` を設定する。
- `updateHelp()` — 選択している装備品の説明をヘルプウィンドウに表示・更新する。

### Window_EquipItem

装備画面の装備品選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EquipItem**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — 同時に並べる列数（基本1行1列）を返す。
- `colSpacing()` — 列の間隔（基本8）を返す。
- `setActor(actor)` — 装備を着脱する対象アクターを設定する。
- `setSlotId(slotId)` — 現在リストアップ対象となる装備スロットIDを設定する。
- `includes(item)` — アイテムが選択スロットに適した装備品かを確認する。
- `etypeId()` — 選択中スロットの装備タイプID（1：武器、2：盾など）を返す。
- `isEnabled(/*item*/)` — 装備候補として常に有効かを返す（通常true）。
- `selectLast()` — （未使用）親リスト機能だが今回はオーバーライドされない挙動。
- `setStatusWindow(statusWindow)` — 対象アイテムにカーソルを合わせたときプレビュー数値を描画する先のウィンドウを設定する。
- `updateHelp()` — 指定しているアイテムの説明、およびステータスウィンドウにプレビューアクター情報を送る。
- `playOkSound()` — （自身ではなく親のシーン等で鳴らすため）ここでの決定音再生は抑止する。

### Window_Status

ステータス画面の詳細ステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_Status**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — ステータス画面に表示する詳細アクターを設定する。
- `refresh()` — ウィンドウ内容をクリアし、設定されたアクターの情報を再描画する。
- `drawBlock1()` — ブロック1（名前や職業、レベル等の基本情報）の領域を描画する。
- `block1Y()` — ブロック1を描画するY座標を返す。
- `drawBlock2()` — ブロック2（歩行グラフィック等の情報ブロック）の領域を描画する。
- `block2Y()` — ブロック2を描画するY座標を返す。
- `drawBasicInfo(x, y)` — アクターの基本情報（HP/MP等簡易ステータス）を描画する。
- `drawExpInfo(x, y)` — 経験値情報（現在のEXPと次のレベルまでのEXP）を描画する。
- `expTotalValue()` — アクターの現在の総獲得経験値をテキスト形式で返す。
- `expNextValue()` — アクターが次のレベルになるために必要な経験値をテキスト形式で返す。

### Window_StatusParams

ステータス画面のパラメータ表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusParams**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — パラメータを表示する対象アクターを設定する。
- `maxItems()` — 表示するパラメータの項目数（通常6）を返す。
- `itemHeight()` — 1つのパラメータを描画する行の高さを返す。
- `drawItem(index)` — 指定インデックスの基本パラメータ（攻撃力、防御力等）の名前と数値を描画する。
- `drawItemBackground(/*index*/)` — ステータス画面では選択がないため、背景描画をスキップするよう上書きする。

### Window_StatusEquip

ステータス画面の装備品表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusEquip**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setActor(actor)` — 装備情報を表示する対象アクターを設定する。
- `maxItems()` — 現在のアクターにおける装備スロットの最大数を返す。
- `itemHeight()` — 1つの装備品情報を描画する行の高さを返す。
- `drawItem(index)` — 指定インデックスのスロット名と現在装備しているアイテムを描画する。
- `drawItemBackground(/*index*/)` — 背景描画処理をスキップする（選択カーソル等を描かないため）。

### Window_Options

オプション画面の設定変更ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_Options**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — 一般設定と音量設定のオプション項目リストを構築する。
- `addGeneralOptions()` — 常時ダッシュやコマンド記憶といった一般設定の項目を追加する。
- `addVolumeOptions()` — BGM、BGS、ME、SEの音量設定項目を追加する。
- `drawItem(index)` — 各オプションの名称とその現在の設定状態（ON/OFFや数値）を描画する。
- `statusWidth()` — 設定状態テキスト部（右寄せ部分）を描画するために確保する幅を返す。
- `statusText(index)` — 指定オプション項目の現在の設定状態をテキスト（「ON」「100%」等）で取得する。
- `isVolumeSymbol(symbol)` — 対象のシンボルが音量設定項目か（'bgmVolume'等）を確認する。
- `booleanStatusText(value)` — 真偽値の項目について「ON」または「OFF」のテキストを返す。
- `volumeStatusText(value)` — 音量の項目について「100%」のようなテキストを返す。
- `processOk()` — 決定ボタンが押された時の処理（ON/OFF切り替えや音量プラス）を実行する。
- `cursorRight()` — 各項目の値を増やしたり、ONにしたりする。
- `cursorLeft()` — 各項目の値を減らしたり、OFFにしたりする。
- `changeVolume(symbol, forward, wrap)` — テキスト選択に基づき、対象音量の設定値を増減する。
- `volumeOffset()` — 1回の音量変更ボタン操作で増減する1ステップ量（通常20）を返す。
- `changeValue(symbol, value)` — 対象オプションの設定値を直接書き換え、保存・反映し、再描画する。
- `getConfigValue(symbol)` — `ConfigManager` から現在のオプション設定値を取得する。
- `setConfigValue(symbol, volume)` — `ConfigManager` に設定値を保存し、反映する。

### Window_SavefileList

セーブ・ロード画面のセーブファイル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SavefileList**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setMode(mode, autosave)` — 動作モード（'save' または 'load'）とオートセーブ表示の有無を設定する。
- `maxItems()` — 用意されるセーブファイル枠の最大数を返す。
- `numVisibleRows()` — 一画面に表示できるセーブファイル枠の数を返す。
- `itemHeight()` — セーブファイル枠1つ分の描画領域の高さを返す。
- `drawItem(index)` — セーブデータ枠を描画する。
- `indexToSavefileId(index)` — 表示リスト内のインデックスに対応する実際のセーブファイルIDを返す。
- `savefileIdToIndex(savefileId)` — 実際のセーブファイルIDからリスト内のインデックスを特定する。
- `isEnabled(savefileId)` — 対象セーブファイルがロード機能で読み込めるか（セーブデータが存在するか）等を確認する。
- `savefileId()` — 現在選択されているセーブファイルのIDを返す。
- `selectSavefile(savefileId)` — 指定されたセーブファイルIDにカーソルを合わせる。
- `drawTitle(savefileId, x, y)` — 「ファイル1」や「オートセーブ」などのタイトル表記を描画する。
- `drawContents(info, rect)` — タイトル以外のセーブデータ情報詳細（プレイ時間やパーティなど）を描画する。
- `drawPartyCharacters(info, x, y)` — サムネイルとして保存されたパーティメンバーの歩行グラフィックを描画する。
- `drawPlaytime(info, x, y, width)` — 保存されているプレイ時間（HH:MM:SS等）を描画する。
- `playOkSound()` — 「セーブ」実行時と「ロード」実行時の音を分けてここで鳴らすため、標準の決定音を鳴らさないカスタマイズをする。

### Window_ShopCommand

ショップ画面の売買選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ShopCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setPurchaseOnly(purchaseOnly)` — 買い取りのみ（売却禁止）かどうかのフラグを設定する。
- `maxCols()` — 同時に表示されるコマンドの数（基本3）を返す。
- `makeCommandList()` — 「購入する」「売却する」「やめる」等のコマンドリストを構築する。

### Window_ShopBuy

ショップ画面の購入アイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopBuy**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setupGoods(shopGoods)` — イベント等で設定されたショップの商品リスト（配列）を受け取りセットアップする。
- `maxItems()` — 現在の商品リストにあるアイテムの総数を返す。
- `item()` — 現在選択している商品のデータベースアイテム（無ければnull）を返す。
- `itemAt(index)` — 指定インデックスの表すデータベースアイテムを返す。
- `setMoney(money)` — 所持金を表示価格の文字色評価などに使うため設定する。
- `isCurrentItemEnabled()` — 選択している商品が購入可能（所持金が足りている等）かを確認する。
- `price(item)` — 引数アイテムのショップにおける販売価格を返す。
- `isEnabled(item)` — 引数アイテムが購入可能か（所持金条件や最大所持数等）を確認する。
- `refresh()` — リストを再構築し、全商品を再描画する。
- `makeItemList()` — イベントのショップ商品データから、実際のデータベースのアイテム・武器・防具リストへと変換・構築する。
- `goodsToItem(goods)` — ショップの単一の商品情報配列(id, 種別など)から実際のデータベース項目のオブジェクトを特定する。
- `drawItem(index)` — 指定インデックスの商品のアイコン、名前、価格を描画する。
- `priceWidth()` — 購入価格の描画用に確保する幅（基本96）を返す。
- `setStatusWindow(statusWindow)` — プレイヤーの現在の所持状況や装備比較情報を更新するための `Window_ShopStatus` を紐付ける。
- `updateHelp()` — 選択した商品の詳細な説明文をヘルプウィンドウ側に更新する。

### Window_ShopSell

ショップ画面の売却アイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_ShopSell**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `isEnabled(item)` — 対象アイテムが売却可能（価格が0より大きい等）かを確認する。

### Window_ShopNumber

ショップ画面の売買個数入力ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopNumber**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `isScrollEnabled()` — マウススクロール操作が（ここでは個数変更として）機能するか確認する。
- `number()` — 現在入力中の個数を返す。
- `setup(item, max, price)` — 個数決定対象のアイテム、最大入力個数、および単価をセットアップする。
- `setCurrencyUnit(currencyUnit)` — 合計額表示で用いる通貨単位（「G」等）を設定する。
- `createButtons()` — 入力補佐用のプラスマイナスボタン（タッチUI用）のスプライトを生成する。
- `placeButtons()` — 生成したボタン群をウィンドウの適切な位置に配置・整列する。
- `totalButtonWidth()` — 配置したボタン領域全体の幅を確保するために返す。
- `buttonSpacing()` — ボタン同士の間隔ピクセル幅を返す。
- `refresh()` — 表示するアイテム名と個数、合計価格の表示を描画・更新する。
- `drawCurrentItemName()` — 選択中のアイテムアイコンや名称を描画する。
- `drawMultiplicationSign()` — 掛け算の記号（乗算記号：×など）を描画する。
- `multiplicationSign()` — 描画に使用する乗算記号の文字（初期設定は '×'）を返す。
- `multiplicationSignX()` — 乗算記号を描画するX座標を返す。
- `drawNumber()` — 現在選択されている個数の数値を描画する。
- `drawHorzLine()` — 表示項目名と合計金額の間に区切り線を描画する。
- `drawTotalPrice()` — 個数×単価の合計金額を指定された書式で描画する。
- `itemNameY()` — アイテム名を表記する基本のY座標を返す。
- `totalPriceY()` — 合計金額表示欄のY座標を返す。
- `buttonY()` — タッチ操作用ボタンを配置するY座標を返す。
- `cursorWidth()` — 選択中の個数を装飾する点滅カーソルの幅を返す。
- `cursorX()` — カーソルおよび個数を描画する基準X枠を返す。
- `maxDigits()` — 最大入力個数の桁数（99なら2桁など）を返す。
- `update()` — 毎フレーム更新し、ボタンのスクロール操作等による数変動を処理する。
- `playOkSound()` — 個数確定の決定時にはここでは鳴らさないため処理をオーバーライドしている。
- `processNumberChange()` — 左右キーなどに応じて入力個数を加算・減算し、音を鳴らす処理を呼ぶ。
- `changeNumber(amount)` — 入力個数を与えられた量だけ増減（上下限の範囲内）させ、画面を更新する。
- `itemRect()` — カーソルの枠表示などのために使用される架空の1項目の描画範囲を返す。
- `isTouchOkEnabled()` — 画面タッチでの確定操作が有効かを確認する。
- `onButtonUp()` — タッチUIの「+1」ボタンが押下・クリックされた時の処理。
- `onButtonUp2()` — タッチUIの「+10(PageUp)」ボタンが押下・クリックされた時の処理。
- `onButtonDown()` — タッチUIの「-1」ボタンが押下・クリックされた時の処理。
- `onButtonDown2()` — タッチUIの「-10(PageDown)」ボタンが押下・クリックされた時の処理。
- `onButtonOk()` — タッチUIの「決定」ボタンが押下・クリックされた時の処理。

### Window_ShopStatus

ショップ画面の所持数・アクター装備状況表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_ShopStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `refresh()` — 表示内容をクリアし、現在の対象アイテムの詳細情報を描画・更新する。
- `setItem(item)` — 状況を表示する対象アイテム（武器や防具など）を設定する。
- `isEquipItem()` — 対象アイテムが装備品（武器・防具）かを確認する。
- `drawPossession(x, y)` — 「所持数: N」のテキストを描画する。
- `drawEquipInfo(x, y)` — 対象が装備品の場合、アクターの「装備しているか」や「能力変化」を描画する。
- `statusMembers()` — 装備状況を比較・表示する対象となるアクターの配列を返す。
- `pageSize()` — 一画面（1ページ）に表示できるアクターの人数（基本4）を返す。
- `maxPages()` — アクター全員の情報を表示するために必要なページ数を計算して返す。
- `drawActorEquipInfo(x, y, actor)` — 指定アクターがそのアイテムを装備可能か、及び装備した際の能力変化を描画する。
- `paramId()` — 対象アイテムの能力変化や比較に使用する基本パラメータIDを返す。
- `currentEquippedItem(actor, etypeId)` — 対象アクターが現在装備している、同種のスロットのアイテムを返す。
- `update()` — 毎フレーム更新し、ページ切り替え（アクター送り）操作を受け付ける。
- `updatePage()` — ページ切り替えの入力を監視し、必要ならページを変更する。
- `isPageChangeEnabled()` — アクターが多く、ページ送りが可能であるかを確認する。
- `isPageChangeRequested()` — Shiftキーやタッチボタン等でページ変更の入力があったかを確認する。
- `changePage()` — 次のページを表示し、ウィンドウを再描画して音を鳴らす。

### Window_NameEdit

名前入力画面のアクター名編集ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_NameEdit**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setup(actor, maxLength)` — 名前変更対象のアクターと、入力可能な最大文字数を設定する。
- `name()` — 現在編集中の名前テキストを返す。
- `restoreDefault()` — 編集中に入力をすべて消し、アクターのデフォルト名に戻す。
- `add(ch)` — 引数で受け取った1文字を現在の名前に末尾追加する。
- `back()` — 現在の名前から末尾の1文字を削除する。
- `faceWidth()` — アクターの顔画像（フェイス）を描画するための幅（144）を返す。
- `charWidth()` — 名前1文字分を描画するために確保する幅を返す。
- `left()` — 名前テキストの描画を開始するX座標（顔画像の右側）を返す。
- `itemRect(index)` — 指定インデックスの文字を描画・編集する枠矩形を計算して返す。
- `underlineRect(index)` — 指定文字の下線の描画矩形を計算して返す。
- `underlineColor()` — 入力文字の位置を示す下線の色（CSS色文字列）を返す。
- `drawUnderline(index)` — 指定インデックスの文字位置に下線を描画する。
- `drawChar(index)` — 指定インデックスに入力済みの文字を描画する。
- `refresh()` — 全体をクリアして顔画像、名前一覧、下線を再描画する。

### Window_NameInput

名前入力画面の文字選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NameInput**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setEditWindow(editWindow)` — 入力結果を反映させるための文字編集用ウィンドウ（`Window_NameEdit`）を設定する。
- `table()` — 現在表示中（ひらがな、カタカナ、英語など）の文字パレット用二次元配列を返す。
- `maxCols()` — 文字パレットの列数（通常10）を返す。
- `maxItems()` — 文字パレットの全入力パネル数（通常90）を返す。
- `itemWidth()` — 文字1つ分の選択枠の幅（基本的に一律42ピクセル）を返す。
- `groupSpacing()` — 文字パレット間の区切りスペースを返す。
- `character()` — 現在カーソルが選択中のパレットにある文字を返す。
- `isPageChange()` — 現在カーソルがページ切り替え（ひらがな⇔カタカナ等）の特別ボタンにあるか確認する。
- `isOk()` — 現在カーソルが決定（OK）の特別ボタンにあるか確認する。
- `itemRect(index)` — 指定インデックス（パレット項目の位置）の矩形枠を返す。
- `drawItem(index)` — 指定インデックスに該当する文字（または表示）を描画する。
- `updateCursor()` — 現在のパレットインデックスに合わせてカーソルの描画位置を更新する。
- `isCursorMovable()` — 現在カーソルが移動可能かを確認する（常にtrue）。
- `cursorDown(wrap)` — カーソルを下に移動する。上下ルーピング等も考慮する。
- `cursorUp(wrap)` — カーソルを上に移動する。
- `cursorRight(wrap)` — カーソルを右に移動する。
- `cursorLeft(wrap)` — カーソルを左に移動する。
- `cursorPagedown()` — PageDownキー（ページ切り替え）の操作を行う。
- `cursorPageup()` — PageUpキーによるページ切り替え操作を行う。
- `processCursorMove()` — 入力に応じたカーソル移動とページ切り替えを処理する。
- `processHandling()` — 決定音とともに文字入力・決定を実行したりキャンセルを処理する。
- `isCancelEnabled()` — キャンセル操作（文字を消す）が可能状態か確認する。
- `processCancel()` — キャンセルボタン（1文字消去）の処理を行う。
- `processJump()` — どの位置からでも瞬時に「決定」ボタンへカーソルを飛ばす。
- `processBack()` — 文字消去（Backspace・キャンセル）の操作処理。
- `processOk()` — カーソル上の文字を追加、ページ変更、または名前決定を行う。
- `onNameAdd()` — 文字追加時の共通処理（音を鳴らし、編集ウィンドウに追加を命令）。
- `onNameOk()` — 名前決定時の共通処理。

### Window_NameBox

メッセージウィンドウ上部の話者名表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_NameBox**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setMessageWindow(messageWindow)` — 本ウィンドウの表示に連動するメッセージウィンドウを設定する。
- `setName(name)` — 表示する話者の名前を設定し、変更があれば再描画する。
- `clear()` — 表示中の名前をクリアする。
- `start()` — 表示を開始し、ウィンドウサイズ調整とリフレッシュを行い、ウィンドウを開く。
- `updatePlacement()` — 紐付けられたメッセージウィンドウの位置に従い、表示座標や相対位置を更新する。
- `updateBackground()` — メッセージウィンドウの背景タイプ（通常/暗く/透明）に合わせて自身の背景を同期する。
- `windowWidth()` — 設定された名前テキストの長さに応じて、ウィンドウの最適な幅を計算して返す。
- `windowHeight()` — ウィンドウの高さを返す。
- `refresh()` — 名前テキストを描画（制御文字による色の反映など）して更新する。

### Window_ChoiceList

イベントコマンド「選択肢の表示」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ChoiceList**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setMessageWindow(messageWindow)` — 紐付くメインのメッセージウィンドウ（表示タイミング等用）を設定する。
- `createCancelButton()` — タッチUI用のキャンセルボタン（閉じるボタン）スプライトを生成する。
- `start()` — 選択肢の表示を開始し、位置やリストを初期化してウィンドウを開く。
- `update()` — 毎フレーム更新し、メッセージ表示中等のウェイト制御、キャンセルボタン等の処理を行う。
- `updateCancelButton()` — タッチ用キャンセルボタンの可視性や位置を更新する。
- `selectDefault()` — イベントコマンドで設定されているデフォルトの選択肢へカーソルを合わせる。
- `updatePlacement()` — 選択時の位置設定やメッセージウィンドウの位置から自身の表示座標を更新する。
- `updateBackground()` — メッセージウィンドウの背景設定に合わせて自身の背景を合わせる。
- `placeCancelButton()` — キャンセルボタンの表示座標をウィンドウ右上などの適切な位置に配置する。
- `windowX()` — 指定された表示ポジションに基づいてX座標を計算して返す。
- `windowY()` — Y座標を計算し、メッセージウィンドウに重ならないようにする。
- `windowWidth()` — 選択肢テキストの最大幅に基づいてウィンドウサイズを計算して返す。
- `windowHeight()` — 選択肢の数とキャンセルボタンをふまえたウィンドウの高さを返す。
- `numVisibleRows()` — 画面内に表示可能な選択肢の行数（全項目数と最大行数の小さい方）を返す。
- `maxLines()` — リストとして一度に表示できる最大行数（基本は設定上の最大数など）を返す。
- `maxChoiceWidth()` — 各選択肢テキスト＋アイコン等の幅を計算し、その最大幅を返す。
- `makeCommandList()` — イベントコマンドから受け取った文字列候補を使って選択肢リストを構築する。
- `drawItem(index)` — 指定インデックスの選択肢を描画し、制御文字の変換等を行う。
- `isCancelEnabled()` — イベント設定でキャンセルが許可されているか確認する。
- `needsCancelButton()` — タッチUI用キャンセルボタンの表示が必要かを確認する。
- `callOkHandler()` — 決定された選択肢番号をイベントインタプリタへ通知するコールバック。
- `callCancelHandler()` — キャンセル時に設定されたキャンセル番号をイベントインタプリタへ通知するコールバック。

### Window_NumberInput

イベントコマンド「数値入力の処理」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NumberInput**


#### インスタンスメソッド

- `initialize()` — 初期化する。
- `setMessageWindow(messageWindow)` — 連動するテキストメッセージウィンドウを設定する。
- `start()` — 変数と桁数を初期化し、ウィンドウ位置を合わせて表示を開始する。
- `updatePlacement()` — メッセージウィンドウの位置に合わせて、自身の座標（中央配置など）を更新する。
- `windowWidth()` — 入力する桁数やボタンサイズに合わせて最適なウィンドウ幅を計算する。
- `windowHeight()` — 決定された桁数やボタン配置スペースに従って高さを返す。
- `maxCols()` — 入力する数値の桁数をそのまま列数として返す。
- `maxItems()` — 入力する数値の桁数を項目数として返す。
- `itemWidth()` — 1桁の数値を描画するための幅（余白と文字幅）を計算して返す。
- `itemRect(index)` — 指定された各桁の描画またはタップ判定用の領域枠を返す。
- `isScrollEnabled()` — マウススクロール等による数値変更が可能か確認する（基本false）。
- `isHoverEnabled()` — マウスホバーでカーソル列（桁）を移動できるかを確認する（基本false）。
- `createButtons()` — 桁ごとの数値増減用と決定用のタッチボタン群を生成する。
- `placeButtons()` — 生成したタッチボタン群の配置座標をウィンドウ下部などに設定する。
- `totalButtonWidth()` — 配置する全ボタンの合計幅を計算する。
- `buttonSpacing()` — ボタン間に空ける間隔幅を返す。
- `buttonY()` — ボタンの表示Y座標（一番下部）を計算して返す。
- `update()` — 毎フレーム更新し、桁ごとの数値変更操作等を処理する。
- `processDigitChange()` — 上下キーの入力に応じて選択中の桁の数値を増減させる。
- `changeDigit(up)` — 選択桁の数値を1増減し、0〜9でループするように処理する。
- `isTouchOkEnabled()` — タッチによる「OK(決定)」操作が可能かを確認する。
- `isOkEnabled()` — 確定ボタン押下が有効か（常に有効）を確認する。
- `isCancelEnabled()` — キャンセル操作が有効かを返す（数値入力では基本false）。
- `processOk()` — 決定操作時に結果をゲーム変数に代入し、ウィンドウを閉じて終了する。
- `drawItem(index)` — 指定されたインデックス（桁）の現在の数値を描画する。
- `onButtonUp()` — タッチボタン「上矢印」押下時に現在の桁を＋1するコールバック。
- `onButtonDown()` — タッチボタン「下矢印」押下時に現在の桁を－1するコールバック。
- `onButtonOk()` — タッチボタン「決定」押下時に確定処理を呼ぶコールバック。

### Window_EventItem

イベントコマンド「アイテム選択の処理」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EventItem**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setMessageWindow(messageWindow)` — 連動するテキストメッセージウィンドウを設定する。
- `createCancelButton()` — タッチUI用のキャンセルボタンのスプライトを生成する。
- `start()` — 項目リストの最新化とカーソルリセットを行い、ウィンドウ表示を開始する。
- `update()` — 毎フレーム更新し、キャンセルボタン等の表示可視性も制御する。
- `updateCancelButton()` — メッセージ等が表示されていない場合だけキャンセルボタンを有効にする。
- `updatePlacement()` — メッセージウィンドウの構成に合わせてウィンドウの配置Y座標を決定する。
- `placeCancelButton()` — タッチ用キャンセルボタンの表示領域・座標を配置する。
- `includes(item)` — 引数のアイテムが、イベント設定されたカテゴリ（「大事なもの」等）に合致するか判定する。
- `needsNumber()` — リストでのアイテム所持数描画が必要かどうか確認する（通常表示）。
- `isEnabled(/*item*/)` — 選択可能か。常にtrueを返す（条件合致したアイテム全て選択可能）。
- `onOk()` — アイテム決定時に対象のIDをゲーム変数へ保存し、イベントインタプリタに通知する。
- `onCancel()` — キャンセル時にゲーム変数「0」を保存し、イベントインタプリタに通知する。

### Window_Message ⭐

テキストメッセージ表示用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Message**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `initMembers()` — 内部管理フラグ（テキスト状態、表示中フラグなど）を初期化する。
- `setGoldWindow(goldWindow)` — 連動する所持金ウィンドウを設定し、イベントコマンドで連携表示可能にする。
- `setNameBoxWindow(nameBoxWindow)` — 話者名を表示するための `Window_NameBox` を設定する。
- `setChoiceListWindow(choiceListWindow)` — 選択肢表示用の `Window_ChoiceList` を連携させる。
- `setNumberInputWindow(numberInputWindow)` — 数値入力用の `Window_NumberInput` を連携させる。
- `setEventItemWindow(eventItemWindow)` — アイテム選択用の `Window_EventItem` を連携させる。
- `clearFlags()` — 指定待機フラグや高速表示フラグなど、メッセージ表示用の一時状態を初期化する。
- `update()` — 毎フレーム更新し、文字送りやサブウィンドウとの調停を実行する。
- `checkToNotClose()` — メッセージの終了時でも顔画像や名前が連続する場合、閉じないか判定する。
- `synchronizeNameBox()` — 名前表示ウィンドウ設定などを同期更新する。
- `canStart()` — 表示中でない場合など、次のメッセージを開始できる状況か判定する。
- `startMessage()` — テキスト情報を準備し、顔画像を描き、最初の文字処理を開始する。
- `newLineX(textState)` — 新しい行へ続く場合の改行後X座標（顔画像がある場合は右に寄せる等）を計算する。
- `updatePlacement()` — コマンド設定の位置（上・中・下）に合わせて適切なY座標に自らを配置する。
- `updateBackground()` — 背景パターン（通常・暗く・透明）に合わせて装飾描画などを更新する。
- `terminateMessage()` — メッセージの表示をすべて終了させ、サブウィンドウ類を閉じる。
- `updateWait()` — 制御文字（\.\|等）による特定フレーム数の一時停止カウントを消費・管理する。
- `cancelWait()` — 早送り操作等でテキストが強制表示される際に一時停止状態を無効化する。
- `updateLoading()` — 顔画像画像などの非同期ロードを待機している状態の処理を行う。
- `updateInput()` — クリックや決定キー入力によるページ送り、待機停止解除等の処理を行う。
- `isAnySubWindowActive()` — 選択肢や数値入力などの連動ウィンドウのいずれかが開いているか確認する。
- `updateMessage()` — 1文字ずつテキスト描画を進行させ、制御処理等を挟みつつループ更新を管理する。
- `shouldBreakHere(textState)` — ワードラップ等のため現在の描画位置で改行、または1フレーム進行を区切る（Break）べきか判定する。
- `canBreakHere(textState)` — 基本的に日本語ではfalse。欧文等で空白時に単語折り返し可能かを判定する。
- `onEndOfText()` — 表示中の文章全体の描画が終わった際の処理（入力待ちや次のイベント呼び出し移行）を行う。
- `startInput()` — メッセージ表示完了後に連動する選択肢や数値入力を起動させる合図の処理。
- `isTriggered()` — 決定ボタンやマウスクリック等、次へ進む操作がフレーム内で実行されたかを確認する。
- `doesContinue()` — 次のイベントコマンドも「文章の表示」など連続表示されるコマンドか確認する。
- `areSettingsChanged()` — 連続する文章で、顔画像や背景設定に変更が入っているか確認する。
- `updateShowFast()` — 決定キー等の長押しによる「高速文字送り（Show Fast）」フラグを更新する。
- `newPage(textState)` — テキストの描画ページを切り替え、描画内容をクリアし位置をリセットする。
- `updateSpeakerName()` — 制御文字で名前の指定があれば、名前ウィンドウに反映更新する。
- `loadMessageFace()` — 使われる顔画像データ（ファイルと番号）に応じて事前にBitmapをロードする。
- `drawMessageFace()` — テキストで指定された顔画像（フェイスグラフィック）を左側の専用領域へ描画する。
- `processControlCharacter(textState, c)` — テキスト中の制御文字（色変更、ウェイトなど）の処理を実行する。
- `processNewLine(textState)` — テキストの改行文字を処理し、描画の行(Y)を一つ下げる。
- `processNewPage(textState)` — テキスト中に特殊な「ページ改行」がある場合、次のページ処理の準備をする。
- `isEndOfText(textState)` — テキストの全文字を描画し終えてインデックスが末尾に達したか確認する。
- `needsNewPage(textState)` — 次の文字を描画するにはX/Y座標的に次のページ領域が必要か確認する。
- `processEscapeCharacter(code, textState)` — メッセージ固有の追加制御文字（\C等）をオーバーライドして実行する。
- `startWait(count)` — 制御文字（\.\|）指定されたフレーム数だけ文字送り進行を停止（ウェイト）させる。
- `startPause()` — テキストの画面入力待ちアイコン（ポーズサイン）を表示させ決定を待つ。
- `isWaiting()` — メッセージウェイト中、もしくはフェードやサブウィンドウ等の結果待ち等で待機中かを確認する。

### Window_ScrollText

スクロールテキスト表示用のウィンドウ。枠なし。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_ScrollText**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `update()` — 毎フレーム更新し、テキストのスクロールを進行させる。
- `startMessage()` — スクロールテキストの表示を開始する。
- `refresh()` — 全体をクリアし、テキスト内容を描画し直す。
- `updatePlacement()` — ウィンドウの表示位置（常に画面全体等）を更新する。
- `contentsHeight()` — スクロールすべき全テキストの高さを計算して返す。
- `updateMessage()` — スクロール量がコンテンツ高さを超えたか判定し、終了処理を行う。
- `scrollSpeed()` — スクロールの基本速度（イベントコマンドの設定値またはデフォルト等）を計算する。
- `isFastForward()` — 決定キーが押されて早送り状態になっているかを確認する。
- `fastForwardRate()` — 早送り状態の時のスクロール速度の倍率（基本3倍など）を返す。
- `terminateMessage()` — スクロール終了時にテキストや進行状態をクリアする。

### Window_MapName

マップ画面のマップ名表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_MapName**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `update()` — 毎フレーム更新し、フェードインやフェードアウトの進行状態を管理する。
- `updateFadeIn()` — フェードイン中の不透明度上昇を処理する。
- `updateFadeOut()` — 一定時間表示した後のフェードアウト処理を行う。
- `open()` — マップ名の表示を開始する（フェードインへ移行する）。
- `close()` — 強制的に表示を終了する（即座に透明にする等）。
- `refresh()` — マップ名を取得して背景とテキストを描画する。
- `drawBackground(x, y, width, height)` — マップ名表示用の半透明な黒背景を描画する。

### Window_BattleLog ⭐

戦闘経過表示用のウィンドウ。枠なしだがWindow_Baseを継承。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_BattleLog**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `setSpriteset(spriteset)` — アニメーション表示等で連動する `Spriteset_Battle` を設定する。
- `maxLines()` — バトルログとして表示する最大行数（基本10行等）を返す。
- `numLines()` — 現在実際に表示されているログの行数を返す。
- `messageSpeed()` — 1行を表示する際のウェイトフレーム数（基本16）を返す。
- `isBusy()` — ログ表示のウェイト中やメソッド実行の待機中でビジー状態かどうかを確認する。
- `update()` — 毎フレーム更新し、溜まっているメソッドの順次実行とウェイト処理を行う。
- `updateWait()` — イベントコマンド等で要求されたウェイトをカウントダウン・管理する。
- `updateWaitCount()` — 単純なフレームウェイトのカウントダウンを処理する。
- `updateWaitMode()` — エフェクトやモーション完了を待つ「ウェイトモード」を判定し待機状態を更新する。
- `setWaitMode(waitMode)` — エフェクト・アニメーション等の終了を待機するモード（'effect', 'movement'等）を設定する。
- `callNextMethod()` — 待機状態でなければ、キューに登録されている次の演出・ログ表示メソッドを実行する。
- `isFastForward()` — 決定キーの長押し等により演出を早送りするフラグが立っているか確認する。
- `push(methodName)` — 引数のメソッド名や関数、および引数を演出キューに登録する。
- `clear()` — 表示されているすべてのログテキストと背景情報をクリアする。
- `wait()` — 演出待機用のメソッドをキューに登録する（実際の待機は内部カウントで実行）。
- `waitForEffect()` — アニメーションエフェクトの完了待ちをキューに登録する。
- `waitForMovement()` — バトラーの移動演出の完了待ちをキューに登録する。
- `addText(text)` — ログに新たな1行のテキストを追加して描画する。
- `pushBaseLine()` — 現在表示中のログのベース行の状態を保存する（複数対象のアニメーション後などで戻すため）。
- `popBaseLine()` — 保存しておいたベース行の状態を復元し、余分なログを消す。
- `waitForNewLine()` — 新しい行へ続く際にベースラインをリセットして待機する。
- `popupDamage(target)` — 対象バトラーの被ダメージや回復のポップアップ演出をキューに登録する。
- `performActionStart(subject, action)` — スキル等の発動開始演出（前進等）を対象バトラーに実行させるキューを登録する。
- `performAction(subject, action)` — スキル等のアクション発動モーション（武器振り等）を実行させるキューを登録する。
- `performActionEnd(subject)` — アクション終了演出（元の位置に戻る等）を実行させるキューを登録する。
- `performDamage(target)` — 対象のダメージ演出モーションを実行させるキューを登録する。
- `performMiss(target)` — 対象への攻撃ミス演出を実行させるキューを登録する。
- `performRecovery(target)` — 対象への回復演出（数値ポップアップ等）を実行させるキューを登録する。
- `performEvasion(target)` — 対象の回避アクションの演出を実行させるキューを登録する。
- `performMagicEvasion(target)` — 対象の魔法回避の演出を実行させるキューを登録する。
- `performCounter(target)` — 対象の反撃（カウンター）の演出を実行させるキューを登録する。
- `performReflection(target)` — 対象の魔法反射（リフレクション）の演出を実行させるキューを登録する。
- `performSubstitute(substitute, target)` — 身代わり（かばう）を行う演出を実行させるキューを登録する。
- `performCollapse(target)` — 対象の戦闘不能（倒れ）演出を実行させるキューを登録する。
- `showAttackAnimation(subject, targets)` — 対象への通常攻撃アニメーションを表示する演出をキューに登録する。
- `refresh()` — 全テキストと背景の描画をリフレッシュする。
- `drawBackground()` — 現在表示されているログの行の数だけ、フェードアウト用等の半透明な背景を描画する。
- `backRect()` — ウィンドウ背景ではなくログ1行用の黒背景としての描画矩形領域を計算して返す。
- `lineRect(index)` — 指定インデックスの文字列および背景の描画矩形領域を返す。
- `backColor()` — ログ行の背景色（CSS色指定、ここでは黒系の半透明）を返す。
- `backPaintOpacity()` — ログ行の背景の不透明度（64等）を返す。
- `drawLineText(index)` — 指定行に登録されているテキスト文字列を描画する。
- `startTurn()` — ターンの開始通知等の演出を（必要に応じて）開始する。
- `startAction(subject, action, targets)` — アクション開始時のログ表示と演出（前進等）を指示する。
- `endAction(subject)` — アクション終了時の演出（位置戻り等）を指示する。
- `displayCurrentState(subject)` — バトラーに現在かかっているステートの継続メッセージをログに表示する。
- `displayRegeneration(subject)` — ターン終了時等のHP回復/毒ダメージなどの結果を反映・ポップアップさせる。
- `displayAction(subject, item)` — スキルやアイテムを使用した旨のメッセージをログに追加する。
- `displayItemMessage(fmt, subject, item)` — 行動（アイテム/スキル）時の特定のフォーマットメッセージを構築・表示する。
- `displayCounter(target)` — カウンター発動を知らせるメッセージをログに追加する。
- `displayReflection(target)` — 魔法反射（リフレクト）発動を知らせるメッセージをログに追加する。
- `displaySubstitute(substitute, target)` — 身代わり（かばう）を行ったメッセージをログに追加する。
- `displayActionResults(subject, target)` — アクションの結果（命中・ミス・ダメージなど）を総合して演出呼出やログ追加を行う。
- `displayFailure(target)` — アクションが対象に効果が無かった場合（失敗）のメッセージをログに追加する。
- `displayCritical(target)` — クリティカルヒットが発生した旨のメッセージをログに追加する。
- `displayDamage(target)` — 被ダメージ量をログとしてテキスト表示する。
- `displayMiss(target)` — 攻撃が外れた旨のメッセージをログとして表示する。
- `displayEvasion(target)` — 攻撃を回避した旨のメッセージをログとして表示する。
- `displayHpDamage(target)` — HPダメージ・回復の結果をテキスト構築し表示する。
- `displayMpDamage(target)` — MPダメージ・回復の結果をテキスト構築し表示する。
- `displayTpDamage(target)` — TPダメージ・回復の結果をテキスト構築し表示する。
- `displayAffectedStatus(target)` — ステートやバフ・デバフの付加・解除結果をまとめてテキスト表示する。
- `displayAutoAffectedStatus(target)` — 自動付加されたステート等（戦闘不能など）をテキスト表示する。
- `displayChangedStates(target)` — 付加・解除された各ステートの個別メッセージを表示する。
- `displayAddedStates(target)` — 新たに付加されたステートのメッセージを表示する。
- `displayRemovedStates(target)` — 解除されたステートのメッセージを表示する。
- `displayChangedBuffs(target)` — 変化したバフ・デバフのメッセージを表示する。
- `displayBuffs(target, buffs, fmt)` — 各パラメータ対象のバフ・デバフ指定のフォーマットに沿って表示する。
- `makeHpDamageText(target)` — 発生したHPダメージ・回復のメッセージ文字列を組み立てて返す。
- `makeMpDamageText(target)` — 発生したMPダメージ・回復のメッセージ文字列を組み立てて返す。
- `makeTpDamageText(target)` — 発生したTPダメージ・回復のメッセージ文字列を組み立てて返す。

### Window_PartyCommand

戦闘画面の「戦う/逃げる」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_PartyCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — 「戦う」と「逃げる」のコマンドリストを構築する。
- `setup()` — ウィンドウ内容をクリアして構築し直し、アクターのインデックス等を準備してから表示・アクティブにする。

### Window_ActorCommand

戦闘画面のアクターコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ActorCommand**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — 選択されているアクターに応じた行動コマンドのリストを構築する。
- `addAttackCommand()` — 通常攻撃コマンドを追加する。
- `addSkillCommands()` — 設定されているスキルタイプごとのコマンドをリストに追加する。
- `addGuardCommand()` — 防御コマンドを追加する。
- `addItemCommand()` — アイテム使用コマンドを追加する。
- `setup(actor)` — 引数のアクターに基づくコマンドリストを構築し、ウィンドウを表示・アクティブにする。
- `actor()` — 現在コマンドを選択している対象の `Game_Actor` オブジェクトを返す。
- `processOk()` — 対象アクターの直前のコマンド選択記録を残しつつ、決定ハンドラを呼ぶ。
- `selectLast()` — 対象アクターが前回選択したコマンド（インデックス）を再選択し、カーソルを合わせる。

### Window_BattleStatus ⭐

戦闘画面のパーティメンバーステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_BattleStatus**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `extraHeight()` — 余分な高さ（基本的に10、Window_BattleActor用等）を返す。
- `maxCols()` — パーティの人数に応じて、同時に表示する最大列数を返す（基本4）。
- `itemHeight()` — 1つのバトラー項目の描画行の高さを返す。
- `maxItems()` — 現在戦闘に参加しているパーティメンバーの人数を返す。
- `rowSpacing()` — 縦に並ぶ場合等の行間のピクセル数を返す（基本0）。
- `updatePadding()` — パディングを設定・更新する。
- `actor(index)` — 指定インデックスの `Game_Actor` オブジェクトを返す。
- `selectActor(actor)` — 指定のアクターオブジェクトをカーソルで選択状態にする。
- `update()` — 毎フレーム更新し、画面に反映させる必要に応じてリフレッシュ等を行う。
- `preparePartyRefresh()` — パーティのステータス変化などで再描画が必要なフラグを立てる。
- `performPartyRefresh()` — 再表示を要求された際、スプライト等を隠して全体をリフレッシュする。
- `drawItem(index)` — 指定インデックスのアクターについて顔画像、名前等の各情報（アイコン・ゲージ等）を描画する。
- `drawItemImage(index)` — 指定インデックスのアクターの顔画像を指定位置に描画する。
- `drawItemStatus(index)` — 指定インデックスのアクターの名前、ステートアイコン、HP/MPゲージ等を描画する。
- `faceRect(index)` — 顔画像の切り抜き・描画用の矩形領域を計算して返す。
- `nameX(rect)` — 名前を描画するためのX座標を矩形領域から計算して返す。
- `nameY(rect)` — 名前を描画するためのY座標を計算して返す。
- `stateIconX(rect)` — ステートアイコンを描画するためのX座標を計算して返す。
- `stateIconY(rect)` — ステートアイコンを描画するためのY座標を計算して返す。
- `basicGaugesX(rect)` — HP/MP/TPゲージ群を描画するための基準X座標を計算して返す。
- `basicGaugesY(rect)` — HP/MP/TPゲージ群を描画するための基準Y座標を計算して返す。

### Window_BattleActor

戦闘画面の対象アクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → `Window_BattleStatus` → **Window_BattleActor**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `show()` — ウィンドウを表示状態にする。
- `hide()` — ウィンドウを非表示状態にする。
- `select(index)` — 指定インデックスのアクターを選択し、カーソルを合わせる。
- `processTouch()` — フリックやタップなどのタッチ・クリック入力処理をオーバーライドで受け付ける（必要時拡張向け）。

### Window_BattleEnemy

戦闘画面の対象敵キャラクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_BattleEnemy**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxCols()` — ウィンドウに表示可能な列数を返す（基本2列等）。
- `maxItems()` — 選択可能な生存している敵キャラクターの数を返す。
- `enemy()` — 現在選択している対象の敵の `Game_Enemy` オブジェクトを返す。
- `enemyIndex()` — 選択している敵グループ内でのインデックスを返す。
- `drawItem(index)` — 指定インデックスの敵キャラクターの名前を描画する。
- `show()` — デフォルトの表示処理に加え、1体目の敵を選択状態にして表示する。
- `hide()` — ウィンウドウを非表示にし、敵の選択状態フラグも解除する。
- `refresh()` — 全体をクリアし、選択可能な生存敵のリストを構築・描画し直す。
- `select(index)` — 指定されたインデックスの敵を選択し、バトラー側の選択エフェクトを明滅させる。
- `processTouch()` — クリックやタッチなどの操作情報を受け取る。

### Window_BattleSkill

戦闘画面のスキル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_SkillList` → **Window_BattleSkill**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `show()` — ウィンドウを表示状態（アクティブ化）する。
- `hide()` — ウィンドウを非表示状態（非アクティブ化）にする。

### Window_BattleItem

戦闘画面のアイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_BattleItem**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `includes(item)` — アイテムがバトル時に使用可能なカテゴリであることを判定し返す。
- `show()` — ウィンドウを表示状態（アクティブ化）する。
- `hide()` — ウィンドウを非表示状態（非アクティブ化）にする。

### Window_TitleCommand

タイトル画面の「ニューゲーム/コンティニュー」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_TitleCommand**


#### 静的メソッド

- `initCommandPosition()` — ゲーム起動時にカーソルの初期位置（通常0:ニューゲーム）を設定する。

#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — 「ニューゲーム」「コンティニュー」「オプション」のコマンドを含むリストを構築する。
- `isContinueEnabled()` — セーブファイルが存在し、コンティニューが可能であるか判定する。
- `processOk()` — セーブファイルの有無なども加味し、決定時の初期位置を保存してハンドラを呼ぶ。
- `selectLast()` — `initCommandPosition()` で保存された直前の選択位置（ニューゲーム等）を再選択する。

### Window_GameEnd

ゲーム終了画面の「タイトルへ」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_GameEnd**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `makeCommandList()` — 「タイトルへ」「やめる」のコマンドリストを構築する。

### Window_DebugRange

デバッグ画面のスイッチ/変数ブロック選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugRange**


#### 静的プロパティ

- `lastTopRow` — 画面遷移間で前回のスクロール状態のY座標を保持する。
- `lastIndex` — 画面遷移間で前回選択していた項目のインデックスを保持する。

#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — 10個単位で分割されたスイッチと変数のグループ全体数を計算して返す。
- `update()` — 毎フレーム更新し、連動するデバッグ編集ウィンドウに現在の範囲情報を渡す。
- `mode(index)` — 指定インデックスのグループが扱うのが「スイッチ('switch')」か「変数('variable')」かを返す。
- `topId(index)` — 指定グループの開始ID（該当グループが11~20を扱う場合は11）を返す。
- `isSwitchMode(index)` — そのインデックスがスイッチグループかを判定しtrueを返す。
- `drawItem(index)` — インデックスに該当するグループの範囲（「S [0011-0020]」など）を描画する。
- `isCancelTriggered()` — キャンセル操作が実行されたかを確認する。
- `processCancel()` — キャンセル操作の際、現在の選択状態をスタティックプロパティに保持・保存して閉じる処理を行う。
- `setEditWindow(editWindow)` — 実際に個々のスイッチや変数を編集・表示する対象ウィンドウを設定・同期させる。

### Window_DebugEdit

デバッグ画面のスイッチ/変数表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugEdit**


#### インスタンスメソッド

- `initialize(rect)` — 初期化する。
- `maxItems()` — 現在のグループ（範囲）内で表示可能な最大の項目数（基本的に10）を返す。
- `drawItem(index)` — スイッチまたは変数のIDに応じた名前と現在の状態（ON/OFFや数値）を描画する。
- `itemName(dataId)` — スイッチ・変数のシステムに登録された名称を取得し、無名なら空文字列を返す。
- `itemStatus(dataId)` — 指定されたデータIDにおける現在の値（[ON]/[OFF]や数値テキスト）を返す。
- `setMode(mode)` — 当編集ウィンドウが現在スイッチと変数のどちらのモード（'switch', 'variable'）を表示するか設定する。
- `setTopId(id)` — 現在のリストで一番上に表示される項目のデータ参照元ID（1等）を設定する。
- `currentId()` — 現在カーソルがある項目の実際のゲーム用データIDを計算して返す。
- `update()` — 毎フレーム更新し、選択中の項目の値の変更ボタン入力（決定/左右など）を監視し処理を呼ぶ。
- `updateSwitch()` — 決定ボタンによるスイッチのON/OFF切り替えの入力を処理する。
- `updateVariable()` — 左右ボタンやLRボタンによる変数の数値の増減入力を処理する。
- `deltaForVariable()` — LRボタンまたは左右ボタンの入力に応じて、変数を増減させるための変動量（1、10等）を計算する。

---

