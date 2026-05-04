## Scenes

画面遷移を管理する `Scene_*` クラス群。各画面が1つのシーンクラスに対応

ソースファイル: `rmmz_scenes.js`

### Scene_Base

ゲーム内の全シーンのスーパークラス

- **継承**: `Stage` → **Scene_Base**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — シーンを作成する
- `isActive()` — アクティブな（現在の）シーンかを確認する
- `isReady()` — シーンの準備が完了したかを確認する
- `start()` — シーンを開始する
- `update()` — 毎フレーム更新する
- `stop()` — シーンを停止する
- `isStarted()` — シーンが開始済みかを確認する
- `isBusy()` — ビジー状態（フェード中など）かを確認する
- `isFading()` — フェードイン・フェードアウト中かを確認する
- `terminate()` — シーンを終了・破棄する
- `createWindowLayer()` — ウィンドウを表示するレイヤーを作成する
- `addWindow(window)` — ウィンドウをシーンに追加する
- `startFadeIn(duration, white)` — フェードインを開始する
- `startFadeOut(duration, white)` — フェードアウトを開始する
- `createColorFilter()` — カラーフィルター（色調変更用）を作成する
- `updateColorFilter()` — カラーフィルターを更新する
- `updateFade()` — フェード処理を更新する
- `updateChildren()` — 子要素（スプライトなど）を更新する
- `popScene()` — 現在のシーンを終了して前のシーンに戻る
- `checkGameover()` — ゲームオーバー条件を満たしているかチェックする
- `fadeOutAll()` — 音楽と画面をすべてフェードアウトする
- `fadeSpeed()` — デフォルトのフェード速度（24フレーム）を返す
- `slowFadeSpeed()` — 遅いフェード速度（時間をかける場合用）を返す
- `scaleSprite(sprite)` — 画面サイズに合わせてスプライトを拡大する
- `centerSprite(sprite)` — スプライトを画面中央に配置する
- `isBottomHelpMode()` — ヘルプウィンドウを画面下部に配置するかを確認する
- `isBottomButtonMode()` — タッチボタンを画面下部に配置するかを確認する
- `isRightInputMode()` — 入力系ウィンドウを画面右側に配置するかを確認する
- `mainCommandWidth()` — メインコマンドウィンドウの基準幅（240）を返す
- `buttonAreaTop()` — タッチボタン領域の上端Y座標を返す
- `buttonAreaBottom()` — タッチボタン領域の下端Y座標を返す
- `buttonAreaHeight()` — タッチボタン領域の高さを返す（UIエリアが広い場合52）
- `buttonY()` — タッチボタンのY座標を返す
- `calcWindowHeight(numLines, selectable)` — 指定行数に必要なウィンドウの高さを計算する
- `requestAutosave()` — オートセーブを要求する
- `isAutosaveEnabled()` — オートセーブが可能かを確認する
- `executeAutosave()` — オートセーブを実行する
- `onAutosaveSuccess()` — オートセーブ成功時のコールバック
- `onAutosaveFailure()` — オートセーブ失敗時のコールバック

### Scene_Boot

ゲーム全体の初期化を行うシーンクラス

- **継承**: `Stage` → `Scene_Base` → **Scene_Boot**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — データベースや画像のロードを開始する
- `isReady()` — 全データファイルの読み込みが完了したかを確認する
- `onDatabaseLoaded()` — データベース読み込み完了時のコールバック
- `setEncryptionInfo()` — 画像・音声の暗号化情報を設定する
- `loadSystemImages()` — システム画像（Window等）を読み込む
- `loadPlayerData()` — セーブデータ情報を読み込み、グローバル情報を設定する
- `loadGameFonts()` — ゲーム用フォントを読み込む
- `isPlayerDataLoaded()` — プレイヤー情報が読み込み完了したかを確認する
- `start()` — ブート処理を完了し、次のシーンへ遷移する
- `startNormalGame()` — 通常のゲーム（またはタイトル）を開始する
- `resizeScreen()` — 画面サイズを初期化・リサイズする
- `adjustBoxSize()` — UIエリアのサイズ（Box Size）を調整する
- `adjustWindow()` — ブラウザや画面に合わせてゲームウィンドウを調整する
- `screenScale()` — 画面のスケール倍率を取得する
- `updateDocumentTitle()` — ブラウザのタイトルをゲームタイトルに更新する
- `checkPlayerLocation()` — 新規ゲーム時にプレイヤーの初期位置が存在するかチェックする

### Scene_Splash

