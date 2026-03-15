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

- `loadGlobalInfo()`
- `removeInvalidGlobalInfo()`
- `saveGlobalInfo()`
- `isGlobalInfoLoaded()`
- `loadDatabase()`
- `loadDataFile(name, src)`
- `onXhrLoad(xhr, name, src, url)`
- `onXhrError(name, src, url)`
- `isDatabaseLoaded()`
- `loadMapData(mapId)`
- `makeEmptyMap()`
- `isMapLoaded()`
- `onLoad(object)`
- `isMapObject(object)`
- `extractArrayMetadata(array)`
- `extractMetadata(data)`
- `checkError()`
- `isBattleTest()`
- `isEventTest()`
- `isTitleSkip()`
- `isSkill(item)`
- `isItem(item)`
- `isWeapon(item)`
- `isArmor(item)`
- `createGameObjects()`
- `setupNewGame()`
- `setupBattleTest()`
- `setupEventTest()`
- `isAnySavefileExists()`
- `latestSavefileId()`
- `earliestSavefileId()`
- `emptySavefileId()`
- `loadAllSavefileImages()`
- `loadSavefileImages(info)`
- `maxSavefiles()`
- `savefileInfo(savefileId)`
- `savefileExists(savefileId)`
- `saveGame(savefileId)`
- `loadGame(savefileId)`
- `makeSavename(savefileId)`
- `selectSavefileForNewGame()`
- `makeSavefileInfo()`
- `makeSaveContents()`
- `extractSaveContents(contents)`
- `correctDataErrors()`

### ConfigManager ⭐

設定データを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的プロパティ

- `alwaysDash`
- `commandRemember`
- `touchUI`

#### 静的メソッド

- `load()`
- `save()`
- `isLoaded()`
- `makeData()`
- `applyData(config)`
- `readFlag(config, name, defaultValue)`
- `readVolume(config, name)`

#### プロパティ

- `bgmVolume`
- `bgsVolume`
- `meVolume`
- `seVolume`

### StorageManager

セーブデータの保存を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `isLocalMode()`
- `saveObject(saveName, object)`
- `loadObject(saveName)`
- `objectToJson(object)`
- `jsonToObject(json)`
- `jsonToZip(json)`
- `zipToJson(zip)`
- `saveZip(saveName, zip)`
- `loadZip(saveName)`
- `exists(saveName)`
- `remove(saveName)`
- `saveToLocalFile(saveName, zip)`
- `loadFromLocalFile(saveName)`
- `localFileExists(saveName)`
- `removeLocalFile(saveName)`
- `saveToForage(saveName, zip)`
- `loadFromForage(saveName)`
- `forageExists(saveName)`
- `removeForage(saveName)`
- `updateForageKeys()`
- `forageKeysUpdated()`
- `fsMkdir(path)`
- `fsRename(oldPath, newPath)`
- `fsUnlink(path)`
- `fsReadFile(path)`
- `fsWriteFile(path, data)`
- `fileDirectoryPath()`
- `filePath(saveName)`
- `forageKey(saveName)`
- `forageTestKey()`

### FontManager

フォントファイルの読み込みを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `load(family, filename)`
- `isReady()`
- `startLoading(family, url)`
- `throwLoadError(family)`
- `makeUrl(filename)`

### ImageManager ⭐

画像の読み込み・Bitmapオブジェクトの作成・保持を行う静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的プロパティ

- `standardIconWidth`
- `standardIconHeight`
- `standardFaceWidth`
- `standardFaceHeight`

#### 静的メソッド

- `getIconSize()`
- `getFaceSize()`
- `loadAnimation(filename)`
- `loadBattleback1(filename)`
- `loadBattleback2(filename)`
- `loadEnemy(filename)`
- `loadCharacter(filename)`
- `loadFace(filename)`
- `loadParallax(filename)`
- `loadPicture(filename)`
- `loadSvActor(filename)`
- `loadSvEnemy(filename)`
- `loadSystem(filename)`
- `loadTileset(filename)`
- `loadTitle1(filename)`
- `loadTitle2(filename)`
- `loadBitmap(folder, filename)`
- `loadBitmapFromUrl(url)`
- `clear()`
- `isReady()`
- `throwLoadError(bitmap)`
- `isObjectCharacter(filename)`
- `isBigCharacter(filename)`
- `isZeroParallax(filename)`

#### プロパティ

- `iconWidth`
- `iconHeight`
- `faceWidth`
- `faceHeight`

### EffectManager

Effekseerエフェクトの読み込みを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `load(filename)`
- `startLoading(url)`
- `clear()`
- `onLoad(/*url*/)`
- `onError(url)`
- `makeUrl(filename)`
- `checkErrors()`
- `throwLoadError(url)`
- `isReady()`

### AudioManager ⭐

BGM・BGS・ME・SEの再生を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `playBgm(bgm, pos)`
- `replayBgm(bgm)`
- `isCurrentBgm(bgm)`
- `updateBgmParameters(bgm)`
- `updateCurrentBgm(bgm, pos)`
- `stopBgm()`
- `fadeOutBgm(duration)`
- `fadeInBgm(duration)`
- `playBgs(bgs, pos)`
- `replayBgs(bgs)`
- `isCurrentBgs(bgs)`
- `updateBgsParameters(bgs)`
- `updateCurrentBgs(bgs, pos)`
- `stopBgs()`
- `fadeOutBgs(duration)`
- `fadeInBgs(duration)`
- `playMe(me)`
- `updateMeParameters(me)`
- `fadeOutMe(duration)`
- `stopMe()`
- `playSe(se)`
- `updateSeParameters(buffer, se)`
- `cleanupSe()`
- `stopSe()`
- `playStaticSe(se)`
- `loadStaticSe(se)`
- `isStaticSe(se)`
- `stopAll()`
- `saveBgm()`
- `saveBgs()`
- `makeEmptyAudioObject()`
- `createBuffer(folder, name)`
- `updateBufferParameters(buffer, configVolume, audio)`
- `audioFileExt()`
- `checkErrors()`
- `throwLoadError(webAudio)`

#### プロパティ

- `bgmVolume`
- `bgsVolume`
- `meVolume`
- `seVolume`

### SoundManager

データベースで定義された効果音を再生する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `preloadImportantSounds()`
- `loadSystemSound(n)`
- `playSystemSound(n)`
- `playCursor()`
- `playOk()`
- `playCancel()`
- `playBuzzer()`
- `playEquip()`
- `playSave()`
- `playLoad()`
- `playBattleStart()`
- `playEscape()`
- `playEnemyAttack()`
- `playEnemyDamage()`
- `playEnemyCollapse()`
- `playBossCollapse1()`
- `playBossCollapse2()`
- `playActorDamage()`
- `playActorCollapse()`
- `playRecovery()`
- `playMiss()`
- `playEvasion()`
- `playMagicEvasion()`
- `playReflection()`
- `playShop()`
- `playUseItem()`
- `playUseSkill()`

### TextManager ⭐

用語やメッセージを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `basic(basicId)`
- `param(paramId)`
- `command(commandId)`
- `message(messageId)`
- `getter(method, param)`

#### プロパティ

- `currencyUnit`

### ColorManager ⭐

ウィンドウカラーを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `loadWindowskin()`
- `textColor(n)`
- `normalColor()`
- `systemColor()`
- `crisisColor()`
- `deathColor()`
- `gaugeBackColor()`
- `hpGaugeColor1()`
- `hpGaugeColor2()`
- `mpGaugeColor1()`
- `mpGaugeColor2()`
- `mpCostColor()`
- `powerUpColor()`
- `powerDownColor()`
- `ctGaugeColor1()`
- `ctGaugeColor2()`
- `tpGaugeColor1()`
- `tpGaugeColor2()`
- `tpCostColor()`
- `pendingColor()`
- `hpColor(actor)`
- `mpColor(/*actor*/)`
- `tpColor(/*actor*/)`
- `paramchangeTextColor(change)`
- `damageColor(colorType)`
- `outlineColor()`
- `dimColor1()`
- `dimColor2()`
- `itemBackColor1()`
- `itemBackColor2()`

### SceneManager ⭐

シーン遷移を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `run(sceneClass)`
- `initialize()`
- `checkBrowser()`
- `checkPluginErrors()`
- `initGraphics()`
- `initAudio()`
- `initVideo()`
- `initInput()`
- `setupEventHandlers()`
- `update(deltaTime)`
- `determineRepeatNumber(deltaTime)`
- `terminate()`
- `onError(event)`
- `onReject(event)`
- `onUnload()`
- `onKeyDown(event)`
- `reloadGame()`
- `showDevTools()`
- `catchException(e)`
- `catchNormalError(e)`
- `catchLoadError(e)`
- `catchUnknownError(e)`
- `updateMain()`
- `updateFrameCount()`
- `updateInputData()`
- `updateEffekseer()`
- `changeScene()`
- `updateScene()`
- `isGameActive()`
- `onSceneTerminate()`
- `onSceneCreate()`
- `onBeforeSceneStart()`
- `onSceneStart()`
- `isSceneChanging()`
- `isCurrentSceneBusy()`
- `isNextScene(sceneClass)`
- `isPreviousScene(sceneClass)`
- `goto(sceneClass)`
- `push(sceneClass)`
- `pop()`
- `exit()`
- `clearStack()`
- `stop()`
- `prepareNextScene()`
- `snap()`
- `snapForBackground()`
- `backgroundBitmap()`
- `resume()`

### BattleManager ⭐

戦闘進行を管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `setup(troopId, canEscape, canLose)`
- `initMembers()`
- `isTpb()`
- `isActiveTpb()`
- `isBattleTest()`
- `setBattleTest(battleTest)`
- `setEventCallback(callback)`
- `setLogWindow(logWindow)`
- `setSpriteset(spriteset)`
- `onEncounter()`
- `ratePreemptive()`
- `rateSurprise()`
- `saveBgmAndBgs()`
- `playBattleBgm()`
- `playVictoryMe()`
- `playDefeatMe()`
- `replayBgmAndBgs()`
- `makeEscapeRatio()`
- `update(timeActive)`
- `updatePhase(timeActive)`
- `updateEvent()`
- `updateEventMain()`
- `isBusy()`
- `updateTpbInput()`
- `checkTpbInputClose()`
- `checkTpbInputOpen()`
- `isPartyTpbInputtable()`
- `needsActorInputCancel()`
- `isTpbMainPhase()`
- `isInputting()`
- `isInTurn()`
- `isTurnEnd()`
- `isAborting()`
- `isBattleEnd()`
- `canEscape()`
- `canLose()`
- `isEscaped()`
- `actor()`
- `startBattle()`
- `displayStartMessages()`
- `startInput()`
- `inputtingAction()`
- `selectNextCommand()`
- `selectNextActor()`
- `selectPreviousCommand()`
- `selectPreviousActor()`
- `changeCurrentActor(forward)`
- `startActorInput()`
- `finishActorInput()`
- `cancelActorInput()`
- `updateStart()`
- `startTurn()`
- `updateTurn(timeActive)`
- `updateTpb()`
- `updateAllTpbBattlers()`
- `updateTpbBattler(battler)`
- `checkTpbTurnEnd()`
- `processTurn()`
- `endBattlerActions(battler)`
- `endTurn()`
- `updateTurnEnd()`
- `endAllBattlersTurn()`
- `displayBattlerStatus(battler, current)`
- `getNextSubject()`
- `allBattleMembers()`
- `makeActionOrders()`
- `startAction()`
- `updateAction()`
- `endAction()`
- `invokeAction(subject, target)`
- `invokeNormalAction(subject, target)`
- `invokeCounterAttack(subject, target)`
- `invokeMagicReflection(subject, target)`
- `applySubstitute(target)`
- `checkSubstitute(target)`
- `isActionForced()`
- `forceAction(battler)`
- `processForcedAction()`
- `abort()`
- `checkBattleEnd()`
- `checkAbort()`
- `processVictory()`
- `processEscape()`
- `onEscapeSuccess()`
- `onEscapeFailure()`
- `processPartyEscape()`
- `processAbort()`
- `processDefeat()`
- `endBattle(result)`
- `updateBattleEnd()`
- `makeRewards()`
- `displayVictoryMessage()`
- `displayDefeatMessage()`
- `displayEscapeSuccessMessage()`
- `displayEscapeFailureMessage()`
- `displayRewards()`
- `displayExp()`
- `displayGold()`
- `displayDropItems()`
- `gainRewards()`
- `gainExp()`
- `gainGold()`
- `gainDropItems()`

### PluginManager ⭐

プラグインを管理する静的クラス。

- **ソースファイル**: `rmmz_managers.js`


#### 静的メソッド

- `setup(plugins)`
- `parameters(name)`
- `setParameters(name, parameters)`
- `loadScript(filename)`
- `onError(e)`
- `makeUrl(filename)`
- `checkErrors()`
- `throwLoadError(url)`
- `registerCommand(pluginName, commandName, func)`
- `callCommand(self, pluginName, commandName, args)`

---

## Objects

ゲームロジックを構成する `Game_*` クラス群です。セーブデータとして保存されるものが多いです。 ( `rmmz_objects.js` )

### Game_Temp ⭐

セーブデータに含まれない一時データ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `isPlaytest()`
- `setDestination(x, y)`
- `clearDestination()`
- `isDestinationValid()`
- `destinationX()`
- `destinationY()`
- `setTouchState(target, state)`
- `clearTouchState()`
- `touchTarget()`
- `touchState()`
- `requestBattleRefresh()`
- `clearBattleRefreshRequest()`
- `isBattleRefreshRequested()`
- `reserveCommonEvent(commonEventId)`
- `retrieveCommonEvent()`
- `clearCommonEventReservation()`
- `isCommonEventReserved()`
- `retrieveAnimation()`
- `requestBalloon(target, balloonId)`
- `retrieveBalloon()`
- `lastActionData(type)`
- `setLastActionData(type, value)`
- `setLastUsedSkillId(skillID)`
- `setLastUsedItemId(itemID)`
- `setLastSubjectActorId(actorID)`
- `setLastSubjectEnemyIndex(enemyIndex)`
- `setLastTargetActorId(actorID)`
- `setLastTargetEnemyIndex(enemyIndex)`

