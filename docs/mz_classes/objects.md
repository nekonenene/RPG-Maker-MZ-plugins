## Objects

ゲームロジックを構成する `Game_*` クラス群。セーブデータとして保存されるものが多い

ソースファイル: `rmmz_objects.js`

### Game_Temp

セーブデータに含まれない一時データ用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `isPlaytest()` — プレイテストモードかどうかを確認する
- `setDestination(x, y)` — タッチ入力によるマップ上の移動先を設定する
- `clearDestination()` — マップ上の移動先をクリアする
- `isDestinationValid()` — 移動先が有効かどうかを確認する
- `destinationX()` — 移動先のX座標を返す
- `destinationY()` — 移動先のY座標を返す
- `setTouchState(target, state)` — タッチ状態（対象と状態）を設定する
- `clearTouchState()` — タッチ状態をクリアする
- `touchTarget()` — タッチ対象を返す
- `touchState()` — タッチ状態を返す
- `requestBattleRefresh()` — 戦闘画面のリフレッシュを要求する
- `clearBattleRefreshRequest()` — 戦闘リフレッシュ要求をクリアする
- `isBattleRefreshRequested()` — 戦闘リフレッシュが要求されているかを確認する
- `reserveCommonEvent(commonEventId)` — コモンイベントの実行を予約する
- `retrieveCommonEvent()` — 予約されたコモンイベントを取り出す
- `clearCommonEventReservation()` — コモンイベントの予約をクリアする
- `isCommonEventReserved()` — コモンイベントが予約されているかを確認する
- `retrieveAnimation()` — 要求されたアニメーション情報を取り出す
- `requestBalloon(target, balloonId)` — フキダシアイコンの表示を要求する
- `retrieveBalloon()` — 要求されたフキダシ情報を取り出す
- `lastActionData(type)` — 最後のアクション情報を取得する
- `setLastActionData(type, value)` — 最後のアクション情報を設定する
- `setLastUsedSkillId(skillID)` — 最後に使用したスキルIDを設定する
- `setLastUsedItemId(itemID)` — 最後に使用したアイテムIDを設定する
- `setLastSubjectActorId(actorID)` — 最後の行動主体のアクターIDを設定する
- `setLastSubjectEnemyIndex(enemyIndex)` — 最後の行動主体の敵インデックスを設定する
- `setLastTargetActorId(actorID)` — 最後の対象アクターIDを設定する
- `setLastTargetEnemyIndex(enemyIndex)` — 最後の対象敵インデックスを設定する

### Game_System

システムデータ用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `isJapanese()` — ロケールが日本語かを確認する
- `isChinese()` — ロケールが中国語かを確認する
- `isKorean()` — ロケールが韓国語かを確認する
- `isCJK()` — ロケールがCJK（日中韓）かを確認する
- `isRussian()` — ロケールがロシア語かを確認する
- `isSideView()` — サイドビュー戦闘かを確認する
- `isAutosaveEnabled()` — オートセーブが有効かを確認する
- `isMessageSkipEnabled()` — メッセージスキップが有効かを確認する
- `isSaveEnabled()` — セーブが許可されているかを確認する
- `disableSave()` — セーブを禁止する
- `enableSave()` — セーブを許可する
- `isMenuEnabled()` — メニューが許可されているかを確認する
- `disableMenu()` — メニューを禁止する
- `enableMenu()` — メニューを許可する
- `isEncounterEnabled()` — エンカウントが有効かを確認する
- `disableEncounter()` — エンカウントを無効にする
- `enableEncounter()` — エンカウントを有効にする
- `isFormationEnabled()` — 隊列変更が許可されているかを確認する
- `disableFormation()` — 隊列変更を禁止する
- `enableFormation()` — 隊列変更を許可する
- `battleCount()` — 戦闘回数を返す
- `winCount()` — 勝利回数を返す
- `escapeCount()` — 逃走回数を返す
- `saveCount()` — セーブ回数を返す
- `versionId()` — バージョンIDを返す
- `savefileId()` — 現在のセーブファイルIDを返す
- `setSavefileId(savefileId)` — セーブファイルIDを設定する
- `windowTone()` — ウィンドウカラートーンを返す
- `setWindowTone(value)` — ウィンドウカラートーンを設定する
- `battleBgm()` — 戦闘BGMを返す
- `setBattleBgm(value)` — 戦闘BGMを設定する
- `victoryMe()` — 勝利MEを返す
- `setVictoryMe(value)` — 勝利MEを設定する
- `defeatMe()` — 敗北MEを返す
- `setDefeatMe(value)` — 敗北MEを設定する
- `onBattleStart()` — 戦闘開始時に呼ばれる（戦闘回数カウント）
- `onBattleWin()` — 戦闘勝利時に呼ばれる（勝利回数カウント）
- `onBattleEscape()` — 戦闘逃走時に呼ばれる（逃走回数カウント）
- `onBeforeSave()` — セーブ前に呼ばれる（フレーム数・BGM等を保存）
- `onAfterLoad()` — ロード後に呼ばれる（フレーム数・BGM等を復元）
- `playtime()` — プレイ時間を秒で返す
- `playtimeText()` — プレイ時間を "HH:MM:SS" 形式の文字列で返す
- `saveBgm()` — 現在のBGMを保存する
- `replayBgm()` — 保存したBGMを再生する
- `saveWalkingBgm()` — 移動時のBGMを保存する
- `replayWalkingBgm()` — 保存した移動時BGMを再生する
- `saveWalkingBgm2()` — マップ指定のBGMを移動時BGMとして保存する
- `mainFontFace()` — メインフォント名を返す
- `numberFontFace()` — 数値用フォント名を返す
- `mainFontSize()` — メインフォントサイズを返す
- `windowPadding()` — ウィンドウのパディングサイズを返す（デフォルト: 12）
- `windowOpacity()` — ウィンドウの不透明度を返す

### Game_Timer

タイマー用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `update(sceneActive)` — タイマーを毎フレーム更新する
- `start(count)` — タイマーを開始する（フレーム数指定）
- `stop()` — タイマーを停止する
- `isWorking()` — タイマーが動作中かを確認する
- `seconds()` — 残り秒数を返す
- `frames()` — 残りフレーム数を返す
- `onExpire()` — タイマー満了時のコールバック（デフォルト: 戦闘中断）

### Game_Message

テキストや選択肢などを表示するメッセージウィンドウの状態を管理するクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `clear()` — メッセージ状態をクリアする
- `choices()` — 選択肢の配列を返す
- `speakerName()` — 話者名を返す
- `faceName()` — 顔画像のファイル名を返す
- `faceIndex()` — 顔画像のインデックスを返す
- `background()` — メッセージウィンドウの背景タイプを返す
- `positionType()` — メッセージウィンドウの位置タイプを返す
- `choiceDefaultType()` — 選択肢のデフォルトタイプを返す
- `choiceCancelType()` — 選択肢のキャンセルタイプを返す
- `choiceBackground()` — 選択肢の背景タイプを返す
- `choicePositionType()` — 選択肢の位置タイプを返す
- `numInputVariableId()` — 数値入力の変数IDを返す
- `numInputMaxDigits()` — 数値入力の最大桁数を返す
- `itemChoiceVariableId()` — アイテム選択の変数IDを返す
- `itemChoiceItypeId()` — アイテム選択のアイテムタイプIDを返す
- `scrollMode()` — スクロールモードかを確認する
- `scrollSpeed()` — スクロール速度を返す
- `scrollNoFast()` — スクロール早送り無効かを返す
- `add(text)` — テキスト行を追加する
- `setSpeakerName(speakerName)` — 話者名を設定する
- `setFaceImage(faceName, faceIndex)` — 顔画像を設定する
- `setBackground(background)` — 背景タイプを設定する
- `setPositionType(positionType)` — 位置タイプを設定する
- `setChoices(choices, defaultType, cancelType)` — 選択肢を設定する
- `setChoiceBackground(background)` — 選択肢の背景タイプを設定する
- `setChoicePositionType(positionType)` — 選択肢の位置タイプを設定する
- `setNumberInput(variableId, maxDigits)` — 数値入力を設定する
- `setItemChoice(variableId, itemType)` — アイテム選択を設定する
- `setScroll(speed, noFast)` — スクロールモードを設定する
- `setChoiceCallback(callback)` — 選択肢のコールバック関数を設定する
- `onChoice(n)` — 選択肢が選ばれた時のコールバックを呼び出す
- `hasText()` — テキストがあるかを確認する
- `isChoice()` — 選択肢表示中かを確認する
- `isNumberInput()` — 数値入力中かを確認する
- `isItemChoice()` — アイテム選択中かを確認する
- `isBusy()` — メッセージウィンドウがビジー状態かを確認する
- `newPage()` — 新しいページを追加する
- `allText()` — 全テキストを結合して返す
- `isRTL()` — テキストが右から左（RTL）かを確認する

### Game_Switches

スイッチ用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `clear()` — 全スイッチをクリアする
- `value(switchId)` — 指定されたスイッチIDの値を返す
- `setValue(switchId, value)` — 指定されたスイッチIDの値を設定する
- `onChange()` — スイッチ変更時のコールバック（マップリフレッシュ要求）

### Game_Variables

変数用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `clear()` — 全変数をクリアする
- `value(variableId)` — 指定された変数IDの値を返す
- `setValue(variableId, value)` — 指定された変数IDの値を設定する
- `onChange()` — 変数変更時のコールバック（マップリフレッシュ要求）

### Game_SelfSwitches

セルフスイッチ用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `clear()` — 全セルフスイッチをクリアする
- `value(key)` — 指定されたキーのセルフスイッチ値を返す
- `setValue(key, value)` — 指定されたキーのセルフスイッチ値を設定する
- `onChange()` — セルフスイッチ変更時のコールバック

### Game_Screen

色調変更やフラッシュなどの画面エフェクトデータ用のクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `clear()` — 全画面エフェクトをクリアする
- `onBattleStart()` — 戦闘開始時にフェードとフラッシュをクリアする
- `brightness()` — 画面の明るさを返す
- `tone()` — 画面の色調を返す
- `flashColor()` — フラッシュの色を返す
- `shake()` — 画面の揺れ量を返す
- `zoomX()` — ズームのX座標を返す
- `zoomY()` — ズームのY座標を返す
- `zoomScale()` — ズームの拡大率を返す
- `weatherType()` — 天候の種類を返す
- `weatherPower()` — 天候の強さを返す
- `picture(pictureId)` — 指定されたIDのピクチャを返す
- `realPictureId(pictureId)` — 実際のピクチャIDを返す（戦闘時はオフセット付き）
- `clearFade()` — フェード状態をクリアする
- `clearTone()` — 色調をクリアする
- `clearFlash()` — フラッシュをクリアする
- `clearShake()` — 画面の揺れをクリアする
- `clearZoom()` — ズームをクリアする（等倍に戻す）
- `clearWeather()` — 天候をクリアする（天候なしに戻す）
- `clearPictures()` — 全ピクチャをクリアする
- `eraseBattlePictures()` — 戦闘用ピクチャ（IDオフセット付き）を全て消去する
- `maxPictures()` — ピクチャの最大数を返す（デフォルト: 100）
- `startFadeOut(duration)` — フェードアウトを開始する（指定フレーム数で暗転）
- `startFadeIn(duration)` — フェードインを開始する（指定フレーム数で明転）
- `startTint(tone, duration)` — 画面の色調変更を開始する
- `startFlash(color, duration)` — 画面フラッシュを開始する
- `startShake(power, speed, duration)` — 画面の揺れを開始する
- `startZoom(x, y, scale, duration)` — 指定座標・拡大率へのズームを開始する
- `setZoom(x, y, scale)` — ズームを即座に設定する（アニメーションなし）
- `changeWeather(type, power, duration)` — 天候を変更する（type: none/rain/storm/snow）
- `update()` — 毎フレーム全画面エフェクトを更新する
- `updateFadeOut()` — フェードアウトの進行を更新する
- `updateFadeIn()` — フェードインの進行を更新する
- `updateTone()` — 色調変更の進行を更新する
- `updateFlash()` — フラッシュの進行を更新する
- `updateShake()` — 画面の揺れの進行を更新する
- `updateZoom()` — ズームの進行を更新する
- `updateWeather()` — 天候の進行を更新する
- `updatePictures()` — 全ピクチャの毎フレーム更新を行う
- `startFlashForDamage()` — ダメージ用の赤フラッシュを開始する
- `rotatePicture(pictureId, speed)` — ピクチャの回転速度を設定する
- `tintPicture(pictureId, tone, duration)` — ピクチャの色調を変更する
- `erasePicture(pictureId)` — ピクチャを消去する