スプラッシュ画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → **Scene_Splash**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — スプラッシュ画面を作成する
- `start()` — シーンを開始する
- `update()` — 毎フレーム更新する
- `stop()` — シーンを停止する
- `createBackground()` — 背景画像（MadeWithMvロゴ等）を作成する
- `adjustBackground()` — 背景画像のサイズ・位置を調整する
- `isEnabled()` — スプラッシュ画面が有効か（システム設定）を確認する
- `initWaitCount()` — ウェイトカウント（表示時間）を初期化する
- `updateWaitCount()` — ウェイトカウントを更新する
- `checkSkip()` — タッチやクリックでスキップされたかをチェックする
- `gotoTitle()` — タイトル画面に遷移する

### Scene_Title

タイトル画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → **Scene_Title**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — タイトル画面（背景・UI）を作成する
- `start()` — シーンを開始する
- `update()` — 毎フレーム更新する
- `isBusy()` — ビジー状態（フェードアウト中など）かを確認する
- `terminate()` — シーンを終了・破棄する
- `createBackground()` — 背景画像を作成する
- `createForeground()` — 前景（タイトルロゴ・文字）を作成する
- `drawGameTitle()` — 前景にゲームタイトルを描画する
- `adjustBackground()` — 背景のサイズ・位置を画面に合わせる
- `createCommandWindow()` — コマンドウィンドウ（ニューゲーム等）を作成する
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す
- `commandNewGame()` — 「ニューゲーム」選択時の処理
- `commandContinue()` — 「コンティニュー」選択時の処理
- `commandOptions()` — 「オプション」選択時の処理
- `playTitleMusic()` — タイトルのBGMを再生する

### Scene_Message

Scene_MapとScene_Battleのスーパークラス。共通するメッセージウィンドウ群を管理する

- **継承**: `Stage` → `Scene_Base` → **Scene_Message**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `isMessageWindowClosing()` — メッセージウィンドウが閉じている最中かを確認する
- `createAllWindows()` — 関連するすべてのUIウィンドウを作成する
- `createMessageWindow()` — メッセージウィンドウを作成する
- `messageWindowRect()` — メッセージウィンドウの矩形領域を返す
- `createScrollTextWindow()` — スクロール文章ウィンドウを作成する
- `scrollTextWindowRect()` — スクロール文章ウィンドウの矩形領域を返す
- `createGoldWindow()` — 所持金ウィンドウを作成する
- `goldWindowRect()` — 所持金ウィンドウの矩形領域を返す
- `createNameBoxWindow()` — 名前ボックス（名前ウィンドウ）を作成する
- `createChoiceListWindow()` — 選択肢ウィンドウを作成する
- `createNumberInputWindow()` — 数値入力ウィンドウを作成する
- `createEventItemWindow()` — アイテム選択ウィンドウを作成する
- `eventItemWindowRect()` — アイテム選択ウィンドウの矩形領域を返す
- `associateWindows()` — 各メッセージウィンドウ群をメッセージウィンドウ本体に関連付ける
- `cancelMessageWait()` — メッセージ表示のウェイトをキャンセルする

### Scene_Map

