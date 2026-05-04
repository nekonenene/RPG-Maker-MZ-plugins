## Sprites

ゲーム画面に描画されるスプライトの `Sprite_*` / `Spriteset_*` クラス群

ソースファイル: `rmmz_sprites.js`

### Sprite_Clickable

クリック処理機能を持つスプライトクラス

- **継承**: `Sprite` → **Sprite_Clickable**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `update()` — 毎フレーム更新する
- `processTouch()` — タッチ・クリック等の入力を処理する
- `isPressed()` — スプライトが押下されているかを確認する
- `isClickEnabled()` — クリック操作が有効かを確認する（透明でないか等）
- `isBeingTouched()` — 現在タッチされている最中かを確認する
- `hitTest(x, y)` — 指定座標がスプライトの矩形内にあるかを判定する
- `onMouseEnter()` — マウスカーソルが乗った（ホバー）時のコールバック
- `onMouseExit()` — マウスカーソルが外れた時のコールバック
- `onPress()` — 押下（プレス）された時のコールバック
- `onClick()` — クリック（またはタップ）された時のコールバック

### Sprite_Button

ボタン表示用のスプライトクラス

- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Button**

#### インスタンスメソッド
- `initialize(buttonType)` — 指定されたボタンタイプ（cancel, pageup等）で初期化する
- `setupFrames()` — ボタン画像内の通常時・押下時の位置フォーマットをセットアップする
- `blockWidth()` — ボタン画像の1ブロック分の幅を返す
- `blockHeight()` — ボタン画像の1ブロック分の高さを返す
- `loadButtonImage()` — ボタン用のシステム画像（system/ButtonSet）を読み込む
- `buttonData()` — 各ボタンタイプの画像上の座標情報データを返す
- `update()` — 毎フレーム更新する
- `checkBitmap()` — 画像のローディング完了をチェックし、完了ならフレームを設定する
- `updateFrame()` — 押下状態などに合わせて描画フレーム（通常/押下）を更新する
- `updateOpacity()` — ボタンの有効/無効状態等に応じて不透明度を更新する
- `setColdFrame(x, y, width, height)` — 通常時（非押下）の切り出し矩形を設定する
- `setHotFrame(x, y, width, height)` — 押下時の切り出し矩形を設定する
- `setClickHandler(method)` — クリックされた時に実行されるコールバック関数を設定する
- `onClick()` — クリック時に設定されたハンドラを実行する

### Sprite_Character

キャラクター表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Character**

#### インスタンスメソッド
- `initialize(character)` — 指定されたキャラクター（Game_CharacterBase等）で初期化する
- `initMembers()` — メンバ変数を初期化する
- `setCharacter(character)` — 描画対象のキャラクターオブジェクトを設定する
- `checkCharacter(character)` — キャラクターオブジェクトが変更されたかチェックする
- `update()` — 毎フレーム更新する
- `updateVisibility()` — 透明状態に応じて表示/非表示を更新する
- `isTile()` — キャラクター画像がタイルセットのものかを確認する
- `isObjectCharacter()` — ファイル名が'!'から始まるオブジェクト系かを確認する
- `isEmptyCharacter()` — キャラクター画像やタイルが空（なし）かを確認する
- `tilesetBitmap(tileId)` — タイルIDから対応するタイルセット画像のBitmapを返す
- `updateBitmap()` — キャラクターの画像名が変更された場合にBitmapを再ロードする
- `isImageChanged()` — 画像名やインデックスが変更されたかを確認する
- `setTileBitmap()` — タイル用のBitmapおよびフレームを設定する
- `setCharacterBitmap()` — キャラクター歩行グラフィック等のBitmapを設定する
- `updateFrame()` — キャラクターの向き・足踏みに合わせて切り出しフレームを更新する
- `updateTileFrame()` — タイル画像の切り出しフレームを更新する
- `updateCharacterFrame()` — 歩行グラフィックの切り出しフレームを更新する
- `characterBlockX()` — 歩行グラフィック集合画像内のXブロック位置（0〜3）を返す
- `characterBlockY()` — 歩行グラフィック集合画像内のYブロック位置（0〜1）を返す
- `characterPatternX()` — 向き・パターンに基づくXフレームインデックスを返す
- `characterPatternY()` — 向き・パターンに基づくYフレームインデックスを返す
- `patternWidth()` — 1パターン（1キャラ分）の幅を返す
- `patternHeight()` — 1パターン（1キャラ分）の高さを返す
- `updateHalfBodySprites()` — 茂み属性（半透明表示）用の下半身スプライトを更新する
- `createHalfBodySprites()` — 茂み表示用の下半身スプライトを作成する
- `updatePosition()` — 画面座標およびZ座標（重ね合わせ順）を更新する
- `updateOther()` — アニメーションやフキダシアイコン、不透明度などを更新する