### Game_System ⭐

システムデータ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `isJapanese()`
- `isChinese()`
- `isKorean()`
- `isCJK()`
- `isRussian()`
- `isSideView()`
- `isAutosaveEnabled()`
- `isMessageSkipEnabled()`
- `isSaveEnabled()`
- `disableSave()`
- `enableSave()`
- `isMenuEnabled()`
- `disableMenu()`
- `enableMenu()`
- `isEncounterEnabled()`
- `disableEncounter()`
- `enableEncounter()`
- `isFormationEnabled()`
- `disableFormation()`
- `enableFormation()`
- `battleCount()`
- `winCount()`
- `escapeCount()`
- `saveCount()`
- `versionId()`
- `savefileId()`
- `setSavefileId(savefileId)`
- `windowTone()`
- `setWindowTone(value)`
- `battleBgm()`
- `setBattleBgm(value)`
- `victoryMe()`
- `setVictoryMe(value)`
- `defeatMe()`
- `setDefeatMe(value)`
- `onBattleStart()`
- `onBattleWin()`
- `onBattleEscape()`
- `onBeforeSave()`
- `onAfterLoad()`
- `playtime()`
- `playtimeText()`
- `saveBgm()`
- `replayBgm()`
- `saveWalkingBgm()`
- `replayWalkingBgm()`
- `saveWalkingBgm2()`
- `mainFontFace()`
- `numberFontFace()`
- `mainFontSize()`
- `windowPadding()`
- `windowOpacity()`

### Game_Timer

タイマー用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `update(sceneActive)`
- `start(count)`
- `stop()`
- `isWorking()`
- `seconds()`
- `frames()`
- `onExpire()`

### Game_Message ⭐

テキストや選択肢などを表示するメッセージウィンドウの状態を管理するゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `clear()`
- `choices()`
- `speakerName()`
- `faceName()`
- `faceIndex()`
- `background()`
- `positionType()`
- `choiceDefaultType()`
- `choiceCancelType()`
- `choiceBackground()`
- `choicePositionType()`
- `numInputVariableId()`
- `numInputMaxDigits()`
- `itemChoiceVariableId()`
- `itemChoiceItypeId()`
- `scrollMode()`
- `scrollSpeed()`
- `scrollNoFast()`
- `add(text)`
- `setSpeakerName(speakerName)`
- `setFaceImage(faceName, faceIndex)`
- `setBackground(background)`
- `setPositionType(positionType)`
- `setChoices(choices, defaultType, cancelType)`
- `setChoiceBackground(background)`
- `setChoicePositionType(positionType)`
- `setNumberInput(variableId, maxDigits)`
- `setItemChoice(variableId, itemType)`
- `setScroll(speed, noFast)`
- `setChoiceCallback(callback)`
- `onChoice(n)`
- `hasText()`
- `isChoice()`
- `isNumberInput()`
- `isItemChoice()`
- `isBusy()`
- `newPage()`
- `allText()`
- `isRTL()`

### Game_Switches

スイッチ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `clear()`
- `value(switchId)`
- `setValue(switchId, value)`
- `onChange()`

### Game_Variables

変数用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `clear()`
- `value(variableId)`
- `setValue(variableId, value)`
- `onChange()`

### Game_SelfSwitches

セルフスイッチ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `clear()`
- `value(key)`
- `setValue(key, value)`
- `onChange()`

### Game_Screen ⭐

色調変更やフラッシュなどの画面エフェクトデータ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `clear()`
- `onBattleStart()`
- `brightness()`
- `tone()`
- `flashColor()`
- `shake()`
- `zoomX()`
- `zoomY()`
- `zoomScale()`
- `weatherType()`
- `weatherPower()`
- `picture(pictureId)`
- `realPictureId(pictureId)`
- `clearFade()`
- `clearTone()`
- `clearFlash()`
- `clearShake()`
- `clearZoom()`
- `clearWeather()`
- `clearPictures()`
- `eraseBattlePictures()`
- `maxPictures()`
- `startFadeOut(duration)`
- `startFadeIn(duration)`
- `startTint(tone, duration)`
- `startFlash(color, duration)`
- `startShake(power, speed, duration)`
- `startZoom(x, y, scale, duration)`
- `setZoom(x, y, scale)`
- `changeWeather(type, power, duration)`
- `update()`
- `updateFadeOut()`
- `updateFadeIn()`
- `updateTone()`
- `updateFlash()`
- `updateShake()`
- `updateZoom()`
- `updateWeather()`
- `updatePictures()`
- `startFlashForDamage()`
- `rotatePicture(pictureId, speed)`
- `tintPicture(pictureId, tone, duration)`
- `erasePicture(pictureId)`

### Game_Picture

ピクチャ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `name()`
- `origin()`
- `x()`
- `y()`
- `scaleX()`
- `scaleY()`
- `opacity()`
- `blendMode()`
- `tone()`
- `angle()`
- `initBasic()`
- `initTarget()`
- `initTone()`
- `initRotation()`
- `rotate(speed)`
- `tint(tone, duration)`
- `update()`
- `updateMove()`
- `updateTone()`
- `updateRotation()`
- `applyEasing(current, target)`
- `calcEasing(t)`
- `easeIn(t, exponent)`
- `easeOut(t, exponent)`
- `easeInOut(t, exponent)`

### Game_Item

