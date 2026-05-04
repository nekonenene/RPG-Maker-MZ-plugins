## Managers

データ管理・シーン管理・リソース管理を行うマネージャークラス群。すべて静的クラス

ソースファイル: `rmmz_managers.js`

### DataManager

データベースとゲームオブジェクトを管理する静的クラス

#### 静的メソッド
- `loadGlobalInfo()` — グローバル情報（セーブファイル一覧）を読み込む
- `removeInvalidGlobalInfo()` — 無効なグローバル情報を削除する
- `saveGlobalInfo()` — グローバル情報を保存する
- `isGlobalInfoLoaded()` — グローバル情報の読み込みが完了したかを確認する
- `loadDatabase()` — ゲームデータベースを読み込む
- `loadDataFile(name, src)` — 指定されたデータファイルを読み込む
- `onXhrLoad(xhr, name, src, url)` — XHRリクエスト成功時のコールバック
- `onXhrError(name, src, url)` — XHRリクエスト失敗時のコールバック
- `isDatabaseLoaded()` — データベースの読み込みが完了したかを確認する
- `loadMapData(mapId)` — 指定されたマップIDのマップデータを読み込む
- `makeEmptyMap()` — 空のマップデータを作成する
- `isMapLoaded()` — マップデータの読み込みが完了したかを確認する
- `onLoad(object)` — データ読み込み完了時にメタデータを抽出する
- `isMapObject(object)` — オブジェクトがマップデータかどうかを判定する
- `extractArrayMetadata(array)` — 配列内の各要素からメタデータを抽出する
- `extractMetadata(data)` — メモ欄からメタデータ（metaプロパティ）を抽出する
- `checkError()` — 読み込みエラーが発生していないかをチェックする
- `isBattleTest()` — 戦闘テストモードかどうかを確認する
- `isEventTest()` — イベントテストモードかどうかを確認する
- `isTitleSkip()` — タイトルスキップモードかどうかを確認する
- `isSkill(item)` — アイテムがスキルかどうかを判定する
- `isItem(item)` — アイテムが通常アイテムかどうかを判定する
- `isWeapon(item)` — アイテムが武器かどうかを判定する
- `isArmor(item)` — アイテムが防具かどうかを判定する
- `createGameObjects()` — 全てのゲームオブジェクト($game*)を生成する
- `setupNewGame()` — ニューゲームをセットアップする
- `setupBattleTest()` — 戦闘テストをセットアップする
- `setupEventTest()` — イベントテストをセットアップする
- `isAnySavefileExists()` — セーブファイルが1つ以上存在するかを確認する
- `latestSavefileId()` — 最新のセーブファイルIDを返す
- `earliestSavefileId()` — 最も古いセーブファイルIDを返す
- `emptySavefileId()` — 空きのセーブファイルIDを返す
- `loadAllSavefileImages()` — 全セーブファイルの画像を読み込む
- `loadSavefileImages(info)` — 指定されたセーブファイル情報から画像を読み込む
- `maxSavefiles()` — セーブファイルの最大数を返す（デフォルト: 20）
- `savefileInfo(savefileId)` — 指定されたセーブファイルIDの情報を返す
- `savefileExists(savefileId)` — 指定されたセーブファイルが存在するかを確認する
- `saveGame(savefileId)` — ゲームデータを保存する。Promiseを返す
- `loadGame(savefileId)` — セーブデータを読み込む。Promiseを返す
- `makeSavename(savefileId)` — セーブファイルIDからファイル名を生成する
- `selectSavefileForNewGame()` — ニューゲーム用のセーブファイルIDを選択する
- `makeSavefileInfo()` — セーブファイル用の情報オブジェクトを作成する
- `makeSaveContents()` — セーブデータの内容オブジェクトを作成する
- `extractSaveContents(contents)` — セーブデータの内容からゲームオブジェクトを復元する
- `correctDataErrors()` — セーブデータのデータエラーを修正する

### ConfigManager

設定データを管理する静的クラス