### Game_Picture

ピクチャ用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `name()` — ピクチャのファイル名を返す
- `origin()` — 原点タイプ（0:左上, 1:中央）を返す
- `x()` — X座標を返す
- `y()` — Y座標を返す
- `scaleX()` — X方向の拡大率（%）を返す
- `scaleY()` — Y方向の拡大率（%）を返す
- `opacity()` — 不透明度（0〜255）を返す
- `blendMode()` — ブレンドモードを返す
- `tone()` — 色調を返す
- `angle()` — 回転角度を返す
- `show(name, origin, x, y, scaleX, scaleY, opacity, blendMode)` — ピクチャを表示する
- `move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration, easingType)` — ピクチャを移動する（指定フレーム数でイージング付き）
- `initBasic()` — 基本プロパティ（名前・座標・拡大率・不透明度・ブレンドモード）を初期化する
- `initTarget()` — 移動先のターゲット値とイージング設定を初期化する
- `initTone()` — 色調と色調変更の目標値を初期化する
- `initRotation()` — 回転角度と回転速度を初期化する
- `rotate(speed)` — 回転速度を設定する（毎フレーム speed/2 度ずつ回転）
- `tint(tone, duration)` — 色調変更を開始する（指定フレーム数で目標色調へ遷移）
- `update()` — 毎フレーム移動・色調・回転を更新する
- `updateMove()` — 移動アニメーション（座標・拡大率・不透明度）を更新する
- `updateTone()` — 色調変更アニメーションを更新する
- `updateRotation()` — 回転アニメーションを更新する
- `applyEasing(current, target)` — イージング関数を適用して現在値から目標値への補間を計算する
- `calcEasing(t)` — イージングタイプに応じた補間値を計算する
- `easeIn(t, exponent)` — Ease In（ゆっくり開始）の補間値を計算する
- `easeOut(t, exponent)` — Ease Out（ゆっくり終了）の補間値を計算する
- `easeInOut(t, exponent)` — Ease In Out（ゆっくり開始＆終了）の補間値を計算する

### Game_Item

スキル・アイテム・武器・防具を扱うゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize(item)` — 初期化する。itemが指定されていればそのアイテムをセットする
- `isSkill()` — スキルかどうかを確認する
- `isItem()` — 通常アイテムかどうかを確認する
- `isUsableItem()` — 使用可能なアイテム（スキルまたは通常アイテム）かを確認する
- `isWeapon()` — 武器かどうかを確認する
- `isArmor()` — 防具かどうかを確認する
- `isEquipItem()` — 装備品（武器または防具）かを確認する
- `isNull()` — 未設定（空）かどうかを確認する
- `itemId()` — アイテムIDを返す
- `object()` — 対応するデータベースオブジェクト（$dataSkills等）を返す。未設定ならnull
- `setObject(item)` — データベースオブジェクトからデータクラスとIDをセットする
- `setEquip(isWeapon, itemId)` — 装備品として設定する（武器/防具とIDを直接指定）

### Game_Action

戦闘行動用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize(subject, forcing)` — 初期化する。subjectは行動主体のバトラー、forcingは強制アクションか
- `clear()` — アクション内容をクリアする
- `setSubject(subject)` — 行動主体のバトラーを設定する
- `subject()` — 行動主体のバトラーを返す
- `friendsUnit()` — 行動主体の味方ユニットを返す
- `opponentsUnit()` — 行動主体の敵側ユニットを返す
- `setEnemyAction(action)` — 敵の行動パターンからアクションを設定する
- `setAttack()` — 通常攻撃をアクションとして設定する
- `setGuard()` — 防御をアクションとして設定する
- `setSkill(skillId)` — 指定スキルIDをアクションとして設定する
- `setItem(itemId)` — 指定アイテムIDをアクションとして設定する
- `setItemObject(object)` — データベースオブジェクトからアクションを設定する
- `setTarget(targetIndex)` — 対象インデックスを設定する
- `item()` — アクションに対応するスキルまたはアイテムのデータベースオブジェクトを返す
- `isSkill()` — スキルアクションかを確認する
- `isItem()` — アイテムアクションかを確認する
- `numRepeats()` — アクションの繰り返し回数を返す
- `checkItemScope(list)` — アイテムの範囲が指定リストに含まれるかを確認する
- `isForOpponent()` — 敵側対象のアクションかを確認する
- `isForFriend()` — 味方対象のアクションかを確認する
- `isForEveryone()` — 敵味方全体対象かを確認する
- `isForAliveFriend()` — 生存味方対象かを確認する
- `isForDeadFriend()` — 戦闘不能味方対象かを確認する
- `isForUser()` — 使用者自身対象かを確認する
- `isForOne()` — 単体対象かを確認する
- `isForRandom()` — ランダム対象かを確認する
- `isForAll()` — 全体対象かを確認する
- `needsSelection()` — 対象選択が必要かを確認する
- `numTargets()` — ランダム対象の人数を返す
- `checkDamageType(list)` — ダメージタイプが指定リストに含まれるかを確認する
- `isHpEffect()` — HPに影響するアクションかを確認する
- `isMpEffect()` — MPに影響するアクションかを確認する
- `isDamage()` — ダメージアクションかを確認する
- `isRecover()` — 回復アクションかを確認する
- `isDrain()` — 吸収アクションかを確認する
- `isHpRecover()` — HP回復アクションかを確認する
- `isMpRecover()` — MP回復アクションかを確認する
- `isCertainHit()` — 必中アクションかを確認する
- `isPhysical()` — 物理アクションかを確認する
- `isMagical()` — 魔法アクションかを確認する
- `isAttack()` — 通常攻撃かを確認する
- `isGuard()` — 防御かを確認する
- `isMagicSkill()` — 魔法スキルかを確認する
- `decideRandomTarget()` — ランダムに対象を決定する
- `setConfusion()` — 混乱時のアクションを設定する
- `prepare()` — アクション実行前の準備を行う（混乱時の対象変更等）
- `isValid()` — アクションが有効かを確認する
- `speed()` — アクションの速度を返す（行動順序に使用）
- `makeTargets()` — アクションの対象リストを作成する
- `repeatTargets(targets)` — 繰り返し回数分ターゲットを複製する
- `confusionTarget()` — 混乱状態での対象を返す
- `targetsForEveryone()` — 全体対象（敵+味方）の配列を返す
- `targetsForOpponents()` — 敵側対象の配列を返す
- `targetsForFriends()` — 味方対象の配列を返す
- `randomTargets(unit)` — ユニットからランダムに対象を選ぶ
- `targetsForDead(unit)` — ユニットの戦闘不能メンバーを対象として返す
- `targetsForAlive(unit)` — ユニットの生存メンバーを対象として返す
- `targetsForDeadAndAlive(unit)` — ユニットの全メンバー（生死問わず）を返す
- `evaluate()` — アクションの有効度を評価する（AI用）
- `itemTargetCandidates()` — アイテムの対象候補一覧を返す
- `evaluateWithTarget(target)` — 特定の対象に対するアクションの有効度を評価する
- `testApply(target)` — 対象にアクションが適用可能かをテストする
- `testLifeAndDeath(target)` — 対象の生死状態がアクションの範囲と合致するかを確認する
- `hasItemAnyValidEffects(target)` — 対象に有効な効果が1つでもあるかを確認する
- `testItemEffect(target, effect)` — 個別の効果が対象に有効かをテストする
- `itemCnt(target)` — 対象の反撃率を返す
- `itemMrf(target)` — 対象の魔法反射率を返す
- `itemHit(/*target*/)` — アクションの命中率を返す
- `itemEva(target)` — 対象の回避率を返す
- `itemCri(target)` — クリティカル率を返す
- `apply(target)` — 対象にアクションを適用する（命中判定・ダメージ計算・効果適用）
- `makeDamageValue(target, critical)` — ダメージ値を計算する（属性・分散・防御・クリティカル反映）
- `evalDamageFormula(target)` — ダメージ計算式を評価する（データベースの式をevalで実行）
- `calcElementRate(target)` — 属性有効度を計算する
- `elementsMaxRate(target, elements)` — 複数属性の最大有効度を返す
- `applyCritical(damage)` — クリティカル倍率（×3）を適用する
- `applyVariance(damage, variance)` — ダメージに分散（ランダム変動）を適用する
- `applyGuard(damage, target)` — 防御によるダメージ軽減を適用する
- `executeDamage(target, value)` — ダメージを実行する（HPまたはMPに応じて振り分け）
- `executeHpDamage(target, value)` — HPダメージを実行する
- `executeMpDamage(target, value)` — MPダメージを実行する
- `gainDrainedHp(value)` — 吸収したHPを行動主体が獲得する
- `gainDrainedMp(value)` — 吸収したMPを行動主体が獲得する
- `applyItemEffect(target, effect)` — アイテムの個別効果を対象に適用する
- `itemEffectRecoverHp(target, effect)` — HP回復効果を適用する
- `itemEffectRecoverMp(target, effect)` — MP回復効果を適用する
- `itemEffectGainTp(target, effect)` — TP獲得効果を適用する
- `itemEffectAddState(target, effect)` — ステート付与効果を適用する
- `itemEffectAddAttackState(target, effect)` — 通常攻撃時のステート付与効果を適用する
- `itemEffectAddNormalState(target, effect)` — 指定ステートの付与効果を適用する
- `itemEffectRemoveState(target, effect)` — ステート解除効果を適用する
- `itemEffectAddBuff(target, effect)` — バフ付与効果を適用する
- `itemEffectAddDebuff(target, effect)` — デバフ付与効果を適用する
- `itemEffectRemoveBuff(target, effect)` — バフ解除効果を適用する
- `itemEffectRemoveDebuff(target, effect)` — デバフ解除効果を適用する
- `itemEffectSpecial(target, effect)` — 特殊効果（逃走等）を適用する
- `itemEffectGrow(target, effect)` — 成長効果（永続パラメータ上昇）を適用する
- `itemEffectLearnSkill(target, effect)` — スキル習得効果を適用する
- `itemEffectCommonEvent(/*target, effect*/)` — コモンイベント呼び出し効果を適用する
- `makeSuccess(target)` — 対象のアクション結果を成功に設定する
- `applyItemUserEffect(/*target*/)` — アイテム使用者へのTP獲得効果を適用する
- `lukEffectRate(target)` — 運による効果補正率を返す
- `applyGlobal()` — グローバル効果（コモンイベント予約等）を適用する
- `updateLastUsed()` — 最後に使用したスキル/アイテムのIDを記録する
- `updateLastSubject()` — 最後の行動主体情報を記録する
- `updateLastTarget(target)` — 最後の対象情報を記録する

### Game_ActionResult

