# RPGツクールMZ クラス一覧

## Core

RPGツクールMZのコアエンジンを構成する基本クラス群です。 ( `rmmz_core.js` )

### Utils

ユーティリティメソッドを定義する静的クラス。

- RPGMAKER_NAME: RPGツクールの名前。現在のバージョンでは "MZ"。
- RPGMAKER_VERSION: RPGツクールのバージョン。
- checkRMVersion: 現在のRPGツクールのバージョンが指定されたバージョン以上かどうかを確認する。
- isOptionValid: クエリストリングにオプションが含まれているかを確認する。
- isNwjs: プラットフォームがNW.jsかどうかを確認する。
- isMobileDevice: プラットフォームがモバイルデバイスかどうかを確認する。
- isMobileSafari: ブラウザがMobile Safariかどうかを確認する。
- isAndroidChrome: ブラウザがAndroid Chromeかどうかを確認する。
- isLocal: ブラウザがローカルファイルにアクセスしているかを確認する。
- canUseWebGL: ブラウザがWebGLをサポートしているかを確認する。
- canUseWebAudioAPI: ブラウザがWeb Audio APIをサポートしているかを確認する。
- canUseCssFontLoading: ブラウザがCSS Font Loadingをサポートしているかを確認する。
- canUseIndexedDB: ブラウザがIndexedDBをサポートしているかを確認する。
- canPlayOgg: ブラウザがoggファイルを再生できるかを確認する。
- canPlayWebm: ブラウザがwebmファイルを再生できるかを確認する。
- encodeURI: スラッシュをエスケープせずにURIコンポーネントをエンコードする。
- extractFileName: サブフォルダを含まないファイル名を取得する。
- escapeHtml: HTML用の特殊文字をエスケープする。
- containsArabic: 文字列にアラビア文字が含まれているかを確認する。
- setEncryptionInfo: 暗号化に関する情報を設定する。
- hasEncryptedImages: ゲーム内の画像ファイルが暗号化されているかを確認する。
- hasEncryptedAudio: ゲーム内の音声ファイルが暗号化されているかを確認する。
- decryptArrayBuffer: 暗号化されたデータを復号する。

### Graphics

グラフィック処理を実行する静的クラス。

- initialize: グラフィックシステムを初期化する。
- app: PIXI.Application オブジェクト。
- effekseer: Effekseer のコンテキストオブジェクト。
- setTickHandler: tickイベント用のハンドラを登録する。
- startGameLoop: ゲームループを開始する。
- stopGameLoop: ゲームループを停止する。
- setStage: 描画するステージ(Stage)オブジェクトを設定する。
- startLoading: ローディングスピナーを表示する。
- endLoading: ローディングスピナーを消去する。
- printError: 画面にエラーテキストを表示する。
- showRetryButton: リソースの再読み込みを試行するボタンを表示する。
- eraseError: ローディングエラーのテキストを消去する。
- pageToCanvasX: ページ上のX座標をキャンバス領域上のX座標に変換する。
- pageToCanvasY: ページ上のY座標をキャンバス領域上のY座標に変換する。
- isInsideCanvas: 指定されたポイントがゲームキャンバスの領域内にあるかを確認する。
- showScreen: ゲーム画面を表示する。
- hideScreen: ゲーム画面を隠す。
- resize: ゲーム画面のサイズを変更する。
- width: ゲーム画面の幅。
- height: ゲーム画面の高さ。
- defaultScale: ゲーム画面のデフォルトのズームスケール。

### Point

ポイント(座標)クラス。

### Rectangle

矩形クラス。

### Bitmap

画像を表す基本オブジェクト。