### Sprite_Battler

Sprite_ActorとSprite_Enemyのスーパークラス

- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Battler**

#### インスタンスメソッド
- `initialize(battler)` — 指定されたバトラー（Game_Battler）で初期化する
- `initMembers()` — メンバ変数を初期化する
- `setBattler(battler)` — 描画対象のバトラーオブジェクトを設定する
- `checkBattler(battler)` — 対象バトラーが変更されていれば正しくセットする
- `mainSprite()` — バトラー本体の画像を表示するメインスプライトを返す
- `setHome(x, y)` — バトラーの定位置（ホームポジション）を設定する
- `update()` — 毎フレーム更新する
- `updateVisibility()` — 隠れ状態や戦闘不能などに合わせて表示/非表示を更新する
- `updateMain()` — メインスプライト（バトラー画像部分）を更新する
- `updateBitmap()` — バトラーのグラフィック変更に合わせてBitmapを更新する
- `updateFrame()` — 切り出しフレームを更新する（サブクラスで実装）
- `updateMove()` — 攻撃時などのステップ移動を更新する
- `updatePosition()` — 画面座標を更新する
- `updateDamagePopup()` — ダメージポップアップの生成・更新を行う
- `updateSelectionEffect()` — ターゲット選択時の点滅エフェクトなどを更新する
- `setupDamagePopup()` — バトラーのダメージ予約があれば新しいポップアップを作成する
- `createDamageSprite()` — ダメージ処理用のポップアップスプライトを作成する
- `destroyDamageSprite(sprite)` — 再生終了したダメージポップアップを破棄する
- `damageOffsetX()` — ダメージポップアップのX座標のオフセット
- `damageOffsetY()` — ダメージポップアップのY座標のオフセット
- `startMove(x, y, duration)` — 目標座標への移動（ステップ）を開始する
- `onMoveEnd()` — 移動が終了した時のコールバック
- `isEffecting()` — アニメーションやポップアップなどのエフェクト再生中かを確認する
- `isMoving()` — 目標座標に向けて移動中かを確認する
- `inHomePosition()` — バトラーが定位置（ホームポジション）にいるかを確認する
- `onMouseEnter()` — マウスカーソルがバトラー上に重なった時、ターゲットに選ぶ（ホバー）
- `onPress()` — 押し続けられた時のコールバック
- `onClick()` — クリック（タップ）された時、ターゲット選択決定を行う

### Sprite_Actor

アクター表示用のスプライトクラス

- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Actor**

#### インスタンスメソッド
- `initialize(battler)` — 初期化し、各種パーツスプライトを作成する
- `initMembers()` — メンバ変数を初期化する
- `mainSprite()` — 武器・状態異常などをまとめる親となるメインスプライトを返す
- `createMainSprite()` — メインスプライトを作成する
- `createShadowSprite()` — 足元の影スプライトを作成する
- `createWeaponSprite()` — 武器の攻撃アニメーション用スプライトを作成する
- `createStateSprite()` — 状態異常アイコン用スプライト（Sprite_StateIcon）を作成する
- `setBattler(battler)` — 対象となるアクターオブジェクトを設定する
- `moveToStartPosition()` — 戦闘開始時、画面外から初期位置（ホーム）へ移動開始する
- `setActorHome(index)` — パーティ内インデックスからホームポジションを計算して設定する
- `update()` — 毎フレーム更新する
- `updateShadow()` — 足元の影の表示を更新する
- `updateMain()` — アクター本体の画像・状態を更新する
- `setupMotion()` — 攻撃・魔法・ダメージなどのモーションをセットアップする
- `setupWeaponAnimation()` — 武器を振るアニメーションの開始をセットアップする
- `startMotion(motionType)` — 指定されたモーション（'walk', 'wait', 'attack' 等）を開始する
- `updateTargetPosition()` — 移動目標位置に向かっている最中か更新する
- `shouldStepForward()` — アクション実行前に一歩前へ出るべきかを確認する
- `updateBitmap()` — アクター画像（[sv]アクター等）のBitmapを更新する
- `updateFrame()` — モーションに基づく切り出しフレーム（セル）を更新する
- `updateMove()` — ステップ移動などの座標更新を行う
- `updateMotion()` — モーション進行の処理（ループや単発終了など）を更新する
- `updateMotionCount()` — モーション進行のフレームカウンタを更新する
- `motionSpeed()` — モーションの基本再生速度（12）を返す
- `refreshMotion()` — バトラーの状態（ステート・HP等）から適切なモーションを再設定する
- `startEntryMotion()` — 戦闘開始時の入場モーション（歩いて定位置に就く等）を開始する
- `stepForward()` — アクション開始時などに一歩前進する移動処理を行う
- `stepBack()` — 定位置に戻る移動処理を行う
- `retreat()` — 逃走時の後退処理を行う
- `onMoveEnd()` — 移動終了後、リフレッシュ等を行うコールバック
- `damageOffsetX()` — アクター側のダメージポップアップXオフセット（-32）
- `damageOffsetY()` — アクター側のダメージポップアップYオフセット（0）