戦闘行動の結果用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `clear()` — アクション結果をクリアする
- `addedStateObjects()` — 付与されたステートのデータベースオブジェクトの配列を返す
- `removedStateObjects()` — 解除されたステートのデータベースオブジェクトの配列を返す
- `isStatusAffected()` — ステート・バフ・デバフに変化があったかを確認する
- `isHit()` — アクションが命中したかを確認する
- `isStateAdded(stateId)` — 指定ステートが付与されたかを確認する
- `pushAddedState(stateId)` — 付与ステートリストに追加する
- `isStateRemoved(stateId)` — 指定ステートが解除されたかを確認する
- `pushRemovedState(stateId)` — 解除ステートリストに追加する
- `isBuffAdded(paramId)` — 指定パラメータのバフが付与されたかを確認する
- `pushAddedBuff(paramId)` — 付与バフリストに追加する
- `isDebuffAdded(paramId)` — 指定パラメータのデバフが付与されたかを確認する
- `pushAddedDebuff(paramId)` — 付与デバフリストに追加する
- `isBuffRemoved(paramId)` — 指定パラメータのバフが解除されたかを確認する
- `pushRemovedBuff(paramId)` — 解除バフリストに追加する。`

### Game_BattlerBase

Game_Battlerのスーパークラス。主にパラメータ計算を行う

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `clearParamPlus()` — パラメータ加算値をクリアする
- `clearStates()` — 全ステートをクリアする
- `eraseState(stateId)` — 指定ステートを解除する
- `isStateAffected(stateId)` — 指定ステートが付与されているかを確認する
- `isDeathStateAffected()` — 戦闘不能ステートが付与されているかを確認する
- `deathStateId()` — 戦闘不能ステートのIDを返す（デフォルト: 1）
- `resetStateCounts(stateId)` — ステートの残りターン数をリセットする
- `isStateExpired(stateId)` — ステートの有効期限が切れたかを確認する
- `updateStateTurns()` — 全ステートの残りターン数を1減少させる
- `clearBuffs()` — 全バフ・デバフをクリアする
- `eraseBuff(paramId)` — 指定パラメータのバフ・デバフを消去する
- `buffLength()` — バフ配列の長さ（パラメータ数: 8）を返す
- `buff(paramId)` — 指定パラメータのバフレベルを返す（正=バフ、負=デバフ）
- `isBuffAffected(paramId)` — 指定パラメータにバフが付与されているかを確認する
- `isDebuffAffected(paramId)` — 指定パラメータにデバフが付与されているかを確認する
- `isBuffOrDebuffAffected(paramId)` — 指定パラメータにバフまたはデバフが付与されているかを確認する
- `isMaxBuffAffected(paramId)` — バフが最大段階（2段階）かを確認する
- `isMaxDebuffAffected(paramId)` — デバフが最大段階（-2段階）かを確認する
- `increaseBuff(paramId)` — 指定パラメータのバフレベルを1段階上げる
- `decreaseBuff(paramId)` — 指定パラメータのバフレベルを1段階下げる
- `overwriteBuffTurns(paramId, turns)` — バフの残りターン数を上書きする（現在値より大きい場合のみ）
- `isBuffExpired(paramId)` — バフの有効期限が切れたかを確認する
- `updateBuffTurns()` — 全バフの残りターン数を1減少させる
- `die()` — 戦闘不能にする（HP=0、ステート・バフクリア）
- `revive()` — 戦闘不能から復活する（HP=1以上に）
- `states()` — 付与されているステートのデータベースオブジェクトの配列を返す
- `stateIcons()` — 付与されているステートのアイコンID配列を返す
- `buffIcons()` — バフ・デバフのアイコンID配列を返す
- `buffIconIndex(buffLevel, paramId)` — バフレベルとパラメータIDからアイコンインデックスを返す
- `allIcons()` — ステート+バフの全アイコンID配列を返す
- `traitObjects()` — 特徴を持つオブジェクト（ステート等）の配列を返す。サブクラスでオーバーライド
- `allTraits()` — 全特徴の配列を返す
- `traits(code)` — 指定コードの特徴の配列を返す
- `traitsWithId(code, id)` — 指定コード・IDの特徴の配列を返す
- `traitsPi(code, id)` — 指定特徴の値を乗算で合成して返す
- `traitsSum(code, id)` — 指定特徴の値を加算で合成して返す
- `traitsSumAll(code)` — 指定コードの全特徴の値を合計して返す
- `traitsSet(code)` — 指定コードの特徴のdataIdのセットを返す
- `paramBase(/*paramId*/)` — パラメータの基本値を返す。サブクラスでオーバーライド
- `paramPlus(paramId)` — パラメータの加算値（装備・成長等）を返す
- `paramBasePlus(paramId)` — パラメータの基本値+加算値を返す（最小値制限付き）
- `paramMin(paramId)` — パラメータの最小値を返す
- `paramMax(/*paramId*/)` — パラメータの最大値を返す
- `paramRate(paramId)` — パラメータの特徴による倍率を返す
- `paramBuffRate(paramId)` — バフによるパラメータ倍率を返す（1段階あたり25%）
- `param(paramId)` — 最終的なパラメータ値を返す（基本+加算×倍率×バフ倍率）
- `xparam(xparamId)` — 追加パラメータ（命中率・回避率等）の値を返す
- `sparam(sparamId)` — 特殊パラメータ（狙われ率・防御効果率等）の値を返す
- `elementRate(elementId)` — 属性有効度を返す
- `debuffRate(paramId)` — デバフ有効度を返す
- `stateRate(stateId)` — ステート有効度を返す
- `stateResistSet()` — ステート無効化のセットを返す
- `isStateResist(stateId)` — 指定ステートを無効化するかを確認する
- `attackElements()` — 通常攻撃の属性ID配列を返す
- `attackStates()` — 通常攻撃時に付与するステートID配列を返す
- `attackStatesRate(stateId)` — 通常攻撃時のステート付与率を返す
- `attackSpeed()` — 通常攻撃の速度補正を返す
- `attackTimesAdd()` — 通常攻撃の追加回数を返す
- `attackSkillId()` — 通常攻撃に使用するスキルIDを返す
- `addedSkillTypes()` — 追加されたスキルタイプID配列を返す
- `isSkillTypeSealed(stypeId)` — 指定スキルタイプが封印されているかを確認する
- `addedSkills()` — 特徴で追加されたスキルID配列を返す
- `isSkillSealed(skillId)` — 指定スキルが封印されているかを確認する
- `isEquipWtypeOk(wtypeId)` — 指定武器タイプを装備可能かを確認する
- `isEquipAtypeOk(atypeId)` — 指定防具タイプを装備可能かを確認する
- `isEquipTypeLocked(etypeId)` — 指定装備タイプがロックされているかを確認する
- `isEquipTypeSealed(etypeId)` — 指定装備タイプが封印されているかを確認する
- `slotType()` — スロットタイプ（0:通常, 1:二刀流）を返す
- `isDualWield()` — 二刀流かを確認する
- `actionPlusSet()` — 行動回数追加の確率配列を返す
- `specialFlag(flagId)` — 指定特殊フラグが有効かを返す
- `collapseType()` — 消滅エフェクトのタイプを返す
- `partyAbility(abilityId)` — パーティアビリティが有効かを返す
- `isAutoBattle()` — 自動戦闘かを確認する
- `isGuard()` — 防御状態かを確認する
- `isSubstitute()` — 身代わり状態かを確認する
- `isPreserveTp()` — TP持ち越しが有効かを確認する
- `addParam(paramId, value)` — パラメータ加算値に値を追加する
- `setHp(hp)` — HPを設定する（0〜最大HPにクランプ）
- `setMp(mp)` — MPを設定する（0〜最大MPにクランプ）
- `setTp(tp)` — TPを設定する（0〜最大TPにクランプ）
- `maxTp()` — 最大TPを返す（デフォルト: 100）
- `refresh()` — ステート・HP・MPの状態を再計算する
- `recoverAll()` — HP・MPを全回復し、全ステートを解除する
- `hpRate()` — HP割合（現在HP/最大HP）を返す
- `mpRate()` — MP割合（現在MP/最大MP）を返す
- `tpRate()` — TP割合（現在TP/最大TP）を返す
- `hide()` — バトラーを非表示にする
- `appear()` — バトラーを表示する
- `isHidden()` — 非表示状態かを確認する
- `isAppeared()` — 表示状態かを確認する
- `isDead()` — 戦闘不能かを確認する
- `isAlive()` — 生存しているかを確認する
- `isDying()` — 瀕死（HP25%以下）かを確認する
- `isRestricted()` — 行動制約（混乱等）があるかを確認する
- `canInput()` — コマンド入力可能かを確認する
- `canMove()` — 行動可能（移動・攻撃等）かを確認する
- `isConfused()` — 混乱状態かを確認する
- `confusionLevel()` — 混乱レベルを返す（行動制約の種類に応じて1〜3）
- `isActor()` — アクターかを確認する
- `isEnemy()` — 敵かを確認する
- `sortStates()` — ステートを優先度順にソートする
- `restriction()` — 最も優先度の高い行動制約値を返す
- `addNewState(stateId)` — 新しいステートを付与する。戦闘不能ステートなら死亡処理
- `onRestrict()` — 行動制約が発生した時のコールバック
- `mostImportantStateText()` — 最も優先度の高いステートのメッセージを返す
- `stateMotionIndex()` — ステートに対応するモーションインデックスを返す
- `stateOverlayIndex()` — ステートに対応するオーバーレイインデックスを返す
- `isSkillWtypeOk(/*skill*/)` — スキルに必要な武器タイプを装備しているかを確認する
- `skillMpCost(skill)` — スキルのMP消費量を計算する
- `skillTpCost(skill)` — スキルのTP消費量を計算する
- `canPaySkillCost(skill)` — スキルのコストを支払えるかを確認する
- `paySkillCost(skill)` — スキルのMP・TPコストを支払う
- `isOccasionOk(item)` — アイテムが現在の状況で使用可能かを確認する
- `meetsUsableItemConditions(item)` — アイテム使用条件を満たすかを確認する
- `meetsSkillConditions(skill)` — スキル使用条件を満たすかを確認する
- `meetsItemConditions(item)` — アイテム使用条件を満たすかを確認する
- `canUse(item)` — アイテムまたはスキルを使用可能かを確認する
- `canEquip(item)` — 装備可能かを確認する
- `canEquipWeapon(item)` — 武器を装備可能かを確認する
- `canEquipArmor(item)` — 防具を装備可能かを確認する
- `guardSkillId()` — 防御に使用するスキルIDを返す（デフォルト: 2）
- `canAttack()` — 通常攻撃可能かを確認する
- `canGuard()` — 防御可能かを確認する

### Game_Battler

Game_ActorとGame_Enemyのスーパークラス。スプライトやアクション関連のメソッドを含む

- **継承**: `Game_BattlerBase` → **Game_Battler**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `clearDamagePopup()` — ダメージポップアップ要求をクリアする
- `clearWeaponAnimation()` — 武器アニメーション要求をクリアする
- `clearEffect()` — エフェクト要求をクリアする
- `clearMotion()` — モーション要求をクリアする
- `requestEffect(effectType)` — スプライトエフェクトを要求する
- `requestMotion(motionType)` — スプライトモーションを要求する
- `requestMotionRefresh()` — モーションのリフレッシュを要求する
- `cancelMotionRefresh()` — モーションリフレッシュ要求をキャンセルする
- `select()` — バトラーを選択状態にする
- `deselect()` — バトラーの選択状態を解除する
- `isDamagePopupRequested()` — ダメージポップアップが要求されているかを確認する
- `isEffectRequested()` — エフェクトが要求されているかを確認する
- `isMotionRequested()` — モーションが要求されているかを確認する
- `isWeaponAnimationRequested()` — 武器アニメーションが要求されているかを確認する
- `isMotionRefreshRequested()` — モーションリフレッシュが要求されているかを確認する
- `isSelected()` — 選択状態かを確認する
- `effectType()` — 要求されたエフェクトタイプを返す
- `motionType()` — 要求されたモーションタイプを返す
- `weaponImageId()` — 武器アニメーションの画像IDを返す
- `startDamagePopup()` — ダメージポップアップ表示を要求する
- `shouldPopupDamage()` — ダメージポップアップを表示すべきかを確認する
- `startWeaponAnimation(weaponImageId)` — 武器アニメーションを開始する
- `action(index)` — 指定インデックスのGame_Actionを返す
- `setAction(index, action)` — 指定インデックスにアクションを設定する
- `numActions()` — アクションの数を返す
- `clearActions()` — 全アクションをクリアする
- `result()` — アクション結果（Game_ActionResult）を返す
- `clearResult()` — アクション結果をクリアする
- `clearTpbChargeTime()` — TPBチャージタイムをクリアする
- `applyTpbPenalty()` — TPBペナルティ（キャンセル時のチャージ減少）を適用する
- `initTpbChargeTime(advantageous)` — TPBチャージタイムを初期化する（先制時は満タン）
- `tpbChargeTime()` — TPBチャージタイムの値を返す
- `startTpbCasting()` — TPBキャスト（スキル詠唱）を開始する
- `startTpbAction()` — TPBアクション実行を開始する
- `isTpbCharged()` — TPBチャージが完了したかを確認する
- `isTpbReady()` — TPBアクション準備完了かを確認する
- `isTpbTimeout()` — TPBタイムアウトかを確認する
- `updateTpb()` — TPB状態を更新する
- `updateTpbChargeTime()` — TPBチャージタイムを進行させる
- `updateTpbCastTime()` — TPBキャストタイムを進行させる
- `updateTpbAutoBattle()` — TPB自動戦闘時のアクション決定を更新する
- `updateTpbIdleTime()` — TPBアイドルタイムを更新する
- `tpbAcceleration()` — TPBの加速度を返す
- `tpbRelativeSpeed()` — TPBの相対速度を返す
- `tpbSpeed()` — TPBの速度を返す
- `tpbBaseSpeed()` — TPBの基本速度を返す
- `tpbRequiredCastTime()` — TPBキャストに必要な時間を返す
- `onTpbCharged()` — TPBチャージ完了時のコールバック
- `shouldDelayTpbCharge()` — TPBチャージを遅延すべきかを確認する
- `finishTpbCharge()` — TPBチャージを完了する
- `isTpbTurnEnd()` — TPBターンが終了したかを確認する
- `initTpbTurn()` — TPBターンカウントを初期化する
- `startTpbTurn()` — TPBターンを開始する
- `makeTpbActions()` — TPB用アクションを作成する
- `onTpbTimeout()` — TPBタイムアウト時のコールバック
- `turnCount()` — ターンカウントを返す
- `canInput()` — コマンド入力可能かを確認する（TPBチャージ完了かつ制約なし）
- `refresh()` — ステート・バフを再計算する
- `addState(stateId)` — ステートを付与する（有効度・無効化判定含む）
- `isStateAddable(stateId)` — ステートを付与可能かを確認する
- `isStateRestrict(stateId)` — ステートが行動制約により付与不可かを確認する
- `onRestrict()` — 行動制約発生時のコールバック（アクションクリア等）
- `removeState(stateId)` — ステートを解除する
- `escape()` — 逃走する（戦闘不能ステートを解除して非表示に）
- `addBuff(paramId, turns)` — バフを付与する（指定ターン数）
- `addDebuff(paramId, turns)` — デバフを付与する（指定ターン数）
- `removeBuff(paramId)` — バフ・デバフを解除する
- `removeBattleStates()` — 戦闘終了時に解除されるステートを削除する
- `removeAllBuffs()` — 全バフ・デバフを解除する
- `removeStatesAuto(timing)` — 自動解除タイミングのステートを解除する
- `removeBuffsAuto()` — 有効期限切れのバフを自動解除する
- `removeStatesByDamage()` — ダメージによるステート解除を処理する
- `makeActionTimes()` — 行動回数を計算する
- `makeActions()` — アクションを作成する
- `speed()` — 行動速度を返す
- `makeSpeed()` — 行動速度を計算する
- `currentAction()` — 現在のアクションを返す
- `removeCurrentAction()` — 現在のアクションを削除する
- `setLastTarget(target)` — 最後の対象を設定する
- `forceAction(skillId, targetIndex)` — 強制アクションを設定する
- `useItem(item)` — アイテム・スキルを使用する（コスト支払い・消費）
- `consumeItem(item)` — アイテムを消費する（パーティの所持数を1減らす）
- `gainHp(value)` — HPを増減する（正=回復、負=ダメージ）
- `gainMp(value)` — MPを増減する
- `gainTp(value)` — TPを増減する
- `gainSilentTp(value)` — TPを増減する（ポップアップなし）
- `initTp()` — TPをランダムに初期化する（0〜25）
- `clearTp()` — TPを0にする
- `chargeTpByDamage(damageRate)` — ダメージ割合に応じてTPをチャージする
- `regenerateHp()` — HPの自動回復（スリップダメージ含む）を処理する
- `maxSlipDamage()` — スリップダメージの最大値を返す
- `regenerateMp()` — MPの自動回復を処理する
- `regenerateTp()` — TPの自動回復を処理する
- `regenerateAll()` — HP・MP・TPの全自動回復を処理する
- `onBattleStart(advantageous)` — 戦闘開始時のコールバック（TP初期化等）
- `onAllActionsEnd()` — 全アクション終了時のコールバック（ステート自動解除等）
- `onTurnEnd()` — ターン終了時のコールバック（自動回復・ステート解除・バフ解除等）
- `onBattleEnd()` — 戦闘終了時のコールバック（アクション・ステートクリア等）
- `onDamage(value)` — ダメージを受けた時のコールバック（TPチャージ・ステート解除等）
- `setActionState(actionState)` — 行動状態を設定する（undecided/inputting/waiting/acting）
- `isUndecided()` — 行動未決定かを確認する
- `isInputting()` — コマンド入力中かを確認する
- `isWaiting()` — 待機中かを確認する
- `isActing()` — 行動実行中かを確認する
- `isChanting()` — 詠唱中（魔法キャスト中）かを確認する
- `isGuardWaiting()` — 防御待機中かを確認する
- `performActionStart(action)` — アクション開始時の演出を実行する
- `performAction(/*action*/)` — アクション実行時の演出を実行する
- `performActionEnd()` — アクション終了時の演出を実行する
- `performDamage()` — ダメージ時の演出を実行する
- `performMiss()` — ミス時の演出を実行する
- `performRecovery()` — 回復時の演出を実行する
- `performEvasion()` — 回避時の演出を実行する
- `performMagicEvasion()` — 魔法回避時の演出を実行する
- `performCounter()` — 反撃時の演出を実行する
- `performReflection()` — 魔法反射時の演出を実行する
- `performSubstitute(/*target*/)` — 身代わり時の演出を実行する
- `performCollapse()` — 戦闘不能時の消滅演出を実行する

### Game_Actor

アクター用のゲームオブジェクトクラス

- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Actor**

#### プロパティ
- `level` — レベルを返す

#### インスタンスメソッド
- `initialize(actorId)` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `setup(actorId)` — アクターIDでセットアップする
- `actorId()` — アクターIDを返す
- `actor()` — データベースのアクターオブジェクトを返す
- `name()` — 名前を返す
- `setName(name)` — 名前を設定する
- `nickname()` — 二つ名を返す
- `setNickname(nickname)` — 二つ名を設定する
- `profile()` — プロフィールを返す
- `setProfile(profile)` — プロフィールを設定する
- `characterName()` — キャラクター画像のファイル名を返す
- `characterIndex()` — キャラクター画像のインデックスを返す
- `faceName()` — 顔画像のファイル名を返す
- `faceIndex()` — 顔画像のインデックスを返す
- `battlerName()` — 戦闘キャラ画像のファイル名を返す
- `clearStates()` — 全ステートをクリアする
- `eraseState(stateId)` — 指定ステートを解除する
- `resetStateCounts(stateId)` — ステートの残りターン数をリセットする
- `initImages()` — キャラクター・顔・戦闘画像を初期化する
- `expForLevel(level)` — 指定レベルに必要な累計経験値を返す
- `initExp()` — 経験値を初期化する
- `currentExp()` — 現在の累計経験値を返す
- `currentLevelExp()` — 現在レベルの必要経験値を返す
- `nextLevelExp()` — 次のレベルの必要経験値を返す
- `nextRequiredExp()` — 次のレベルまでの残り経験値を返す
- `maxLevel()` — 最大レベルを返す
- `isMaxLevel()` — 最大レベルかを確認する
- `initSkills()` — 初期スキルを習得する
- `initEquips(equips)` — 初期装備をセットする
- `equipSlots()` — 装備スロットの配列を返す
- `equips()` — 装備品の配列を返す
- `weapons()` — 装備中の武器の配列を返す
- `armors()` — 装備中の防具の配列を返す
- `hasWeapon(weapon)` — 指定武器を装備しているかを確認する
- `hasArmor(armor)` — 指定防具を装備しているかを確認する
- `isEquipChangeOk(slotId)` — 指定スロットの装備変更が可能かを確認する
- `changeEquip(slotId, item)` — 指定スロットの装備を変更する
- `forceChangeEquip(slotId, item)` — 装備を強制変更する（パーティ所持数考慮なし）
- `tradeItemWithParty(newItem, oldItem)` — パーティとアイテムを交換する（旧装備を返却、新装備を取得）
- `changeEquipById(etypeId, itemId)` — 装備タイプとアイテムIDで装備を変更する
- `isEquipped(item)` — 指定アイテムを装備中かを確認する
- `discardEquip(item)` — 装備を破棄する（パーティに返却しない）
- `releaseUnequippableItems(forcing)` — 装備不可になったアイテムを外す
- `clearEquipments()` — 全装備を外す
- `optimizeEquipments()` — 装備を最適化する（最強装備）
- `bestEquipItem(slotId)` — 指定スロットの最適装備を返す
- `calcEquipItemPerformance(item)` — 装備品の性能値を計算する
- `isSkillWtypeOk(skill)` — スキルに必要な武器タイプを装備しているかを確認する
- `isWtypeEquipped(wtypeId)` — 指定武器タイプを装備中かを確認する
- `refresh()` — ステート・装備を再計算する
- `hide()` — 非表示にする
- `isActor()` — アクターかを確認する（常にtrue）
- `friendsUnit()` — 味方ユニット（$gameParty）を返す
- `opponentsUnit()` — 敵ユニット（$gameTroop）を返す
- `index()` — パーティ内のインデックスを返す
- `isBattleMember()` — 戦闘メンバーかを確認する
- `isFormationChangeOk()` — 隊列変更可能かを確認する
- `currentClass()` — 現在の職業データを返す
- `isClass(gameClass)` — 指定職業かを確認する
- `skillTypes()` — 使用可能なスキルタイプID配列を返す
- `skills()` — 習得済みスキルの配列を返す
- `usableSkills()` — 現在使用可能なスキルの配列を返す
- `traitObjects()` — 特徴を持つオブジェクト（アクター・職業・装備・ステート）の配列を返す
- `attackElements()` — 通常攻撃の属性ID配列を返す
- `hasNoWeapons()` — 武器を装備していないかを確認する
- `bareHandsElementId()` — 素手攻撃の属性IDを返す
- `paramBase(paramId)` — レベルに応じたパラメータ基本値を返す
- `paramPlus(paramId)` — パラメータ加算値（装備含む）を返す
- `attackAnimationId1()` — 通常攻撃アニメーションID（武器1）を返す
- `attackAnimationId2()` — 通常攻撃アニメーションID（武器2/二刀流）を返す
- `bareHandsAnimationId()` — 素手攻撃のアニメーションIDを返す
- `changeExp(exp, show)` — 経験値を変更する（レベルアップ表示制御付き）
- `levelUp()` — レベルアップ処理を行う
- `levelDown()` — レベルダウン処理を行う
- `findNewSkills(lastSkills)` — レベルアップで新たに習得したスキルを検索する
- `displayLevelUp(newSkills)` — レベルアップメッセージを表示する
- `gainExp(exp)` — 経験値を獲得する
- `finalExpRate()` — 最終的な経験値倍率を返す
- `benchMembersExpRate()` — 控えメンバーの経験値倍率を返す
- `shouldDisplayLevelUp()` — レベルアップ表示をすべきかを確認する
- `changeLevel(level, show)` — レベルを変更する
- `learnSkill(skillId)` — スキルを習得する
- `forgetSkill(skillId)` — スキルを忘れる
- `isLearnedSkill(skillId)` — スキルを習得済みかを確認する
- `hasSkill(skillId)` — スキルを所持しているか（習得+特徴追加）を確認する
- `changeClass(classId, keepExp)` — 職業を変更する
- `setFaceImage(faceName, faceIndex)` — 顔画像を設定する
- `setBattlerImage(battlerName)` — 戦闘キャラ画像を設定する
- `isSpriteVisible()` — SV戦闘でスプライトが表示されるかを確認する
- `performActionStart(action)` — アクション開始演出を実行する
- `performAction(action)` — アクション演出を実行する
- `performActionEnd()` — アクション終了演出を実行する
- `performAttack()` — 通常攻撃演出を実行する
- `performDamage()` — ダメージ演出を実行する
- `performEvasion()` — 回避演出を実行する
- `performMagicEvasion()` — 魔法回避演出を実行する
- `performCounter()` — 反撃演出を実行する
- `performCollapse()` — 戦闘不能演出を実行する
- `performVictory()` — 勝利演出を実行する
- `performEscape()` — 逃走演出を実行する
- `makeActionList()` — 自動戦闘用アクション候補リストを作成する
- `makeAutoBattleActions()` — 自動戦闘用アクションを作成する
- `makeConfusionActions()` — 混乱時のアクションを作成する
- `makeActions()` — アクションを作成する
- `onPlayerWalk()` — プレイヤー移動時のコールバック（歩数経過ステート等）
- `updateStateSteps(state)` — 歩数経過ステートの歩数を更新する
- `showAddedStates()` — 付与されたステートのメッセージを表示する
- `showRemovedStates()` — 解除されたステートのメッセージを表示する
- `stepsForTurn()` — 1ターンあたりの歩数を返す
- `turnEndOnMap()` — マップ上でのターン終了処理を行う
- `checkFloorEffect()` — 床ダメージのチェックを行う
- `executeFloorDamage()` — 床ダメージを実行する
- `basicFloorDamage()` — 床ダメージの基本値を返す
- `maxFloorDamage()` — 床ダメージの最大値を返す
- `performMapDamage()` — マップ上ダメージの演出を実行する
- `clearActions()` — 全アクションをクリアする
- `inputtingAction()` — 現在入力中のアクションを返す
- `selectNextCommand()` — 次のコマンド入力へ進む
- `selectPreviousCommand()` — 前のコマンド入力に戻る
- `lastSkill()` — 最後に使用したスキルを返す
- `lastMenuSkill()` — メニューで最後に使用したスキルを返す
- `setLastMenuSkill(skill)` — メニューで最後に使用したスキルを設定する
- `lastBattleSkill()` — 戦闘で最後に使用したスキルを返す
- `setLastBattleSkill(skill)` — 戦闘で最後に使用したスキルを設定する
- `lastCommandSymbol()` — 最後のコマンドシンボルを返す
- `setLastCommandSymbol(symbol)` — 最後のコマンドシンボルを設定する
- `testEscape(item)` — アイテムが逃走効果を持つかをテストする
- `meetsUsableItemConditions(item)` — アイテム使用条件を満たすかを確認する
- `onEscapeFailure()` — 逃走失敗時のコールバック（TPBペナルティ適用）

### Game_Enemy

敵キャラクター用のゲームオブジェクトクラス

- **継承**: `Game_BattlerBase` → `Game_Battler` → **Game_Enemy**

#### インスタンスメソッド
- `initialize(enemyId, x, y)` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `setup(enemyId, x, y)` — 敵IDと座標でセットアップする
- `isEnemy()` — 敵かを確認する（常にtrue）
- `friendsUnit()` — 味方ユニット（$gameTroop）を返す
- `opponentsUnit()` — 敵ユニット（$gameParty）を返す
- `index()` — 敵グループ内のインデックスを返す
- `isBattleMember()` — 戦闘メンバーかを確認する（常にtrue）
- `enemyId()` — 敵キャラのIDを返す
- `enemy()` — データベースの敵オブジェクトを返す
- `traitObjects()` — 特徴を持つオブジェクト（敵・ステート）の配列を返す
- `paramBase(paramId)` — パラメータ基本値を返す
- `exp()` — 獲得経験値を返す
- `gold()` — 獲得ゴールドを返す
- `makeDropItems()` — ドロップアイテムの配列を作成する
- `dropItemRate()` — ドロップアイテム倍率を返す
- `itemObject(kind, dataId)` — 種類とIDからデータベースオブジェクトを返す
- `isSpriteVisible()` — スプライトが表示されるかを確認する（常にtrue）
- `screenX()` — 画面上のX座標を返す
- `screenY()` — 画面上のY座標を返す
- `battlerName()` — バトラー画像のファイル名を返す
- `battlerHue()` — バトラー画像の色相を返す
- `originalName()` — 元の名前（変身前）を返す
- `name()` — 名前（複数がいる場合は英字付き）を返す
- `isLetterEmpty()` — 識別英字が未設定かを確認する
- `setLetter(letter)` — 識別英字を設定する（A, B等）
- `setPlural(plural)` — 同名の敵が複数いるかを設定する
- `performActionStart(action)` — アクション開始演出を実行する
- `performAction(action)` — アクション演出を実行する
- `performActionEnd()` — アクション終了演出を実行する
- `performDamage()` — ダメージ演出を実行する
- `performCollapse()` — 戦闘不能演出を実行する
- `transform(enemyId)` — 別の敵に変身する
- `meetsCondition(action)` — 行動パターンの条件を満たすかを確認する
- `meetsTurnCondition(param1, param2)` — ターン条件を満たすかを確認する
- `meetsHpCondition(param1, param2)` — HP条件を満たすかを確認する
- `meetsMpCondition(param1, param2)` — MP条件を満たすかを確認する
- `meetsStateCondition(param)` — ステート条件を満たすかを確認する
- `meetsPartyLevelCondition(param)` — パーティレベル条件を満たすかを確認する
- `meetsSwitchCondition(param)` — スイッチ条件を満たすかを確認する
- `isActionValid(action)` — 行動パターンが有効かを確認する
- `selectAction(actionList, ratingZero)` — レーティングに基づいて行動を選択する
- `selectAllActions(actionList)` — 全アクションスロットの行動を選択する
- `makeActions()` — アクションを作成する

### Game_Actors

アクター配列のラッパークラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `actor(actorId)` — アクターオブジェクトを返す

### Game_Unit

Game_PartyとGame_Troopのスーパークラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `inBattle()` — 戦闘中かを確認する
- `members()` — メンバーの配列を返す
- `aliveMembers()` — 生存メンバーの配列を返す
- `deadMembers()` — 戦闘不能メンバーの配列を返す
- `movableMembers()` — 行動可能なメンバーの配列を返す
- `clearActions()` — 全メンバーのアクションをクリアする
- `agility()` — ユニットの平均敏捷性を返す
- `tgrSum()` — ユニットの狙われ率合計を返す
- `randomTarget()` — 狙われ率に基づいてランダムに対象を選ぶ
- `randomDeadTarget()` — 戦闘不能メンバーからランダムに対象を選ぶ
- `smoothTarget(index)` — 指定インデックスの生存メンバーを返す（戦闘不能なら別の生存者）
- `smoothDeadTarget(index)` — 指定インデックスの戦闘不能メンバーを返す
- `clearResults()` — 全メンバーのアクション結果をクリアする
- `onBattleStart(advantageous)` — 戦闘開始時のコールバック
- `onBattleEnd()` — 戦闘終了時のコールバック
- `makeActions()` — 全メンバーのアクションを作成する
- `select(activeMember)` — 指定メンバーを選択状態にする
- `isAllDead()` — 全メンバーが戦闘不能かを確認する
- `substituteBattler(target)` — 身代わり可能なバトラーを返す
- `tpbBaseSpeed()` — TPBの基本速度を返す
- `tpbReferenceTime()` — TPBの参照時間を返す
- `updateTpb()` — 全メンバーのTPBを更新する

### Game_Party

パーティ用のゲームオブジェクトクラス。所持金やアイテムなどの情報を含む

- **継承**: `Game_Unit` → **Game_Party**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initAllItems()` — 全アイテム・武器・防具の所持数を初期化する
- `exists()` — パーティが存在する（メンバーがいる）かを確認する
- `size()` — パーティの人数を返す
- `isEmpty()` — パーティが空かを確認する
- `members()` — 全メンバーの配列を返す
- `allMembers()` — 控え含む全メンバーの配列を返す
- `battleMembers()` — 戦闘メンバーの配列を返す
- `hiddenBattleMembers()` — 非表示の戦闘メンバーの配列を返す
- `allBattleMembers()` — 非表示含む全戦闘メンバーの配列を返す
- `maxBattleMembers()` — 戦闘メンバーの最大数を返す（デフォルト: 4）
- `leader()` — リーダー（先頭メンバー）を返す
- `removeInvalidMembers()` — 無効なメンバーを削除する
- `reviveBattleMembers()` — 戦闘不能の戦闘メンバーをHP1で復活させる
- `items()` — 所持アイテムの配列を返す
- `weapons()` — 所持武器の配列を返す
- `armors()` — 所持防具の配列を返す
- `equipItems()` — 所持装備品（武器+防具）の配列を返す
- `allItems()` — 全所持品（アイテム+装備品）の配列を返す
- `itemContainer(item)` — アイテムの種類に応じた所持コンテナを返す
- `setupStartingMembers()` — 初期メンバーをセットアップする
- `name()` — パーティ名（リーダー名）を返す
- `setupBattleTest()` — 戦闘テスト用のセットアップを行う
- `setupBattleTestMembers()` — 戦闘テスト用メンバーをセットアップする
- `setupBattleTestItems()` — 戦闘テスト用アイテムをセットアップする
- `highestLevel()` — パーティ内の最高レベルを返す
- `addActor(actorId)` — アクターをパーティに追加する
- `removeActor(actorId)` — アクターをパーティから削除する
- `gold()` — 所持金を返す
- `gainGold(amount)` — ゴールドを獲得する
- `loseGold(amount)` — ゴールドを失う
- `maxGold()` — 所持金の最大値を返す
- `steps()` — 累計歩数を返す
- `increaseSteps()` — 歩数を1増やす
- `numItems(item)` — 指定アイテムの所持数を返す
- `maxItems(/*item*/)` — アイテムの最大所持数を返す（デフォルト: 99）
- `hasMaxItems(item)` — アイテムが最大所持数かを確認する
- `hasItem(item, includeEquip)` — アイテムを所持しているかを確認する（装備含むオプション）
- `isAnyMemberEquipped(item)` — いずれかのメンバーが装備中かを確認する
- `gainItem(item, amount, includeEquip)` — アイテムを獲得する
- `discardMembersEquip(item, amount)` — メンバーの装備からアイテムを破棄する
- `loseItem(item, amount, includeEquip)` — アイテムを失う
- `consumeItem(item)` — 消耗アイテムを1つ消費する
- `canUse(item)` — アイテムを使用可能かを確認する
- `canInput()` — コマンド入力可能かを確認する
- `isAllDead()` — 全メンバーが戦闘不能かを確認する
- `isEscaped()` — 逃走済みかを確認する
- `onPlayerWalk()` — プレイヤー移動時のコールバック
- `menuActor()` — メニューで選択中のアクターを返す
- `setMenuActor(actor)` — メニューで選択中のアクターを設定する
- `makeMenuActorNext()` — メニューの次のアクターに切り替える
- `makeMenuActorPrevious()` — メニューの前のアクターに切り替える
- `targetActor()` — 対象アクターを返す
- `setTargetActor(actor)` — 対象アクターを設定する
- `lastItem()` — 最後に使用したアイテムを返す
- `setLastItem(item)` — 最後に使用したアイテムを設定する
- `swapOrder(index1, index2)` — 2人のメンバーの順序を入れ替える
- `charactersForSavefile()` — セーブファイル用のキャラクター情報を返す
- `facesForSavefile()` — セーブファイル用の顔画像情報を返す
- `partyAbility(abilityId)` — パーティアビリティが有効かを確認する
- `hasEncounterHalf()` — エンカウント半減アビリティを持つかを確認する
- `hasEncounterNone()` — エンカウント無効アビリティを持つかを確認する
- `hasCancelSurprise()` — 不意打ち無効アビリティを持つかを確認する
- `hasRaisePreemptive()` — 先制攻撃率アップアビリティを持つかを確認する
- `hasGoldDouble()` — 獲得ゴールド2倍アビリティを持つかを確認する
- `hasDropItemDouble()` — ドロップアイテム2倍アビリティを持つかを確認する
- `ratePreemptive(troopAgi)` — 先制攻撃率を計算する
- `rateSurprise(troopAgi)` — 不意打ち率を計算する
- `performVictory()` — 勝利演出を実行する
- `performEscape()` — 逃走演出を実行する
- `removeBattleStates()` — 戦闘終了時に解除されるステートを削除する
- `requestMotionRefresh()` — 全メンバーのモーションリフレッシュを要求する
- `onEscapeFailure()` — 逃走失敗時のコールバック