マップ画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Map**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — マップシーン（表示オブジェクトとUI）を作成する
- `isReady()` — マップのローディングが完了したかを確認する
- `onMapLoaded()` — マップロード完了時のコールバック
- `onTransfer()` — マップ移動（場所移動）が発生した時のコールバック
- `start()` — シーンを開始する
- `onTransferEnd()` — マップ移動完了時のオートセーブなどを処理する
- `shouldAutosave()` — オートセーブを実行すべきかを確認する
- `update()` — 毎フレーム更新する
- `updateMainMultiply()` — 早送り状態に応じて`updateMain`を複数回呼ぶ
- `updateMain()` — マップ進行（プレイヤー移動、イベント実行など）を更新する
- `isPlayerActive()` — プレイヤーが操作可能（移動可能、イベント中ではない）かを確認する
- `isFastForward()` — 決定ボタン長押しによるイベント早送り中かを確認する
- `stop()` — シーンを停止する
- `isBusy()` — メッセージ表示中やスクロール中など、ビジー状態かを確認する
- `terminate()` — シーン終了時にイベント画像を消去するなどの破棄処理を行う
- `needsFadeIn()` — 開始時にフェードインが必要かを確認する
- `needsSlowFadeOut()` — 終了時に遅いフェードアウトが必要かを確認する
- `updateWaitCount()` — バトル終了時などのウェイトカウントを更新する
- `updateDestination()` — タッチ操作の目的地フラグを更新する
- `updateMenuButton()` — メニュー呼び出しボタン（タッチUI）の状態を更新する
- `hideMenuButton()` — メニュー呼び出しボタンを隠す
- `updateMapNameWindow()` — マップ名ウィンドウを更新する
- `isMenuEnabled()` — メニュー画面が開ける状態かを確認する
- `isMapTouchOk()` — マップのタッチ操作（移動等）が有効かを確認する
- `processMapTouch()` — マップ上のタッチによるプレイヤー移動を処理する
- `isAnyButtonPressed()` — いずれかのタッチUIボタンが押されているかを確認する
- `onMapTouch()` — マップがタッチされた時の目的地などのイベントハンドラ
- `isSceneChangeOk()` — 他のシーンへ遷移可能な状態かを確認する
- `updateScene()` — バトルやメニュー等のシーン遷移トリガーを監視して遷移する
- `createDisplayObjects()` — マップグラフィック（Spriteset_Map）等を作成する
- `createSpriteset()` — スプライトセットを作成する
- `createAllWindows()` — ウィンドウレイヤーと全UIウィンドウを作成する
- `createMapNameWindow()` — マップ名ウィンドウを作成する
- `mapNameWindowRect()` — マップ名ウィンドウの矩形領域を返す
- `createButtons()` — スマホ等向けのタッチUIボタンを作成する
- `createMenuButton()` — メニュー呼び出しボタンを作成する
- `updateTransferPlayer()` — プレイヤーの場所移動予約があれば実行する
- `updateEncounter()` — ランダムエンカウントが発生するかチェックする
- `updateCallMenu()` — メニュー呼び出し予約があればメニューへ移行する
- `isMenuCalled()` — プレイヤーの操作でメニューが開かれたかチェックする
- `callMenu()` — `Scene_Menu`への遷移を準備する
- `updateCallDebug()` — デバッグ画面の呼び出し予約があれば処理する
- `isDebugCalled()` — F9等でデバッグ画面が開かれたかチェックする
- `fadeInForTransfer()` — 移動後のフェードインを行う
- `fadeOutForTransfer()` — 移動前のフェードアウトを行う
- `launchBattle()` — 戦闘（Scene_Battle）への遷移を開始する
- `stopAudioOnBattleStart()` — エンカウント時のBGM・BGSの自動停止や引き継ぎを処理する
- `startEncounterEffect()` — エンカウント時の画面フラッシュ・ズームなどのエフェクトを開始する
- `updateEncounterEffect()` — エンカウントエフェクトの進行を更新する
- `snapForBattleBackground()` — 戦闘の背景用に現在のマップ画面をキャプチャする
- `startFlashForEncounter(duration)` — エンカウント時の画面フラッシュエフェクトを実行する
- `encounterEffectSpeed()` — エンカウントエフェクトの速度（60）を返す

### Scene_MenuBase

すべてのメニュー系シーン（メニュー、アイテム、スキル、装備、セーブ等）のスーパークラス

- **継承**: `Stage` → `Scene_Base` → **Scene_MenuBase**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — 共通する背景やボタンを作成する
- `update()` — 毎フレーム更新する
- `helpAreaTop()` — ヘルプウィンドウ領域の上端Y座標を返す
- `helpAreaBottom()` — ヘルプウィンドウ領域の下端Y座標を返す
- `helpAreaHeight()` — ヘルプウィンドウ領域の高さを返す
- `mainAreaTop()` — メイン領域の上端Y座標を返す
- `mainAreaBottom()` — メイン領域の下端Y座標を返す
- `mainAreaHeight()` — メイン領域の高さを返す
- `actor()` — 現在選択中のアクターを返す
- `updateActor()` — アクター切り替え操作があった場合にアクターを更新する
- `createBackground()` — 背景となるぼかし画像（マップ画面のキャプチャ）を作成する
- `setBackgroundOpacity(opacity)` — 背景画像の不透明度を設定する
- `createHelpWindow()` — ヘルプウィンドウを作成する
- `helpWindowRect()` — ヘルプウィンドウの矩形領域を返す
- `createButtons()` — タッチUI用のキャンセルボタン・ページ切替ボタンを作成する
- `needsCancelButton()` — キャンセルボタンが必要かを確認する
- `createCancelButton()` — キャンセルボタンを作成する
- `needsPageButtons()` — ページ切替（アクター切替）ボタンが必要かを確認する
- `createPageButtons()` — ページ切替ボタンを作成する
- `updatePageButtons()` — ページ切替ボタンの有効/無効状態を更新する
- `arePageButtonsEnabled()` — ページ切替ボタンが有効か（アクターが2人以上等）を確認する
- `nextActor()` — 次のアクターに切り替える
- `previousActor()` — 前のアクターに切り替える
- `onActorChange()` — アクター切り替え時の処理
- `previousActor()`
- `onActorChange()` — Actor Change時のコールバック

### Scene_Menu