#### 静的プロパティ
- `alwaysDash` — 常時ダッシュが有効かどうか
- `commandRemember` — コマンド記憶が有効かどうか
- `touchUI` — タッチUI表示が有効かどうか

#### 静的メソッド
- `load()` — 設定データをストレージから読み込む
- `save()` — 設定データをストレージに保存する
- `isLoaded()` — 設定データの読み込みが完了したかを確認する
- `makeData()` — 保存用の設定データオブジェクトを作成する
- `applyData(config)` — 読み込んだ設定データを各プロパティに適用する
- `readFlag(config, name, defaultValue)` — 設定データからブール値を読み取る
- `readVolume(config, name)` — 設定データから音量値（0〜100）を読み取る

#### プロパティ
- `bgmVolume` — BGMの音量（0〜100）。AudioManagerと連動
- `bgsVolume` — BGSの音量（0〜100）。AudioManagerと連動
- `meVolume` — MEの音量（0〜100）。AudioManagerと連動
- `seVolume` — SEの音量（0〜100）。AudioManagerと連動

### StorageManager

セーブデータの保存を管理する静的クラス

#### 静的メソッド
- `isLocalMode()` — ローカルファイルモード（NW.js）かどうかを確認する
- `saveObject(saveName, object)` — オブジェクトをJSON→ZIP変換して保存する。Promiseを返す
- `loadObject(saveName)` — 保存データを読み込みZIP→JSONからオブジェクトに復元する
- `objectToJson(object)` — オブジェクトをJSON文字列に変換する
- `jsonToObject(json)` — JSON文字列をオブジェクトに変換する
- `jsonToZip(json)` — JSON文字列をZIP圧縮する
- `zipToJson(zip)` — ZIP圧縮データをJSON文字列に展開する
- `saveZip(saveName, zip)` — ZIP圧縮データを保存する
- `loadZip(saveName)` — ZIP圧縮データを読み込む
- `exists(saveName)` — 指定されたセーブ名のファイルが存在するかを確認する
- `remove(saveName)` — 指定されたセーブ名のファイルを削除する
- `saveToLocalFile(saveName, zip)` — ローカルファイルに保存する
- `loadFromLocalFile(saveName)` — ローカルファイルから読み込む
- `localFileExists(saveName)` — ローカルファイルが存在するかを確認する
- `removeLocalFile(saveName)` — ローカルファイルを削除する
- `saveToForage(saveName, zip)` — localForageに保存する（ブラウザ用）
- `loadFromForage(saveName)` — localForageから読み込む
- `forageExists(saveName)` — localForageにデータが存在するかを確認する
- `removeForage(saveName)` — localForageからデータを削除する
- `updateForageKeys()` — localForageのキー一覧を更新する
- `forageKeysUpdated()` — localForageのキー更新が完了したかを確認する
- `fsMkdir(path)` — ディレクトリを作成する
- `fsRename(oldPath, newPath)` — ファイル名を変更する
- `fsUnlink(path)` — ファイルを削除する
- `fsReadFile(path)` — ファイルを読み込む
- `fsWriteFile(path, data)` — ファイルに書き込む
- `fileDirectoryPath()` — セーブファイルのディレクトリパスを返す
- `filePath(saveName)` — セーブファイルのフルパスを返す
- `forageKey(saveName)` — localForage用のキー文字列を返す
- `forageTestKey()` — localForageテスト用のキー文字列を返す

### FontManager

フォントファイルの読み込みを管理する静的クラス

#### 静的メソッド
- `load(family, filename)` — フォントファイルを読み込む
- `isReady()` — すべてのフォントの読み込みが完了したかを確認する
- `startLoading(family, url)` — フォントの読み込みを開始する
- `throwLoadError(family)` — フォント読み込みエラーを投げる
- `makeUrl(filename)` — フォントファイルのURLを生成する

### ImageManager

画像の読み込み・Bitmapオブジェクトの作成・保持を行う静的クラス