スキル・アイテム・武器・防具を扱うゲームオブジェクトクラス。Game_Actionの内部クラスとしても使用される。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(item)`
- `isSkill()`
- `isItem()`
- `isUsableItem()`
- `isWeapon()`
- `isArmor()`
- `isEquipItem()`
- `isNull()`
- `itemId()`
- `object()`
- `setObject(item)`
- `setEquip(isWeapon, itemId)`

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

- `initialize(subject, forcing)`
- `clear()`
- `setSubject(subject)`
- `subject()`
- `friendsUnit()`
- `opponentsUnit()`
- `setEnemyAction(action)`
- `setAttack()`
- `setGuard()`
- `setSkill(skillId)`
- `setItem(itemId)`
- `setItemObject(object)`
- `setTarget(targetIndex)`
- `item()`
- `isSkill()`
- `isItem()`
- `numRepeats()`
- `checkItemScope(list)`
- `isForOpponent()`
- `isForFriend()`
- `isForEveryone()`
- `isForAliveFriend()`
- `isForDeadFriend()`
- `isForUser()`
- `isForOne()`
- `isForRandom()`
- `isForAll()`
- `needsSelection()`
- `numTargets()`
- `checkDamageType(list)`
- `isHpEffect()`
- `isMpEffect()`
- `isDamage()`
- `isRecover()`
- `isDrain()`
- `isHpRecover()`
- `isMpRecover()`
- `isCertainHit()`
- `isPhysical()`
- `isMagical()`
- `isAttack()`
- `isGuard()`
- `isMagicSkill()`
- `decideRandomTarget()`
- `setConfusion()`
- `prepare()`
- `isValid()`
- `speed()`
- `makeTargets()`
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
- `hasItemAnyValidEffects(target)`
- `testItemEffect(target, effect)`
- `itemCnt(target)`
- `itemMrf(target)`
- `itemHit(/*target*/)`
- `itemEva(target)`
- `itemCri(target)`
- `apply(target)`
- `makeDamageValue(target, critical)`
- `evalDamageFormula(target)`
- `calcElementRate(target)`
- `elementsMaxRate(target, elements)`
- `applyCritical(damage)`
- `applyVariance(damage, variance)`
- `applyGuard(damage, target)`
- `executeDamage(target, value)`
- `executeHpDamage(target, value)`
- `executeMpDamage(target, value)`
- `gainDrainedHp(value)`
- `gainDrainedMp(value)`
- `applyItemEffect(target, effect)`
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
- `makeSuccess(target)`
- `applyItemUserEffect(/*target*/)`
- `lukEffectRate(target)`
- `applyGlobal()`
- `updateLastUsed()`
- `updateLastSubject()`
- `updateLastTarget(target)`

### Game_ActionResult

戦闘行動の結果用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `clear()`
- `addedStateObjects()`
- `removedStateObjects()`
- `isStatusAffected()`
- `isHit()`
- `isStateAdded(stateId)`
- `pushAddedState(stateId)`
- `isStateRemoved(stateId)`
- `pushRemovedState(stateId)`
- `isBuffAdded(paramId)`
- `pushAddedBuff(paramId)`
- `isDebuffAdded(paramId)`
- `pushAddedDebuff(paramId)`
- `isBuffRemoved(paramId)`
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

- `initialize()`
- `initMembers()`
- `clearParamPlus()`
- `clearStates()`
- `eraseState(stateId)`
- `isStateAffected(stateId)`
- `isDeathStateAffected()`
- `deathStateId()`
- `resetStateCounts(stateId)`
- `isStateExpired(stateId)`
- `updateStateTurns()`
- `clearBuffs()`
- `eraseBuff(paramId)`
- `buffLength()`
- `buff(paramId)`
- `isBuffAffected(paramId)`
- `isDebuffAffected(paramId)`
- `isBuffOrDebuffAffected(paramId)`
- `isMaxBuffAffected(paramId)`
- `isMaxDebuffAffected(paramId)`
- `increaseBuff(paramId)`
- `decreaseBuff(paramId)`
- `overwriteBuffTurns(paramId, turns)`
- `isBuffExpired(paramId)`
- `updateBuffTurns()`
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
- `traitsWithId(code, id)`
- `traitsPi(code, id)`
- `traitsSum(code, id)`
- `traitsSumAll(code)`
- `traitsSet(code)`
- `paramBase(/*paramId*/)`
- `paramPlus(paramId)`
- `paramBasePlus(paramId)`
- `paramMin(paramId)`
- `paramMax(/*paramId*/)`
- `paramRate(paramId)`
- `paramBuffRate(paramId)`
- `param(paramId)`
- `xparam(xparamId)`
- `sparam(sparamId)`
- `elementRate(elementId)`
- `debuffRate(paramId)`
- `stateRate(stateId)`
- `stateResistSet()`
- `isStateResist(stateId)`
- `attackElements()`
- `attackStates()`
- `attackStatesRate(stateId)`
- `attackSpeed()`
- `attackTimesAdd()`
- `attackSkillId()`
- `addedSkillTypes()`
- `isSkillTypeSealed(stypeId)`
- `addedSkills()`
- `isSkillSealed(skillId)`
- `isEquipWtypeOk(wtypeId)`
- `isEquipAtypeOk(atypeId)`
- `isEquipTypeLocked(etypeId)`
- `isEquipTypeSealed(etypeId)`
- `slotType()`
- `isDualWield()`
- `actionPlusSet()`
- `specialFlag(flagId)`
- `collapseType()`
- `partyAbility(abilityId)`
- `isAutoBattle()`
- `isGuard()`
- `isSubstitute()`
- `isPreserveTp()`
- `addParam(paramId, value)`
- `setHp(hp)`
- `setMp(mp)`
- `setTp(tp)`
- `maxTp()`
- `refresh()`
- `recoverAll()`
- `hpRate()`
- `mpRate()`
- `tpRate()`
- `hide()`
- `appear()`
- `isHidden()`
- `isAppeared()`
- `isDead()`
- `isAlive()`
- `isDying()`
- `isRestricted()`
- `canInput()`
- `canMove()`
- `isConfused()`
- `confusionLevel()`
- `isActor()`
- `isEnemy()`
- `sortStates()`
- `restriction()`
- `addNewState(stateId)`
- `onRestrict()`
- `mostImportantStateText()`
- `stateMotionIndex()`
- `stateOverlayIndex()`
- `isSkillWtypeOk(/*skill*/)`
- `skillMpCost(skill)`
- `skillTpCost(skill)`
- `canPaySkillCost(skill)`
- `paySkillCost(skill)`
- `isOccasionOk(item)`
- `meetsUsableItemConditions(item)`
- `meetsSkillConditions(skill)`
- `meetsItemConditions(item)`
- `canUse(item)`
- `canEquip(item)`
- `canEquipWeapon(item)`
- `canEquipArmor(item)`
- `guardSkillId()`
- `canAttack()`
- `canGuard()`

### Game_Battler ⭐

Game_ActorとGame_Enemyのスーパークラス。スプライトやアクション関連のメソッドを含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → **Game_Battler**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `clearDamagePopup()`
- `clearWeaponAnimation()`
- `clearEffect()`
- `clearMotion()`
- `requestEffect(effectType)`
- `requestMotion(motionType)`
- `requestMotionRefresh()`
- `cancelMotionRefresh()`
- `select()`
- `deselect()`
- `isDamagePopupRequested()`
- `isEffectRequested()`
- `isMotionRequested()`
- `isWeaponAnimationRequested()`
- `isMotionRefreshRequested()`
- `isSelected()`
- `effectType()`
- `motionType()`
- `weaponImageId()`
- `startDamagePopup()`
- `shouldPopupDamage()`
- `startWeaponAnimation(weaponImageId)`
- `action(index)`
- `setAction(index, action)`
- `numActions()`
- `clearActions()`
- `result()`
- `clearResult()`
- `clearTpbChargeTime()`
- `applyTpbPenalty()`
- `initTpbChargeTime(advantageous)`
- `tpbChargeTime()`
- `startTpbCasting()`
- `startTpbAction()`
- `isTpbCharged()`
- `isTpbReady()`
- `isTpbTimeout()`
- `updateTpb()`
- `updateTpbChargeTime()`
- `updateTpbCastTime()`
- `updateTpbAutoBattle()`
- `updateTpbIdleTime()`
- `tpbAcceleration()`
- `tpbRelativeSpeed()`
- `tpbSpeed()`
- `tpbBaseSpeed()`
- `tpbRequiredCastTime()`
- `onTpbCharged()`
- `shouldDelayTpbCharge()`
- `finishTpbCharge()`
- `isTpbTurnEnd()`
- `initTpbTurn()`
- `startTpbTurn()`
- `makeTpbActions()`
- `onTpbTimeout()`
- `turnCount()`
- `canInput()`
- `refresh()`
- `addState(stateId)`
- `isStateAddable(stateId)`
- `isStateRestrict(stateId)`
- `onRestrict()`
- `removeState(stateId)`
- `escape()`
- `addBuff(paramId, turns)`
- `addDebuff(paramId, turns)`
- `removeBuff(paramId)`
- `removeBattleStates()`
- `removeAllBuffs()`
- `removeStatesAuto(timing)`
- `removeBuffsAuto()`
- `removeStatesByDamage()`
- `makeActionTimes()`
- `makeActions()`
- `speed()`
- `makeSpeed()`
- `currentAction()`
- `removeCurrentAction()`
- `setLastTarget(target)`
- `forceAction(skillId, targetIndex)`
- `useItem(item)`
- `consumeItem(item)`
- `gainHp(value)`
- `gainMp(value)`
- `gainTp(value)`
- `gainSilentTp(value)`
- `initTp()`
- `clearTp()`
- `chargeTpByDamage(damageRate)`
- `regenerateHp()`
- `maxSlipDamage()`
- `regenerateMp()`
- `regenerateTp()`
- `regenerateAll()`
- `onBattleStart(advantageous)`
- `onAllActionsEnd()`
- `onTurnEnd()`
- `onBattleEnd()`
- `onDamage(value)`
- `setActionState(actionState)`
- `isUndecided()`
- `isInputting()`
- `isWaiting()`
- `isActing()`
- `isChanting()`
- `isGuardWaiting()`
- `performActionStart(action)`
- `performAction(/*action*/)`
- `performActionEnd()`
- `performDamage()`
- `performMiss()`
- `performRecovery()`
- `performEvasion()`
- `performMagicEvasion()`
- `performCounter()`
- `performReflection()`
- `performSubstitute(/*target*/)`
- `performCollapse()`

### Game_Actor ⭐

アクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Actor**


#### プロパティ

- `level`

#### インスタンスメソッド

- `initialize(actorId)`
- `initMembers()`
- `setup(actorId)`
- `actorId()`
- `actor()`
- `name()`
- `setName(name)`
- `nickname()`
- `setNickname(nickname)`
- `profile()`
- `setProfile(profile)`
- `characterName()`
- `characterIndex()`
- `faceName()`
- `faceIndex()`
- `battlerName()`
- `clearStates()`
- `eraseState(stateId)`
- `resetStateCounts(stateId)`
- `initImages()`
- `expForLevel(level)`
- `initExp()`
- `currentExp()`
- `currentLevelExp()`
- `nextLevelExp()`
- `nextRequiredExp()`
- `maxLevel()`
- `isMaxLevel()`
- `initSkills()`
- `initEquips(equips)`
- `equipSlots()`
- `equips()`
- `weapons()`
- `armors()`
- `hasWeapon(weapon)`
- `hasArmor(armor)`
- `isEquipChangeOk(slotId)`
- `changeEquip(slotId, item)`
- `forceChangeEquip(slotId, item)`
- `tradeItemWithParty(newItem, oldItem)`
- `changeEquipById(etypeId, itemId)`
- `isEquipped(item)`
- `discardEquip(item)`
- `releaseUnequippableItems(forcing)`
- `clearEquipments()`
- `optimizeEquipments()`
- `bestEquipItem(slotId)`
- `calcEquipItemPerformance(item)`
- `isSkillWtypeOk(skill)`
- `isWtypeEquipped(wtypeId)`
- `refresh()`
- `hide()`
- `isActor()`
- `friendsUnit()`
- `opponentsUnit()`
- `index()`
- `isBattleMember()`
- `isFormationChangeOk()`
- `currentClass()`
- `isClass(gameClass)`
- `skillTypes()`
- `skills()`
- `usableSkills()`
- `traitObjects()`
- `attackElements()`
- `hasNoWeapons()`
- `bareHandsElementId()`
- `paramBase(paramId)`
- `paramPlus(paramId)`
- `attackAnimationId1()`
- `attackAnimationId2()`
- `bareHandsAnimationId()`
- `changeExp(exp, show)`
- `levelUp()`
- `levelDown()`
- `findNewSkills(lastSkills)`
- `displayLevelUp(newSkills)`
- `gainExp(exp)`
- `finalExpRate()`
- `benchMembersExpRate()`
- `shouldDisplayLevelUp()`
- `changeLevel(level, show)`
- `learnSkill(skillId)`
- `forgetSkill(skillId)`
- `isLearnedSkill(skillId)`
- `hasSkill(skillId)`
- `changeClass(classId, keepExp)`
- `setFaceImage(faceName, faceIndex)`
- `setBattlerImage(battlerName)`
- `isSpriteVisible()`
- `performActionStart(action)`
- `performAction(action)`
- `performActionEnd()`
- `performAttack()`
- `performDamage()`
- `performEvasion()`
- `performMagicEvasion()`
- `performCounter()`
- `performCollapse()`
- `performVictory()`
- `performEscape()`
- `makeActionList()`
- `makeAutoBattleActions()`
- `makeConfusionActions()`
- `makeActions()`
- `onPlayerWalk()`
- `updateStateSteps(state)`
- `showAddedStates()`
- `showRemovedStates()`
- `stepsForTurn()`
- `turnEndOnMap()`
- `checkFloorEffect()`
- `executeFloorDamage()`
- `basicFloorDamage()`
- `maxFloorDamage()`
- `performMapDamage()`
- `clearActions()`
- `inputtingAction()`
- `selectNextCommand()`
- `selectPreviousCommand()`
- `lastSkill()`
- `lastMenuSkill()`
- `setLastMenuSkill(skill)`
- `lastBattleSkill()`
- `setLastBattleSkill(skill)`
- `lastCommandSymbol()`
- `setLastCommandSymbol(symbol)`
- `testEscape(item)`
- `meetsUsableItemConditions(item)`
- `onEscapeFailure()`

### Game_Enemy ⭐

敵キャラクター用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Enemy**


#### インスタンスメソッド

- `initialize(enemyId, x, y)`
- `initMembers()`
- `setup(enemyId, x, y)`
- `isEnemy()`
- `friendsUnit()`
- `opponentsUnit()`
- `index()`
- `isBattleMember()`
- `enemyId()`
- `enemy()`
- `traitObjects()`
- `paramBase(paramId)`
- `exp()`
- `gold()`
- `makeDropItems()`
- `dropItemRate()`
- `itemObject(kind, dataId)`
- `isSpriteVisible()`
- `screenX()`
- `screenY()`
- `battlerName()`
- `battlerHue()`
- `originalName()`
- `name()`
- `isLetterEmpty()`
- `setLetter(letter)`
- `setPlural(plural)`
- `performActionStart(action)`
- `performAction(action)`
- `performActionEnd()`
- `performDamage()`
- `performCollapse()`
- `transform(enemyId)`
- `meetsCondition(action)`
- `meetsTurnCondition(param1, param2)`
- `meetsHpCondition(param1, param2)`
- `meetsMpCondition(param1, param2)`
- `meetsStateCondition(param)`
- `meetsPartyLevelCondition(param)`
- `meetsSwitchCondition(param)`
- `isActionValid(action)`
- `selectAction(actionList, ratingZero)`
- `selectAllActions(actionList)`
- `makeActions()`

### Game_Actors

アクター配列のラッパークラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `actor(actorId)`

### Game_Unit

Game_PartyとGame_Troopのスーパークラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `inBattle()`
- `members()`
- `aliveMembers()`
- `deadMembers()`
- `movableMembers()`
- `clearActions()`
- `agility()`
- `tgrSum()`
- `randomTarget()`
- `randomDeadTarget()`
- `smoothTarget(index)`
- `smoothDeadTarget(index)`
- `clearResults()`
- `onBattleStart(advantageous)`
- `onBattleEnd()`
- `makeActions()`
- `select(activeMember)`
- `isAllDead()`
- `substituteBattler(target)`
- `tpbBaseSpeed()`
- `tpbReferenceTime()`
- `updateTpb()`

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

- `initialize()`
- `initAllItems()`
- `exists()`
- `size()`
- `isEmpty()`
- `members()`
- `allMembers()`
- `battleMembers()`
- `hiddenBattleMembers()`
- `allBattleMembers()`
- `maxBattleMembers()`
- `leader()`
- `removeInvalidMembers()`
- `reviveBattleMembers()`
- `items()`
- `weapons()`
- `armors()`
- `equipItems()`
- `allItems()`
- `itemContainer(item)`
- `setupStartingMembers()`
- `name()`
- `setupBattleTest()`
- `setupBattleTestMembers()`
- `setupBattleTestItems()`
- `highestLevel()`
- `addActor(actorId)`
- `removeActor(actorId)`
- `gold()`
- `gainGold(amount)`
- `loseGold(amount)`
- `maxGold()`
- `steps()`
- `increaseSteps()`
- `numItems(item)`
- `maxItems(/*item*/)`
- `hasMaxItems(item)`
- `hasItem(item, includeEquip)`
- `isAnyMemberEquipped(item)`
- `gainItem(item, amount, includeEquip)`
- `discardMembersEquip(item, amount)`
- `loseItem(item, amount, includeEquip)`
- `consumeItem(item)`
- `canUse(item)`
- `canInput()`
- `isAllDead()`
- `isEscaped()`
- `onPlayerWalk()`
- `menuActor()`
- `setMenuActor(actor)`
- `makeMenuActorNext()`
- `makeMenuActorPrevious()`
- `targetActor()`
- `setTargetActor(actor)`
- `lastItem()`
- `setLastItem(item)`
- `swapOrder(index1, index2)`
- `charactersForSavefile()`
- `facesForSavefile()`
- `partyAbility(abilityId)`
- `hasEncounterHalf()`
- `hasEncounterNone()`
- `hasCancelSurprise()`
- `hasRaisePreemptive()`
- `hasGoldDouble()`
- `hasDropItemDouble()`
- `ratePreemptive(troopAgi)`
- `rateSurprise(troopAgi)`
- `performVictory()`
- `performEscape()`
- `removeBattleStates()`
- `requestMotionRefresh()`
- `onEscapeFailure()`

### Game_Troop ⭐

敵グループおよび戦闘関連データ用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_Unit` → **Game_Troop**


#### インスタンスメソッド

- `initialize()`
- `isEventRunning()`
- `updateInterpreter()`
- `turnCount()`
- `members()`
- `clear()`
- `troop()`
- `setup(troopId)`
- `makeUniqueNames()`
- `updatePluralFlags()`
- `letterTable()`
- `enemyNames()`
- `meetsConditions(page)`
- `setupBattleEvent()`
- `increaseTurn()`
- `expTotal()`
- `goldTotal()`
- `goldRate()`
- `makeDropItems()`
- `isTpbTurnEnd()`

### Game_Map ⭐

マップ用のゲームオブジェクトクラス。スクロールや通行判定の機能を含む。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `setup(mapId)`
- `isEventRunning()`
- `tileWidth()`
- `tileHeight()`
- `bushDepth()`
- `mapId()`
- `tilesetId()`
- `displayX()`
- `displayY()`
- `parallaxName()`
- `battleback1Name()`
- `battleback2Name()`
- `requestRefresh()`
- `isNameDisplayEnabled()`
- `disableNameDisplay()`
- `enableNameDisplay()`
- `createVehicles()`
- `refereshVehicles()`
- `vehicles()`
- `vehicle(type)`
- `boat()`
- `ship()`
- `airship()`
- `setupEvents()`
- `events()`
- `event(eventId)`
- `eraseEvent(eventId)`
- `autorunCommonEvents()`
- `parallelCommonEvents()`
- `setupScroll()`
- `setupParallax()`
- `setupBattleback()`
- `setDisplayPos(x, y)`
- `parallaxOx()`
- `parallaxOy()`
- `tileset()`
- `tilesetFlags()`
- `displayName()`
- `width()`
- `height()`
- `data()`
- `isLoopHorizontal()`
- `isLoopVertical()`
- `isDashDisabled()`
- `encounterList()`
- `encounterStep()`
- `isOverworld()`
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
- `refreshIfNeeded()`
- `refresh()`
- `refreshTileEvents()`
- `eventsXy(x, y)`
- `eventsXyNt(x, y)`
- `tileEventsXy(x, y)`
- `eventIdXy(x, y)`
- `scrollDown(distance)`
- `scrollLeft(distance)`
- `scrollRight(distance)`
- `scrollUp(distance)`
- `isValid(x, y)`
- `checkPassage(x, y, bit)`
- `tileId(x, y, z)`
- `layeredTiles(x, y)`
- `allTiles(x, y)`
- `autotileType(x, y, z)`
- `isPassable(x, y, d)`
- `isBoatPassable(x, y)`
- `isShipPassable(x, y)`
- `isAirshipLandOk(x, y)`
- `checkLayeredTilesFlags(x, y, bit)`
- `isLadder(x, y)`
- `isBush(x, y)`
- `isCounter(x, y)`
- `isDamageFloor(x, y)`
- `terrainTag(x, y)`
- `regionId(x, y)`
- `startScroll(direction, distance, speed)`
- `isScrolling()`
- `update(sceneActive)`
- `updateScroll()`
- `scrollDistance()`
- `doScroll(direction, distance)`
- `updateEvents()`
- `updateVehicles()`
- `updateParallax()`
- `changeTileset(tilesetId)`
- `changeParallax(name, loopX, loopY, sx, sy)`
- `updateInterpreter()`
- `unlockEvent(eventId)`
- `setupStartingEvent()`
- `setupTestEvent()`
- `setupStartingMapEvent()`
- `setupAutorunCommonEvent()`
- `isAnyEventStarting()`