メニュー画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Menu**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `helpAreaHeight()` — メニュー画面のヘルプ領域の高さを返す（通常0）
- `create()` — メニュー画面の各ウィンドウを作成する
- `start()` — シーンを開始する
- `createCommandWindow()` — メインのコマンドウィンドウを作成する
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す
- `createGoldWindow()` — 所持金ウィンドウを作成する
- `goldWindowRect()` — 所持金ウィンドウの矩形領域を返す
- `createStatusWindow()` — パーティステータスウィンドウを作成する
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す
- `commandItem()` — 「アイテム」コマンド選択時の処理
- `commandPersonal()` — 「スキル」「装備」「ステータス」など個人対象のコマンド選択時の処理
- `commandFormation()` — 「並び替え」コマンド選択時の処理
- `commandOptions()` — 「オプション」コマンド選択時の処理
- `commandSave()` — 「セーブ」コマンド選択時の処理
- `commandGameEnd()` — 「ゲーム終了」コマンド選択時の処理
- `onPersonalOk()` — 個人コマンドでアクターを選択決定した時の処理
- `onPersonalCancel()` — 個人コマンドでアクター選択をキャンセルした時の処理
- `onFormationOk()` — 並び替えでメンバーを選択決定した時の処理
- `onFormationCancel()` — 並び替えをキャンセルした時の処理

### Scene_ItemBase

Scene_ItemとScene_Skillのスーパークラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_ItemBase**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — アイテム・スキル画面共通のウィンドウ群を作成する
- `createActorWindow()` — アイテム/スキル対象選択用のアクターウィンドウを作成する
- `actorWindowRect()` — アクターウィンドウの矩形領域を返す
- `item()` — 現在選択されているアイテム（またはスキル）を返す
- `user()` — アイテム/スキルの使用者を返す（アイテム類の場合はパーティ）
- `isCursorLeft()` — アクターウィンドウ内でカーソルが左側にあるかを確認する
- `showActorWindow()` — アクターウィンドウを表示してアクティブにする
- `hideActorWindow()` — アクターウィンドウを非表示にして非アクティブにする
- `isActorWindowActive()` — アクターウィンドウがアクティブかを確認する
- `onActorOk()` — アクターウィンドウで対象を選択決定した時の処理（使用実行）
- `onActorCancel()` — アクターウィンドウで対象選択をキャンセルした時の処理
- `determineItem()` — アイテム（またはスキル）を決定した時の処理（対象選択へ移行など）
- `useItem()` — 選択されたアイテム（またはスキル）を使用する
- `activateItemWindow()` — アイテム（またはスキル）ウィンドウをアクティブにする
- `itemTargetActors()` — 対象となるアクターの配列を返す
- `canUse()` — 現在の状態でアイテム（またはスキル）が使用可能かを確認する
- `isItemEffectsValid()` — アイテム（またはスキル）の効果が対象に有効かを確認する
- `applyItem()` — ターゲットにアイテム（またはスキル）の効果を適用する
- `checkCommonEvent()` — 使用したアイテム/スキルにコモンイベントがある場合に予約する

### Scene_Item

アイテム画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Item**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — アイテム画面の各種ウィンドウを作成する
- `createCategoryWindow()` — アイテムのカテゴリカウィンドウを作成する
- `categoryWindowRect()` — カテゴリウィンドウの矩形領域を返す
- `createItemWindow()` — アイテムリストウィンドウを作成する
- `itemWindowRect()` — アイテムリストウィンドウの矩形領域を返す
- `user()` — アイテムの使用者（パーティ）を返す
- `onCategoryOk()` — カテゴリを選択決定した時の処理
- `onItemOk()` — アイテムを選択決定した時の処理
- `onItemCancel()` — アイテム選択をキャンセルした時の処理
- `playSeForItem()` — アイテム使用時の効果音を再生する
- `useItem()` — アイテムを使用し、ウィンドウを再描画する

### Scene_Skill