#### 静的プロパティ
- `standardIconWidth` — 標準アイコン表示幅
- `standardIconHeight` — 標準アイコン表示高さ
- `standardFaceWidth` — 標準顔画像表示幅
- `standardFaceHeight` — 標準顔画像表示高さ

#### 静的メソッド
- `getIconSize()` — アイコンサイズ情報を取得する
- `getFaceSize()` — 顔画像サイズ情報を取得する
- `loadAnimation(filename)` — img/animations/ からアニメーション画像を読み込む
- `loadBattleback1(filename)` — img/battlebacks1/ から戦闘背景1を読み込む
- `loadBattleback2(filename)` — img/battlebacks2/ から戦闘背景2を読み込む
- `loadEnemy(filename)` — img/enemies/ から敵画像を読み込む
- `loadCharacter(filename)` — img/characters/ からキャラクター画像を読み込む
- `loadFace(filename)` — img/faces/ から顔画像を読み込む
- `loadParallax(filename)` — img/parallaxes/ から遠景画像を読み込む
- `loadPicture(filename)` — img/pictures/ からピクチャ画像を読み込む
- `loadSvActor(filename)` — img/sv_actors/ からSVアクター画像を読み込む
- `loadSvEnemy(filename)` — img/sv_enemies/ からSV敵画像を読み込む
- `loadSystem(filename)` — img/system/ からシステム画像を読み込む
- `loadTileset(filename)` — img/tilesets/ からタイルセット画像を読み込む
- `loadTitle1(filename)` — img/titles1/ からタイトル背景画像1を読み込む
- `loadTitle2(filename)` — img/titles2/ からタイトル背景画像2を読み込む
- `loadBitmap(folder, filename)` — 指定されたURLからビットマップ画像を読み込む
- `loadBitmapFromUrl(url)` — URLから直接ビットマップを読み込む
- `clear()` — 全ての画像キャッシュをクリアする
- `isReady()` — 全ての画像の読み込みが完了したかを確認する
- `throwLoadError(bitmap)` — 画像読み込みエラーを投げる
- `isObjectCharacter(filename)` — オブジェクトキャラクター画像かどうかを判定する（!プレフィックス）
- `isBigCharacter(filename)` — 大型キャラクター画像かどうかを判定する（$プレフィックス）
- `isZeroParallax(filename)` — ゼロ遠景かどうかを判定する

#### プロパティ
- `iconWidth` — アイコンの幅（ピクセル）
- `iconHeight` — アイコンの高さ（ピクセル）
- `faceWidth` — 顔画像の幅（ピクセル）
- `faceHeight` — 顔画像の高さ（ピクセル）

### EffectManager

Effekseerエフェクトの読み込みを管理する静的クラス

#### 静的メソッド
- `load(filename)` — Effekseerのエフェクトファイルを読み込む
- `startLoading(url)` — エフェクトの読み込みを開始する
- `clear()` — 全てのエフェクトキャッシュをクリアする
- `onLoad(/*url*/)` — エフェクト読み込み完了時のコールバック
- `onError(url)` — エフェクト読み込みエラー時のコールバック
- `makeUrl(filename)` — エフェクトファイルのURLを生成する
- `checkErrors()` — エフェクトの読み込みエラーをチェックする
- `throwLoadError(url)` — エフェクト読み込みエラーを投げる
- `isReady()` — 全てのエフェクトの読み込みが完了したかを確認する

### AudioManager

BGM・BGS・ME・SEの再生を管理する静的クラス