### Game_Troop

敵グループおよび戦闘関連データ用のゲームオブジェクトクラス

- **継承**: `Game_Unit` → **Game_Troop**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `isEventRunning()` — 戦闘イベントが実行中かを確認する
- `updateInterpreter()` — 戦闘イベントのインタプリタを更新する
- `turnCount()` — ターン数を返す
- `members()` — 敵メンバーの配列を返す
- `clear()` — 敵グループをクリアする
- `troop()` — データベースの敵グループオブジェクトを返す
- `setup(troopId)` — 敵グループIDでセットアップする
- `makeUniqueNames()` — 同名の敵に識別英字（A, B等）を付ける
- `updatePluralFlags()` — 同名敵複数フラグを更新する
- `letterTable()` — 識別用英字テーブルを返す
- `enemyNames()` — 敵の名前配列を返す（重複なし）
- `meetsConditions(page)` — バトルイベントページの条件を満たすかを確認する
- `setupBattleEvent()` — バトルイベントをセットアップする
- `increaseTurn()` — ターン数を1増加させる
- `expTotal()` — 敵グループの総経験値を返す
- `goldTotal()` — 敵グループの総ゴールドを返す
- `goldRate()` — ゴールド倍率を返す
- `makeDropItems()` — 全敵のドロップアイテムをまとめて返す
- `isTpbTurnEnd()` — TPBターンが終了したかを確認する