- load: 画像ファイルを読み込む。
- snap: ゲーム画面のスナップショットを取得する。
- prototype.isReady: ビットマップが描画準備完了かどうかを確認する。
- prototype.isError: 読み込みエラーが発生したかどうかを確認する。
- url: 画像ファイルのURL。
- baseTexture: 画像を保持するベーステクスチャ (PIXI.BaseTexture)。
- image: ビットマップ画像。
- canvas: ビットマップキャンバス。
- context: ビットマップキャンバスの2Dコンテキスト。
- width: ビットマップの幅。
- height: ビットマップの高さ。
- rect: ビットマップの矩形領域。
- smooth: 平滑化スケーリングが適用されているかどうか。
- paintOpacity: 描画オブジェクトの不透明度（0〜255の範囲）。
- prototype.destroy: ビットマップを破棄する。
- prototype.resize: ビットマップのサイズを変更する。
- prototype.blt: ブロック転送（画像の一部コピー）を実行する。
- prototype.getPixel: 指定された座標のピクセルの色(16進数文字列)を返す。
- prototype.getAlphaPixel: 指定された座標のアルファ(透明度)ピクセル値を返す。
- prototype.clearRect: 指定された矩形領域をクリアする。
- prototype.clear: ビットマップ全体をクリアする。
- prototype.fillRect: 指定された矩形領域を塗りつぶす。
- prototype.fillAll: ビットマップ全体を塗りつぶす。
- prototype.strokeRect: 指定された矩形の枠線を描画する。
- prototype.gradientFillRect: グラデーションで矩形を描画する。
- prototype.drawCircle: 円形のビットマップを描画する。
- prototype.drawText: ビットマップにアウトラインテキストを描画する。
- prototype.measureTextWidth: 指定されたテキストの幅を返す。
- prototype.addLoadListener: ビットマップが読み込まれた時に呼び出されるコールバック関数を追加する。
- prototype.retry: 画像の再読み込みを試みる。

### Sprite

ゲーム画面に描画される基本オブジェクト。

- bitmap: スプライトの画像 (Bitmapオブジェクト)。
- width: 拡大率を適用しないスプライトの幅。
- height: 拡大率を適用しないスプライトの高さ。
- opacity: スプライトの不透明度 (0〜255)。
- blendMode: スプライトに適用されるブレンドモード。
- prototype.destroy: スプライトを破棄する。
- prototype.update: 毎フレーム、スプライトを更新する。
- prototype.hide: スプライトを「非表示状態」にする。
- prototype.show: スプライトの「非表示状態」を解除する。
- prototype.updateVisibility: スプライトの「非表示状態」を実際の可視状態に反映する。
- prototype.move: x座標とy座標を一度に設定する。
- prototype.setFrame: スプライトが表示するビットマップの矩形領域を設定する。
- prototype.setHue: 色相回転値を設定する。
- prototype.getBlendColor: スプライトのブレンドカラーを取得する。
- prototype.setBlendColor: スプライトのブレンドカラーを設定する。
- prototype.getColorTone: スプライトのカラートーン(色調)を取得する。
- prototype.setColorTone: スプライトのカラートーン(色調)を設定する。

### Tilemap

2Dタイルベースのゲームマップを表示するタイルマップ。

- width: タイルマップの幅。
- height: タイルマップの高さ。
- prototype.destroy: タイルマップを破棄する。
- prototype.setData: タイルマップのデータ配列を設定する。
- prototype.isReady: タイルセットが描画準備完了かどうかを確認する。
- prototype.update: 毎フレーム、タイルマップを更新する。
- prototype.setBitmaps: タイルセットとして使用するビットマップの配列を設定する。
- prototype.refresh: タイルマップ全体を強制的に再描画する。
- prototype.updateTransform: 描画のために、このコンテナのすべての子要素のトランスフォームを更新する。

### TilingSprite

タイリング画像（繰り返し表示）用のスプライトオブジェクト。

- bitmap: タイリングスプライトの画像。
- opacity: タイリングスプライトの不透明度 (0〜255)。
- prototype.destroy: タイリングスプライトを破棄する。
- prototype.update: 毎フレーム、タイリングスプライトを更新する。
- prototype.move: x, y, width, heightを一度に設定する。
- prototype.setFrame: タイリングスプライトが使用する画像の領域を指定する。
- prototype.updateTransform: 描画のために、子のトランスフォームを更新する。

### ScreenSprite

ゲーム画面全体を覆うスプライト（フラッシュや画面の色調変更用など）。