#### 静的メソッド
- `playBgm(bgm, pos)` — BGMを再生する
- `replayBgm(bgm)` — 保存されたBGMを再開する
- `isCurrentBgm(bgm)` — 指定されたBGMが現在再生中かを確認する
- `updateBgmParameters(bgm)` — BGMのパラメータ（音量・ピッチ・パン）を更新する
- `updateCurrentBgm(bgm, pos)` — 現在のBGM情報を更新する
- `stopBgm()` — BGMを停止する
- `fadeOutBgm(duration)` — BGMをフェードアウトする
- `fadeInBgm(duration)` — BGMをフェードインする
- `playBgs(bgs, pos)` — BGSを再生する
- `replayBgs(bgs)` — 保存されたBGSを再開する
- `isCurrentBgs(bgs)` — 指定されたBGSが現在再生中かを確認する
- `updateBgsParameters(bgs)` — BGSのパラメータを更新する
- `updateCurrentBgs(bgs, pos)` — 現在のBGS情報を更新する
- `stopBgs()` — BGSを停止する
- `fadeOutBgs(duration)` — BGSをフェードアウトする
- `fadeInBgs(duration)` — BGSをフェードインする
- `playMe(me)` — MEを再生する
- `updateMeParameters(me)` — MEのパラメータを更新する
- `fadeOutMe(duration)` — MEをフェードアウトする
- `stopMe()` — MEを停止する
- `playSe(se)` — SEを再生する
- `updateSeParameters(buffer, se)` — SEのパラメータを更新する
- `cleanupSe()` — 再生完了したSEバッファをクリーンアップする
- `stopSe()` — 全てのSEを停止する
- `playStaticSe(se)` — 静的SE（常に新規バッファ）を再生する
- `loadStaticSe(se)` — 静的SE用のバッファを事前に読み込む
- `isStaticSe(se)` — 指定されたSEが静的SEかを確認する
- `stopAll()` — 全てのオーディオを停止する
- `saveBgm()` — 現在のBGM情報を保存用オブジェクトとして返す
- `saveBgs()` — 現在のBGS情報を保存用オブジェクトとして返す
- `makeEmptyAudioObject()` — 空のオーディオオブジェクトを作成する
- `createBuffer(folder, name)` — WebAudioバッファを作成する
- `updateBufferParameters(buffer, configVolume, audio)` — バッファの音量・ピッチ・パンを更新する
- `audioFileExt()` — オーディオファイルの拡張子（".ogg" または ".m4a"）を返す
- `checkErrors()` — オーディオの読み込みエラーをチェックする
- `throwLoadError(webAudio)` — オーディオ読み込みエラーを投げる

#### プロパティ
- `bgmVolume` — BGMの音量（0〜100）。設定時にBGMバッファのパラメータも更新する
- `bgsVolume` — BGSの音量（0〜100）。設定時にBGSバッファのパラメータも更新する
- `meVolume` — MEの音量（0〜100）。設定時にMEバッファのパラメータも更新する
- `seVolume` — SEの音量（0〜100）

### SoundManager

データベースで定義された効果音を再生する静的クラス

#### 静的メソッド
- `preloadImportantSounds()` — 重要な効果音を事前に読み込む
- `loadSystemSound(n)` — システム効果音を読み込む
- `playSystemSound(n)` — システム効果音を再生する
- `playCursor()` — カーソル移動音を再生する
- `playOk()` — 決定音を再生する
- `playCancel()` — キャンセル音を再生する
- `playBuzzer()` — ブザー音を再生する
- `playEquip()` — 装備音を再生する
- `playSave()` — セーブ音を再生する
- `playLoad()` — ロード音を再生する
- `playBattleStart()` — 戦闘開始音を再生する
- `playEscape()` — 逃走音を再生する
- `playEnemyAttack()` — 敵の攻撃音を再生する
- `playEnemyDamage()` — 敵のダメージ音を再生する
- `playEnemyCollapse()` — 敵の消滅音を再生する
- `playBossCollapse1()` — ボスの消滅音1を再生する
- `playBossCollapse2()` — ボスの消滅音2を再生する
- `playActorDamage()` — アクターのダメージ音を再生する
- `playActorCollapse()` — アクターの戦闘不能音を再生する
- `playRecovery()` — 回復音を再生する
- `playMiss()` — ミス音を再生する
- `playEvasion()` — 回避音を再生する
- `playMagicEvasion()` — 魔法回避音を再生する
- `playReflection()` — 反射音を再生する
- `playShop()` — ショップ音を再生する
- `playUseItem()` — アイテム使用音を再生する
- `playUseSkill()` — スキル使用音を再生する

### TextManager