### Game_CommonEvent

コモンイベント用のゲームオブジェクトクラス。並列実行の機能を含む。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(commonEventId)`
- `event()`
- `list()`
- `refresh()`
- `isActive()`
- `update()`

### Game_CharacterBase ⭐

Game_Characterのスーパークラス。座標や画像などの基本情報を扱う。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `pos(x, y)`
- `posNt(x, y)`
- `moveSpeed()`
- `setMoveSpeed(moveSpeed)`
- `moveFrequency()`
- `setMoveFrequency(moveFrequency)`
- `opacity()`
- `setOpacity(opacity)`
- `blendMode()`
- `setBlendMode(blendMode)`
- `isNormalPriority()`
- `setPriorityType(priorityType)`
- `isMoving()`
- `isJumping()`
- `jumpHeight()`
- `isStopping()`
- `checkStop(threshold)`
- `resetStopCount()`
- `realMoveSpeed()`
- `distancePerFrame()`
- `isDashing()`
- `isDebugThrough()`
- `straighten()`
- `reverseDir(d)`
- `canPass(x, y, d)`
- `canPassDiagonally(x, y, horz, vert)`
- `isMapPassable(x, y, d)`
- `isCollidedWithCharacters(x, y)`
- `isCollidedWithEvents(x, y)`
- `isCollidedWithVehicles(x, y)`
- `setPosition(x, y)`
- `copyPosition(character)`
- `locate(x, y)`
- `direction()`
- `setDirection(d)`
- `isTile()`
- `isObjectCharacter()`
- `shiftY()`
- `scrolledX()`
- `scrolledY()`
- `screenX()`
- `screenY()`
- `screenZ()`
- `isNearTheScreen()`
- `update()`
- `updateStop()`
- `updateJump()`
- `updateMove()`
- `updateAnimation()`
- `animationWait()`
- `updateAnimationCount()`
- `updatePattern()`
- `maxPattern()`
- `pattern()`
- `setPattern(pattern)`
- `isOriginalPattern()`
- `resetPattern()`
- `refreshBushDepth()`
- `isOnLadder()`
- `isOnBush()`
- `terrainTag()`
- `regionId()`
- `increaseSteps()`
- `tileId()`
- `characterName()`
- `characterIndex()`
- `setTileImage(tileId)`
- `checkEventTriggerTouchFront(d)`
- `checkEventTriggerTouch(/*x, y*/)`
- `isMovementSucceeded(/*x, y*/)`
- `setMovementSuccess(success)`
- `moveStraight(d)`
- `moveDiagonally(horz, vert)`
- `jump(xPlus, yPlus)`
- `hasWalkAnime()`
- `setWalkAnime(walkAnime)`
- `hasStepAnime()`
- `setStepAnime(stepAnime)`
- `isDirectionFixed()`
- `setDirectionFix(directionFix)`
- `isThrough()`
- `setThrough(through)`
- `isTransparent()`
- `bushDepth()`
- `setTransparent(transparent)`
- `startAnimation()`
- `startBalloon()`
- `isAnimationPlaying()`
- `isBalloonPlaying()`
- `endAnimation()`
- `endBalloon()`

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

- `initialize()`
- `initMembers()`
- `memorizeMoveRoute()`
- `restoreMoveRoute()`
- `isMoveRouteForcing()`
- `setMoveRoute(moveRoute)`
- `forceMoveRoute(moveRoute)`
- `updateStop()`
- `updateRoutineMove()`
- `processMoveCommand(command)`
- `deltaXFrom(x)`
- `deltaYFrom(y)`
- `moveRandom()`
- `moveTowardCharacter(character)`
- `moveAwayFromCharacter(character)`
- `turnTowardCharacter(character)`
- `turnAwayFromCharacter(character)`
- `turnTowardPlayer()`
- `turnAwayFromPlayer()`
- `moveTowardPlayer()`
- `moveAwayFromPlayer()`
- `moveForward()`
- `moveBackward()`
- `processRouteEnd()`
- `advanceMoveRouteIndex()`
- `turnRight90()`
- `turnLeft90()`
- `turn180()`
- `turnRightOrLeft90()`
- `turnRandom()`
- `swap(character)`
- `findDirectionTo(goalX, goalY)`
- `searchLimit()`

### Game_Player ⭐

プレイヤーキャラクター用のゲームオブジェクトクラス。イベント開始やマップスクロール機能を含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Player**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `clearTransferInfo()`
- `followers()`
- `refresh()`
- `isStopping()`
- `reserveTransfer(mapId, x, y, d, fadeType)`
- `setupForNewGame()`
- `requestMapReload()`
- `isTransferring()`
- `newMapId()`
- `fadeType()`
- `performTransfer()`
- `isMapPassable(x, y, d)`
- `vehicle()`
- `isInBoat()`
- `isInShip()`
- `isInAirship()`
- `isInVehicle()`
- `isNormal()`
- `isDashing()`
- `isDebugThrough()`
- `isCollided(x, y)`
- `centerX()`
- `centerY()`
- `center(x, y)`
- `locate(x, y)`
- `increaseSteps()`
- `makeEncounterCount()`
- `makeEncounterTroopId()`
- `meetsEncounterConditions(encounter)`
- `executeEncounter()`
- `startMapEvent(x, y, triggers, normal)`
- `moveByInput()`
- `canMove()`
- `getInputDirection()`
- `executeMove(direction)`
- `update(sceneActive)`
- `updateDashing()`
- `isDashButtonPressed()`
- `updateScroll(lastScrolledX, lastScrolledY)`
- `updateVehicle()`
- `updateVehicleGetOn()`
- `updateVehicleGetOff()`
- `updateNonmoving(wasMoving, sceneActive)`
- `triggerAction()`
- `triggerButtonAction()`
- `triggerTouchAction()`
- `triggerTouchActionD1(x1, y1)`
- `triggerTouchActionD2(x2, y2)`
- `triggerTouchActionD3(x2, y2)`
- `updateEncounterCount()`
- `canEncounter()`
- `encounterProgressValue()`
- `checkEventTriggerHere(triggers)`
- `checkEventTriggerThere(triggers)`
- `checkEventTriggerTouch(x, y)`
- `canStartLocalEvents()`
- `getOnOffVehicle()`
- `getOnVehicle()`
- `getOffVehicle()`
- `forceMoveForward()`
- `isOnDamageFloor()`
- `moveStraight(d)`
- `moveDiagonally(horz, vert)`
- `jump(xPlus, yPlus)`
- `showFollowers()`
- `hideFollowers()`
- `gatherFollowers()`
- `areFollowersGathering()`
- `areFollowersGathered()`

### Game_Follower

隊列歩行のフォロワー用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Follower**


#### インスタンスメソッド

- `initialize(memberIndex)`
- `refresh()`
- `actor()`
- `isVisible()`
- `isGathered()`
- `update()`
- `chaseCharacter(character)`

### Game_Followers

フォロワー配列のラッパークラス。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize()`
- `setup()`
- `isVisible()`
- `show()`
- `hide()`
- `data()`
- `reverseData()`
- `follower(index)`
- `refresh()`
- `update()`
- `updateMove()`
- `jumpAll()`
- `synchronize(x, y, d)`
- `gather()`
- `areGathering()`
- `visibleFollowers()`
- `areMoving()`
- `areGathered()`
- `isSomeoneCollided(x, y)`

### Game_Vehicle

乗り物用のゲームオブジェクトクラス。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Vehicle**


#### インスタンスメソッド

- `initialize(type)`
- `initMembers()`
- `isBoat()`
- `isShip()`
- `isAirship()`
- `resetDirection()`
- `initMoveSpeed()`
- `vehicle()`
- `loadSystemSettings()`
- `refresh()`
- `setLocation(mapId, x, y)`
- `pos(x, y)`
- `isMapPassable(x, y, d)`
- `getOn()`
- `getOff()`
- `setBgm(bgm)`
- `playBgm()`
- `syncWithPlayer()`
- `screenY()`
- `shadowX()`
- `shadowY()`
- `shadowOpacity()`
- `canMove()`
- `update()`
- `updateAirship()`
- `updateAirshipAltitude()`
- `maxAltitude()`
- `isLowest()`
- `isHighest()`
- `isTakeoffOk()`
- `isLandOk(x, y, d)`

### Game_Event ⭐

イベント用のゲームオブジェクトクラス。イベントページの切り替えや並列処理の機能を含む。

- **ソースファイル**: `rmmz_objects.js`
- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Event**


#### インスタンスメソッド

- `initialize(mapId, eventId)`
- `initMembers()`
- `eventId()`
- `event()`
- `page()`
- `list()`
- `isCollidedWithCharacters(x, y)`
- `isCollidedWithEvents(x, y)`
- `isCollidedWithPlayerCharacters(x, y)`
- `lock()`
- `unlock()`
- `updateStop()`
- `updateSelfMovement()`
- `stopCountThreshold()`
- `moveTypeRandom()`
- `moveTypeTowardPlayer()`
- `isNearThePlayer()`
- `moveTypeCustom()`
- `isStarting()`
- `clearStartingFlag()`
- `isTriggerIn(triggers)`
- `start()`
- `erase()`
- `refresh()`
- `findProperPageIndex()`
- `meetsConditions(page)`
- `setupPage()`
- `clearPageSettings()`
- `setupPageSettings()`
- `isOriginalPattern()`
- `resetPattern()`
- `checkEventTriggerTouch(x, y)`
- `checkEventTriggerAuto()`
- `update()`
- `updateParallel()`
- `locate(x, y)`
- `forceMoveRoute(moveRoute)`

### Game_Interpreter ⭐

イベントコマンドを実行するインタプリタ。

- **ソースファイル**: `rmmz_objects.js`


#### インスタンスメソッド

- `initialize(depth)`
- `checkOverflow()`
- `clear()`
- `setup(list, eventId)`
- `loadImages()`
- `eventId()`
- `isOnCurrentMap()`
- `setupReservedCommonEvent()`
- `isRunning()`
- `update()`
- `updateChild()`
- `updateWait()`
- `updateWaitCount()`
- `updateWaitMode()`
- `setWaitMode(waitMode)`
- `wait(duration)`
- `fadeSpeed()`
- `executeCommand()`
- `checkFreeze()`
- `terminate()`
- `skipBranch()`
- `currentCommand()`
- `nextEventCode()`
- `iterateActorId(param, callback)`
- `iterateActorEx(param1, param2, callback)`
- `iterateActorIndex(param, callback)`
- `iterateEnemyIndex(param, callback)`
- `iterateBattler(param1, param2, callback)`
- `character(param)`
- `changeHp(target, value, allowDeath)`
- `command101(params)`
- `command102(params)`
- `setupChoices(params)`
- `command402(params)`
- `command403()`
- `command103(params)`
- `setupNumInput(params)`
- `command104(params)`
- `setupItemChoice(params)`
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
- `setupChild(list, eventId)`
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

- `initialize()`
- `create()`
- `isActive()`
- `isReady()`
- `start()`
- `update()`
- `stop()`
- `isStarted()`
- `isBusy()`
- `isFading()`
- `terminate()`
- `createWindowLayer()`
- `addWindow(window)`
- `startFadeIn(duration, white)`
- `startFadeOut(duration, white)`
- `createColorFilter()`
- `updateColorFilter()`
- `updateFade()`
- `updateChildren()`
- `popScene()`
- `checkGameover()`
- `fadeOutAll()`
- `fadeSpeed()`
- `slowFadeSpeed()`
- `scaleSprite(sprite)`
- `centerSprite(sprite)`
- `isBottomHelpMode()`
- `isBottomButtonMode()`
- `isRightInputMode()`
- `mainCommandWidth()`
- `buttonAreaTop()`
- `buttonAreaBottom()`
- `buttonAreaHeight()`
- `buttonY()`
- `calcWindowHeight(numLines, selectable)`
- `requestAutosave()`
- `isAutosaveEnabled()`
- `executeAutosave()`
- `onAutosaveSuccess()`
- `onAutosaveFailure()`

### Scene_Boot ⭐

ゲーム全体の初期化を行うシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Boot**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `isReady()`
- `onDatabaseLoaded()`
- `setEncryptionInfo()`
- `loadSystemImages()`
- `loadPlayerData()`
- `loadGameFonts()`
- `isPlayerDataLoaded()`
- `start()`
- `startNormalGame()`
- `resizeScreen()`
- `adjustBoxSize()`
- `adjustWindow()`
- `screenScale()`
- `updateDocumentTitle()`
- `checkPlayerLocation()`

### Scene_Splash

スプラッシュ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Splash**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `start()`
- `update()`
- `stop()`
- `createBackground()`
- `adjustBackground()`
- `isEnabled()`
- `initWaitCount()`
- `updateWaitCount()`
- `checkSkip()`
- `gotoTitle()`

### Scene_Title ⭐

タイトル画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Title**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `start()`
- `update()`
- `isBusy()`
- `terminate()`
- `createBackground()`
- `createForeground()`
- `drawGameTitle()`
- `adjustBackground()`
- `createCommandWindow()`
- `commandWindowRect()`
- `commandNewGame()`
- `commandContinue()`
- `commandOptions()`
- `playTitleMusic()`

### Scene_Message

Scene_MapとScene_Battleのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Message**