- opacity: スプライトの不透明度 (0〜255)。
- prototype.destroy: スプリーンスプライトを破棄する。
- prototype.setBlack: スクリーンスプライトの色を黒に設定する。
- prototype.setWhite: スクリーンスプライトの色を白に設定する。
- prototype.setColor: RGB値でスクリーンスプライトの色を設定する。

### Window

ゲーム内のウィンドウ。

- windowskin: ウィンドウスキンとして使用される画像。
- contents: ウィンドウのコンテンツ（テキスト等）に使用されるビットマップ。
- contentsBack: ウィンドウのコンテンツ背景に使用されるビットマップ。
- width: ウィンドウの幅 (ピクセル単位)。
- height: ウィンドウの高さ (ピクセル単位)。
- padding: フレームとコンテンツの間のパディングサイズ。
- margin: ウィンドウ背景の余白サイズ。
- opacity: コンテンツを含まないウィンドウ自体の不透明度 (0〜255)。
- backOpacity: ウィンドウ背景の不透明度 (0〜255)。
- contentsOpacity: ウィンドウコンテンツの不透明度 (0〜255)。
- openness: ウィンドウの開度合い (0=閉〜255=開)。
- innerWidth: コンテンツエリア（内側）の幅 (ピクセル単位)。
- innerHeight: コンテンツエリア（内側）の高さ (ピクセル単位)。
- innerRect: コンテンツエリアの矩形領域。
- prototype.destroy: ウィンドウを破棄する。
- prototype.update: 毎フレーム、ウィンドウを更新する。
- prototype.move: x, y, width, heightを一度に設定する。
- prototype.isOpen: ウィンドウが完全に開いているか (openness == 255) を確認する。
- prototype.isClosed: ウィンドウが完全に閉じているか (openness == 0) を確認する。
- prototype.setCursorRect: コマンドカーソルの位置を設定する。
- prototype.moveCursorBy: 指定された量だけカーソル位置を移動する。
- prototype.moveInnerChildrenBy: 指定された量だけ内部の子要素を移動する。
- prototype.setTone: 背景の色調を変更する。
- prototype.addChildToBack: 背景とコンテンツの間に子要素を追加する。
- prototype.addInnerChild: クライアントエリアに子要素を追加する。
- prototype.updateTransform: 描画のためにトランスフォームを更新する。
- prototype.drawShape: ウィンドウの形状をPIXI.Graphicsオブジェクトに描画する(WindowLayerで使用)。

### WindowLayer

ゲームウィンドウを含むレイヤー（重なりなどを制御）。

- prototype.update: 毎フレーム、ウィンドウレイヤーを更新する。
- prototype.render: WebGLレンダラを使用してオブジェクトを描画する。

### Weather

雨、嵐、雪を表示する天候エフェクト。

- prototype.destroy: 天候エフェクトを破棄する。
- prototype.update: 毎フレーム、天候状態を更新する。

### ColorFilter

WebGL用のカラーフィルター（色調変更などに使用）。

- prototype.setHue: 色相回転値を設定する。
- prototype.setColorTone: カラートーン(色調)を設定する。
- prototype.setBlendColor: ブレンドカラーを設定する。
- prototype.setBrightness: 明るさを設定する。

### Stage

表示ツリーのルートオブジェクト。

- prototype.destroy: ステージを破棄する。

### WebAudio

Web Audio APIのオーディオオブジェクト。

- initialize: オーディオシステムを初期化する。
- setMasterVolume: すべてのオーディオのマスターボリュームを設定する。
- prototype.clear: オーディオデータをクリアする。
- url: 音声ファイルのURL。
- volume: オーディオの音量。
- pitch: オーディオのピッチ(再生速度/音程)。
- pan: オーディオのパン(左右の定位)。
- prototype.isReady: オーディオデータが再生準備完了かどうかを確認する。
- prototype.isError: 読み込みエラーが発生したかどうかを確認する。
- prototype.isPlaying: オーディオが再生中かどうかを確認する。
- prototype.play: オーディオを再生する。
- prototype.stop: オーディオを停止する。
- prototype.destroy: オーディオを破棄する。
- prototype.fadeIn: フェードインを実行する。
- prototype.fadeOut: フェードアウトを実行する。
- prototype.seek: オーディオのシーク位置(再生位置)を取得する。
- prototype.addLoadListener: オーディオデータ読み込み完了時に呼び出されるコールバック関数を追加する。
- prototype.addStopListener: 再生停止時に呼び出されるコールバック関数を追加する。
- prototype.retry: オーディオパラメータの再読み込みを試みる。

