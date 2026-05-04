## Core

RPGツクールMZのコアエンジンを構成する基本クラス群

ソースファイル: `rmmz_core.js`

### Utils

ユーティリティメソッドを定義する静的クラス

#### 静的プロパティ
- `RPGMAKER_NAME` — RPGツクールの名前。現在のバージョンでは "MZ"
- `RPGMAKER_VERSION` — RPGツクールのバージョン

#### 静的メソッド
- `checkRMVersion(version)` — 現在のRPGツクールのバージョンが指定されたバージョン以上かどうかを確認する
- `isOptionValid(name)` — クエリストリングにオプションが含まれているかを確認する
- `isNwjs()` — プラットフォームがNW.jsかどうかを確認する
- `isMobileDevice()` — プラットフォームがモバイルデバイスかどうかを確認する
- `isMobileSafari()` — ブラウザがMobile Safariかどうかを確認する
- `isAndroidChrome()` — ブラウザがAndroid Chromeかどうかを確認する
- `isLocal()` — ブラウザがローカルファイルにアクセスしているかを確認する
- `canUseWebGL()` — ブラウザがWebGLをサポートしているかを確認する
- `canUseWebAudioAPI()` — ブラウザがWeb Audio APIをサポートしているかを確認する
- `canUseCssFontLoading()` — ブラウザがCSS Font Loadingをサポートしているかを確認する
- `canUseIndexedDB()` — ブラウザがIndexedDBをサポートしているかを確認する
- `canPlayOgg()` — ブラウザがoggファイルを再生できるかを確認する
- `canPlayWebm()` — ブラウザがwebmファイルを再生できるかを確認する
- `encodeURI(str)` — スラッシュをエスケープせずにURIコンポーネントをエンコードする
- `extractFileName(filename)` — サブフォルダを含まないファイル名を取得する
- `escapeHtml(str)` — HTML用の特殊文字をエスケープする
- `containsArabic(str)` — 文字列にアラビア文字が含まれているかを確認する
- `setEncryptionInfo(hasImages, hasAudio, key)` — 暗号化に関する情報を設定する
- `hasEncryptedImages()` — ゲーム内の画像ファイルが暗号化されているかを確認する
- `hasEncryptedAudio()` — ゲーム内の音声ファイルが暗号化されているかを確認する
- `decryptArrayBuffer(source)` — 暗号化されたデータを復号する

### Graphics

グラフィック処理を実行する静的クラス

#### 静的プロパティ
- `app` — PIXI.Application オブジェクト
- `effekseer` — Effekseer のコンテキストオブジェクト
- `width` — ゲーム画面の幅
- `height` — ゲーム画面の高さ
- `defaultScale` — ゲーム画面のデフォルトのズームスケール

#### 静的メソッド
- `initialize()` — グラフィックシステムを初期化する
- `setTickHandler(handler)` — tickイベント用のハンドラを登録する
- `startGameLoop()` — ゲームループを開始する
- `stopGameLoop()` — ゲームループを停止する
- `setStage(stage)` — 描画するステージ(Stage)オブジェクトを設定する
- `startLoading()` — ローディングスピナーを表示する
- `endLoading()` — ローディングスピナーを消去する
- `printError(name, message, error)` — 画面にエラーテキストを表示する
- `showRetryButton(retry)` — リソースの再読み込みを試行するボタンを表示する
- `eraseError()` — ローディングエラーのテキストを消去する
- `pageToCanvasX(x)` — ページ上のX座標をキャンバス領域上のX座標に変換する
- `pageToCanvasY(y)` — ページ上のY座標をキャンバス領域上のY座標に変換する
- `isInsideCanvas(x, y)` — 指定されたポイントがゲームキャンバスの領域内にあるかを確認する
- `showScreen()` — ゲーム画面を表示する
- `hideScreen()` — ゲーム画面を隠す
- `resize(width, height)` — ゲーム画面のサイズを変更する

### Point

ポイント(座標)クラス。PIXI.Point を継承

- **継承**: `PIXI.Point` → **Point**

### Rectangle

矩形クラス。PIXI.Rectangle を継承

- **継承**: `PIXI.Rectangle` → **Rectangle**

### Bitmap

画像を表す基本オブジェクト

#### 静的メソッド
- `load(url)` — 画像ファイルを読み込む
- `snap(stage)` — ゲーム画面のスナップショットを取得する