#### インスタンスメソッド

- `initialize()`
- `isMessageWindowClosing()`
- `createAllWindows()`
- `createMessageWindow()`
- `messageWindowRect()`
- `createScrollTextWindow()`
- `scrollTextWindowRect()`
- `createGoldWindow()`
- `goldWindowRect()`
- `createNameBoxWindow()`
- `createChoiceListWindow()`
- `createNumberInputWindow()`
- `createEventItemWindow()`
- `eventItemWindowRect()`
- `associateWindows()`
- `cancelMessageWait()`

### Scene_Map ⭐

マップ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Map**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `isReady()`
- `onMapLoaded()`
- `onTransfer()`
- `start()`
- `onTransferEnd()`
- `shouldAutosave()`
- `update()`
- `updateMainMultiply()`
- `updateMain()`
- `isPlayerActive()`
- `isFastForward()`
- `stop()`
- `isBusy()`
- `terminate()`
- `needsFadeIn()`
- `needsSlowFadeOut()`
- `updateWaitCount()`
- `updateDestination()`
- `updateMenuButton()`
- `hideMenuButton()`
- `updateMapNameWindow()`
- `isMenuEnabled()`
- `isMapTouchOk()`
- `processMapTouch()`
- `isAnyButtonPressed()`
- `onMapTouch()`
- `isSceneChangeOk()`
- `updateScene()`
- `createDisplayObjects()`
- `createSpriteset()`
- `createAllWindows()`
- `createMapNameWindow()`
- `mapNameWindowRect()`
- `createButtons()`
- `createMenuButton()`
- `updateTransferPlayer()`
- `updateEncounter()`
- `updateCallMenu()`
- `isMenuCalled()`
- `callMenu()`
- `updateCallDebug()`
- `isDebugCalled()`
- `fadeInForTransfer()`
- `fadeOutForTransfer()`
- `launchBattle()`
- `stopAudioOnBattleStart()`
- `startEncounterEffect()`
- `updateEncounterEffect()`
- `snapForBattleBackground()`
- `startFlashForEncounter(duration)`
- `encounterEffectSpeed()`

### Scene_MenuBase ⭐

すべてのメニュー系シーンのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_MenuBase**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `update()`
- `helpAreaTop()`
- `helpAreaBottom()`
- `helpAreaHeight()`
- `mainAreaTop()`
- `mainAreaBottom()`
- `mainAreaHeight()`
- `actor()`
- `updateActor()`
- `createBackground()`
- `setBackgroundOpacity(opacity)`
- `createHelpWindow()`
- `helpWindowRect()`
- `createButtons()`
- `needsCancelButton()`
- `createCancelButton()`
- `needsPageButtons()`
- `createPageButtons()`
- `updatePageButtons()`
- `arePageButtonsEnabled()`
- `nextActor()`
- `previousActor()`
- `onActorChange()`

### Scene_Menu ⭐

メニュー画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Menu**


#### インスタンスメソッド

- `initialize()`
- `helpAreaHeight()`
- `create()`
- `start()`
- `createCommandWindow()`
- `commandWindowRect()`
- `createGoldWindow()`
- `goldWindowRect()`
- `createStatusWindow()`
- `statusWindowRect()`
- `commandItem()`
- `commandPersonal()`
- `commandFormation()`
- `commandOptions()`
- `commandSave()`
- `commandGameEnd()`
- `onPersonalOk()`
- `onPersonalCancel()`
- `onFormationOk()`
- `onFormationCancel()`

### Scene_ItemBase

Scene_ItemとScene_Skillのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_ItemBase**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `createActorWindow()`
- `actorWindowRect()`
- `item()`
- `user()`
- `isCursorLeft()`
- `showActorWindow()`
- `hideActorWindow()`
- `isActorWindowActive()`
- `onActorOk()`
- `onActorCancel()`
- `determineItem()`
- `useItem()`
- `activateItemWindow()`
- `itemTargetActors()`
- `canUse()`
- `isItemEffectsValid()`
- `applyItem()`
- `checkCommonEvent()`

### Scene_Item

アイテム画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Item**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `createCategoryWindow()`
- `categoryWindowRect()`
- `createItemWindow()`
- `itemWindowRect()`
- `user()`
- `onCategoryOk()`
- `onItemOk()`
- `onItemCancel()`
- `playSeForItem()`
- `useItem()`

### Scene_Skill

スキル画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Skill**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `start()`
- `createSkillTypeWindow()`
- `skillTypeWindowRect()`
- `createStatusWindow()`
- `statusWindowRect()`
- `createItemWindow()`
- `itemWindowRect()`
- `needsPageButtons()`
- `arePageButtonsEnabled()`
- `refreshActor()`
- `user()`
- `commandSkill()`
- `onItemOk()`
- `onItemCancel()`
- `playSeForItem()`
- `useItem()`
- `onActorChange()`

### Scene_Equip

装備画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Equip**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `createStatusWindow()`
- `statusWindowRect()`
- `createCommandWindow()`
- `commandWindowRect()`
- `createSlotWindow()`
- `slotWindowRect()`
- `createItemWindow()`
- `itemWindowRect()`
- `statusWidth()`
- `needsPageButtons()`
- `arePageButtonsEnabled()`
- `refreshActor()`
- `commandEquip()`
- `commandOptimize()`
- `commandClear()`
- `onSlotOk()`
- `onSlotCancel()`
- `onItemOk()`
- `executeEquipChange()`
- `onItemCancel()`
- `onActorChange()`
- `hideItemWindow()`

### Scene_Status

ステータス画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Status**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `helpAreaHeight()`
- `createProfileWindow()`
- `profileWindowRect()`
- `createStatusWindow()`
- `statusWindowRect()`
- `createStatusParamsWindow()`
- `statusParamsWindowRect()`
- `createStatusEquipWindow()`
- `statusEquipWindowRect()`
- `statusParamsWidth()`
- `statusParamsHeight()`
- `profileHeight()`
- `start()`
- `needsPageButtons()`
- `refreshActor()`
- `onActorChange()`

### Scene_Options

オプション画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Options**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `terminate()`
- `createOptionsWindow()`
- `optionsWindowRect()`
- `maxCommands()`
- `maxVisibleCommands()`

### Scene_File

Scene_SaveとScene_Loadのスーパークラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_File**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `helpAreaHeight()`
- `start()`
- `savefileId()`
- `isSavefileEnabled(savefileId)`
- `createHelpWindow()`
- `helpWindowRect()`
- `createListWindow()`
- `listWindowRect()`
- `mode()`
- `needsAutosave()`
- `activateListWindow()`
- `helpWindowText()`
- `firstSavefileId()`
- `onSavefileOk()`

### Scene_Save

セーブ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Save**


#### インスタンスメソッド

- `initialize()`
- `mode()`
- `helpWindowText()`
- `firstSavefileId()`
- `onSavefileOk()`
- `executeSave(savefileId)`
- `onSaveSuccess()`
- `onSaveFailure()`

### Scene_Load

ロード画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Load**


#### インスタンスメソッド

- `initialize()`
- `terminate()`
- `mode()`
- `helpWindowText()`
- `firstSavefileId()`
- `onSavefileOk()`
- `executeLoad(savefileId)`
- `onLoadSuccess()`
- `onLoadFailure()`
- `reloadMapIfUpdated()`

### Scene_GameEnd

ゲーム終了画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_GameEnd**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `stop()`
- `createBackground()`
- `createCommandWindow()`
- `commandWindowRect()`
- `commandToTitle()`

### Scene_Shop

ショップ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Shop**


#### インスタンスメソッド

- `initialize()`
- `prepare(goods, purchaseOnly)`
- `create()`
- `createGoldWindow()`
- `goldWindowRect()`
- `createCommandWindow()`
- `commandWindowRect()`
- `createDummyWindow()`
- `dummyWindowRect()`
- `createNumberWindow()`
- `numberWindowRect()`
- `createStatusWindow()`
- `statusWindowRect()`
- `createBuyWindow()`
- `buyWindowRect()`
- `createCategoryWindow()`
- `categoryWindowRect()`
- `createSellWindow()`
- `sellWindowRect()`
- `statusWidth()`
- `activateBuyWindow()`
- `activateSellWindow()`
- `commandBuy()`
- `commandSell()`
- `onBuyOk()`
- `onBuyCancel()`
- `onCategoryOk()`
- `onCategoryCancel()`
- `onSellOk()`
- `onSellCancel()`
- `onNumberOk()`
- `onNumberCancel()`
- `doBuy(number)`
- `doSell(number)`
- `endNumberInput()`
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

- `initialize()`
- `prepare(actorId, maxLength)`
- `create()`
- `start()`
- `createEditWindow()`
- `editWindowRect()`
- `createInputWindow()`
- `inputWindowRect()`
- `onInputOk()`

### Scene_Debug

デバッグ画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Debug**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `needsCancelButton()`
- `createRangeWindow()`
- `rangeWindowRect()`
- `createEditWindow()`
- `editWindowRect()`
- `createDebugHelpWindow()`
- `debugHelpWindowRect()`
- `onRangeOk()`
- `onEditCancel()`
- `refreshHelpWindow()`
- `helpText()`

### Scene_Battle ⭐

戦闘画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Battle**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `start()`
- `update()`
- `updateVisibility()`
- `updateBattleProcess()`
- `isTimeActive()`
- `isAnyInputWindowActive()`
- `changeInputWindow()`
- `stop()`
- `terminate()`
- `shouldAutosave()`
- `needsSlowFadeOut()`
- `updateLogWindowVisibility()`
- `updateStatusWindowVisibility()`
- `shouldOpenStatusWindow()`
- `updateStatusWindowPosition()`
- `statusWindowX()`
- `updateInputWindowVisibility()`
- `needsInputWindowChange()`
- `updateCancelButton()`
- `createDisplayObjects()`
- `createSpriteset()`
- `createAllWindows()`
- `createLogWindow()`
- `logWindowRect()`
- `createStatusWindow()`
- `statusWindowRect()`
- `createPartyCommandWindow()`
- `partyCommandWindowRect()`
- `createActorCommandWindow()`
- `actorCommandWindowRect()`
- `createHelpWindow()`
- `helpWindowRect()`
- `createSkillWindow()`
- `skillWindowRect()`
- `createItemWindow()`
- `itemWindowRect()`
- `createActorWindow()`
- `actorWindowRect()`
- `createEnemyWindow()`
- `enemyWindowRect()`
- `helpAreaTop()`
- `helpAreaBottom()`
- `helpAreaHeight()`
- `buttonAreaTop()`
- `windowAreaHeight()`
- `createButtons()`
- `createCancelButton()`
- `closeCommandWindows()`
- `hideSubInputWindows()`
- `startPartyCommandSelection()`
- `commandFight()`
- `commandEscape()`
- `startActorCommandSelection()`
- `commandAttack()`
- `commandSkill()`
- `commandGuard()`
- `commandItem()`
- `commandCancel()`
- `selectNextCommand()`
- `selectPreviousCommand()`
- `startActorSelection()`
- `onActorOk()`
- `onActorCancel()`
- `startEnemySelection()`
- `onEnemyOk()`
- `onEnemyCancel()`
- `onSkillOk()`
- `onSkillCancel()`
- `onItemOk()`
- `onItemCancel()`
- `onSelectAction()`
- `endCommandSelection()`

### Scene_Gameover

ゲームオーバー画面のシーンクラス。

- **ソースファイル**: `rmmz_scenes.js`
- **継承**: `Stage` → `Scene_Base` → **Scene_Gameover**


#### インスタンスメソッド

- `initialize()`
- `create()`
- `start()`
- `update()`
- `stop()`
- `terminate()`
- `playGameoverMusic()`
- `createBackground()`
- `adjustBackground()`
- `isTriggered()`
- `gotoTitle()`

---

## Sprites

ゲーム画面に描画されるスプライトの `Sprite_*` / `Spriteset_*` クラス群です。 ( `rmmz_sprites.js` )

### Sprite_Clickable ⭐

クリック処理機能を持つスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Clickable**


#### インスタンスメソッド

- `initialize()`
- `update()`
- `processTouch()`
- `isPressed()`
- `isClickEnabled()`
- `isBeingTouched()`
- `hitTest(x, y)`
- `onMouseEnter()`
- `onMouseExit()`
- `onPress()`
- `onClick()`

### Sprite_Button

ボタン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Button**


#### インスタンスメソッド

- `initialize(buttonType)`
- `setupFrames()`
- `blockWidth()`
- `blockHeight()`
- `loadButtonImage()`
- `buttonData()`
- `update()`
- `checkBitmap()`
- `updateFrame()`
- `updateOpacity()`
- `setColdFrame(x, y, width, height)`
- `setHotFrame(x, y, width, height)`
- `setClickHandler(method)`
- `onClick()`

### Sprite_Character ⭐

キャラクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Character**


#### インスタンスメソッド

- `initialize(character)`
- `initMembers()`
- `setCharacter(character)`
- `checkCharacter(character)`
- `update()`
- `updateVisibility()`
- `isTile()`
- `isObjectCharacter()`
- `isEmptyCharacter()`
- `tilesetBitmap(tileId)`
- `updateBitmap()`
- `isImageChanged()`
- `setTileBitmap()`
- `setCharacterBitmap()`
- `updateFrame()`
- `updateTileFrame()`
- `updateCharacterFrame()`
- `characterBlockX()`
- `characterBlockY()`
- `characterPatternX()`
- `characterPatternY()`
- `patternWidth()`
- `patternHeight()`
- `updateHalfBodySprites()`
- `createHalfBodySprites()`
- `updatePosition()`
- `updateOther()`

### Sprite_Battler ⭐

Sprite_ActorとSprite_Enemyのスーパークラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Battler**


#### インスタンスメソッド