用語やメッセージを管理する静的クラス

#### 静的メソッド
- `basic(basicId)` — 基本用語を取得する（例: レベル、HP、MP等）
- `param(paramId)` — パラメータ名を取得する
- `command(commandId)` — コマンド名を取得する
- `message(messageId)` — メッセージテキストを取得する
- `getter(method, param)` — 用語のgetterプロパティを定義するユーティリティ

#### プロパティ
- `currencyUnit` — 通貨単位の文字列（$dataSystem.currencyUnit を返す）

### ColorManager

ウィンドウカラーを管理する静的クラス

#### 静的メソッド
- `loadWindowskin()` — ウィンドウスキン画像を読み込む
- `textColor(n)` — テキストカラー番号に対応する色を返す
- `normalColor()` — 通常テキストの色を返す
- `systemColor()` — システムカラーを返す
- `crisisColor()` — 危機時（HPが少ない等）の色を返す
- `deathColor()` — 戦闘不能時の色を返す
- `gaugeBackColor()` — ゲージの背景色を返す
- `hpGaugeColor1()` — HPゲージのグラデーション色1を返す
- `hpGaugeColor2()` — HPゲージのグラデーション色2を返す
- `mpGaugeColor1()` — MPゲージのグラデーション色1を返す
- `mpGaugeColor2()` — MPゲージのグラデーション色2を返す
- `mpCostColor()` — MP消費量の色を返す
- `powerUpColor()` — 能力上昇の色を返す
- `powerDownColor()` — 能力低下の色を返す
- `ctGaugeColor1()` — CTゲージのグラデーション色1を返す
- `ctGaugeColor2()` — CTゲージのグラデーション色2を返す
- `tpGaugeColor1()` — TPゲージのグラデーション色1を返す
- `tpGaugeColor2()` — TPゲージのグラデーション色2を返す
- `tpCostColor()` — TP消費量の色を返す
- `pendingColor()` — 保留中の色を返す
- `hpColor(actor)` — アクターのHP状態に応じた色を返す
- `mpColor(/*actor*/)` — MPの色を返す
- `tpColor(/*actor*/)` — TPの色を返す
- `paramchangeTextColor(change)` — パラメータ変化値に応じた色（上昇=緑/低下=赤）を返す
- `damageColor(colorType)` — ダメージ表示の色を返す（種類別）
- `outlineColor()` — テキストのアウトライン色を返す
- `dimColor1()` — 暗転の色1を返す
- `dimColor2()` — 暗転の色2を返す
- `itemBackColor1()` — アイテム背景の色1を返す
- `itemBackColor2()` — アイテム背景の色2を返す

### SceneManager

シーン遷移を管理する静的クラス