#### プロパティ
- `url` — 画像ファイルのURL（読み取り専用）
- `baseTexture` — ベーステクスチャ (PIXI.BaseTexture)
- `image` — ビットマップ画像
- `canvas` — ビットマップキャンバス
- `context` — ビットマップキャンバスの2Dコンテキスト
- `width` — ビットマップの幅
- `height` — ビットマップの高さ
- `rect` — ビットマップの矩形領域
- `smooth` — 平滑化スケーリングが適用されているかどうか
- `paintOpacity` — 描画オブジェクトの不透明度（0〜255の範囲）

#### インスタンスメソッド
- `isReady()` — ビットマップが描画準備完了かどうかを確認する
- `isError()` — 読み込みエラーが発生したかどうかを確認する
- `destroy()` — ビットマップを破棄する
- `resize(width, height)` — ビットマップのサイズを変更する
- `blt(source, sx, sy, sw, sh, dx, dy, dw?, dh?)` — ブロック転送（画像の一部コピー）を実行する
- `getPixel(x, y)` — 指定された座標のピクセルの色(16進数文字列)を返す
- `getAlphaPixel(x, y)` — 指定された座標のアルファ(透明度)ピクセル値を返す
- `clearRect(x, y, width, height)` — 指定された矩形領域をクリアする
- `clear()` — ビットマップ全体をクリアする
- `fillRect(x, y, width, height, color)` — 指定された矩形領域を塗りつぶす
- `fillAll(color)` — ビットマップ全体を塗りつぶす
- `strokeRect(x, y, width, height, color)` — 指定された矩形の枠線を描画する
- `gradientFillRect(x, y, width, height, color1, color2, vertical)` — グラデーションで矩形を描画する
- `drawCircle(x, y, radius, color)` — 円形のビットマップを描画する
- `drawText(text, x, y, maxWidth, lineHeight, align)` — ビットマップにアウトラインテキストを描画する
- `measureTextWidth(text)` — 指定されたテキストの幅を返す
- `addLoadListener(listener)` — ビットマップが読み込まれた時に呼び出されるコールバック関数を追加する
- `retry()` — 画像の再読み込みを試みる

### Sprite

ゲーム画面に描画される基本オブジェクト

- **継承**: `PIXI.Sprite` → **Sprite**

#### プロパティ
- `bitmap` — スプライトの画像 (Bitmapオブジェクト)
- `width` — 拡大率を適用しないスプライトの幅
- `height` — 拡大率を適用しないスプライトの高さ
- `opacity` — スプライトの不透明度 (0〜255)
- `blendMode` — スプライトに適用されるブレンドモード

#### インスタンスメソッド
- `destroy()` — スプライトを破棄する
- `update()` — 毎フレーム、スプライトを更新する
- `hide()` — スプライトを「非表示状態」にする
- `show()` — スプライトの「非表示状態」を解除する
- `updateVisibility()` — スプライトの「非表示状態」を実際の可視状態に反映する
- `move(x, y)` — x座標とy座標を一度に設定する
- `setFrame(x, y, width, height)` — スプライトが表示するビットマップの矩形領域を設定する
- `setHue(hue)` — 色相回転値を設定する
- `getBlendColor()` — スプライトのブレンドカラーを取得する
- `setBlendColor(color)` — スプライトのブレンドカラーを設定する
- `getColorTone()` — スプライトのカラートーン(色調)を取得する
- `setColorTone(tone)` — スプライトのカラートーン(色調)を設定する

### Tilemap

2Dタイルベースのゲームマップを表示するタイルマップ

#### プロパティ
- `width` — タイルマップの幅
- `height` — タイルマップの高さ

#### インスタンスメソッド
- `destroy()` — タイルマップを破棄する
- `setData(width, height, data)` — タイルマップのデータ配列を設定する
- `isReady()` — タイルセットが描画準備完了かどうかを確認する
- `update()` — 毎フレーム、タイルマップを更新する
- `setBitmaps(bitmaps)` — タイルセットとして使用するビットマップの配列を設定する
- `refresh()` — タイルマップ全体を強制的に再描画する
- `updateTransform()` — このコンテナのすべての子要素のトランスフォームを更新する

### TilingSprite

タイリング画像（繰り返し表示）用のスプライトオブジェクト

#### プロパティ
- `bitmap` — タイリングスプライトの画像
- `opacity` — タイリングスプライトの不透明度 (0〜255)