- `initialize(battler)`
- `initMembers()`
- `setBattler(battler)`
- `checkBattler(battler)`
- `mainSprite()`
- `setHome(x, y)`
- `update()`
- `updateVisibility()`
- `updateMain()`
- `updateBitmap()`
- `updateFrame()`
- `updateMove()`
- `updatePosition()`
- `updateDamagePopup()`
- `updateSelectionEffect()`
- `setupDamagePopup()`
- `createDamageSprite()`
- `destroyDamageSprite(sprite)`
- `damageOffsetX()`
- `damageOffsetY()`
- `startMove(x, y, duration)`
- `onMoveEnd()`
- `isEffecting()`
- `isMoving()`
- `inHomePosition()`
- `onMouseEnter()`
- `onPress()`
- `onClick()`

### Sprite_Actor ⭐

アクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Actor**


#### インスタンスメソッド

- `initialize(battler)`
- `initMembers()`
- `mainSprite()`
- `createMainSprite()`
- `createShadowSprite()`
- `createWeaponSprite()`
- `createStateSprite()`
- `setBattler(battler)`
- `moveToStartPosition()`
- `setActorHome(index)`
- `update()`
- `updateShadow()`
- `updateMain()`
- `setupMotion()`
- `setupWeaponAnimation()`
- `startMotion(motionType)`
- `updateTargetPosition()`
- `shouldStepForward()`
- `updateBitmap()`
- `updateFrame()`
- `updateMove()`
- `updateMotion()`
- `updateMotionCount()`
- `motionSpeed()`
- `refreshMotion()`
- `startEntryMotion()`
- `stepForward()`
- `stepBack()`
- `retreat()`
- `onMoveEnd()`
- `damageOffsetX()`
- `damageOffsetY()`

### Sprite_Enemy ⭐

敵キャラクター表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Enemy**


#### インスタンスメソッド

- `initialize(battler)`
- `initMembers()`
- `createStateIconSprite()`
- `setBattler(battler)`
- `update()`
- `updateBitmap()`
- `loadBitmap(name)`
- `setHue(hue)`
- `updateFrame()`
- `updatePosition()`
- `updateStateSprite()`
- `initVisibility()`
- `setupEffect()`
- `startEffect(effectType)`
- `startAppear()`
- `startDisappear()`
- `startWhiten()`
- `startBlink()`
- `startCollapse()`
- `startBossCollapse()`
- `startInstantCollapse()`
- `updateEffect()`
- `isEffecting()`
- `revertToNormal()`
- `updateWhiten()`
- `updateBlink()`
- `updateAppear()`
- `updateDisappear()`
- `updateCollapse()`
- `updateBossCollapse()`
- `updateInstantCollapse()`
- `damageOffsetX()`
- `damageOffsetY()`

### Sprite_Animation

アニメーション表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Animation**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `destroy(options)`
- `update()`
- `canStart()`
- `shouldWaitForPrevious()`
- `updateEffectGeometry()`
- `updateMain()`
- `processSoundTimings()`
- `processFlashTimings()`
- `checkEnd()`
- `updateFlash()`
- `isPlaying()`
- `setRotation(x, y, z)`
- `setProjectionMatrix(renderer)`
- `setCameraMatrix(/*renderer*/)`
- `setViewport(renderer)`
- `targetPosition(renderer)`
- `targetSpritePosition(sprite)`
- `resetViewport(renderer)`
- `onBeforeRender(renderer)`
- `onAfterRender(renderer)`

### Sprite_AnimationMV

旧フォーマット(MV形式)のアニメーション表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_AnimationMV**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `setupRate()`
- `setupDuration()`
- `update()`
- `updateFlash()`
- `updateScreenFlash()`
- `absoluteX()`
- `absoluteY()`
- `updateHiding()`
- `isPlaying()`
- `loadBitmaps()`
- `isReady()`
- `createCellSprites()`
- `createScreenFlashSprite()`
- `updateMain()`
- `updatePosition()`
- `updateFrame()`
- `currentFrameIndex()`
- `updateAllCellSprites(frame)`
- `updateCellSprite(sprite, cell)`
- `processTimingData(timing)`
- `startFlash(color, duration)`
- `startScreenFlash(color, duration)`
- `startHiding(duration)`
- `onEnd()`

### Sprite_Battleback

戦闘背景画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `TilingSprite` → **Sprite_Battleback**


#### インスタンスメソッド

- `initialize(type)`
- `adjustPosition()`
- `battleback1Bitmap()`
- `battleback2Bitmap()`
- `battleback1Name()`
- `battleback2Name()`
- `overworldBattleback1Name()`
- `overworldBattleback2Name()`
- `normalBattleback1Name()`
- `normalBattleback2Name()`
- `terrainBattleback1Name(type)`
- `terrainBattleback2Name(type)`
- `defaultBattleback1Name()`
- `defaultBattleback2Name()`
- `shipBattleback1Name()`
- `shipBattleback2Name()`
- `autotileType(z)`

### Sprite_Damage

ダメージポップアップ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Damage**


#### インスタンスメソッド

- `initialize()`
- `destroy(options)`
- `setup(target)`
- `setupCriticalEffect()`
- `fontFace()`
- `fontSize()`
- `damageColor()`
- `outlineColor()`
- `outlineWidth()`
- `createMiss()`
- `createDigits(value)`
- `createChildSprite(width, height)`
- `createBitmap(width, height)`
- `update()`
- `updateChild(sprite)`
- `updateFlash()`
- `updateOpacity()`
- `isPlaying()`

### Sprite_Gauge ⭐

ステータスゲージ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Gauge**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `destroy(options)`
- `createBitmap()`
- `bitmapWidth()`
- `bitmapHeight()`
- `textHeight()`
- `gaugeHeight()`
- `gaugeX()`
- `labelY()`
- `labelFontFace()`
- `labelFontSize()`
- `valueFontFace()`
- `valueFontSize()`
- `setup(battler, statusType)`
- `update()`
- `updateBitmap()`
- `updateTargetValue(value, maxValue)`
- `smoothness()`
- `updateGaugeAnimation()`
- `updateFlashing()`
- `flashingColor1()`
- `flashingColor2()`
- `isValid()`
- `currentValue()`
- `currentMaxValue()`
- `label()`
- `gaugeBackColor()`
- `gaugeColor1()`
- `gaugeColor2()`
- `labelColor()`
- `labelOutlineColor()`
- `labelOutlineWidth()`
- `valueColor()`
- `valueOutlineColor()`
- `valueOutlineWidth()`
- `redraw()`
- `drawGauge()`
- `drawGaugeRect(x, y, width, height)`
- `gaugeRate()`
- `drawLabel()`
- `setupLabelFont()`
- `measureLabelWidth()`
- `labelOpacity()`
- `drawValue()`
- `setupValueFont()`

### Sprite_Name

名前表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Name**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `destroy(options)`
- `createBitmap()`
- `bitmapWidth()`
- `bitmapHeight()`
- `fontFace()`
- `fontSize()`
- `setup(battler)`
- `update()`
- `updateBitmap()`
- `name()`
- `textColor()`
- `outlineColor()`
- `outlineWidth()`
- `redraw()`
- `setupFont()`

### Sprite_StateIcon

ステートアイコン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_StateIcon**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `loadBitmap()`
- `setup(battler)`
- `update()`
- `animationWait()`
- `updateIcon()`
- `shouldDisplay()`
- `updateFrame()`

### Sprite_StateOverlay

ステートのオーバーレイ画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_StateOverlay**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `loadBitmap()`
- `setup(battler)`
- `update()`
- `animationWait()`
- `updatePattern()`
- `updateFrame()`

### Sprite_Weapon

攻撃時の武器画像表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Weapon**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `setup(weaponImageId)`
- `update()`
- `animationWait()`
- `updatePattern()`
- `loadBitmap()`
- `updateFrame()`
- `isPlaying()`

### Sprite_Balloon

フキダシアイコン表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Balloon**


#### インスタンスメソッド

- `initialize()`
- `initMembers()`
- `loadBitmap()`
- `setup(targetSprite, balloonId)`
- `update()`
- `updatePosition()`
- `updateFrame()`
- `speed()`
- `waitTime()`
- `frameIndex()`
- `isPlaying()`

### Sprite_Picture

ピクチャ表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Picture**


#### インスタンスメソッド

- `initialize(pictureId)`
- `picture()`
- `update()`
- `updateBitmap()`
- `updateOrigin()`
- `updatePosition()`
- `updateScale()`
- `updateTone()`
- `updateOther()`
- `loadBitmap()`

### Sprite_Timer

タイマー表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Timer**


#### インスタンスメソッド

- `initialize()`
- `destroy(options)`
- `createBitmap()`
- `fontFace()`
- `fontSize()`
- `update()`
- `updateBitmap()`
- `redraw()`
- `timerText()`
- `updatePosition()`
- `updateVisibility()`

### Sprite_Destination

タッチ入力の目的地表示用のスプライトクラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Sprite_Destination**


#### インスタンスメソッド

- `initialize()`
- `destroy(options)`
- `update()`
- `createBitmap()`
- `updatePosition()`
- `updateAnimation()`

### Spriteset_Base ⭐

Spriteset_MapとSpriteset_Battleのスーパークラス。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → **Spriteset_Base**


#### インスタンスメソッド

- `initialize()`
- `destroy(options)`
- `loadSystemImages()`
- `createLowerLayer()`
- `createUpperLayer()`
- `update()`
- `createBaseSprite()`
- `createBaseFilters()`
- `createPictures()`
- `pictureContainerRect()`
- `createTimer()`
- `createOverallFilters()`
- `updateBaseFilters()`
- `updateOverallFilters()`
- `updatePosition()`
- `findTargetSprite(/*target*/)`
- `updateAnimations()`
- `processAnimationRequests()`
- `createAnimation(request)`
- `isMVAnimation(animation)`
- `makeTargetSprites(targets)`
- `lastAnimationSprite()`
- `isAnimationForEach(animation)`
- `animationBaseDelay()`
- `animationNextDelay()`
- `animationShouldMirror(target)`
- `removeAnimation(sprite)`
- `removeAllAnimations()`
- `isAnimationPlaying()`

### Spriteset_Map ⭐

マップ画面のスプライトセット。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Map**


#### インスタンスメソッド

- `initialize()`
- `destroy(options)`
- `loadSystemImages()`
- `createLowerLayer()`
- `update()`
- `hideCharacters()`
- `createParallax()`
- `createTilemap()`
- `loadTileset()`
- `createCharacters()`
- `createShadow()`
- `createDestination()`
- `createWeather()`
- `updateTileset()`
- `updateParallax()`
- `updateTilemap()`
- `updateShadow()`
- `updateWeather()`
- `updateBalloons()`
- `processBalloonRequests()`
- `createBalloon(request)`
- `removeBalloon(sprite)`
- `removeAllBalloons()`
- `findTargetSprite(target)`
- `animationBaseDelay()`

### Spriteset_Battle ⭐

戦闘画面のスプライトセット。

- **ソースファイル**: `rmmz_sprites.js`
- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Battle**


#### インスタンスメソッド

- `initialize()`
- `loadSystemImages()`
- `createLowerLayer()`
- `createBackground()`
- `createBattleback()`
- `createBattleField()`
- `battleFieldOffsetY()`
- `update()`
- `updateBattleback()`
- `createEnemies()`
- `compareEnemySprite(a, b)`
- `createActors()`
- `updateActors()`
- `findTargetSprite(target)`
- `battlerSprites()`
- `isEffecting()`
- `isAnyoneMoving()`
- `isBusy()`

---

## Windows

ゲーム内UI用の `Window_*` クラス群です。 ( `rmmz_windows.js` )

### Window_Base ⭐

ゲーム内の全ウィンドウのスーパークラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → **Window_Base**


#### インスタンスメソッド

- `initialize(rect)`
- `destroy(options)`
- `checkRectObject(rect)`
- `lineHeight()`
- `itemWidth()`
- `itemHeight()`
- `itemPadding()`
- `baseTextRect()`
- `loadWindowskin()`
- `updatePadding()`
- `updateBackOpacity()`
- `fittingHeight(numLines)`
- `updateTone()`
- `createContents()`
- `destroyContents()`
- `contentsWidth()`
- `contentsHeight()`
- `resetFontSettings()`
- `resetTextColor()`
- `update()`
- `updateOpen()`
- `updateClose()`
- `open()`
- `close()`
- `isOpening()`
- `isClosing()`
- `show()`
- `hide()`
- `activate()`
- `deactivate()`
- `systemColor()`
- `translucentOpacity()`
- `changeTextColor(color)`
- `changeOutlineColor(color)`
- `changePaintOpacity(enabled)`
- `drawRect(x, y, width, height)`
- `drawText(text, x, y, maxWidth, align)`
- `textWidth(text)`
- `drawTextEx(text, x, y, width)`
- `textSizeEx(text)`
- `createTextState(text, x, y, width)`
- `processAllText(textState)`
- `flushTextState(textState)`
- `createTextBuffer(rtl)`
- `convertEscapeCharacters(text)`
- `actorName(n)`
- `partyMemberName(n)`
- `processCharacter(textState)`
- `processControlCharacter(textState, c)`
- `processNewLine(textState)`
- `obtainEscapeCode(textState)`
- `obtainEscapeParam(textState)`
- `processEscapeCharacter(code, textState)`
- `processColorChange(colorIndex)`
- `processDrawIcon(iconIndex, textState)`
- `makeFontBigger()`
- `makeFontSmaller()`
- `calcTextHeight(textState)`
- `maxFontSizeInLine(line)`
- `drawIcon(iconIndex, x, y)`
- `drawItemName(item, x, y, width)`
- `drawCurrencyValue(value, unit, x, y, width)`
- `setBackgroundType(type)`
- `showBackgroundDimmer()`
- `createDimmerSprite()`
- `hideBackgroundDimmer()`
- `updateBackgroundDimmer()`
- `refreshDimmerBitmap()`
- `playCursorSound()`
- `playOkSound()`
- `playBuzzerSound()`