#### 静的メソッド
- `run(sceneClass)` — ゲームを起動し、メインループを開始する
- `initialize()` — シーンマネージャを初期化する
- `checkBrowser()` — ブラウザの互換性を確認する
- `checkPluginErrors()` — プラグインのエラーをチェックする
- `initGraphics()` — グラフィックシステムを初期化する
- `initAudio()` — オーディオシステムを初期化する
- `initVideo()` — ビデオシステムを初期化する
- `initInput()` — 入力システムを初期化する
- `setupEventHandlers()` — エラーハンドラやリサイズイベント等を設定する
- `update(deltaTime)` — フレーム毎にシーンを更新する（メインループ）
- `determineRepeatNumber(deltaTime)` — フレーム補間の繰り返し回数を決定する
- `terminate()` — ゲームを終了する
- `onError(event)` — エラー発生時のハンドラ
- `onReject(event)` — Promise拒否時のハンドラ
- `onUnload()` — ページアンロード時のハンドラ
- `onKeyDown(event)` — キー押下時のハンドラ（F5リロード等）
- `reloadGame()` — ゲームをリロードする
- `showDevTools()` — 開発者ツールを表示する
- `catchException(e)` — 例外をキャッチして画面にエラー表示する
- `catchNormalError(e)` — 通常エラーを処理する
- `catchLoadError(e)` — 読み込みエラーを処理する
- `catchUnknownError(e)` — 不明なエラーを処理する
- `updateMain()` — シーンの変更・更新のメイン処理
- `updateFrameCount()` — フレームカウントを更新する
- `updateInputData()` — 入力データ（Input, TouchInput）を更新する
- `updateEffekseer()` — Effekseerの更新処理
- `changeScene()` — 次のシーンへの切り替え処理
- `updateScene()` — 現在のシーンのupdate()を呼び出す
- `isGameActive()` — ゲームウィンドウがアクティブかを確認する
- `onSceneTerminate()` — シーン終了時のコールバック
- `onSceneCreate()` — シーン作成時のコールバック
- `onBeforeSceneStart()` — シーン開始前のコールバック
- `onSceneStart()` — シーン開始時のコールバック
- `isSceneChanging()` — シーン遷移中かどうかを確認する
- `isCurrentSceneBusy()` — 現在のシーンがビジー状態かを確認する
- `isNextScene(sceneClass)` — 次のシーンが指定されたクラスかを確認する
- `isPreviousScene(sceneClass)` — 前のシーンが指定されたクラスかを確認する
- `goto(sceneClass)` — 指定されたシーンクラスに直接遷移する（スタッククリア）
- `push(sceneClass)` — 指定されたシーンクラスをスタックに積んで遷移する
- `pop()` — シーンスタックから1つ戻る
- `exit()` — ゲームを終了する
- `clearStack()` — シーンスタックをクリアする
- `stop()` — シーンの更新を停止する
- `prepareNextScene()` — 次のシーンの準備を行う
- `snap()` — 現在の画面のスナップショットを取得する
- `snapForBackground()` — 背景用に現在の画面をスナップショットとして保存する
- `backgroundBitmap()` — 背景用のスナップショットビットマップを返す
- `resume()` — シーンの更新を再開する

### BattleManager

戦闘進行を管理する静的クラス