#### インスタンスメソッド
- `destroy()` — タイリングスプライトを破棄する
- `update()` — 毎フレーム、タイリングスプライトを更新する
- `move(x, y, width, height)` — x, y, width, heightを一度に設定する
- `setFrame(x, y, width, height)` — 使用する画像の領域を指定する
- `updateTransform()` — 子のトランスフォームを更新する

### ScreenSprite

ゲーム画面全体を覆うスプライト（フラッシュや画面の色調変更用など）

#### プロパティ
- `opacity` — スプライトの不透明度 (0〜255)

#### インスタンスメソッド
- `destroy()` — スクリーンスプライトを破棄する
- `setBlack()` — 色を黒に設定する
- `setWhite()` — 色を白に設定する
- `setColor(r, g, b)` — RGB値で色を設定する

### Window

ゲーム内のウィンドウ

- **継承**: `PIXI.Container` → **Window**

#### プロパティ
- `windowskin` — ウィンドウスキンとして使用される画像
- `contents` — ウィンドウのコンテンツ（テキスト等）に使用されるビットマップ
- `contentsBack` — ウィンドウのコンテンツ背景に使用されるビットマップ
- `width` — ウィンドウの幅 (ピクセル単位)
- `height` — ウィンドウの高さ (ピクセル単位)
- `padding` — フレームとコンテンツの間のパディングサイズ
- `margin` — ウィンドウ背景の余白サイズ
- `opacity` — コンテンツを含まないウィンドウ自体の不透明度 (0〜255)
- `backOpacity` — ウィンドウ背景の不透明度 (0〜255)
- `contentsOpacity` — ウィンドウコンテンツの不透明度 (0〜255)
- `openness` — ウィンドウの開度合い (0=閉〜255=開)
- `innerWidth` — コンテンツエリア（内側）の幅 (ピクセル単位)
- `innerHeight` — コンテンツエリア（内側）の高さ (ピクセル単位)
- `innerRect` — コンテンツエリアの矩形領域

#### インスタンスメソッド
- `destroy()` — ウィンドウを破棄する
- `update()` — 毎フレーム、ウィンドウを更新する
- `move(x, y, width, height)` — x, y, width, heightを一度に設定する
- `isOpen()` — ウィンドウが完全に開いているか (openness == 255) を確認する
- `isClosed()` — ウィンドウが完全に閉じているか (openness == 0) を確認する
- `setCursorRect(x, y, width, height)` — コマンドカーソルの位置を設定する
- `moveCursorBy(x, y)` — 指定された量だけカーソル位置を移動する
- `moveInnerChildrenBy(x, y)` — 指定された量だけ内部の子要素を移動する
- `setTone(r, g, b)` — 背景の色調を変更する
- `addChildToBack(child)` — 背景とコンテンツの間に子要素を追加する
- `addInnerChild(child)` — クライアントエリアに子要素を追加する
- `updateTransform()` — 描画のためにトランスフォームを更新する
- `drawShape(graphics)` — ウィンドウの形状をPIXI.Graphicsオブジェクトに描画する

### WindowLayer

ゲームウィンドウを含むレイヤー（重なりなどを制御）

#### インスタンスメソッド
- `update()` — 毎フレーム、ウィンドウレイヤーを更新する
- `render(renderer)` — WebGLレンダラを使用してオブジェクトを描画する

### Weather

雨、嵐、雪を表示する天候エフェクト

#### インスタンスメソッド
- `destroy()` — 天候エフェクトを破棄する
- `update()` — 毎フレーム、天候状態を更新する

### ColorFilter

WebGL用のカラーフィルター（色調変更などに使用）

#### インスタンスメソッド
- `setHue(hue)` — 色相回転値を設定する
- `setColorTone(tone)` — カラートーン(色調)を設定する
- `setBlendColor(color)` — ブレンドカラーを設定する
- `setBrightness(brightness)` — 明るさを設定する

### Stage

表示ツリーのルートオブジェクト

#### インスタンスメソッド
- `destroy()` — ステージを破棄する

### WebAudio

Web Audio APIのオーディオオブジェクト

#### 静的メソッド
- `initialize()` — オーディオシステムを初期化する
- `setMasterVolume(value)` — すべてのオーディオのマスターボリュームを設定する

#### プロパティ
- `url` — 音声ファイルのURL
- `volume` — オーディオの音量
- `pitch` — オーディオのピッチ(再生速度/音程)
- `pan` — オーディオのパン(左右の定位)