### Window_Scrollable

スクロール機能を持つウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Scrollable**


#### インスタンスメソッド

- `initialize(rect)`
- `clearScrollStatus()`
- `scrollX()`
- `scrollY()`
- `scrollBaseX()`
- `scrollBaseY()`
- `scrollTo(x, y)`
- `scrollBy(x, y)`
- `smoothScrollTo(x, y)`
- `smoothScrollBy(x, y)`
- `setScrollAccel(x, y)`
- `overallWidth()`
- `overallHeight()`
- `maxScrollX()`
- `maxScrollY()`
- `scrollBlockWidth()`
- `scrollBlockHeight()`
- `smoothScrollDown(n)`
- `smoothScrollUp(n)`
- `update()`
- `processWheelScroll()`
- `processTouchScroll()`
- `isWheelScrollEnabled()`
- `isTouchScrollEnabled()`
- `isScrollEnabled()`
- `isTouchedInsideFrame()`
- `onTouchScrollStart()`
- `onTouchScroll()`
- `onTouchScrollEnd()`
- `updateSmoothScroll()`
- `updateScrollAccel()`
- `updateArrows()`
- `updateOrigin()`
- `updateScrollBase(baseX, baseY)`
- `paint()`

### Window_Selectable ⭐

項目選択機能を持つウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → **Window_Selectable**


#### インスタンスメソッド

- `initialize(rect)`
- `index()`
- `cursorFixed()`
- `setCursorFixed(cursorFixed)`
- `cursorAll()`
- `setCursorAll(cursorAll)`
- `maxCols()`
- `maxItems()`
- `colSpacing()`
- `rowSpacing()`
- `itemWidth()`
- `itemHeight()`
- `contentsHeight()`
- `maxRows()`
- `overallHeight()`
- `activate()`
- `deactivate()`
- `select(index)`
- `forceSelect(index)`
- `smoothSelect(index)`
- `deselect()`
- `reselect()`
- `row()`
- `topRow()`
- `maxTopRow()`
- `setTopRow(row)`
- `maxPageRows()`
- `maxPageItems()`
- `maxVisibleItems()`
- `isHorizontal()`
- `topIndex()`
- `itemRect(index)`
- `itemRectWithPadding(index)`
- `itemLineRect(index)`
- `setHelpWindow(helpWindow)`
- `showHelpWindow()`
- `hideHelpWindow()`
- `setHandler(symbol, method)`
- `isHandled(symbol)`
- `callHandler(symbol)`
- `isOpenAndActive()`
- `isCursorMovable()`
- `cursorDown(wrap)`
- `cursorUp(wrap)`
- `cursorRight(wrap)`
- `cursorLeft(wrap)`
- `cursorPagedown()`
- `cursorPageup()`
- `isScrollEnabled()`
- `update()`
- `processCursorMove()`
- `processHandling()`
- `processTouch()`
- `isHoverEnabled()`
- `onTouchSelect(trigger)`
- `onTouchOk()`
- `onTouchCancel()`
- `hitIndex()`
- `hitTest(x, y)`
- `isTouchOkEnabled()`
- `isOkEnabled()`
- `isCancelEnabled()`
- `isOkTriggered()`
- `isCancelTriggered()`
- `processOk()`
- `callOkHandler()`
- `processCancel()`
- `callCancelHandler()`
- `processPageup()`
- `processPagedown()`
- `updateInputData()`
- `ensureCursorVisible(smooth)`
- `callUpdateHelp()`
- `updateHelp()`
- `setHelpWindowItem(item)`
- `isCurrentItemEnabled()`
- `drawAllItems()`
- `drawItem(/*index*/)`
- `clearItem(index)`
- `drawItemBackground(index)`
- `drawBackgroundRect(rect)`
- `redrawItem(index)`
- `redrawCurrentItem()`
- `refresh()`
- `paint()`
- `refreshCursor()`
- `refreshCursorForAll()`

### Window_Command ⭐

コマンド選択ウィンドウの基底クラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Command**


#### インスタンスメソッド

- `initialize(rect)`
- `maxItems()`
- `clearCommandList()`
- `makeCommandList()`
- `commandName(index)`
- `commandSymbol(index)`
- `isCommandEnabled(index)`
- `currentData()`
- `isCurrentItemEnabled()`
- `currentSymbol()`
- `currentExt()`
- `findSymbol(symbol)`
- `selectSymbol(symbol)`
- `findExt(ext)`
- `selectExt(ext)`
- `drawItem(index)`
- `itemTextAlign()`
- `isOkEnabled()`
- `callOkHandler()`
- `refresh()`

### Window_HorzCommand

横並びコマンド選択ウィンドウの基底クラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_HorzCommand**


#### インスタンスメソッド

- `initialize(rect)`
- `maxCols()`
- `itemTextAlign()`

### Window_Help

ヘルプテキスト表示用のウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Help**


#### インスタンスメソッド

- `initialize(rect)`
- `setText(text)`
- `clear()`
- `setItem(item)`
- `refresh()`

### Window_Gold

所持金表示用のウィンドウクラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Gold**


#### インスタンスメソッド

- `initialize(rect)`
- `colSpacing()`
- `refresh()`
- `value()`
- `currencyUnit()`
- `open()`

### Window_StatusBase ⭐

アクターステータス表示ウィンドウのスーパークラス。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_StatusBase**


#### インスタンスメソッド

- `initialize(rect)`
- `loadFaceImages()`
- `refresh()`
- `hideAdditionalSprites()`
- `placeActorName(actor, x, y)`
- `placeStateIcon(actor, x, y)`
- `placeGauge(actor, type, x, y)`
- `createInnerSprite(key, spriteClass)`
- `placeTimeGauge(actor, x, y)`
- `placeBasicGauges(actor, x, y)`
- `gaugeLineHeight()`
- `drawActorCharacter(actor, x, y)`
- `drawActorName(actor, x, y, width)`
- `drawActorClass(actor, x, y, width)`
- `drawActorNickname(actor, x, y, width)`
- `drawActorLevel(actor, x, y)`
- `drawActorIcons(actor, x, y, width)`
- `drawActorSimpleStatus(actor, x, y)`
- `actorSlotName(actor, index)`

### Window_MenuCommand

メニュー画面のコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_MenuCommand**


#### 静的メソッド

- `initCommandPosition()`

#### インスタンスメソッド

- `initialize(rect)`
- `makeCommandList()`
- `addMainCommands()`
- `addFormationCommand()`
- `addOriginalCommands()`
- `addOptionsCommand()`
- `addSaveCommand()`
- `addGameEndCommand()`
- `needsCommand(name)`
- `areMainCommandsEnabled()`
- `isFormationEnabled()`
- `isOptionsEnabled()`
- `isSaveEnabled()`
- `isGameEndEnabled()`
- `processOk()`
- `selectLast()`

### Window_MenuStatus

メニュー画面のパーティメンバーステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_MenuStatus**


#### インスタンスメソッド

- `initialize(rect)`
- `maxItems()`
- `numVisibleRows()`
- `itemHeight()`
- `actor(index)`
- `drawItem(index)`
- `drawPendingItemBackground(index)`
- `drawItemImage(index)`
- `drawItemStatus(index)`
- `processOk()`
- `isCurrentItemEnabled()`
- `selectLast()`
- `formationMode()`
- `setFormationMode(formationMode)`
- `pendingIndex()`
- `setPendingIndex(index)`

### Window_MenuActor

アイテム・スキル画面の対象アクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → `Window_MenuStatus` → **Window_MenuActor**


#### インスタンスメソッド

- `initialize(rect)`
- `processOk()`
- `selectLast()`
- `selectForItem(item)`

### Window_ItemCategory

アイテム・ショップ画面のアイテムカテゴリ選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ItemCategory**


#### インスタンスメソッド

- `initialize(rect)`
- `maxCols()`
- `update()`
- `makeCommandList()`
- `needsCommand(name)`
- `setItemWindow(itemWindow)`
- `needsSelection()`

### Window_ItemList

アイテム画面のアイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ItemList**


#### インスタンスメソッド

- `initialize(rect)`
- `setCategory(category)`
- `maxCols()`
- `colSpacing()`
- `maxItems()`
- `item()`
- `itemAt(index)`
- `isCurrentItemEnabled()`
- `includes(item)`
- `needsNumber()`
- `isEnabled(item)`
- `makeItemList()`
- `selectLast()`
- `drawItem(index)`
- `numberWidth()`
- `drawItemNumber(item, x, y, width)`
- `updateHelp()`
- `refresh()`

### Window_SkillType

スキル画面のスキルタイプ選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_SkillType**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `makeCommandList()`
- `update()`
- `setSkillWindow(skillWindow)`
- `selectLast()`

### Window_SkillStatus

スキル画面のスキル使用者ステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_SkillStatus**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `refresh()`

### Window_SkillList

スキル画面のスキル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SkillList**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `setStypeId(stypeId)`
- `maxCols()`
- `colSpacing()`
- `maxItems()`
- `item()`
- `itemAt(index)`
- `isCurrentItemEnabled()`
- `includes(item)`
- `isEnabled(item)`
- `makeItemList()`
- `selectLast()`
- `drawItem(index)`
- `costWidth()`
- `drawSkillCost(skill, x, y, width)`
- `updateHelp()`
- `refresh()`

### Window_EquipStatus

装備画面のパラメータ変化表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipStatus**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `colSpacing()`
- `refresh()`
- `setTempActor(tempActor)`
- `drawAllParams()`
- `drawItem(x, y, paramId)`
- `drawParamName(x, y, paramId)`
- `drawCurrentParam(x, y, paramId)`
- `drawRightArrow(x, y)`
- `drawNewParam(x, y, paramId)`
- `rightArrowWidth()`
- `paramWidth()`
- `paramX()`
- `paramY(index)`

### Window_EquipCommand

装備画面のコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_EquipCommand**


#### インスタンスメソッド

- `initialize(rect)`
- `maxCols()`
- `makeCommandList()`

### Window_EquipSlot

装備画面の装備スロット選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipSlot**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `update()`
- `maxItems()`
- `item()`
- `itemAt(index)`
- `drawItem(index)`
- `slotNameWidth()`
- `isEnabled(index)`
- `isCurrentItemEnabled()`
- `setStatusWindow(statusWindow)`
- `setItemWindow(itemWindow)`
- `updateHelp()`

### Window_EquipItem

装備画面の装備品選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EquipItem**


#### インスタンスメソッド

- `initialize(rect)`
- `maxCols()`
- `colSpacing()`
- `setActor(actor)`
- `setSlotId(slotId)`
- `includes(item)`
- `etypeId()`
- `isEnabled(/*item*/)`
- `selectLast()`
- `setStatusWindow(statusWindow)`
- `updateHelp()`
- `playOkSound()`

### Window_Status

ステータス画面の詳細ステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_Status**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `refresh()`
- `drawBlock1()`
- `block1Y()`
- `drawBlock2()`
- `block2Y()`
- `drawBasicInfo(x, y)`
- `drawExpInfo(x, y)`
- `expTotalValue()`
- `expNextValue()`

### Window_StatusParams

ステータス画面のパラメータ表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusParams**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `maxItems()`
- `itemHeight()`
- `drawItem(index)`
- `drawItemBackground(/*index*/)`

### Window_StatusEquip

ステータス画面の装備品表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusEquip**


#### インスタンスメソッド

- `initialize(rect)`
- `setActor(actor)`
- `maxItems()`
- `itemHeight()`
- `drawItem(index)`
- `drawItemBackground(/*index*/)`

### Window_Options

オプション画面の設定変更ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_Options**


#### インスタンスメソッド

- `initialize(rect)`
- `makeCommandList()`
- `addGeneralOptions()`
- `addVolumeOptions()`
- `drawItem(index)`
- `statusWidth()`
- `statusText(index)`
- `isVolumeSymbol(symbol)`
- `booleanStatusText(value)`
- `volumeStatusText(value)`
- `processOk()`
- `cursorRight()`
- `cursorLeft()`
- `changeVolume(symbol, forward, wrap)`
- `volumeOffset()`
- `changeValue(symbol, value)`
- `getConfigValue(symbol)`
- `setConfigValue(symbol, volume)`

### Window_SavefileList

セーブ・ロード画面のセーブファイル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SavefileList**


#### インスタンスメソッド

- `initialize(rect)`
- `setMode(mode, autosave)`
- `maxItems()`
- `numVisibleRows()`
- `itemHeight()`
- `drawItem(index)`
- `indexToSavefileId(index)`
- `savefileIdToIndex(savefileId)`
- `isEnabled(savefileId)`
- `savefileId()`
- `selectSavefile(savefileId)`
- `drawTitle(savefileId, x, y)`
- `drawContents(info, rect)`
- `drawPartyCharacters(info, x, y)`
- `drawPlaytime(info, x, y, width)`
- `playOkSound()`

### Window_ShopCommand

ショップ画面の売買選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ShopCommand**


#### インスタンスメソッド

- `initialize(rect)`
- `setPurchaseOnly(purchaseOnly)`
- `maxCols()`
- `makeCommandList()`

### Window_ShopBuy

ショップ画面の購入アイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopBuy**


#### インスタンスメソッド

- `initialize(rect)`
- `setupGoods(shopGoods)`
- `maxItems()`
- `item()`
- `itemAt(index)`
- `setMoney(money)`
- `isCurrentItemEnabled()`
- `price(item)`
- `isEnabled(item)`
- `refresh()`
- `makeItemList()`
- `goodsToItem(goods)`
- `drawItem(index)`
- `priceWidth()`
- `setStatusWindow(statusWindow)`
- `updateHelp()`