### Sprite_Enemy

敵キャラクター表示用のスプライトクラス

- **継承**: `Sprite` → `Sprite_Clickable` → `Sprite_Battler` → **Sprite_Enemy**

#### インスタンスメソッド
- `initialize(battler)` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `createStateIconSprite()` — 敵の上部に表示する状態異常アイコン（Sprite_StateIcon）を作成する
- `setBattler(battler)` — 対象のエネミーオブジェクトを設定する
- `update()` — 毎フレーム更新する
- `updateBitmap()` — エネミー画像と色相変更を合わせたBitmapを生成・更新する
- `loadBitmap(name)` — 指定された名前のエネミー画像をロードする
- `setHue(hue)` — 画像の色相（Hue）を設定する
- `updateFrame()` — エネミーの切り出し領域（基本は全体）を更新する
- `updatePosition()` — ホーム座標に戻ったり、揺れエフェクト等に合わせて座標を更新する
- `updateStateSprite()` — 状態異常アイコンスプライトの位置（敵の頭上など）を更新する
- `initVisibility()` — 最初から出現しているか隠れているかで可視状態を初期化する
- `setupEffect()` — フラッシュや消滅などのエフェクトをセットアップする
- `startEffect(effectType)` — 出現・消滅等のエフェクトを開始する
- `startAppear()` — フェードインで出現するエフェクトを開始する
- `startDisappear()` — フェードアウトで消滅（逃走など）するエフェクトを開始する
- `startWhiten()` — 敵にダメージを与えた際の白フラッシュ（Whiten）を開始する
- `startBlink()` — 状態異常時などの点滅エフェクトを開始する
- `startCollapse()` — 通常の戦闘不能エフェクト（下に向かって縮む等）を開始する
- `startBossCollapse()` — ボス用戦闘不能エフェクトを開始する
- `startInstantCollapse()` — アニメーション等なしで即座に消滅する処理を開始する
- `updateEffect()` — エフェクト（白フラッシュ・点滅・消滅等）の進行を更新する
- `isEffecting()` — アニメーションや白フラッシュなどのエフェクト再生中かを確認する
- `revertToNormal()` — エフェクト完了時に不透明度・色調などを通常に戻す
- `updateWhiten()` — 白フラッシュのフェード処理を更新する
- `updateBlink()` — 点滅のフェード処理を更新する
- `updateAppear()` — 出現のフェード処理を更新する
- `updateDisappear()` — 消滅のフェード処理を更新する
- `updateCollapse()` — 通常消滅（崩れ）のエフェクト処理を更新する
- `updateBossCollapse()` — ボス消滅のエフェクト処理を更新する
- `updateInstantCollapse()` — 即座の消滅処理（透明にするだけ等）を行う
- `damageOffsetX()` — エネミー側のダメージポップアップXオフセット（0）
- `damageOffsetY()` — エネミー側のダメージポップアップYオフセット（-8）

### Sprite_Animation