#### 静的メソッド
- `setup(troopId, canEscape, canLose)` — 戦闘をセットアップする（敵グループID、逃走可否、敗北可否）
- `initMembers()` — メンバー変数を初期化する
- `isTpb()` — タイムプログレスバトル（TPB）モードかを確認する
- `isActiveTpb()` — アクティブTPBモードかを確認する
- `isBattleTest()` — 戦闘テストモードかを確認する
- `setBattleTest(battleTest)` — 戦闘テストモードを設定する
- `setEventCallback(callback)` — 戦闘終了時のイベントコールバックを設定する
- `setLogWindow(logWindow)` — 戦闘ログウィンドウを設定する
- `setSpriteset(spriteset)` — 戦闘スプライトセットを設定する
- `onEncounter()` — エンカウント時に先制攻撃・不意打ちの判定を行う
- `ratePreemptive()` — 先制攻撃の確率を返す
- `rateSurprise()` — 不意打ちの確率を返す
- `saveBgmAndBgs()` — 現在のBGMとBGSをマップ用として保存する
- `playBattleBgm()` — 戦闘BGMを再生し、BGSを停止する
- `playVictoryMe()` — 勝利MEを再生する
- `playDefeatMe()` — 敗北MEを再生する
- `replayBgmAndBgs()` — 保存したマップのBGMとBGSを再生する
- `makeEscapeRatio()` — 逃走成功率を計算・設定する（パーティと敵の敏捷性に基づく）
- `update(timeActive)` — 戦闘進行を毎フレーム更新する
- `updatePhase(timeActive)` — 現在のフェーズ（start/turn/action/turnEnd/battleEnd）に応じた更新処理を行う
- `updateEvent()` — 戦闘中のイベント処理を更新する。強制アクションがあれば処理する
- `updateEventMain()` — 戦闘イベントのメイン更新。インタプリタ更新・戦闘終了チェック・戦闘イベントのセットアップを行う
- `isBusy()` — 戦闘がビジー状態（メッセージ・スプライト・ログ表示中）かを確認する
- `updateTpbInput()` — TPBモードの入力状態を更新する
- `checkTpbInputClose()` — TPBの入力受付を閉じるべきかチェックする
- `checkTpbInputOpen()` — TPBの入力受付を開くべきかチェックする
- `isPartyTpbInputtable()` — パーティがTPBモードで入力可能かを確認する
- `needsActorInputCancel()` — 現在のアクターの入力をキャンセルする必要があるかを確認する
- `isTpbMainPhase()` — TPBのメインフェーズ（turn/turnEnd/action）かを確認する
- `isInputting()` — コマンド入力中かどうかを確認する
- `isInTurn()` — ターン実行中フェーズかを確認する
- `isTurnEnd()` — ターン終了フェーズかを確認する
- `isAborting()` — 戦闘中断中かを確認する
- `isBattleEnd()` — 戦闘終了フェーズかを確認する
- `canEscape()` — 逃走可能かを確認する
- `canLose()` — 敗北可能（敗北してもゲームオーバーにならない）かを確認する
- `isEscaped()` — 逃走済みかを確認する
- `actor()` — 現在コマンド入力中のアクターを返す
- `startBattle()` — 戦闘を開始し、開始メッセージを表示する
- `displayStartMessages()` — 戦闘開始メッセージ（敵出現・先制攻撃・不意打ち）を表示する
- `startInput()` — コマンド入力フェーズを開始する。不意打ち時は即ターン開始
- `inputtingAction()` — 現在入力中のアクターのアクションを返す
- `selectNextCommand()` — 次のコマンド入力へ進む。全コマンド入力完了なら次のアクターへ
- `selectNextActor()` — 次の入力可能なアクターを選択する
- `selectPreviousCommand()` — 前のコマンド入力に戻る
- `selectPreviousActor()` — 前のアクターの入力に戻る
- `changeCurrentActor(forward)` — 現在のアクターを前後に切り替える。入力可能なアクターを検索する
- `startActorInput()` — アクターのコマンド入力を開始する
- `finishActorInput()` — アクターのコマンド入力を完了する。TPBではキャスト開始
- `cancelActorInput()` — アクターのコマンド入力をキャンセルする
- `updateStart()` — startフェーズの更新。TPBならturnフェーズへ、そうでなければ入力開始
- `startTurn()` — ターンを開始する。ターン数を増加し、アクション順序を決定する
- `updateTurn(timeActive)` — ターンの更新処理。次のアクション実行対象を取得して処理する
- `updateTpb()` — TPBモードのパーティと敵グループの時間経過を更新する
- `updateAllTpbBattlers()` — 全バトラーのTPB状態を更新する
- `updateTpbBattler(battler)` — 個別バトラーのTPB状態（ターン終了・アクション準備完了・タイムアウト）を更新する
- `checkTpbTurnEnd()` — TPBモードのターン終了条件をチェックする
- `processTurn()` — 現在の行動主体のアクションを処理する
- `endBattlerActions(battler)` — バトラーの全アクションを終了し、TPBチャージタイムをクリアする
- `endTurn()` — ターンを終了し、turnEndフェーズに移行する
- `updateTurnEnd()` — ターン終了フェーズの更新。TPBなら次のターンへ、そうでなければ全バトラーのターン終了処理
- `endAllBattlersTurn()` — 全バトラーのターン終了コールバック(onTurnEnd)を呼び出し、ステータスを表示する
- `displayBattlerStatus(battler, current)` — バトラーの自動付与ステート・現在ステート・回復量をログに表示する
- `getNextSubject()` — アクション実行順リストから次の生存バトラーを取得する
- `allBattleMembers()` — 戦闘に参加する全バトラー（味方+敵）の配列を返す
- `makeActionOrders()` — 敏捷性に基づいてアクションの実行順序を決定する
- `startAction()` — アクションの実行を開始する。アイテム使用・ログ表示を行う
- `updateAction()` — アクション実行を更新する。ターゲットリストから順に適用する
- `endAction()` — アクション実行を終了する。全アクション完了でバトラーの行動を終了
- `invokeAction(subject, target)` — 対象にアクションを適用する。反撃・魔法反射の判定も行う
- `invokeNormalAction(subject, target)` — 通常アクションを実行する。身代わり適用後にダメージ計算
- `invokeCounterAttack(subject, target)` — 反撃を実行する（対象が行動主体に通常攻撃）
- `invokeMagicReflection(subject, target)` — 魔法反射を実行する（魔法が行動主体に跳ね返る）
- `applySubstitute(target)` — 身代わり可能なバトラーがいれば身代わりを適用し、実際の対象を返す
- `checkSubstitute(target)` — 身代わり発動条件を確認する（瀕死かつ必中でない場合）
- `isActionForced()` — 強制アクション待ちのバトラーがいるかを確認する
- `forceAction(battler)` — バトラーの強制アクションを予約する
- `processForcedAction()` — 予約された強制アクションを実行する
- `abort()` — 戦闘を中断（aborting）状態にする
- `checkBattleEnd()` — 戦闘終了条件（逃走済み・全滅・敵全滅）をチェックする
- `checkAbort()` — 戦闘中断状態かチェックし、中断なら中断処理を実行する
- `processVictory()` — 勝利処理（ステート解除・ME再生・報酬・経験値獲得等）を実行する
- `processEscape()` — 逃走処理を実行する。成功率に基づいて判定し、失敗時は成功率を上げる
- `onEscapeSuccess()` — 逃走成功時の処理（メッセージ表示・戦闘中断）
- `onEscapeFailure()` — 逃走失敗時の処理（メッセージ表示・逃走成功率+10%・ターン開始）
- `processPartyEscape()` — パーティ逃走処理（イベントコマンドによる逃走）
- `processAbort()` — 戦闘中断処理（ステート解除・ログクリア・BGM復帰）を実行する
- `processDefeat()` — 敗北処理（メッセージ表示・ME再生）を実行する
- `endBattle(result)` — 戦闘を終了する。result: 0=勝利, 1=中断/逃走, 2=敗北
- `updateBattleEnd()` — 戦闘終了フェーズの更新。結果に応じてシーン遷移やゲームオーバーへ
- `makeRewards()` — 戦闘報酬（経験値・ゴールド・ドロップアイテム）を作成する
- `displayVictoryMessage()` — 勝利メッセージを表示する
- `displayDefeatMessage()` — 敗北メッセージを表示する
- `displayEscapeSuccessMessage()` — 逃走成功メッセージを表示する
- `displayEscapeFailureMessage()` — 逃走失敗メッセージを表示する
- `displayRewards()` — 報酬（経験値・ゴールド・アイテム）のメッセージを表示する
- `displayExp()` — 獲得経験値をメッセージ表示する
- `displayGold()` — 獲得ゴールドをメッセージ表示する
- `displayDropItems()` — ドロップアイテムをメッセージ表示する
- `gainRewards()` — 報酬（経験値・ゴールド・アイテム）を実際にパーティに付与する
- `gainExp()` — パーティ全員に経験値を付与する
- `gainGold()` — パーティにゴールドを付与する
- `gainDropItems()` — ドロップアイテムをパーティのインベントリに追加する

### PluginManager

プラグインを管理する静的クラス

#### 静的メソッド
- `setup(plugins)` — プラグインリストを読み込みセットアップする
- `parameters(name)` — 指定されたプラグイン名のパラメータオブジェクトを返す
- `setParameters(name, parameters)` — プラグインのパラメータを設定する
- `loadScript(filename)` — プラグインスクリプトファイルを読み込む
- `onError(e)` — プラグイン読み込みエラー時のコールバック
- `makeUrl(filename)` — プラグインファイルのURLを生成する
- `checkErrors()` — プラグインの読み込みエラーをチェックする
- `throwLoadError(url)` — プラグイン読み込みエラーを投げる
- `registerCommand(pluginName, commandName, func)` — プラグインコマンドを登録する
- `callCommand(self, pluginName, commandName, args)` — 登録されたプラグインコマンドを呼び出す