#### インスタンスメソッド
- `clear()` — オーディオデータをクリアする
- `isReady()` — 再生準備完了かどうかを確認する
- `isError()` — 読み込みエラーが発生したかどうかを確認する
- `isPlaying()` — 再生中かどうかを確認する
- `play(loop, offset)` — オーディオを再生する
- `stop()` — オーディオを停止する
- `destroy()` — オーディオを破棄する
- `fadeIn(duration)` — フェードインを実行する
- `fadeOut(duration)` — フェードアウトを実行する
- `seek()` — シーク位置(再生位置)を取得する
- `addLoadListener(listener)` — 読み込み完了時のコールバック関数を追加する
- `addStopListener(listener)` — 再生停止時のコールバック関数を追加する
- `retry()` — オーディオパラメータの再読み込みを試みる

### Video

ビデオの再生を処理する静的クラス

#### 静的メソッド
- `initialize(width, height)` — ビデオシステムを初期化する
- `resize(width, height)` — ビデオの表示サイズを変更する
- `play(src)` — ビデオの再生を開始する
- `isPlaying()` — ビデオが再生中かどうかを確認する
- `setVolume(volume)` — ビデオの音量を設定する

### Input

キーボードとゲームパッドからの入力データを処理する静的クラス

#### 静的プロパティ
- `keyRepeatWait` — キーリピートが始まるまでの待機時間（フレーム数）
- `keyRepeatInterval` — キーリピートの間隔（フレーム数）
- `keyMapper` — 仮想キーコードからマップされたキー名に変換するハッシュテーブル
- `gamepadMapper` — ゲームパッドのボタンからマップされたキー名に変換するハッシュテーブル
- `dir4` — 4方向の入力値をテンキーの数値 (下=2,左=4,右=6,上=8) またはニュートラル(0)として返す
- `dir8` — 8方向の入力値をテンキーの数値またはニュートラル(0)として返す
- `date` — 最後の入力が行われた時間（ミリ秒）

#### 静的メソッド
- `initialize()` — 入力システムを初期化する
- `clear()` — すべての入力データをクリアする
- `update()` — 入力データをフレーム毎に更新する
- `isPressed(keyName)` — キーが現在押されているかどうかを確認する
- `isTriggered(keyName)` — キーが「ちょうど押された瞬間」かどうかを確認する
- `isRepeated(keyName)` — キーが押された瞬間、またはキーリピートが発生したかを確認する
- `isLongPressed(keyName)` — キーが長押しされているかどうかを確認する

### TouchInput

マウスとタッチスクリーンからの入力データを処理する静的クラス

#### 静的プロパティ
- `keyRepeatWait` — 疑似キーリピートが始まるまでの待機時間（フレーム数）
- `keyRepeatInterval` — 疑似キーリピートの間隔（フレーム数）
- `moveThreshold` — 移動したと判定するピクセル数のしきい値
- `wheelX` — 水平方向のスクロール量
- `wheelY` — 垂直方向のスクロール量
- `x` — 最後のタッチイベントにおけるキャンバス領域上のX座標
- `y` — 最後のタッチイベントにおけるキャンバス領域上のY座標
- `date` — 最後の入力が行われた時間（ミリ秒）

#### 静的メソッド
- `initialize()` — タッチシステムを初期化する
- `clear()` — すべてのタッチデータをクリアする
- `update()` — タッチデータをフレーム毎に更新する
- `isClicked()` — 同じ位置で押されて離された(クリックされた)かを確認する
- `isPressed()` — 現在押されているかどうかを確認する
- `isTriggered()` — 「ちょうど押された瞬間」かどうかを確認する
- `isRepeated()` — 押された瞬間、または疑似キーリピートが発生したかを確認する
- `isLongPressed()` — 長押しされているかどうかを確認する
- `isCancelled()` — 右マウスボタンがちょうど押されたかを確認する
- `isMoved()` — マウスまたは指が移動したかどうかを確認する
- `isHovered()` — ボタンを押さずにマウスが移動(ホバー)したかを確認する
- `isReleased()` — ボタンまたはタッチが離されたかを確認する

### JsonEx

オブジェクト情報を含む独自拡張JSONを処理する静的クラス (セーブデータのシリアライズ等に使用)

#### 静的プロパティ
- `maxDepth` — オブジェクトをパースする最大深度

#### 静的メソッド
- `stringify(object)` — オブジェクトを型情報(@クラス名など)を含めたJSON文字列に変換する
- `parse(json)` — JSON文字列をパースし、対応するクラスインスタンスのオブジェクトを再構築する
- `makeDeepCopy(object)` — 指定されたオブジェクトのディープコピーを作成する