アニメーション表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Animation**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `destroy(options)` — スプライトを破棄する
- `update()` — 毎フレーム更新する
- `canStart()` — アニメーションデータや画像が全てロードされ、再生開始できる状態かを確認する
- `shouldWaitForPrevious()` — 先行するアニメーションの終了を待つべきかを確認する
- `updateEffectGeometry()` — エフェクト（Effekseer）の座標や拡大率などを更新する
- `updateMain()` — アニメーションの進行（フレーム数）を更新する
- `processSoundTimings()` — 現在のフレームに設定された効果音（SE）を再生する
- `processFlashTimings()` — 現在のフレームに設定された画面・対象のフラッシュを実行する
- `checkEnd()` — アニメーションの再生が完了したかを確認し、完了なら自身を削除する
- `updateFlash()` — ターゲットのフラッシュ状態（色と不透明度）を更新する
- `isPlaying()` — アニメーションが再生中かを確認する
- `setRotation(x, y, z)` — エフェクトの回転角を設定する
- `setProjectionMatrix(renderer)` — 3D描画用のプロジェクション行列を設定する
- `setCameraMatrix(/*renderer*/)` — カメラ行列を設定する
- `setViewport(renderer)` — 描画のビューポート（画面上の描画領域）を設定する
- `targetPosition(renderer)` — 対象スプライトの画面中心座標などを計算して返す
- `targetSpritePosition(sprite)` — 指定したスプライトの基準座標を返す
- `resetViewport(renderer)` — ビューポートをリセットする
- `onBeforeRender(renderer)` — 描画前のコールバック（MV互換用等）
- `onAfterRender(renderer)` — 描画後のコールバック（ステートのリセット等）

### Sprite_AnimationMV

旧フォーマット(MV形式)のアニメーション表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_AnimationMV**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `setupRate()` — アニメーションの更新レート（4フレームに1回等）をセットアップする
- `setupDuration()` — アニメーションの総再生フレーム数を計算してセットアップする
- `update()` — 毎フレーム更新し、セル画像やフラッシュを処理する
- `updateFlash()` — 対象のフラッシュ（色や不透明度）を更新する
- `updateScreenFlash()` — 画面全体のフラッシュ処理を更新する
- `absoluteX()` — 画面上の絶対X座標を計算する
- `absoluteY()` — 画面上の絶対Y座標を計算する
- `updateHiding()` — 対象を一時的に非表示（消去エフェクト時等）にしている場合の更新処理
- `isPlaying()` — アニメーションが再生中かを確認する
- `loadBitmaps()` — 使用するアニメーション画像（1と2）をロードする
- `isReady()` — 全ての画像がロード完了しているかを確認する
- `createCellSprites()` — セル画像を描画するための子スプライト群（16個）を作成する
- `createScreenFlashSprite()` — 画面フラッシュ用のスプライトを作成する
- `updateMain()` — アニメーションの進行（フレーム進行、タイミングコマンド実行など）を行う
- `updatePosition()` — 対象に合わせた座標の追従や画面位置の調整を行う
- `updateFrame()` — 現在の進行度から現在のアニメーションフレームインデックスを決定する
- `currentFrameIndex()` — 現在表示すべきアニメーションフレームの番号を返す
- `updateAllCellSprites(frame)` — 現在のフレームデータに基づいて全てのセルスプライトを更新する
- `updateCellSprite(sprite, cell)` — 1つのセルスプライトの画像切り出し、座標、拡大率、不透明度などを更新する
- `processTimingData(timing)` — SEの再生やフラッシュなどのタイミングデータを実行する
- `startFlash(color, duration)` — 対象のフラッシュを開始する
- `startScreenFlash(color, duration)` — 画面全体のフラッシュを開始する
- `startHiding(duration)` — 対象を非表示にするエフェクトを開始する
- `onEnd()` — 再生終了時のコールバック（自身やフラッシュスプライトの破棄）

### Sprite_Battleback

戦闘背景画像表示用のスプライトクラス

- **継承**: `TilingSprite` → **Sprite_Battleback**

#### インスタンスメソッド
- `initialize(type)` — 初期化し、背景のタイプ（床か壁か等）を設定する
- `adjustPosition()` — 画面サイズや揺れエフェクトに合わせて背景位置を調整する
- `battleback1Bitmap()` — バトル背景1（床・下部）のBitmapを生成・ロードする
- `battleback2Bitmap()` — バトル背景2（壁・上部）のBitmapを生成・ロードする
- `battleback1Name()` — マップや指定に応じたバトル背景1のファイル名を返す
- `battleback2Name()` — マップや指定に応じたバトル背景2のファイル名を返す
- `overworldBattleback1Name()` — フィールド（オーバーワールド）時のバトル背景1ファイル名を返す
- `overworldBattleback2Name()` — フィールド時のバトル背景2ファイル名を返す
- `normalBattleback1Name()` — 通常マップ時のバトル背景1ファイル名を返す
- `normalBattleback2Name()` — 通常マップ時のバトル背景2ファイル名を返す
- `terrainBattleback1Name(type)` — 地形タグに応じたバトル背景1ファイル名を返す
- `terrainBattleback2Name(type)` — 地形タグに応じたバトル背景2ファイル名を返す
- `defaultBattleback1Name()` — デフォルト（他が該当しない時）のバトル背景1ファイル名を返す
- `defaultBattleback2Name()` — デフォルトのバトル背景2ファイル名を返す
- `shipBattleback1Name()` — 船に乗っている時のバトル背景1ファイル名を返す
- `shipBattleback2Name()` — 船に乗っている時のバトル背景2ファイル名を返す
- `autotileType(z)` — マップ座標からオートタイルの種類を取得する（背景決定用）