スキル画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_ItemBase` → **Scene_Skill**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — スキル画面の各種ウィンドウを作成する
- `start()` — シーンを開始し、アクター情報をリフレッシュする
- `createSkillTypeWindow()` — スキルタイプ（魔法・必殺技等）ウィンドウを作成する
- `skillTypeWindowRect()` — スキルタイプウィンドウの矩形領域を返す
- `createStatusWindow()` — アクターのステータスウィンドウを作成する
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す
- `createItemWindow()` — スキルリストウィンドウを作成する
- `itemWindowRect()` — スキルリストウィンドウの矩形領域を返す
- `needsPageButtons()` — アクター切替ボタンが必要かを確認する
- `arePageButtonsEnabled()` — アクター切替ボタンが有効かを確認する
- `refreshActor()` — 選択されているアクターに合わせて各ウィンドウを更新する
- `user()` — 現在のアクター（スキルの使用者）を返す
- `commandSkill()` — スキルタイプを選択決定した時の処理
- `onItemOk()` — スキルを選択決定した時の処理
- `onItemCancel()` — スキル選択をキャンセルした時の処理
- `playSeForItem()` — スキル使用時の効果音を再生する
- `useItem()` — スキルを使用し、ステータスを再描画する
- `onActorChange()` — アクターが切り替わった時の処理をオーバーライド

### Scene_Equip

装備画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Equip**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — 装備画面の各種ウィンドウを作成する
- `createStatusWindow()` — ステータス（パラメータ変化）ウィンドウを作成する
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す
- `createCommandWindow()` — コマンド（装備・最強装備・全て外す）ウィンドウを作成する
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す
- `createSlotWindow()` — 装備スロットウィンドウを作成する
- `slotWindowRect()` — 装備スロットウィンドウの矩形領域を返す
- `createItemWindow()` — 装備品リストウィンドウを作成する
- `itemWindowRect()` — 装備品リストウィンドウの矩形領域を返す
- `statusWidth()` — ステータスウィンドウの幅を返す
- `needsPageButtons()` — アクター切替ボタンが必要かを確認する
- `arePageButtonsEnabled()` — アクター切替ボタンが有効かを確認する
- `refreshActor()` — 選択されているアクターに合わせて各ウィンドウを更新する
- `commandEquip()` — 「装備」コマンド選択時の処理
- `commandOptimize()` — 「最強装備」コマンド選択時の処理
- `commandClear()` — 「全て外す」コマンド選択時の処理
- `onSlotOk()` — 変更する装備スロットを選択決定した時の処理
- `onSlotCancel()` — 装備スロット選択をキャンセルした時の処理
- `onItemOk()` — 装備するアイテムを選択決定した時の処理
- `executeEquipChange()` — 実際の装備変更処理を実行する
- `onItemCancel()` — 装備アイテム選択をキャンセルした時の処理
- `onActorChange()` — アクターが切り替わった時の処理
- `hideItemWindow()` — 装備品リストウィンドウを非表示にし、スロットをアクティブにする

### Scene_Status

ステータス画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Status**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — ステータス画面の各種ウィンドウを作成する
- `helpAreaHeight()` — ヘルプ領域の高さを返す（通常0）
- `createProfileWindow()` — プロフィールウィンドウを作成する
- `profileWindowRect()` — プロフィールウィンドウの矩形領域を返す
- `createStatusWindow()` — アクターの基本ステータスウィンドウを作成する
- `statusWindowRect()` — 基本ステータスウィンドウの矩形領域を返す
- `createStatusParamsWindow()` — 能力値詳細ウィンドウを作成する
- `statusParamsWindowRect()` — 能力値詳細ウィンドウの矩形領域を返す
- `createStatusEquipWindow()` — 装備確認ウィンドウを作成する
- `statusEquipWindowRect()` — 装備確認ウィンドウの矩形領域を返す
- `statusParamsWidth()` — 能力値詳細ウィンドウの幅を返す
- `statusParamsHeight()` — 能力値詳細ウィンドウの高さを返す
- `profileHeight()` — プロフィールウィンドウの高さを返す
- `start()` — シーンを開始し、アクター情報をリフレッシュする
- `needsPageButtons()` — アクター切替ボタンが必要かを確認する
- `refreshActor()` — 選択されているアクターに合わせて各ウィンドウを更新する
- `onActorChange()` — アクターが切り替わった時の処理

### Scene_Options

オプション画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Options**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — オプション画面のウィンドウを作成する
- `terminate()` — シーン終了時に設定をセーブする
- `createOptionsWindow()` — オプション設定ウィンドウを作成する
- `optionsWindowRect()` — オプションウィンドウの矩形領域を返す
- `maxCommands()`
- `maxVisibleCommands()`

### Scene_File

Scene_SaveとScene_Loadのスーパークラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_File**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — セーブ・ロード画面共通のウィンドウ群を作成する
- `helpAreaHeight()` — ヘルプ領域の高さを返す（通常0）
- `start()` — シーンを開始する
- `savefileId()` — 選択されているセーブファイルIDを返す
- `isSavefileEnabled(savefileId)` — 指定されたセーブファイルが有効（操作可能）かを確認する
- `createHelpWindow()` — ヘルプ（指示テキスト）ウィンドウを作成する
- `helpWindowRect()` — ヘルプウィンドウの矩形領域を返す
- `createListWindow()` — セーブファイルリストウィンドウを作成する
- `listWindowRect()` — リストウィンドウの矩形領域を返す
- `mode()` — 現在のモード（'save' または 'load'）を返す
- `needsAutosave()` — オートセーブの実行が必要かを確認する
- `activateListWindow()` — リストウィンドウをアクティブにする
- `helpWindowText()` — ヘルプウィンドウに表示するテキストを返す
- `firstSavefileId()` — 最初にカーソルを合わせるセーブファイルIDを返す
- `onSavefileOk()` — セーブファイルを選択決定した時の処理

### Scene_Save

セーブ画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Save**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `mode()` — モードを 'save' として返す
- `helpWindowText()` — ヘルプウィンドウに表示するテキスト（「どのファイルにセーブしますか？」等）を返す
- `firstSavefileId()` — 最後にアクセスしたセーブファイルIDを返す
- `onSavefileOk()` — セーブファイルを選択決定した時の処理
- `executeSave(savefileId)` — 選択したIDにセーブを実行する
- `onSaveSuccess()` — セーブ成功時のコールバック（効果音再生など）
- `onSaveFailure()` — セーブ失敗時のコールバック（ブザー音再生など）

### Scene_Load

ロード画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → `Scene_File` → **Scene_Load**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `terminate()` — シーン終了時の処理（BGMの引き継ぎなど）
- `mode()` — モードを 'load' として返す
- `helpWindowText()` — ヘルプウィンドウに表示するテキスト（「どのファイルをロードしますか？」等）を返す
- `firstSavefileId()` — 最後にアクセスしたセーブファイルIDを返す
- `onSavefileOk()` — セーブファイルを選択決定した時の処理
- `executeLoad(savefileId)` — 選択したIDからロードを実行する
- `onLoadSuccess()` — ロード成功時のコールバック（BGM再開・画面フェード等の処理）
- `onLoadFailure()` — ロード失敗時のコールバック（ブザー音再生など）
- `reloadMapIfUpdated()` — マップデータが更新されている場合に再読み込みを行う

### Scene_GameEnd

ゲーム終了画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_GameEnd**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — ゲーム終了画面の各種ウィンドウを作成する
- `stop()` — シーンを停止し、コマンドウィンドウを閉じる
- `createBackground()` — 背景となるぼかし画像を作成する
- `createCommandWindow()` — コマンド（タイトルへ・キャンセル）ウィンドウを作成する
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す
- `commandToTitle()` — 「タイトルへ」コマンド選択時の処理（タイトル画面へ遷移）

### Scene_Shop

ショップ画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Shop**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `prepare(goods, purchaseOnly)` — 販売品リストと購入のみフラグを準備する
- `create()` — ショップ画面の各種ウィンドウを作成する
- `createGoldWindow()` — 所持金ウィンドウを作成する
- `goldWindowRect()` — 所持金ウィンドウの矩形領域を返す
- `createCommandWindow()` — コマンド（購入・売却・やめる）ウィンドウを作成する
- `commandWindowRect()` — コマンドウィンドウの矩形領域を返す
- `createDummyWindow()` — メイン領域を埋めるダミーウィンドウを作成する
- `dummyWindowRect()` — ダミーウィンドウの矩形領域を返す
- `createNumberWindow()` — 個数入力ウィンドウを作成する
- `numberWindowRect()` — 個数入力ウィンドウの矩形領域を返す
- `createStatusWindow()` — 所持数・装備比較ステータスウィンドウを作成する
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す
- `createBuyWindow()` — 購入アイテムリストウィンドウを作成する
- `buyWindowRect()` — 購入アイテムリストウィンドウの矩形領域を返す
- `createCategoryWindow()` — 売却アイテムのカテゴリウィンドウを作成する
- `categoryWindowRect()` — カテゴリウィンドウの矩形領域を返す
- `createSellWindow()` — 売却アイテムリストウィンドウを作成する
- `sellWindowRect()` — 売却アイテムリストウィンドウの矩形領域を返す
- `statusWidth()` — ステータスウィンドウの幅を返す
- `activateBuyWindow()` — 購入ウィンドウをアクティブにする
- `activateSellWindow()` — 売却ウィンドウをアクティブにする
- `commandBuy()` — 「購入」コマンド選択時の処理
- `commandSell()` — 「売却」コマンド選択時の処理
- `onBuyOk()` — 購入するアイテムを選択決定した時の処理
- `onBuyCancel()` — 購入アイテム選択をキャンセルした時の処理
- `onCategoryOk()` — 売却カテゴリを選択決定した時の処理
- `onCategoryCancel()` — 売却カテゴリ選択をキャンセルした時の処理
- `onSellOk()` — 売却するアイテムを選択決定した時の処理
- `onSellCancel()` — 売却アイテム選択をキャンセルした時の処理
- `onNumberOk()` — 購入・売却する個数を決定した時の処理（決済実行）
- `onNumberCancel()` — 個数入力をキャンセルした時の処理
- `doBuy(number)` — 指定された個数の購入決済を実行する
- `doSell(number)` — 指定された個数の売却決済を実行する
- `endNumberInput()` — 個数入力モードを終了し、リスト画面に戻る
- `maxBuy()` — 選択中のアイテムの最大購入可能個数を返す
- `maxSell()` — 選択中のアイテムの最大売却可能個数（所持数）を返す
- `money()` — 現在の所持金を返す
- `currencyUnit()` — 通貨単位を返す
- `buyingPrice()` — 選択中のアイテムの購入価格を返す
- `sellingPrice()` — 選択中のアイテムの売却価格を返す

### Scene_Name

名前入力画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Name**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `prepare(actorId, maxLength)` — 名前変更の対象アクターと最大文字数を準備する
- `create()` — 名前入力画面の各種ウィンドウを作成する
- `start()` — シーンを開始し、エディットウィンドウをアクティブにする
- `createEditWindow()` — 現在の名前を表示・編集するウィンドウを作成する
- `editWindowRect()` — エディットウィンドウの矩形領域を返す
- `createInputWindow()` — 文字パネル（キーボードUI）のウィンドウを作成する
- `inputWindowRect()` — インプットウィンドウの矩形領域を返す
- `onInputOk()` — 文字入力が完了（「決定」選択）した時の処理

### Scene_Debug

デバッグ画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_MenuBase` → **Scene_Debug**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — デバッグ画面の各種ウィンドウを作成する
- `needsCancelButton()` — キャンセルボタンが必要かを確認する
- `createRangeWindow()` — スイッチ・変数の範囲選択ウィンドウを作成する
- `rangeWindowRect()` — 範囲選択ウィンドウの矩形領域を返す
- `createEditWindow()` — スイッチ・変数の詳細編集ウィンドウを作成する
- `editWindowRect()` — 詳細編集ウィンドウの矩形領域を返す
- `createDebugHelpWindow()` — デバッグ操作のヘルプウィンドウを作成する
- `debugHelpWindowRect()` — ヘルプウィンドウの矩形領域を返す
- `onRangeOk()` — 範囲を選択決定した時の処理
- `onEditCancel()` — 編集をキャンセルした時の処理
- `refreshHelpWindow()` — ヘルプウィンドウのテキストを再描画する
- `helpText()` — ヘルプテキスト（操作方法の説明など）を返す