### Window_ShopSell

ショップ画面の売却アイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_ShopSell**


#### インスタンスメソッド

- `initialize(rect)`
- `isEnabled(item)`

### Window_ShopNumber

ショップ画面の売買個数入力ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopNumber**


#### インスタンスメソッド

- `initialize(rect)`
- `isScrollEnabled()`
- `number()`
- `setup(item, max, price)`
- `setCurrencyUnit(currencyUnit)`
- `createButtons()`
- `placeButtons()`
- `totalButtonWidth()`
- `buttonSpacing()`
- `refresh()`
- `drawCurrentItemName()`
- `drawMultiplicationSign()`
- `multiplicationSign()`
- `multiplicationSignX()`
- `drawNumber()`
- `drawHorzLine()`
- `drawTotalPrice()`
- `itemNameY()`
- `totalPriceY()`
- `buttonY()`
- `cursorWidth()`
- `cursorX()`
- `maxDigits()`
- `update()`
- `playOkSound()`
- `processNumberChange()`
- `changeNumber(amount)`
- `itemRect()`
- `isTouchOkEnabled()`
- `onButtonUp()`
- `onButtonUp2()`
- `onButtonDown()`
- `onButtonDown2()`
- `onButtonOk()`

### Window_ShopStatus

ショップ画面の所持数・アクター装備状況表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_ShopStatus**


#### インスタンスメソッド

- `initialize(rect)`
- `refresh()`
- `setItem(item)`
- `isEquipItem()`
- `drawPossession(x, y)`
- `drawEquipInfo(x, y)`
- `statusMembers()`
- `pageSize()`
- `maxPages()`
- `drawActorEquipInfo(x, y, actor)`
- `paramId()`
- `currentEquippedItem(actor, etypeId)`
- `update()`
- `updatePage()`
- `isPageChangeEnabled()`
- `isPageChangeRequested()`
- `changePage()`

### Window_NameEdit

名前入力画面のアクター名編集ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_NameEdit**


#### インスタンスメソッド

- `initialize(rect)`
- `setup(actor, maxLength)`
- `name()`
- `restoreDefault()`
- `add(ch)`
- `back()`
- `faceWidth()`
- `charWidth()`
- `left()`
- `itemRect(index)`
- `underlineRect(index)`
- `underlineColor()`
- `drawUnderline(index)`
- `drawChar(index)`
- `refresh()`

### Window_NameInput

名前入力画面の文字選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NameInput**


#### インスタンスメソッド

- `initialize(rect)`
- `setEditWindow(editWindow)`
- `table()`
- `maxCols()`
- `maxItems()`
- `itemWidth()`
- `groupSpacing()`
- `character()`
- `isPageChange()`
- `isOk()`
- `itemRect(index)`
- `drawItem(index)`
- `updateCursor()`
- `isCursorMovable()`
- `cursorDown(wrap)`
- `cursorUp(wrap)`
- `cursorRight(wrap)`
- `cursorLeft(wrap)`
- `cursorPagedown()`
- `cursorPageup()`
- `processCursorMove()`
- `processHandling()`
- `isCancelEnabled()`
- `processCancel()`
- `processJump()`
- `processBack()`
- `processOk()`
- `onNameAdd()`
- `onNameOk()`

### Window_NameBox

メッセージウィンドウ上部の話者名表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_NameBox**


#### インスタンスメソッド

- `initialize()`
- `setMessageWindow(messageWindow)`
- `setName(name)`
- `clear()`
- `start()`
- `updatePlacement()`
- `updateBackground()`
- `windowWidth()`
- `windowHeight()`
- `refresh()`

### Window_ChoiceList

イベントコマンド「選択肢の表示」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ChoiceList**


#### インスタンスメソッド

- `initialize()`
- `setMessageWindow(messageWindow)`
- `createCancelButton()`
- `start()`
- `update()`
- `updateCancelButton()`
- `selectDefault()`
- `updatePlacement()`
- `updateBackground()`
- `placeCancelButton()`
- `windowX()`
- `windowY()`
- `windowWidth()`
- `windowHeight()`
- `numVisibleRows()`
- `maxLines()`
- `maxChoiceWidth()`
- `makeCommandList()`
- `drawItem(index)`
- `isCancelEnabled()`
- `needsCancelButton()`
- `callOkHandler()`
- `callCancelHandler()`

### Window_NumberInput

イベントコマンド「数値入力の処理」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NumberInput**


#### インスタンスメソッド

- `initialize()`
- `setMessageWindow(messageWindow)`
- `start()`
- `updatePlacement()`
- `windowWidth()`
- `windowHeight()`
- `maxCols()`
- `maxItems()`
- `itemWidth()`
- `itemRect(index)`
- `isScrollEnabled()`
- `isHoverEnabled()`
- `createButtons()`
- `placeButtons()`
- `totalButtonWidth()`
- `buttonSpacing()`
- `buttonY()`
- `update()`
- `processDigitChange()`
- `changeDigit(up)`
- `isTouchOkEnabled()`
- `isOkEnabled()`
- `isCancelEnabled()`
- `processOk()`
- `drawItem(index)`
- `onButtonUp()`
- `onButtonDown()`
- `onButtonOk()`

### Window_EventItem

イベントコマンド「アイテム選択の処理」用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EventItem**


#### インスタンスメソッド

- `initialize(rect)`
- `setMessageWindow(messageWindow)`
- `createCancelButton()`
- `start()`
- `update()`
- `updateCancelButton()`
- `updatePlacement()`
- `placeCancelButton()`
- `includes(item)`
- `needsNumber()`
- `isEnabled(/*item*/)`
- `onOk()`
- `onCancel()`

### Window_Message ⭐

テキストメッセージ表示用のウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_Message**


#### インスタンスメソッド

- `initialize(rect)`
- `initMembers()`
- `setGoldWindow(goldWindow)`
- `setNameBoxWindow(nameBoxWindow)`
- `setChoiceListWindow(choiceListWindow)`
- `setNumberInputWindow(numberInputWindow)`
- `setEventItemWindow(eventItemWindow)`
- `clearFlags()`
- `update()`
- `checkToNotClose()`
- `synchronizeNameBox()`
- `canStart()`
- `startMessage()`
- `newLineX(textState)`
- `updatePlacement()`
- `updateBackground()`
- `terminateMessage()`
- `updateWait()`
- `cancelWait()`
- `updateLoading()`
- `updateInput()`
- `isAnySubWindowActive()`
- `updateMessage()`
- `shouldBreakHere(textState)`
- `canBreakHere(textState)`
- `onEndOfText()`
- `startInput()`
- `isTriggered()`
- `doesContinue()`
- `areSettingsChanged()`
- `updateShowFast()`
- `newPage(textState)`
- `updateSpeakerName()`
- `loadMessageFace()`
- `drawMessageFace()`
- `processControlCharacter(textState, c)`
- `processNewLine(textState)`
- `processNewPage(textState)`
- `isEndOfText(textState)`
- `needsNewPage(textState)`
- `processEscapeCharacter(code, textState)`
- `startWait(count)`
- `startPause()`
- `isWaiting()`

### Window_ScrollText

スクロールテキスト表示用のウィンドウ。枠なし。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_ScrollText**


#### インスタンスメソッド

- `initialize(rect)`
- `update()`
- `startMessage()`
- `refresh()`
- `updatePlacement()`
- `contentsHeight()`
- `updateMessage()`
- `scrollSpeed()`
- `isFastForward()`
- `fastForwardRate()`
- `terminateMessage()`

### Window_MapName

マップ画面のマップ名表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_MapName**


#### インスタンスメソッド

- `initialize(rect)`
- `update()`
- `updateFadeIn()`
- `updateFadeOut()`
- `open()`
- `close()`
- `refresh()`
- `drawBackground(x, y, width, height)`

### Window_BattleLog ⭐

戦闘経過表示用のウィンドウ。枠なしだがWindow_Baseを継承。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → **Window_BattleLog**


#### インスタンスメソッド

- `initialize(rect)`
- `setSpriteset(spriteset)`
- `maxLines()`
- `numLines()`
- `messageSpeed()`
- `isBusy()`
- `update()`
- `updateWait()`
- `updateWaitCount()`
- `updateWaitMode()`
- `setWaitMode(waitMode)`
- `callNextMethod()`
- `isFastForward()`
- `push(methodName)`
- `clear()`
- `wait()`
- `waitForEffect()`
- `waitForMovement()`
- `addText(text)`
- `pushBaseLine()`
- `popBaseLine()`
- `waitForNewLine()`
- `popupDamage(target)`
- `performActionStart(subject, action)`
- `performAction(subject, action)`
- `performActionEnd(subject)`
- `performDamage(target)`
- `performMiss(target)`
- `performRecovery(target)`
- `performEvasion(target)`
- `performMagicEvasion(target)`
- `performCounter(target)`
- `performReflection(target)`
- `performSubstitute(substitute, target)`
- `performCollapse(target)`
- `showAttackAnimation(subject, targets)`
- `refresh()`
- `drawBackground()`
- `backRect()`
- `lineRect(index)`
- `backColor()`
- `backPaintOpacity()`
- `drawLineText(index)`
- `startTurn()`
- `startAction(subject, action, targets)`
- `endAction(subject)`
- `displayCurrentState(subject)`
- `displayRegeneration(subject)`
- `displayAction(subject, item)`
- `displayItemMessage(fmt, subject, item)`
- `displayCounter(target)`
- `displayReflection(target)`
- `displaySubstitute(substitute, target)`
- `displayActionResults(subject, target)`
- `displayFailure(target)`
- `displayCritical(target)`
- `displayDamage(target)`
- `displayMiss(target)`
- `displayEvasion(target)`
- `displayHpDamage(target)`
- `displayMpDamage(target)`
- `displayTpDamage(target)`
- `displayAffectedStatus(target)`
- `displayAutoAffectedStatus(target)`
- `displayChangedStates(target)`
- `displayAddedStates(target)`
- `displayRemovedStates(target)`
- `displayChangedBuffs(target)`
- `displayBuffs(target, buffs, fmt)`
- `makeHpDamageText(target)`
- `makeMpDamageText(target)`
- `makeTpDamageText(target)`

### Window_PartyCommand

戦闘画面の「戦う/逃げる」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_PartyCommand**


#### インスタンスメソッド

- `initialize(rect)`
- `makeCommandList()`
- `setup()`

### Window_ActorCommand

戦闘画面のアクターコマンド選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ActorCommand**


#### インスタンスメソッド

- `initialize(rect)`
- `makeCommandList()`
- `addAttackCommand()`
- `addSkillCommands()`
- `addGuardCommand()`
- `addItemCommand()`
- `setup(actor)`
- `actor()`
- `processOk()`
- `selectLast()`

### Window_BattleStatus ⭐

戦闘画面のパーティメンバーステータス表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_BattleStatus**


#### インスタンスメソッド

- `initialize(rect)`
- `extraHeight()`
- `maxCols()`
- `itemHeight()`
- `maxItems()`
- `rowSpacing()`
- `updatePadding()`
- `actor(index)`
- `selectActor(actor)`
- `update()`
- `preparePartyRefresh()`
- `performPartyRefresh()`
- `drawItem(index)`
- `drawItemImage(index)`
- `drawItemStatus(index)`
- `faceRect(index)`
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

- `initialize(rect)`
- `show()`
- `hide()`
- `select(index)`
- `processTouch()`

### Window_BattleEnemy

戦闘画面の対象敵キャラクター選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_BattleEnemy**


#### インスタンスメソッド

- `initialize(rect)`
- `maxCols()`
- `maxItems()`
- `enemy()`
- `enemyIndex()`
- `drawItem(index)`
- `show()`
- `hide()`
- `refresh()`
- `select(index)`
- `processTouch()`

### Window_BattleSkill

戦闘画面のスキル選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_SkillList` → **Window_BattleSkill**


#### インスタンスメソッド

- `initialize(rect)`
- `show()`
- `hide()`

### Window_BattleItem

戦闘画面のアイテム選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_BattleItem**


#### インスタンスメソッド

- `initialize(rect)`
- `includes(item)`
- `show()`
- `hide()`

### Window_TitleCommand

タイトル画面の「ニューゲーム/コンティニュー」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_TitleCommand**


#### 静的メソッド

- `initCommandPosition()`

#### インスタンスメソッド

- `initialize(rect)`
- `makeCommandList()`
- `isContinueEnabled()`
- `processOk()`
- `selectLast()`

### Window_GameEnd

ゲーム終了画面の「タイトルへ」選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_GameEnd**


#### インスタンスメソッド

- `initialize(rect)`
- `makeCommandList()`

### Window_DebugRange

デバッグ画面のスイッチ/変数ブロック選択ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugRange**


#### 静的プロパティ

- `lastTopRow`
- `lastIndex`

#### インスタンスメソッド

- `initialize(rect)`
- `maxItems()`
- `update()`
- `mode(index)`
- `topId(index)`
- `isSwitchMode(index)`
- `drawItem(index)`
- `isCancelTriggered()`
- `processCancel()`
- `setEditWindow(editWindow)`

### Window_DebugEdit

デバッグ画面のスイッチ/変数表示ウィンドウ。

- **ソースファイル**: `rmmz_windows.js`
- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugEdit**


#### インスタンスメソッド

- `initialize(rect)`
- `maxItems()`
- `drawItem(index)`
- `itemName(dataId)`
- `itemStatus(dataId)`
- `setMode(mode)`
- `setTopId(id)`
- `currentId()`
- `update()`
- `updateSwitch()`
- `updateVariable()`
- `deltaForVariable()`

---