### Sprite_Damage

ダメージポップアップ表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Damage**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `destroy(options)` — スプライトを破棄する
- `setup(target)` — 対象のバトラーからダメージ結果等を受け取り表示準備をする
- `setupCriticalEffect()` — クリティカル時のエフェクト（フラッシュ等）を予約する
- `fontFace()` — ダメージ数字に使用するフォント名を返す
- `fontSize()` — ダメージ数字のフォントサイズを返す
- `damageColor()` — ダメージのテキスト色を返す（回復は緑、その他は白など）
- `outlineColor()` — ダメージテキストの縁取りの色を返す
- `outlineWidth()` — ダメージテキストの縁取りの太さを返す
- `createMiss()` — 回避時の「Miss」文字スプライトを作成する
- `createDigits(value)` — ダメージ数値の各桁のスプライトを作成・並べる
- `createChildSprite(width, height)` — 数字や文字を描画する子スプライトを作成する
- `createBitmap(width, height)` — 数字や文字を描画するためのBitmapを作成する
- `update()` — 毎フレーム更新し、上に浮かぶアニメーションなどを処理する
- `updateChild(sprite)` — 各子スプライト（数字の各桁等）の遅延表示・跳ね返り座標を更新する
- `updateFlash()` — 会心の一撃による赤フラッシュを更新する
- `updateOpacity()` — 再生終盤に合わせて不透明度を下げ、フェードアウトさせる
- `isPlaying()` — ダメージポップアップが再生中かを確認する

### Sprite_Gauge

ステータスゲージ表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Gauge**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `destroy(options)` — スプライトと生成したBitmapを破棄する
- `createBitmap()` — ゲージやラベルを描画するためのBitmapを作成する
- `bitmapWidth()` — スプライト（ゲージ領域全体）の幅を返す
- `bitmapHeight()` — スプライト（ゲージ領域全体）の高さを返す
- `textHeight()` — テキスト部分の基準高さを返す
- `gaugeHeight()` — ゲージバー本体の高さを返す
- `gaugeX()` — ゲージバーを描画開始するX座標を返す
- `labelY()` — ラベルや数値を描画するY座標を返す
- `labelFontFace()` — ラベルテキストに使用するフォント名を返す
- `labelFontSize()` — ラベルテキストのフォントサイズを返す
- `valueFontFace()` — 数値テキストに使用するフォント名を返す
- `valueFontSize()` — 数値テキストのフォントサイズを返す
- `setup(battler, statusType)` — 指定されたバトラーとゲージ種類（'hp', 'mp', 'tp', 'time'）でセットアップする
- `update()` — 毎フレーム更新する
- `updateBitmap()` — 値の変動等があればBitmapを再描画する
- `updateTargetValue(value, maxValue)` — 現在目標とする値・最大値を更新し、なめらかな増減の準備をする
- `smoothness()` — 値の変動が追いつくまでの滑らかさ（遅延フレーム数）を返す
- `updateGaugeAnimation()` — ゲージの現在表示値を目標値に向けて徐々に近づける
- `updateFlashing()` — TPフル等でのゲージ点滅色を更新する
- `flashingColor1()` — 点滅開始側の色を返す
- `flashingColor2()` — 点滅終了側の色を返す
- `isValid()` — 対象バトラーが存在し、値が正常に取得できるかを確認する
- `currentValue()` — 現在の対象値（HP・MP等）の現在値を返す
- `currentMaxValue()` — 現在の対象値（HP・MP等）の最大値を返す
- `label()` — ゲージのラベル文字（「HP」等のシステム用語）を返す
- `gaugeBackColor()` — ゲージの背景（空き部分）の色を返す
- `gaugeColor1()` — ゲージのグラデーション開始色を返す
- `gaugeColor2()` — ゲージのグラデーション終了色を返す
- `labelColor()` — ラベルテキストの文字色を返す（システムカラー等）
- `labelOutlineColor()` — ラベルテキストの縁取り色を返す
- `labelOutlineWidth()` — ラベルのアウトラインの太さを返す
- `valueColor()` — 数値テキストの文字色を返す（ピンチ時は赤など）
- `valueOutlineColor()` — 数値テキストの縁取り色を返す
- `valueOutlineWidth()` — 数値のアウトラインの太さを返す
- `redraw()` — 全体をクリアし、ゲージ・ラベル・数値を再描画する
- `drawGauge()` — ゲージの背景と現在値バーのグラデーションを描画する
- `drawGaugeRect(x, y, width, height)` — 指定矩形にゲージバーを描画する
- `gaugeRate()` — ゲージの割合（0.0 〜 1.0）を返す
- `drawLabel()` — ゲージの種類名（「HP」等）を描画する
- `setupLabelFont()` — Bitmapのコンテキストにラベル用フォント設定を適用する
- `measureLabelWidth()` — 描画予定のラベルの幅（ピクセル数）を計測して返す
- `labelOpacity()` — ラベルの不透明度を返す（通常は不透明か半透明）
- `drawValue()` — 現在値および最大値の数値を右に寄せて描画する
- `setupValueFont()` — Bitmapのコンテキストに数値用フォント設定を適用する