### Scene_Battle

戦闘画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → `Scene_Message` → **Scene_Battle**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — 戦闘画面の各種ウィンドウやスプライト（背景・バトラー等）を作成する
- `start()` — シーンを開始し、戦闘開始エフェクト（ワイプ等）を実行する
- `update()` — 毎フレーム更新する
- `updateVisibility()` — 表示切り替え（メニューやメッセージ表示時のUI非表示など）を更新する
- `updateBattleProcess()` — 戦闘の進行（BattleManagerの更新）を処理する
- `isTimeActive()` — TPB（タイムプログレスバトル）で時間が進行中かを確認する
- `isAnyInputWindowActive()` — コマンド入力系のウィンドウがアクティブかを確認する
- `changeInputWindow()` — 現在行動入力中のアクターに合わせてコマンドウィンドウを切り替える
- `stop()` — シーンを停止する
- `terminate()` — シーン終了処理を行う
- `shouldAutosave()` — オートセーブを実行すべきかを確認する（戦闘勝利後など）
- `needsSlowFadeOut()` — 終了時にゆっくりフェードアウトするかを確認する
- `updateLogWindowVisibility()` — バトルログウィンドウの表示/非表示を更新する
- `updateStatusWindowVisibility()` — ステータスウィンドウの表示/非表示を更新する
- `shouldOpenStatusWindow()` — ステータスウィンドウを開くべきかを確認する
- `updateStatusWindowPosition()` — ステータスウィンドウの位置（コマンド入力時は右、以外は中央など）を更新する
- `statusWindowX()` — ステータスウィンドウの目標X座標を計算する
- `updateInputWindowVisibility()` — 入力ウィンドウの表示/非表示を更新する
- `needsInputWindowChange()` — 入力ウィンドウの切り替えが必要かを確認する
- `updateCancelButton()` — キャンセルボタンの表示状態を更新する
- `createDisplayObjects()` — スプライトセットとウィンドウレイヤーを作成する
- `createSpriteset()` — `Spriteset_Battle` を作成する
- `createAllWindows()` — バトルUIの全ウィンドウを作成する
- `createLogWindow()` — バトルログウィンドウを作成する
- `logWindowRect()` — バトルログウィンドウの矩形領域を返す
- `createStatusWindow()` — パーティステータスウィンドウを作成する
- `statusWindowRect()` — ステータスウィンドウの矩形領域を返す
- `createPartyCommandWindow()` — パーティコマンド（戦う/逃げる）ウィンドウを作成する
- `partyCommandWindowRect()` — パーティコマンドウィンドウの矩形領域を返す
- `createActorCommandWindow()` — アクターコマンド（攻撃/スキル等）ウィンドウを作成する
- `actorCommandWindowRect()` — アクターコマンドウィンドウの矩形領域を返す
- `createHelpWindow()` — ヘルプウィンドウを作成する
- `helpWindowRect()` — ヘルプウィンドウの矩形領域を返す
- `createSkillWindow()` — スキル選択ウィンドウを作成する
- `skillWindowRect()` — スキル選択ウィンドウの矩形領域を返す
- `createItemWindow()` — アイテム選択ウィンドウを作成する
- `itemWindowRect()` — アイテム選択ウィンドウの矩形領域を返す
- `createActorWindow()` — 対象アクター選択ウィンドウを作成する
- `actorWindowRect()` — アクター選択ウィンドウの矩形領域を返す
- `createEnemyWindow()` — 対象エネミー選択ウィンドウを作成する
- `enemyWindowRect()` — エネミー選択ウィンドウの矩形領域を返す
- `helpAreaTop()` — ヘルプ領域の上端Y座標を返す
- `helpAreaBottom()` — ヘルプ領域の下端Y座標を返す
- `helpAreaHeight()` — ヘルプ領域の高さを返す
- `buttonAreaTop()` — ボタン領域の上端Y座標を返す
- `windowAreaHeight()` — ウィンドウ領域全体の高さを返す
- `createButtons()` — タッチUIボタンを作成する
- `createCancelButton()` — キャンセルボタンを作成する
- `closeCommandWindows()` — すべてのコマンド選択ウィンドウを閉じる
- `hideSubInputWindows()` — スキルやアイテムなどサブ入力用ウィンドウを非表示にする
- `startPartyCommandSelection()` — パーティコマンドの選択を開始する
- `commandFight()` — パーティコマンド「戦う」選択時の処理
- `commandEscape()` — パーティコマンド「逃げる」選択時の処理
- `startActorCommandSelection()` — アクターコマンドの選択を開始する
- `commandAttack()` — アクターコマンド「攻撃」選択時の処理
- `commandSkill()` — アクターコマンド「スキル」選択時の処理（スキルウィンドウ表示）
- `commandGuard()` — アクターコマンド「防御」選択時の処理
- `commandItem()` — アクターコマンド「アイテム」選択時の処理（アイテムウィンドウ表示）
- `commandCancel()` — アクターコマンドキャンセル時の処理（前のキャラに戻る、またはパーティコマンドに戻る）
- `selectNextCommand()` — 次のアクターへのコマンド入力へ進む
- `selectPreviousCommand()` — 前のアクターのコマンド入力へ戻る
- `startActorSelection()` — 全体/単体回復等のためのアクター選択ウィンドウを開く
- `onActorOk()` — アクターを選択決定した時の処理
- `onActorCancel()` — アクター選択をキャンセルした時の処理
- `startEnemySelection()` — 攻撃等のためのエネミー選択ウィンドウを開く
- `onEnemyOk()` — エネミーを選択決定した時の処理
- `onEnemyCancel()` — エネミー選択をキャンセルした時の処理
- `onSkillOk()` — スキルを選択決定した時の処理
- `onSkillCancel()` — スキル選択をキャンセルした時の処理
- `onItemOk()` — アイテムを選択決定した時の処理
- `onItemCancel()` — アイテム選択をキャンセルした時の処理
- `onSelectAction()` — 行動（攻撃・スキル・アイテム）と対象が決定された時の確定処理
- `endCommandSelection()` — 全員のコマンド入力が完了した後の処理

### Scene_Gameover

ゲームオーバー画面のシーンクラス

- **継承**: `Stage` → `Scene_Base` → **Scene_Gameover**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `create()` — ゲームオーバー画面を作成する（背景画像等）
- `start()` — シーンを開始する
- `update()` — 毎フレーム更新する
- `stop()` — シーンを停止する
- `terminate()` — 終了処理を行う
- `playGameoverMusic()` — ゲームオーバー用のME（ミュージックエフェクト）を再生する
- `createBackground()` — 背景となるゲームオーバー画像を作成する
- `adjustBackground()` — 背景画像のサイズ・位置を画面に合わせる
- `isTriggered()` — 決定ボタンや画面タッチがされたかを確認する
- `gotoTitle()` — タイトル画面に遷移する