### Game_Map

マップ用のゲームオブジェクトクラス。スクロールや通行判定の機能を含む

#### インスタンスメソッド
- `initialize()` — 初期化する
- `setup(mapId)` — マップIDでセットアップする
- `isEventRunning()` — イベントが実行中かを確認する
- `tileWidth()` — タイルの幅（ピクセル）を返す
- `tileHeight()` — タイルの高さ（ピクセル）を返す
- `bushDepth()` — 茂みの深さ（ピクセル）を返す
- `mapId()` — マップIDを返す
- `tilesetId()` — タイルセットIDを返す
- `displayX()` — 画面表示のX座標（タイル単位）を返す
- `displayY()` — 画面表示のY座標（タイル単位）を返す
- `parallaxName()` — 遠景画像のファイル名を返す
- `battleback1Name()` — 戦闘背景1のファイル名を返す
- `battleback2Name()` — 戦闘背景2のファイル名を返す
- `requestRefresh()` — マップのリフレッシュを要求する
- `isNameDisplayEnabled()` — マップ名表示が有効かを確認する
- `disableNameDisplay()` — マップ名表示を無効にする
- `enableNameDisplay()` — マップ名表示を有効にする
- `createVehicles()` — 乗り物オブジェクトを作成する
- `refereshVehicles()` — 乗り物をリフレッシュする
- `vehicles()` — 乗り物の配列を返す
- `vehicle(type)` — 指定タイプの乗り物を返す
- `boat()` — 小型船を返す
- `ship()` — 大型船を返す
- `airship()` — 飛行船を返す
- `setupEvents()` — マップイベントをセットアップする
- `events()` — 全イベントの配列を返す
- `event(eventId)` — 指定IDのイベントを返す
- `eraseEvent(eventId)` — 指定IDのイベントを一時消去する
- `autorunCommonEvents()` — 自動実行コモンイベントの配列を返す
- `parallelCommonEvents()` — 並列処理コモンイベントの配列を返す
- `setupScroll()` — スクロール状態を初期化する
- `setupParallax()` — 遠景をセットアップする
- `setupBattleback()` — 戦闘背景をセットアップする
- `setDisplayPos(x, y)` — 画面表示位置を設定する
- `parallaxOx()` — 遠景のX方向オフセットを返す
- `parallaxOy()` — 遠景のY方向オフセットを返す
- `tileset()` — タイルセットデータを返す
- `tilesetFlags()` — タイルセットのフラグ配列を返す
- `displayName()` — マップの表示名を返す
- `width()` — マップの幅（タイル数）を返す
- `height()` — マップの高さ（タイル数）を返す
- `data()` — マップのタイルデータ配列を返す
- `isLoopHorizontal()` — 横方向ループマップかを確認する
- `isLoopVertical()` — 縦方向ループマップかを確認する
- `isDashDisabled()` — ダッシュが無効かを確認する
- `encounterList()` — エンカウントリストを返す
- `encounterStep()` — エンカウント歩数を返す
- `isOverworld()` — フィールドマップかを確認する
- `screenTileX()` — 画面に表示されるタイル数（横）を返す
- `screenTileY()` — 画面に表示されるタイル数（縦）を返す
- `adjustX(x)` — ループ考慮でX座標を調整する
- `adjustY(y)` — ループ考慮でY座標を調整する
- `roundX(x)` — ループ考慮でX座標を丸める
- `roundY(y)` — ループ考慮でY座標を丸める
- `xWithDirection(x, d)` — 指定方向に1タイル移動したX座標を返す
- `yWithDirection(y, d)` — 指定方向に1タイル移動したY座標を返す
- `roundXWithDirection(x, d)` — ループ考慮で方向移動後のX座標を返す
- `roundYWithDirection(y, d)` — ループ考慮で方向移動後のY座標を返す
- `deltaX(x1, x2)` — ループ考慮で2地点間のX差分を返す
- `deltaY(y1, y2)` — ループ考慮で2地点間のY差分を返す
- `distance(x1, y1, x2, y2)` — 2地点間の距離を返す
- `canvasToMapX(x)` — 画面座標をマップX座標に変換する
- `canvasToMapY(y)` — 画面座標をマップY座標に変換する
- `autoplay()` — マップのBGM・BGSを自動再生する
- `refreshIfNeeded()` — リフレッシュが必要なら実行する
- `refresh()` — マップの全イベント・乗り物をリフレッシュする
- `refreshTileEvents()` — タイルイベントをリフレッシュする
- `eventsXy(x, y)` — 指定座標のイベント配列を返す
- `eventsXyNt(x, y)` — 指定座標のすり抜けでないイベント配列を返す
- `tileEventsXy(x, y)` — 指定座標のタイルイベント配列を返す
- `eventIdXy(x, y)` — 指定座標のイベントIDを返す
- `scrollDown(distance)` — 下にスクロールする
- `scrollLeft(distance)` — 左にスクロールする
- `scrollRight(distance)` — 右にスクロールする
- `scrollUp(distance)` — 上にスクロールする
- `isValid(x, y)` — 座標がマップ範囲内かを確認する
- `checkPassage(x, y, bit)` — タイルの通行フラグをチェックする
- `tileId(x, y, z)` — 指定座標・レイヤーのタイルIDを返す
- `layeredTiles(x, y)` — 指定座標の全レイヤータイルID配列を返す
- `allTiles(x, y)` — 指定座標の全タイルID（オートタイル含む）配列を返す
- `autotileType(x, y, z)` — オートタイルのタイプを返す
- `isPassable(x, y, d)` — 指定座標・方向が通行可能かを確認する
- `isBoatPassable(x, y)` — 小型船が通行可能かを確認する
- `isShipPassable(x, y)` — 大型船が通行可能かを確認する
- `isAirshipLandOk(x, y)` — 飛行船が着陸可能かを確認する
- `checkLayeredTilesFlags(x, y, bit)` — 全レイヤータイルのフラグをチェックする
- `isLadder(x, y)` — はしごタイルかを確認する
- `isBush(x, y)` — 茂みタイルかを確認する
- `isCounter(x, y)` — カウンタータイルかを確認する
- `isDamageFloor(x, y)` — ダメージ床かを確認する
- `terrainTag(x, y)` — 地形タグを返す
- `regionId(x, y)` — リージョンIDを返す
- `startScroll(direction, distance, speed)` — スクロールを開始する
- `isScrolling()` — スクロール中かを確認する
- `update(sceneActive)` — 毎フレーム更新する
- `updateScroll()` — スクロールの進行を更新する
- `scrollDistance()` — スクロール距離を返す
- `doScroll(direction, distance)` — 指定方向にスクロールを実行する
- `updateEvents()` — 全イベントを更新する
- `updateVehicles()` — 全乗り物を更新する
- `updateParallax()` — 遠景を更新する
- `changeTileset(tilesetId)` — タイルセットを変更する
- `changeParallax(name, loopX, loopY, sx, sy)` — 遠景を変更する
- `updateInterpreter()` — マップイベントのインタプリタを更新する
- `unlockEvent(eventId)` — 指定イベントのロックを解除する
- `setupStartingEvent()` — 開始イベントをセットアップする
- `setupTestEvent()` — テストイベントをセットアップする
- `setupStartingMapEvent()` — 開始マップイベントをセットアップする
- `setupAutorunCommonEvent()` — 自動実行コモンイベントをセットアップする
- `isAnyEventStarting()` — いずれかのイベントが開始中かを確認する