### Sprite_Name

名前表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Name**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `destroy(options)` — スプライトと生成したBitmapを破棄する
- `createBitmap()` — 名前を描画するためのBitmapを作成する
- `bitmapWidth()` — 文字列を描画する領域の幅（300等）を返す
- `bitmapHeight()` — 文字列を描画する領域の高さを返す
- `fontFace()` — テキストに使用するフォント名を返す
- `fontSize()` — テキストのフォントサイズを返す
- `setup(battler)` — 描画対象のバトラーをセットアップする
- `update()` — 毎フレーム更新する
- `updateBitmap()` — アクター名が変更された等の理由で再描画が必要であればBitmapを更新する
- `name()` — 描画する対象の「名前」を返す
- `textColor()` — 名前の文字色を返す（通常はシステムカラー）
- `outlineColor()` — 名前の縁取り色を返す
- `outlineWidth()` — 名前の縁取り色の太さを返す
- `redraw()` — 全体をクリアし、名前を再描画する
- `setupFont()` — Bitmapのコンテキストにフォント設定を適用する

### Sprite_StateIcon

ステートアイコン表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_StateIcon**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `loadBitmap()` — アイコン画像セット（IconSet）のBitmapをロードする
- `setup(battler)` — 対象バトラーをセットアップする
- `update()` — 毎フレーム更新し、アイコンをアニメーション表示させる
- `animationWait()` — 次のステートアイコンに切り替わるまでのウェイトフレーム数（40）を返す
- `updateIcon()` — 定期的に表示インデックスを進め、描画対象のアイコンIDを更新する
- `shouldDisplay()` — 死亡しておらずステートが存在するなど、アイコンを表示すべきかを確認する
- `updateFrame()` — タイマー等に基づくフェード効果や、アイコン画像からの切り出しフレームを更新する

### Sprite_StateOverlay

ステートのオーバーレイ画像表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_StateOverlay**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `loadBitmap()` — ステートのオーバーレイ用画像セット（system/States）をロードする
- `setup(battler)` — 対象バトラーをセットアップする
- `update()` — 毎フレーム更新し、アニメーションパターンの切り替え等を行う
- `animationWait()` — 1パターンの表示フレーム数（8）を返す
- `updatePattern()` — タイマー等に基づいてオーバーレイアニメのパターン（描画インデックス）を進める
- `updateFrame()` — 描画対象のステートに応じて、画像からの切り出し領域を設定する

### Sprite_Weapon

攻撃時の武器画像表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Weapon**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `setup(weaponImageId)` — 指定された武器画像IDでセットアップする
- `update()` — 毎フレーム更新し、アニメーション（振り）パターンの切り替え等を行う
- `animationWait()` — 1パターンの表示ウェイト数（基準速度などに基づく）を返す
- `updatePattern()` — ウェイト完了ごとに武器振りのパターン（0→1→2等）を進める
- `loadBitmap()` — 武器画像素材（system/Weapons 等）をロードする
- `updateFrame()` — パターンや武器のインデックスに応じて切り出しフレームと座標を更新する
- `isPlaying()` — 武器振りアニメーションが再生中かを確認する

### Sprite_Balloon

フキダシアイコン表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Balloon**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバ変数を初期化する
- `loadBitmap()` — フキダシ画像データ（system/Balloon）をロードする
- `setup(targetSprite, balloonId)` — 対象スプライトとフキダシIDを指定してセットアップする
- `update()` — 毎フレーム更新し、アニメーションの進行や座標の追従を行う
- `updatePosition()` — 対象スプライトの頭上に配置されるよう座標を更新する
- `updateFrame()` — 現在のパターンに応じて切り出し領域（フレーム）を更新する
- `speed()` — アニメーションの基本速度（8等）を返す
- `waitTime()` — アニメーション終了前のウェイトフレーム数（12等）を返す
- `frameIndex()` — フレーム経過時間から現在のパターン（0〜7）を計算して返す
- `isPlaying()` — フキダシ表示が再生中かを確認する