### Video

ビデオの再生を処理する静的クラス。

- initialize: ビデオシステムを初期化する。
- resize: ビデオの表示サイズを変更する。
- play: ビデオの再生を開始する。
- isPlaying: ビデオが再生中かどうかを確認する。
- setVolume: ビデオの音量を設定する。

### Input

キーボードとゲームパッドからの入力データを処理する静的クラス。

- initialize: 入力システムを初期化する。
- keyRepeatWait: キーリピートが始まるまでの待機時間（フレーム数）。
- keyRepeatInterval: キーリピートの間隔（フレーム数）。
- keyMapper: 仮想キーコードからマップされたキー名(up, down, okなど)に変換するハッシュテーブル。
- gamepadMapper: ゲームパッドのボタンからマップされたキー名に変換するハッシュテーブル。
- clear: すべての入力データをクリアする。
- update: 入力データをフレーム毎に更新する。
- isPressed: キーが現在押されているかどうかを確認する。
- isTriggered: キーが「ちょうど押された瞬間」かどうかを確認する。
- isRepeated: キーが押された瞬間、またはキーリピートが発生したかどうかを確認する。
- isLongPressed: キーが押し続けられている(長押し)かどうかを確認する。
- dir4: 4方向の入力値をテンキーの数値(下=2,左=4,右=6,上=8)、またはニュートラル(0)として返す。
- dir8: 8方向の入力値をテンキーの数値、またはニュートラル(0)として返す。
- date: 最後の入力が行われた時間（ミリ秒）。

### TouchInput

マウスとタッチスクリーンからの入力データを処理する静的クラス。

- initialize: タッチシステムを初期化する。
- keyRepeatWait: 疑似キーリピートが始まるまでの待機時間（フレーム数）。
- keyRepeatInterval: 疑似キーリピートの間隔（フレーム数）。
- moveThreshold: 移動したと判定するピクセル数のしきい値。
- clear: すべてのタッチデータをクリアする。
- update: タッチデータをフレーム毎に更新する。
- isClicked: マウスまたはタッチスクリーンが同じ位置で押されて離された(クリックされた)かどうかを確認する。
- isPressed: マウスまたはタッチスクリーンが現在押されているかどうかを確認する。
- isTriggered: 左マウスボタンまたはタッチスクリーンが「ちょうど押された瞬間」かどうかを確認する。
- isRepeated: 左マウスボタンまたはタッチスクリーンが押された瞬間、または疑似キーリピートが発生したかどうかを確認する。
- isLongPressed: 左マウスボタンまたはタッチスクリーンが長押しされているかどうかを確認する。
- isCancelled: 右マウスボタンがちょうど押されたか(キャンセルされたか)を確認する。
- isMoved: マウスまたはタッチスクリーン上の指が移動したかどうかを確認する。
- isHovered: ボタンを押さずにマウスが移動(ホバー)したかどうかを確認する。
- isReleased: 左マウスボタンまたはタッチが離されたかどうかを確認する。
- wheelX: 水平方向のスクロール量。
- wheelY: 垂直方向のスクロール量。
- x: 最後のタッチイベントにおけるキャンバス領域上のX座標。
- y: 最後のタッチイベントにおけるキャンバス領域上のY座標。
- date: 最後の入力が行われた時間（ミリ秒）。

### JsonEx

オブジェクト情報を含む独自拡張JSONを処理する静的クラス (セーブデータのシリアライズ等に使用)。

- maxDepth: オブジェクトをパースする最大深度。
- stringify: オブジェクトを型情報(@クラス名など)を含めたJSON文字列に変換する。
- parse: JSON文字列をパースし、対応するクラスインスタンスのオブジェクトを再構築する。
- makeDeepCopy: 指定されたオブジェクトのディープコピーを作成する(JsonEx.parse(JsonEx.stringify(obj))と同等)。