### Game_CommonEvent

コモンイベント用のゲームオブジェクトクラス

#### インスタンスメソッド
- `initialize(commonEventId)` — 初期化する
- `event()` — データベースのコモンイベントデータを返す
- `list()` — イベントコマンドリストを返す
- `refresh()` — インタプリタをリフレッシュする
- `isActive()` — アクティブ（実行条件を満たす）かを確認する
- `update()` — 毎フレーム更新する

### Game_CharacterBase

Game_Characterのスーパークラス。座標や画像などの基本情報を扱う

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `pos(x, y)` — 指定座標にいるかを確認する
- `posNt(x, y)` — 指定座標にいるかを確認する（すり抜けでない場合）
- `moveSpeed()` — 移動速度を返す
- `setMoveSpeed(moveSpeed)` — 移動速度を設定する
- `moveFrequency()` — 移動頻度を返す
- `setMoveFrequency(moveFrequency)` — 移動頻度を設定する
- `opacity()` — 不透明度を返す
- `setOpacity(opacity)` — 不透明度を設定する
- `blendMode()` — ブレンドモードを返す
- `setBlendMode(blendMode)` — ブレンドモードを設定する
- `isNormalPriority()` — 通常プライオリティ（キャラと同じ）かを確認する
- `setPriorityType(priorityType)` — プライオリティタイプを設定する
- `isMoving()` — 移動中かを確認する
- `isJumping()` — ジャンプ中かを確認する
- `jumpHeight()` — ジャンプの高さ（ピクセル）を返す
- `isStopping()` — 停止中かを確認する
- `checkStop(threshold)` — 停止カウントが閾値以上かを確認する
- `resetStopCount()` — 停止カウントをリセットする
- `realMoveSpeed()` — 実際の移動速度（ダッシュ補正含む）を返す
- `distancePerFrame()` — 1フレームあたりの移動距離を返す
- `isDashing()` — ダッシュ中かを確認する
- `isDebugThrough()` — デバッグすり抜けが有効かを確認する
- `straighten()` — キャラクターのパターンを正面に戻す
- `reverseDir(d)` — 指定方向の逆方向を返す
- `canPass(x, y, d)` — 指定座標・方向に通行可能かを確認する
- `canPassDiagonally(x, y, horz, vert)` — 斜め方向に通行可能かを確認する
- `isMapPassable(x, y, d)` — マップの通行判定（イベントを除く）を確認する
- `isCollidedWithCharacters(x, y)` — 他キャラクターとの衍突を確認する
- `isCollidedWithEvents(x, y)` — イベントとの衍突を確認する
- `isCollidedWithVehicles(x, y)` — 乗り物との衍突を確認する
- `setPosition(x, y)` — 座標を設定する
- `copyPosition(character)` — 他キャラクターの座標をコピーする
- `locate(x, y)` — 指定座標に配置する（移動カウントリセット）
- `direction()` — 向き（2/4/6/8）を返す
- `setDirection(d)` — 向きを設定する
- `isTile()` — タイルキャラクターかを確認する
- `isObjectCharacter()` — オブジェクトキャラ（!付き）かを確認する
- `shiftY()` — Y方向の表示オフセットを返す
- `scrolledX()` — スクロール調整後のX座標を返す
- `scrolledY()` — スクロール調整後のY座標を返す
- `screenX()` — 画面上のX座標（ピクセル）を返す
- `screenY()` — 画面上のY座標（ピクセル）を返す
- `screenZ()` — 画面上のZソート順を返す
- `isNearTheScreen()` — 画面近くにいるかを確認する
- `update()` — 毎フレーム更新する
- `updateStop()` — 停止中の更新を行う
- `updateJump()` — ジャンプの進行を更新する
- `updateMove()` — 移動の進行を更新する
- `updateAnimation()` — 歩行アニメーションを更新する
- `animationWait()` — アニメーションの待ちフレーム数を返す
- `updateAnimationCount()` — アニメーションカウントを更新する
- `updatePattern()` — アニメーションパターンを更新する
- `maxPattern()` — 最大パターン数を返す
- `pattern()` — 現在のパターン番号を返す
- `setPattern(pattern)` — パターンを設定する
- `isOriginalPattern()` — 初期パターンかを確認する
- `resetPattern()` — パターンを初期値にリセットする
- `refreshBushDepth()` — 茂みの深さを再計算する
- `isOnLadder()` — はしご上にいるかを確認する
- `isOnBush()` — 茂みの上にいるかを確認する
- `terrainTag()` — 現在位置の地形タグを返す
- `regionId()` — 現在位置のリージョンIDを返す
- `increaseSteps()` — 歩数を1増やす
- `tileId()` — タイルキャラのタイルIDを返す
- `characterName()` — キャラクター画像のファイル名を返す
- `characterIndex()` — キャラクター画像のインデックスを返す
- `setTileImage(tileId)` — タイル画像を設定する
- `checkEventTriggerTouchFront(d)` — 前方の接触イベントトリガーをチェックする
- `checkEventTriggerTouch(/*x, y*/)` — 接触イベントトリガーをチェックする
- `isMovementSucceeded(/*x, y*/)` — 移動が成功したかを確認する
- `setMovementSuccess(success)` — 移動成功フラグを設定する
- `moveStraight(d)` — 指定方向に直線移動する
- `moveDiagonally(horz, vert)` — 斜め方向に移動する
- `jump(xPlus, yPlus)` — 指定オフセットにジャンプする
- `hasWalkAnime()` — 歩行アニメが有効かを確認する
- `setWalkAnime(walkAnime)` — 歩行アニメの有効/無効を設定する
- `hasStepAnime()` — 足踏みアニメが有効かを確認する
- `setStepAnime(stepAnime)` — 足踏みアニメの有効/無効を設定する
- `isDirectionFixed()` — 向き固定かを確認する
- `setDirectionFix(directionFix)` — 向き固定の有効/無効を設定する
- `isThrough()` — すり抜けが有効かを確認する
- `setThrough(through)` — すり抜けの有効/無効を設定する
- `isTransparent()` — 透明かを確認する
- `bushDepth()` — 茂みの深さを返す
- `setTransparent(transparent)` — 透明の有効/無効を設定する
- `startAnimation()` — アニメーションを開始する
- `startBalloon()` — フキダシアイコンを開始する
- `isAnimationPlaying()` — アニメーション再生中かを確認する
- `isBalloonPlaying()` — フキダシアイコン再生中かを確認する
- `endAnimation()` — アニメーションを終了する
- `endBalloon()` — フキダシアイコンを終了する