### Sprite_Picture

ピクチャ表示用のスプライトクラス

- **継承**: `Sprite` → `Sprite_Clickable` → **Sprite_Picture**

#### インスタンスメソッド
- `initialize(pictureId)` — 指定されたピクチャIDで初期化する
- `picture()` — 対応する `Game_Picture` オブジェクトを返す
- `update()` — 毎フレーム更新する
- `updateBitmap()` — 表示画像名が変わった場合に画像を再ロードする
- `updateOrigin()` — `Game_Picture` の設定に応じて原点（左上か中央か）を更新する
- `updatePosition()` — 画面座標を更新する
- `updateScale()` — 拡大率（X・Y）を更新する
- `updateTone()` — 色調（Tone）および合成方法を更新する
- `updateOther()` — 回転角や不透明度を更新する
- `loadBitmap()` — 対象のピクチャ画像（pictures/）をロードする

### Sprite_Timer

タイマー表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Timer**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `destroy(options)` — スプライトと生成したBitmapを破棄する
- `createBitmap()` — タイマー文字を描画するためのBitmapを作成する
- `fontFace()` — テキストに使用するフォント名を返す
- `fontSize()` — タイマーテキストのフォントサイズを返す
- `update()` — 毎フレーム更新し、画面のタイマー表示状態を反映する
- `updateBitmap()` — `Game_Timer` からの秒数がかわっていれば再描画する
- `redraw()` — 全体をクリアし、タイマー文字列を描画する
- `timerText()` — 「MM:SS」形式のタイマー文字列を返す
- `updatePosition()` — 画面上部等への座標更新を行う
- `updateVisibility()` — `Game_Timer` が作動中か否かで表示フラグを更新する

### Sprite_Destination

タッチ入力の目的地表示用のスプライトクラス

- **継承**: `Sprite` → **Sprite_Destination**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `destroy(options)` — スプライトと生成したBitmapを破棄する
- `update()` — 毎フレーム更新し、枠の拡大・不透明度の変化を行う
- `createBitmap()` — マス目サイズの四角い目的地枠を描画・作成する
- `updatePosition()` — `$gameTemp` に設定された目的地へ座標を更新する
- `updateAnimation()` — 不透明度や拡大アニメーションの進行（フレームによる変化）を更新する

### Spriteset_Base

Spriteset_MapとSpriteset_Battleのスーパークラス

- **継承**: `Sprite` → **Spriteset_Base**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `destroy(options)` — アニメーション群など子要素を含めて破棄する
- `loadSystemImages()` — UI等で共通使用されるシステム画像を事前ロードする（Window等）
- `createLowerLayer()` — ベーススプライト等、下位レイヤー要素を作成する
- `createUpperLayer()` — ピクチャやタイマー等、上位レイヤー要素を作成する
- `update()` — 毎フレーム更新する
- `createBaseSprite()` — アニメーションや天候等を載せるためのベーススプライトコンテナを作成する
- `createBaseFilters()` — マップやバトル全体にかかるベースフィルター群を作成・適用する
- `createPictures()` — ピクチャ表示用のコンテナスプライトと `Sprite_Picture` 群を作成する
- `pictureContainerRect()` — ピクチャコンテナのはみ出し防止用などの矩形領域を返す
- `createTimer()` — タイマー用の `Sprite_Timer` を作成する
- `createOverallFilters()` — 画面全体を覆うフィルターを作成する
- `updateBaseFilters()` — カラーフィルター等の更新を行う
- `updateOverallFilters()` — 画面全体枠のカラーフィルター等を更新する
- `updatePosition()` — 画面の揺れ等に合わせてベーススプライトの座標を更新する
- `findTargetSprite(/*target*/)` — アニメーション等の対象となるスプライトを検索する
- `updateAnimations()` — 再生中のアニメーションリストを更新（終了したものを削除）する
- `processAnimationRequests()` — リクエストのキューに積まれたアニメーションの再生処理を開始する
- `createAnimation(request)` — 新しい `Sprite_Animation` (または MV互換用) を作成してリストに登録する
- `isMVAnimation(animation)` — アニメデータがMV以前の形式かどうかを確認する
- `makeTargetSprites(targets)` — 与えられた対象から実際のスプライトインスタンス配列を生成する
- `lastAnimationSprite()` — 直前に作成・再生開始したアニメーションスプライトを返す
- `isAnimationForEach(animation)` — 全体アニメではなく個別に再生するタイプのアニメ設定かを確認する
- `animationBaseDelay()` — アニメーション再生開始の基礎的な遅延を返す
- `animationNextDelay()` — 複数ターゲット時、次ターゲットへのアニメーション再生までの遅延を返す
- `animationShouldMirror(target)` — 敵への再生など、必要であればアニメーションを反転させるか確認する
- `removeAnimation(sprite)` — 再生終了したアニメーションスプライトをリストから削除・破棄する
- `removeAllAnimations()` — 現在再生中のすべてのアニメーションを削除・破棄する
- `isAnimationPlaying()` — いずれかのアニメーションが再生中かを確認する

### Spriteset_Map

マップ画面のスプライトセット

- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Map**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `destroy(options)` — 破棄する
- `loadSystemImages()` — タイルセットや遠景などシステム画像をロードする
- `createLowerLayer()` — ベーススプライト等、下位レイヤー要素を作成する
- `update()` — 毎フレーム更新する
- `hideCharacters()` — イベントやプレイヤーなどキャラクター群を一時非表示にする
- `createParallax()` — 遠景（パララックス）スプライトを作成する
- `createTilemap()` — タイルマップを管理・描画する `Tilemap` オブジェクトを作成する
- `loadTileset()` — 現在のマップのタイルセット画像群をロードする
- `createCharacters()` — イベントやプレイヤーのスプライト群を作成する
- `createShadow()` — 飛行時などに表示される影スプライトを作成する
- `createDestination()` — タッップ時の目的地（`Sprite_Destination`）を作成する
- `createWeather()` — 天候エフェクト（雨・雪など）を作成する
- `updateTileset()` — タイルセットの変更があればタイル画像を更新する
- `updateParallax()` — 遠景のスクロールや画像変更を更新する
- `updateTilemap()` — タイルマップのアニメーションや座標を更新する
- `updateShadow()` — 影の座標（プレイヤーに追従等）や透明度を更新する
- `updateWeather()` — 天候エフェクトのアニメーションを更新する
- `updateBalloons()` — フキダシアイコンのリストを更新する
- `processBalloonRequests()` — リクエストキューからフキダシ再生処理を開始する
- `createBalloon(request)` — 新しいフキダシを生成して対象キャラの上に付与する
- `removeBalloon(sprite)` — 再生が終了したフキダシをリストから削除する
- `removeAllBalloons()` — すべてのフキダシを削除する
- `findTargetSprite(target)` — 指定された対象（キャラ等）に対応するスプライトを検索する
- `animationBaseDelay()` — アニメーション再生開始の基礎的な遅延を返す

### Spriteset_Battle

戦闘画面のスプライトセット

- **継承**: `Sprite` → `Spriteset_Base` → **Spriteset_Battle**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `loadSystemImages()` — 戦闘背景やアクター・敵画像などの事前ロードを行う
- `createLowerLayer()` — バトル背景、バトラー等を描画する下位レイヤーを作成する
- `createBackground()` — 画面全体を覆う黒い背景画像を作成する
- `createBattleback()` — バトル背景（`Sprite_Battleback`）を作成する
- `createBattleField()` — バトラー等を配置するためのコンテナ（バトルフィールド）を作成する
- `battleFieldOffsetY()` — バトルフィールドのY座標のオフセット（24等）を返す
- `update()` — 毎フレーム更新する
- `updateBattleback()` — バトル背景のスクロールや表示などの状態を更新する
- `createEnemies()` — 敵キャラクターのスプライト群を作成する
- `compareEnemySprite(a, b)` — 敵スプライトのYおよびZ座標によるソート順を比較する
- `createActors()` — パーティメンバー（アクター）のスプライト群を作成する
- `updateActors()` — パーティメンバーの入れ替えなどに応じてスプライトを更新する
- `findTargetSprite(target)` — アニメーション対象などとなる特定バトラーのスプライトを検索する
- `battlerSprites()` — 敵・味方すべてのバトラースプライトを取得する
- `isEffecting()` — いずれかのバトラーがエフェクト（ダメージ・倒れなど）再生中かを確認する
- `isAnyoneMoving()` — いずれかのバトラーが移動中かを確認する
- `isBusy()` — エフェクトや移動が実行中で、進行を待つべき（ビジー）かを確認する