### Game_Character

Game_Player・Game_Follower・Game_Vehicle・Game_Eventのスーパークラス

- **継承**: `Game_CharacterBase` → **Game_Character**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `memorizeMoveRoute()` — 現在の移動ルートを記憶する
- `restoreMoveRoute()` — 記憶した移動ルートを復元する
- `isMoveRouteForcing()` — 移動ルート強制中かを確認する
- `setMoveRoute(moveRoute)` — 移動ルートを設定する
- `forceMoveRoute(moveRoute)` — 移動ルートを強制実行する
- `updateStop()` — 停止中の更新を行う
- `updateRoutineMove()` — 自律移動を更新する
- `processMoveCommand(command)` — 移動コマンドを処理する
- `deltaXFrom(x)` — 指定X座標との差分を返す
- `deltaYFrom(y)` — 指定Y座標との差分を返す
- `moveRandom()` — ランダムに移動する
- `moveTowardCharacter(character)` — 指定キャラに近づく
- `moveAwayFromCharacter(character)` — 指定キャラから遠ざかる
- `turnTowardCharacter(character)` — 指定キャラの方を向く
- `turnAwayFromCharacter(character)` — 指定キャラの反対を向く
- `turnTowardPlayer()` — プレイヤーの方を向く
- `turnAwayFromPlayer()` — プレイヤーの反対を向く
- `moveTowardPlayer()` — プレイヤーに近づく
- `moveAwayFromPlayer()` — プレイヤーから遠ざかる
- `moveForward()` — 前方に移動する
- `moveBackward()` — 後方に移動する（向きは変えず）
- `processRouteEnd()` — 移動ルート終了を処理する
- `advanceMoveRouteIndex()` — 移動ルートのインデックスを進める
- `turnRight90()` — 右に90度回転する
- `turnLeft90()` — 左に90度回転する
- `turn180()` — 180度回転する
- `turnRightOrLeft90()` — ランダムに左右どちらかに90度回転する
- `turnRandom()` — ランダムな方向を向く
- `swap(character)` — 指定キャラと位置を入れ替える
- `findDirectionTo(goalX, goalY)` — 目標座標への最短経路の方向を探索する
- `searchLimit()` — 経路探索の最大距離を返す

### Game_Player

プレイヤーキャラクター用のゲームオブジェクトクラス

- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Player**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `clearTransferInfo()` — 場所移動情報をクリアする
- `followers()` — フォロワー（Game_Followers）を返す
- `refresh()` — キャラクター画像をリフレッシュする
- `isStopping()` — 停止中かを確認する
- `reserveTransfer(mapId, x, y, d, fadeType)` — 場所移動を予約する
- `setupForNewGame()` — ニューゲーム用の初期設定を行う
- `requestMapReload()` — マップの再読み込みを要求する
- `isTransferring()` — 場所移動中かを確認する
- `newMapId()` — 移動先のマップIDを返す
- `fadeType()` — フェードタイプを返す
- `performTransfer()` — 場所移動を実行する
- `isMapPassable(x, y, d)` — マップが通行可能かを確認する（乗り物考慮）
- `vehicle()` — 現在乗っている乗り物を返す
- `isInBoat()` — 小型船に乗っているかを確認する
- `isInShip()` — 大型船に乗っているかを確認する
- `isInAirship()` — 飛行船に乗っているかを確認する
- `isInVehicle()` — 乗り物に乗っているかを確認する
- `isNormal()` — 通常状態（乗り物に乗っていない）かを確認する
- `isDashing()` — ダッシュ中かを確認する
- `isDebugThrough()` — デバッグすり抜けが有効かを確認する
- `isCollided(x, y)` — 指定座標で衍突するかを確認する
- `centerX()` — 画面中央のX座標（タイル単位）を返す
- `centerY()` — 画面中央のY座標（タイル単位）を返す
- `center(x, y)` — 指定座標を画面中央に表示する
- `locate(x, y)` — 指定座標に配置し、画面を中央に合わせる
- `increaseSteps()` — 歩数を増やす（エンカウント・ステート更新含む）
- `makeEncounterCount()` — 次のエンカウントまでの歩数を計算する
- `makeEncounterTroopId()` — エンカウントする敵グループIDを決定する
- `meetsEncounterConditions(encounter)` — エンカウント条件を満たすかを確認する
- `executeEncounter()` — エンカウントを実行する
- `startMapEvent(x, y, triggers, normal)` — 指定座標のマップイベントを開始する
- `moveByInput()` — 入力に応じて移動する
- `canMove()` — 移動可能かを確認する
- `getInputDirection()` — 入力方向を取得する
- `executeMove(direction)` — 指定方向への移動を実行する
- `update(sceneActive)` — 毎フレーム更新する
- `updateDashing()` — ダッシュ状態を更新する
- `isDashButtonPressed()` — ダッシュボタンが押されているかを確認する
- `updateScroll(lastScrolledX, lastScrolledY)` — スクロールを更新する
- `updateVehicle()` — 乗り物の状態を更新する
- `updateVehicleGetOn()` — 乗り物への乗車処理を更新する
- `updateVehicleGetOff()` — 乗り物からの降車処理を更新する
- `updateNonmoving(wasMoving, sceneActive)` — 非移動時の更新を行う
- `triggerAction()` — 決定ボタン・タッチによるアクションをトリガーする
- `triggerButtonAction()` — ボタンによるアクションをトリガーする
- `triggerTouchAction()` — タッチによるアクションをトリガーする
- `triggerTouchActionD1(x1, y1)` — 同位置のタッチアクションを処理する
- `triggerTouchActionD2(x2, y2)` — 1タイル先のタッチアクションを処理する
- `triggerTouchActionD3(x2, y2)` — カウンター越しのタッチアクションを処理する
- `updateEncounterCount()` — エンカウントカウントを更新する
- `canEncounter()` — エンカウント可能かを確認する
- `encounterProgressValue()` — エンカウント進行値を返す
- `checkEventTriggerHere(triggers)` — 現在地点のイベントトリガーをチェックする
- `checkEventTriggerThere(triggers)` — 前方のイベントトリガーをチェックする
- `checkEventTriggerTouch(x, y)` — 接触イベントトリガーをチェックする
- `canStartLocalEvents()` — ローカルイベントを開始できるかを確認する
- `getOnOffVehicle()` — 乗り物の乗降を切り替える
- `getOnVehicle()` — 乗り物に乗る
- `getOffVehicle()` — 乗り物から降りる
- `forceMoveForward()` — 前方に強制移動する
- `isOnDamageFloor()` — ダメージ床の上にいるかを確認する
- `moveStraight(d)` — 直線移動する（イベントトリガーチェック付き）
- `moveDiagonally(horz, vert)` — 斜め移動する（イベントトリガーチェック付き）
- `jump(xPlus, yPlus)` — ジャンプする（フォロワーも同期）
- `showFollowers()` — フォロワーを表示する
- `hideFollowers()` — フォロワーを非表示にする
- `gatherFollowers()` — フォロワーを集合させる
- `areFollowersGathering()` — フォロワーが集合中かを確認する
- `areFollowersGathered()` — フォロワーが集合完了かを確認する。`

### Game_Follower

隊列歩行のフォロワー用のゲームオブジェクトクラス

- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Follower**

#### インスタンスメソッド
- `initialize(memberIndex)` — 初期化する
- `refresh()` — キャラクター画像をリフレッシュする
- `actor()` — 対応するアクターを返す
- `isVisible()` — 表示状態かを確認する
- `isGathered()` — 集合完了かを確認する
- `update()` — 毎フレーム更新する
- `chaseCharacter(character)` — 指定キャラを追尾する

### Game_Followers

フォロワー配列のラッパークラス

#### インスタンスメソッド
- `initialize()` — 初期化する
- `setup()` — フォロワーをセットアップする
- `isVisible()` — フォロワーが表示状態かを確認する
- `show()` — フォロワーを表示する
- `hide()` — フォロワーを非表示にする
- `data()` — フォロワーの配列を返す
- `reverseData()` — フォロワーの配列を逆順で返す
- `follower(index)` — 指定インデックスのフォロワーを返す
- `refresh()` — 全フォロワーをリフレッシュする
- `update()` — 毎フレーム更新する
- `updateMove()` — フォロワーの移動を更新する
- `jumpAll()` — 全フォロワーをジャンプさせる
- `synchronize(x, y, d)` — 全フォロワーの座標と向きを同期する
- `gather()` — 全フォロワーを集合させる
- `areGathering()` — 集合中かを確認する
- `visibleFollowers()` — 表示中のフォロワーの配列を返す
- `areMoving()` — いずれかのフォロワーが移動中かを確認する
- `areGathered()` — 全フォロワーが集合完了かを確認する
- `isSomeoneCollided(x, y)` — いずれかのフォロワーが指定座標で衍突するかを確認する

### Game_Vehicle

乗り物用のゲームオブジェクトクラス

- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Vehicle**

#### インスタンスメソッド
- `initialize(type)` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `isBoat()` — 小型船かを確認する
- `isShip()` — 大型船かを確認する
- `isAirship()` — 飛行船かを確認する
- `resetDirection()` — 向きを初期値にリセットする
- `initMoveSpeed()` — 移動速度を初期化する
- `vehicle()` — データベースの乗り物データを返す
- `loadSystemSettings()` — システム設定から乗り物情報を読み込む
- `refresh()` — キャラクター画像をリフレッシュする
- `setLocation(mapId, x, y)` — 乗り物の場所を設定する
- `pos(x, y)` — 指定座標にいるかを確認する
- `isMapPassable(x, y, d)` — 乗り物で通行可能かを確認する
- `getOn()` — 乗車処理を行う
- `getOff()` — 降車処理を行う
- `setBgm(bgm)` — 乗り物のBGMを設定する
- `playBgm()` — 乗り物のBGMを再生する
- `syncWithPlayer()` — プレイヤーと位置を同期する
- `screenY()` — 画面上のY座標を返す
- `shadowX()` — 影のX座標を返す
- `shadowY()` — 影のY座標を返す
- `shadowOpacity()` — 影の不透明度を返す
- `canMove()` — 移動可能かを確認する
- `update()` — 毎フレーム更新する
- `updateAirship()` — 飛行船の更新を行う
- `updateAirshipAltitude()` — 飛行船の高度を更新する
- `maxAltitude()` — 飛行船の最大高度を返す
- `isLowest()` — 最低高度（着地）かを確認する
- `isHighest()` — 最高高度かを確認する
- `isTakeoffOk()` — 離陸可能かを確認する
- `isLandOk(x, y, d)` — 着陸可能かを確認する

### Game_Event

イベント用のゲームオブジェクトクラス。イベントページの切り替え機能を含む

- **継承**: `Game_CharacterBase` → `Game_Character` → **Game_Event**

#### インスタンスメソッド
- `initialize(mapId, eventId)` — 初期化する
- `initMembers()` — メンバー変数を初期化する
- `eventId()` — イベントIDを返す
- `event()` — データベースのイベントデータを返す
- `page()` — 現在のイベントページを返す
- `list()` — 現在ページのコマンドリストを返す
- `isCollidedWithCharacters(x, y)` — 他キャラクターとの衍突を確認する
- `isCollidedWithEvents(x, y)` — 他イベントとの衍突を確認する
- `isCollidedWithPlayerCharacters(x, y)` — プレイヤー・フォロワーとの衍突を確認する
- `lock()` — イベントをロックする（プレイヤーの方を向く）
- `unlock()` — イベントのロックを解除する
- `updateStop()` — 停止中の更新を行う
- `updateSelfMovement()` — 自律移動を更新する
- `stopCountThreshold()` — 自律移動の停止カウント閾値を返す
- `moveTypeRandom()` — ランダム移動タイプの処理を行う
- `moveTypeTowardPlayer()` — プレイヤーに近づく移動タイプの処理を行う
- `isNearThePlayer()` — プレイヤーの近くにいるかを確認する
- `moveTypeCustom()` — カスタム移動タイプの処理を行う
- `isStarting()` — イベントが開始状態かを確認する
- `clearStartingFlag()` — 開始フラグをクリアする
- `isTriggerIn(triggers)` — イベントのトリガーが指定リストに含まれるかを確認する
- `start()` — イベントを開始する
- `erase()` — イベントを一時消去する
- `refresh()` — イベントページをリフレッシュする
- `findProperPageIndex()` — 条件を満たす適切なページインデックスを検索する
- `meetsConditions(page)` — ページの出現条件を満たすかを確認する
- `setupPage()` — イベントページをセットアップする
- `clearPageSettings()` — ページ設定をクリアする
- `setupPageSettings()` — ページの設定（画像・移動・トリガー等）を適用する
- `isOriginalPattern()` — 初期パターンかを確認する
- `resetPattern()` — パターンを初期値にリセットする
- `checkEventTriggerTouch(x, y)` — 接触イベントトリガーをチェックする
- `checkEventTriggerAuto()` — 自動実行イベントトリガーをチェックする
- `update()` — 毎フレーム更新する
- `updateParallel()` — 並列処理イベントを更新する
- `locate(x, y)` — 指定座標に配置する
- `forceMoveRoute(moveRoute)` — 移動ルートを強制実行する

### Game_Interpreter

イベントコマンドを実行するインタプリタ

#### インスタンスメソッド
- `initialize(depth)` — 初期化する。depthはコモンイベント呼び出しの深さ
- `checkOverflow()` — コモンイベントの再帰呼び出しが深すぎないかチェックする
- `clear()` — インタプリタの状態をクリアする
- `setup(list, eventId)` — コマンドリストとイベントIDでセットアップする
- `loadImages()` — コマンドで使用する画像を事前読み込みする
- `eventId()` — 実行中のイベントIDを返す
- `isOnCurrentMap()` — 現在のマップ上かを確認する
- `setupReservedCommonEvent()` — 予約されたコモンイベントをセットアップする
- `isRunning()` — コマンド実行中かを確認する
- `update()` — 毎フレーム更新する
- `updateChild()` — 子インタプリタを更新する
- `updateWait()` — ウェイト状態を更新する
- `updateWaitCount()` — ウェイトカウントを更新する
- `updateWaitMode()` — ウェイトモードを更新する
- `setWaitMode(waitMode)` — ウェイトモードを設定する
- `wait(duration)` — 指定フレーム数ウェイトする
- `fadeSpeed()` — フェード速度を返す
- `executeCommand()` — 現在のコマンドを実行する
- `checkFreeze()` — 無限ループをチェックする
- `terminate()` — インタプリタを終了する
- `skipBranch()` — 条件分岐をスキップする
- `currentCommand()` — 現在のコマンドを返す
- `nextEventCode()` — 次のイベントコードを返す
- `iterateActorId(param, callback)` — アクターIDでイテレートする（0=全員）
- `iterateActorEx(param1, param2, callback)` — アクターを固定値または変数で指定してイテレートする
- `iterateActorIndex(param, callback)` — パーティインデックスでイテレートする
- `iterateEnemyIndex(param, callback)` — 敵インデックスでイテレートする
- `iterateBattler(param1, param2, callback)` — バトラーをイテレートする
- `character(param)` — パラメータからキャラクターを取得する（-1=プレイヤー, 0=このイベント）
- `changeHp(target, value, allowDeath)` — 対象のHPを変更する
- `command101(params)` — 文章の表示
- `command102(params)` — 選択肢の表示
- `setupChoices(params)` — 選択肢をセットアップする
- `command402(params)` — 選択肢の分岐[選択時]
- `command403()` — 選択肢の分岐[キャンセル]
- `command103(params)` — 数値入力の処理
- `setupNumInput(params)` — 数値入力をセットアップする
- `command104(params)` — アイテム選択の処理
- `setupItemChoice(params)` — アイテム選択をセットアップする
- `command105(params)` — スクロール文章の表示
- `command108(params)` — 注釈
- `command109()` — 条件分岐（スキップ）
- `command111(params)` — 条件分岐
- `command411()` — 条件分岐[それ以外]
- `command112()` — ループ
- `command413()` — ループの中断（以上繰り返し）
- `command113()` — ループの中断
- `command115()` — イベント処理の中断
- `command117(params)` — コモンイベント呼び出し
- `setupChild(list, eventId)` — 子インタプリタをセットアップする
- `command118()` — ラベル
- `command119(params)` — ラベルジャンプ
- `jumpTo(index)` — 指定インデックスにジャンプする
- `command121(params)` — スイッチの操作
- `command122(params)` — 変数の操作
- `gameDataOperand(type, param1, param2)` — ゲームデータのオペランドを取得する
- `command123(params)` — セルフスイッチの操作
- `command124(params)` — タイマーの操作
- `command125(params)` — 所持金の増減
- `command126(params)` — アイテムの増減
- `command127(params)` — 武器の増減
- `command128(params)` — 防具の増減
- `command129(params)` — メンバーの入れ替え
- `command132(params)` — 戦闘BGMの変更
- `command133(params)` — 勝利MEの変更
- `command134(params)` — セーブの禁止
- `command135(params)` — メニューの禁止
- `command136(params)` — エンカウントの禁止
- `command137(params)` — 並び替えの禁止
- `command138(params)` — ウィンドウカラーの変更
- `command139(params)` — 敗北MEの変更
- `command140(params)` — 乗り物BGMの変更
- `command201(params)` — 場所移動
- `command202(params)` — 乗り物の位置設定
- `command203(params)` — イベントの位置設定
- `command204(params)` — マップのスクロール
- `command205(params)` — 移動ルートの設定
- `command206()` — 乗り物の乗降
- `command211(params)` — 透明状態の変更
- `command212(params)` — アニメーションの表示
- `command213(params)` — フキダシアイコンの表示
- `command214()` — イベントの一時消去
- `command216(params)` — 隊列歩行の変更
- `command217()` — 隊列メンバーの集合
- `command221()` — 画面のフェードアウト
- `command222()` — 画面のフェードイン
- `command223(params)` — 画面の色調変更
- `command224(params)` — 画面のフラッシュ
- `command225(params)` — 画面のシェイク
- `command230(params)` — ウェイト
- `command231(params)` — ピクチャの表示
- `command232(params)` — ピクチャの移動
- `picturePoint(params)` — ピクチャの座標を計算する
- `command233(params)` — ピクチャの回転
- `command234(params)` — ピクチャの色調変更
- `command235(params)` — ピクチャの消去
- `command236(params)` — 天候の設定
- `command241(params)` — BGMの演奏
- `command242(params)` — BGMのフェードアウト
- `command243()` — BGMの保存
- `command244()` — BGMの再開
- `command245(params)` — BGSの演奏
- `command246(params)` — BGSのフェードアウト
- `command249(params)` — MEの演奏
- `command250(params)` — SEの演奏
- `command251()` — SEの停止
- `command261(params)` — ムービーの再生
- `videoFileExt()` — 動画ファイルの拡張子を返す
- `command281(params)` — マップ名表示の変更
- `command282(params)` — タイルセットの変更
- `command283(params)` — 戦闘背景の変更
- `command284(params)` — 遠景の変更
- `command285(params)` — 指定位置の情報取得
- `command301(params)` — 戦闘の処理
- `command601()` — 戦闘の処理[勝った場合]
- `command602()` — 戦闘の処理[逃げた場合]
- `command603()` — 戦闘の処理[負けた場合]
- `command302(params)` — ショップの処理
- `command303(params)` — ショップの処理[商品追加]
- `command311(params)` — HPの増減
- `command312(params)` — MPの増減
- `command326(params)` — TPの増減
- `command313(params)` — ステートの変更
- `command314(params)` — 全回復
- `command315(params)` — 経験値の増減
- `command316(params)` — レベルの増減
- `command317(params)` — 能力値の増減
- `command318(params)` — スキルの増減
- `command319(params)` — 装備の変更
- `command320(params)` — 名前の変更
- `command321(params)` — 職業の変更
- `command322(params)` — アクターの画像変更
- `command323(params)` — 乗り物の画像変更
- `command324(params)` — 二つ名の変更
- `command325(params)` — プロフィールの変更
- `command331(params)` — 敵キャラのHP増減
- `command332(params)` — 敵キャラのMP増減
- `command342(params)` — 敵キャラのTP増減
- `command333(params)` — 敵キャラのステート変更
- `command334(params)` — 敵キャラの全回復
- `command335(params)` — 敵キャラの出現
- `command336(params)` — 敵キャラの変身
- `command337(params)` — 戦闘アニメーションの表示
- `command339(params)` — 戦闘行動の強制
- `command340()` — バトルの中断
- `command351()` — メニュー画面を開く
- `command352()` — セーブ画面を開く
- `command353()` — ゲームオーバー
- `command354()` — タイトル画面に戻す
- `command355()` — スクリプト
- `command356(params)` — プラグインコマンド（V1形式）
- `pluginCommand()` — プラグインコマンドを実行する（旧形式・空実装）
- `command357(params)` — プラグインコマンド（MZ形式）
