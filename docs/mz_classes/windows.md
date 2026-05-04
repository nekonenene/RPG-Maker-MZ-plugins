## Windows

ゲーム内UI用の `Window_*` クラス群

ソースファイル: `rmmz_windows.js`

### Window_Base

ゲーム内の全ウィンドウのスーパークラス

- **継承**: `Window` → **Window_Base**

#### インスタンスメソッド
- `initialize(rect)` — 指定された矩形（Rect）でウィンドウを初期化する
- `destroy(options)` — ウィンドウ内部の要素（コンテンツBitmap等）を破棄する
- `checkRectObject(rect)` — 渡された矩形オブジェクトが有効かチェックする
- `lineHeight()` — ウィンドウ内のテキスト1行の標準の高さ（通常36）を返す
- `itemWidth()` — リスト項目の幅を返す（基本はコンテンツ領域の幅）
- `itemHeight()` — リスト項目の高さを返す（基本は1行の高さ＋余白）
- `itemPadding()` — 項目テキストを描画する際の左右の余白（通常8）を返す
- `baseTextRect()` — テキストを描画可能な基本の矩形領域を返す
- `loadWindowskin()` — ウィンドウスキン画像（system/Window）をロードする
- `updatePadding()` — ウィンドウの枠設定に基づきパディング値（通常12など）を更新する
- `updateBackOpacity()` — ウィンドウ背景の不透明度（通常192）を更新する
- `fittingHeight(numLines)` — 指定した行数がぴったり収まるウィンドウの高さを計算する
- `updateTone()` — ウィンドウスキンの色調（システム設定）を更新する
- `createContents()` — テキストやアイコンを描画するためのコンテンツBitmap（キャンバス）を作成する
- `destroyContents()` — コンテンツBitmapを破棄し、メモリを解放する
- `contentsWidth()` — 描画可能なコンテンツ領域の幅を返す（幅－パディング設定値）
- `contentsHeight()` — 描画可能なコンテンツ領域の高さを返す（高さ－パディング設定値）
- `resetFontSettings()` — フォント名、サイズ、文字色などを初期状態にリセットする
- `resetTextColor()` — 文字色を通常のシステムテキストカラー（白など）にリセットする
- `update()` — 毎フレーム更新（開閉アニメーションなど）を行う
- `updateOpen()` — ウィンドウを開くフェーズ（オープニング）のアニメーションを更新する
- `updateClose()` — ウィンドウを閉じるフェーズ（クロージング）のアニメーションを更新する
- `open()` — ウィンドウを開く（オープニング状態に移行させる）
- `close()` — ウィンドウを閉じる（クロージング状態に移行させる）
- `isOpening()` — ウィンドウが開いている途中（徐々に不透明になっている等）かを確認する
- `isClosing()` — ウィンドウが閉じている途中かを確認する
- `show()` — ウィンドウを表示状態（可視）にする
- `hide()` — ウィンドウを非表示状態にする
- `activate()` — ウィンドウをアクティブ（入力可能）にする
- `deactivate()` — ウィンドウを非アクティブ（入力無効）にする
- `systemColor()` — システムカラー（テキストシステムカラー等）を返す
- `translucentOpacity()` — 半透明状態の不透明度（通常160）を返す
- `changeTextColor(color)` — 描画文字色を指定のカラーへ変更する
- `changeOutlineColor(color)` — 描画文字のアウトライン修飾色を変更する
- `changePaintOpacity(enabled)` — 描画の不透明度を設定する（無効時は半透明など）
- `drawRect(x, y, width, height)` — 指定矩形の塗りつぶし描画（選択背景等）を行う
- `drawText(text, x, y, maxWidth, align)` — テキストを描画する
- `textWidth(text)` — 指定テキストを描画した際のピクセル幅を計算して返す
- `drawTextEx(text, x, y, width)` — 制御文字（\C[1], \I[2]など）を含むテキストを描画する
- `textSizeEx(text)` — 制御文字を解析した後の実際の描画サイズ領域を計算して返す
- `createTextState(text, x, y, width)` — テキスト解析・描画のためのTextStateオブジェクトを生成する
- `processAllText(textState)` — TextStateに基づき、すべての文字・制御文字を順次描画処理する
- `flushTextState(textState)` — TextStateに残った文字列を一気に描画してバッファをクリアする
- `createTextBuffer(rtl)` — 文字を描画前にバッファ・整形するためのTextBufferオブジェクトを生成する
- `convertEscapeCharacters(text)` — テキスト内の制御文字シーケンス（\V[1], \N[2]等）を事前展開する
- `actorName(n)` — 指定された引数のアクター名を返す（\N[n]用）
- `partyMemberName(n)` — パーティ内インデックスのアクター名を返す（\P[n]用）
- `processCharacter(textState)` — テキストの1文字（または1機能）を描画・処理する
- `processControlCharacter(textState, c)` — 各種制御文字（C, I, \{, \} など）を実行処理する
- `processNewLine(textState)` — 改行（\n）時にX座標リセットとY座標加算を行う処理
- `obtainEscapeCode(textState)` — 制御文字のコードアルファベット部分（'C' 等）を取得する
- `obtainEscapeParam(textState)` — 制御文字のパラメータ部分（'[1]' の 1 等）を取得する
- `processEscapeCharacter(code, textState)` — 対象の制御文字コード固有の処理へ分岐する
- `processColorChange(colorIndex)` — \C[n]によるtextColorの変更処理を実行する
- `processDrawIcon(iconIndex, textState)` — \I[n]によるアイコン描画処理を実行し、描画Xを進める
- `makeFontBigger()` — \{ によるフォントサイズ拡大処理
- `makeFontSmaller()` — \} によるフォントサイズ縮小処理
- `calcTextHeight(textState)` — 改行を含むテキスト等で描画に必要なブロック高さを再計算する
- `maxFontSizeInLine(line)` — 現在の行で使われている最大のフォントサイズを取得する
- `drawIcon(iconIndex, x, y)` — IconSetから指定インデックスのアイコン画像を描画する
- `drawItemName(item, x, y, width)` — アイテム・スキル等のアイコンと名前を並べて描画する
- `drawCurrencyValue(value, unit, x, y, width)` — 所持金などの数値と通貨単位を右詰めで描画する
- `setBackgroundType(type)` — 背景のタイプ（0:通常ウィンドウ, 1:暗め, 2:透明）を設定する
- `showBackgroundDimmer()` — 背景タイプが「暗め（Dimmer）」の時の表示をONにする
- `createDimmerSprite()` — 「暗め」背景用の専用グラデーションスプライトを作成する
- `hideBackgroundDimmer()` — 「暗め」背景用のグラデーションを非表示にする
- `updateBackgroundDimmer()` — 「暗め」背景の色調や表示状態を更新する
- `refreshDimmerBitmap()` — ウィンドウサイズ等が変わった際、Dimmer画像を再生成する
- `playCursorSound()` — カーソル移動時の効果音（SE）を再生する
- `playOkSound()` — 決定時の効果音を再生する
- `playBuzzerSound()` — エラー・無効時のブザー効果音を再生する

### Window_Scrollable

スクロール機能を持つウィンドウクラス

- **継承**: `Window` → `Window_Base` → **Window_Scrollable**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `clearScrollStatus()` — 現在のスクロール座標や目標座標をリセットする
- `scrollX()` — 現在のX方向のスクロール量（ピクセル数）を返す
- `scrollY()` — 現在のY方向のスクロール量（ピクセル数）を返す
- `scrollBaseX()` — スクロール計算の基点となるX座標を返す
- `scrollBaseY()` — スクロール計算の基点となるY座標を返す
- `scrollTo(x, y)` — 指定の座標へ即座にスクロール位置を変更する
- `scrollBy(x, y)` — 現在地から相対的にスクロール位置を変更する
- `smoothScrollTo(x, y)` — 指定の座標へ滑らかに（アニメーション付きで）スクロールする
- `smoothScrollBy(x, y)` — 現在地から相対的に滑らかにスクロールする
- `setScrollAccel(x, y)` — 加速度的な一定速度のスクロール（ホイール等）を設定する
- `overallWidth()` — コンテンツ全体の論理的な幅を返す（スクロール限界計算用）
- `overallHeight()` — コンテンツ全体の論理的な高さを返す（スクロール限界計算用）
- `maxScrollX()` — X方向の最大にスクロールできる座標（上限値）を返す
- `maxScrollY()` — Y方向の最大にスクロールできる座標（上限値）を返す
- `scrollBlockWidth()` — 1回の操作（ページ送り等）でスクロールするピクセル幅を返す
- `scrollBlockHeight()` — 1回の操作でスクロールするピクセル高さを返す
- `smoothScrollDown(n)` — 下方向へ `n` ブロック分滑らかにスクロールする
- `smoothScrollUp(n)` — 上方向へ `n` ブロック分滑らかにスクロールする
- `update()` — 滑らかなスクロールの進行や入力受付などを毎フレーム更新する
- `processWheelScroll()` — マウスホイール操作によるスクロールを処理する
- `processTouchScroll()` — フリック/スワイプ等のタッチ操作によるスクロールを処理する
- `isWheelScrollEnabled()` — マウスホイールによるスクロールが有効かを確認する
- `isTouchScrollEnabled()` — タッチスクリーン（フリック等）によるスクロールが有効かを確認する
- `isScrollEnabled()` — スクロール機能自体が現在有効かを確認する
- `isTouchedInsideFrame()` — タッチ時にウィンドウ枠内かを確認する
- `onTouchScrollStart()` — タッチスクロール操作の開始検知時に呼ばれる
- `onTouchScroll()` — タッチスクロール（ドラッグ中）の挙動を処理する
- `onTouchScrollEnd()` — タッチスクロールの操作終了（離す）時に呼ばれる
- `updateSmoothScroll()` — `smoothScrollTo` 等によるアニメーション処理を計算・更新する
- `updateScrollAccel()` — マウスホイール等による慣性/加速スクロールを計算・更新する
- `updateArrows()` — スクロール可能な場合、上下の矢印画像をアクティブ（点滅等）に更新する
- `updateOrigin()` — 現在のスクロール座標をコンテナの表示原点に適用する
- `updateScrollBase(baseX, baseY)` — スクロール変化分を計算してスクロール基点値に加算・更新する
- `paint()` — スクロール時の内部要素などの再描画処理のトリガー

### Window_Selectable

項目選択機能を持つウィンドウクラス

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → **Window_Selectable**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `index()` — 現在カーソルが選択している項目のインデックスを返す
- `cursorFixed()` — カーソルが固定されているか（移動不可か）を確認する
- `setCursorFixed(cursorFixed)` — カーソルの固定状態を設定する
- `cursorAll()` — 全体選択状態（カーソルが全項目に及ぶか）を確認する
- `setCursorAll(cursorAll)` — 全体選択状態を設定する
- `maxCols()` — ウィンドウ内の最大列数を返す
- `maxItems()` — 選択項目の最大数を返す
- `colSpacing()` — 列同士の間隔（ピクセル数）を返す
- `rowSpacing()` — 行同士の間隔（ピクセル数）を返す
- `itemWidth()` — 1つの項目の幅を返す
- `itemHeight()` — 1つの項目の高さを返す
- `contentsHeight()` — 描画可能なコンテンツ領域の全体の高さを返す
- `maxRows()` — 項目全体の行数を計算して返す
- `overallHeight()` — 全行を合わせたコンテンツの全高を返す（スクロール用）
- `activate()` — ウィンドウをアクティブにし、カーソルを一番上などに合わせる
- `deactivate()` — ウィンドウを非アクティブにし、カーソルを消す
- `select(index)` — 指定インデックスの項目を選択状態にし、カーソルを合わせる
- `forceSelect(index)` — スクロール位置の調整なしに指定位置を強制選択する
- `smoothSelect(index)` — 指定インデックスへ滑らかにスクロールしつつ選択する
- `deselect()` — 現在の選択を解除する（インデックスを -1 にする）
- `reselect()` — 前回選択していたインデックスを再度選択状態にする
- `row()` — 現在選択されている項目の行番号を計算して返す
- `topRow()` — 現在画面に表示されている最も上の行番号を計算して返す
- `maxTopRow()` — スクロール可能な最も上の行番号（最大スクロール位置）を返す
- `setTopRow(row)` — 指定行が一番上になるようにスクロール位置を設定する
- `maxPageRows()` — ウィンドウ内に一度に表示可能な最大行数を返す
- `maxPageItems()` — ウィンドウ内に一度に表示可能な最大項目数を返す
- `maxVisibleItems()` — スクロールなしで表示できる最大項目数を返す
- `isHorizontal()` — ウィンドウが横並び（列数が項目数より多い等）の構成かを確認する
- `topIndex()` — 現在画面に表示されている最も左上のインデックスを返す
- `itemRect(index)` — 指定インデックスの描画用矩形領域を計算して返す
- `itemRectWithPadding(index)` — パディングを考慮した項目の矩形領域を返す
- `itemLineRect(index)` — テキストの描画領域（Yセンタリング等考慮）の矩形領域を返す
- `setHelpWindow(helpWindow)` — 項目説明用などに連動するヘルプウィンドウを設定する
- `showHelpWindow()` — 連動するヘルプウィンドウを表示する
- `hideHelpWindow()` — 連動するヘルプウィンドウを非表示にする
- `setHandler(symbol, method)` — 指定したコマンドシンボルの実行時ハンドラを設定する
- `isHandled(symbol)` — 指定シンブルのハンドラが登録済みかを判定する
- `callHandler(symbol)` — 指定シンボルのハンドラを実行する
- `isOpenAndActive()` — ウィンドウが完全に開いており、かつアクティブかを確認する
- `isCursorMovable()` — 現在カーソルが移動可能な状態かを確認する
- `cursorDown(wrap)` — カーソルを1つ下（または次行）へ移動する。ループ(wrap)対応
- `cursorUp(wrap)` — カーソルを1つ上（または前行）へ移動する。ループ(wrap)対応
- `cursorRight(wrap)` — カーソルを1つ右へ移動する。ループ(wrap)対応
- `cursorLeft(wrap)` — カーソルを1つ左へ移動する。ループ(wrap)対応
- `cursorPagedown()` — ページ送り（下）を行う
- `cursorPageup()` — ページ戻し（上）を行う
- `isScrollEnabled()` — マウス等によるスクロール操作が可能かを確認する
- `update()` — 毎フレーム更新し、入力と項目の選択を処理する
- `processCursorMove()` — 入力に応じたカーソル移動処理を実行する
- `processHandling()` — 決定やキャンセルの入力処理を実行する
- `processTouch()` — フリックやタップなどのタッチ・マウスクリック入力を処理する
- `isHoverEnabled()` — マウスホバーによるアイテム選択が有効かを確認する
- `onTouchSelect(trigger)` — タップ・クリックによる項目選択処理を行う
- `onTouchOk()` — タッチ操作での決定処理を行う
- `onTouchCancel()` — タッチ操作でのキャンセル処理を行う（枠外タッチ等）
- `hitIndex()` — タッチされている座標に該当する項目のインデックスを返す
- `hitTest(x, y)` — 指定座標にある項目のインデックスを判定して返す
- `isTouchOkEnabled()` — タッチ操作での決定（現在選択中の項目再タップ等）が有効かを確認する
- `isOkEnabled()` — 決定入力が有効かを確認する
- `isCancelEnabled()` — キャンセル入力が有効かを確認する
- `isOkTriggered()` — 決定ボタンが押されたかを確認する
- `isCancelTriggered()` — キャンセルボタンが押されたかを確認する
- `processOk()` — 決定時の共通処理（音再生、ハンドラの呼び出しなど）を行う
- `callOkHandler()` — 決定時のハンドラメソッドを呼び出す
- `processCancel()` — キャンセル時の共通処理（音再生など）を行う
- `callCancelHandler()` — キャンセル時のハンドラメソッドを呼び出す
- `processPageup()` — PageUp時の入力処理を行う
- `processPagedown()` — PageDown時の入力処理を行う
- `updateInputData()` — 決定等の入力状態をチェックして更新する
- `ensureCursorVisible(smooth)` — カーソルが画面内に収まるようスクロール位置を調整する
- `callUpdateHelp()` — 連動するヘルプウィンドウの更新を実行する
- `updateHelp()` — サブクラス等で実装する、ヘルプテキストの更新処理
- `setHelpWindowItem(item)` — ヘルプウィンドウに指定のアイテム説明を表示させる
- `isCurrentItemEnabled()` — 現在選択中の項目が選択可能（有効）かを確認する
- `drawAllItems()` — ウィンドウ内のすべてのリスト項目を描画する
- `drawItem(/*index*/)` — 指定インデックスの項目を描画する（サブクラス等で実装）
- `clearItem(index)` — 指定インデックスの描画内容をクリアする
- `drawItemBackground(index)` — 選択中の背景（明滅するカーソル背景等）を描画する
- `drawBackgroundRect(rect)` — 指定された矩形に背景色を塗る
- `redrawItem(index)` — 指定インデックスの項目領域をクリアして再描画する
- `redrawCurrentItem()` — 現在選択している項目の領域を再描画する
- `refresh()` — ウィンドウ内容をクリアし、すべての項目を再生成・再描画する
- `paint()` — スクロール時などに内容全体を描画する
- `refreshCursor()` — カーソルの表示位置・矩形を更新する
- `refreshCursorForAll()` — 全体選択時用にカーソル矩形を全体サイズに更新する

### Window_Command

コマンド選択ウィンドウの基底クラス

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Command**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxItems()` — 追加されたコマンドの数を返す
- `clearCommandList()` — コマンドリストをクリアする
- `makeCommandList()` — コマンドのリストを構築する（サブクラス等で実装）
- `commandName(index)` — 指定インデックスのコマンド名（表示名）を返す
- `commandSymbol(index)` — 指定インデックスのコマンドに対応するシンボルを返す
- `isCommandEnabled(index)` — 指定インデックスのコマンドが選択可能かを確認する
- `currentData()` — 現在選択中のコマンド情報（名前・シンボル・拡張データ等）を返す
- `isCurrentItemEnabled()` — 現在選択中のコマンドが実行可能かを確認する
- `currentSymbol()` — 現在選択中のコマンドのシンボルを返す
- `currentExt()` — 現在選択中のコマンドの拡張データ（Ext）を返す
- `findSymbol(symbol)` — 指定シンボルに一致する項目のインデックスを検索して返す
- `selectSymbol(symbol)` — 指定シンボルに一致する項目を選択状態にする
- `findExt(ext)` — 指定拡張データに一致する項目のインデックスを検索して返す
- `selectExt(ext)` — 指定拡張データに一致する項目を選択状態にする
- `drawItem(index)` — 指定インデックスのコマンド名と有効/無効状態を描画する
- `itemTextAlign()` — テキストの描画配置位置（'left', 'center', 'right'）を返す
- `isOkEnabled()` — コマンド決定が有効かを確認する
- `callOkHandler()` — 決定時、シンボルに対応するハンドラを優先して呼び出す
- `refresh()` — コマンドリストを再構築して全体を再描画する

### Window_HorzCommand

横並びコマンド選択ウィンドウの基底クラス

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_HorzCommand**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxCols()` — 同時に表示される列数を返す（基本4）
- `itemTextAlign()` — テキストの描画配置位置を中央揃え（'center'）で返す

### Window_Help

ヘルプテキスト表示用のウィンドウクラス

- **継承**: `Window` → `Window_Base` → **Window_Help**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setText(text)` — ウィンドウに表示するテキストを設定し、更新する
- `clear()` — 表示テキストをクリアしてウィンドウを空にする
- `setItem(item)` — アイテムやスキルなどに設定された説明文をウィンドウに表示する
- `refresh()` — コンテンツをクリアし、現在のテキストを描画し直す

### Window_Gold

所持金表示用のウィンドウクラス

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_Gold**

#### インスタンスメソッド
- `initialize(rect)` — 初期化し、現在の所持金を描画する
- `colSpacing()` — 列の間隔を返す（本クラスでは使用しないが0を返す）
- `refresh()` — ウィンドウ内容をクリアし、現在の所持金文字列を描画し直す
- `value()` — 現在のアクター等の所持金（通常は `$gameParty.gold()`）を返す
- `currencyUnit()` — 設定された通貨の単位（「G」など）を返す
- `open()` — ウィンドウを開き、同時に表示内容を最新の情報にリフレッシュする

### Window_StatusBase

アクターステータス表示ウィンドウのスーパークラス

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_StatusBase**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `loadFaceImages()` — パーティ全員の顔画像（顔グラフィック）を事前ロードする
- `refresh()` — ステータスアイコン等のスプライトを非表示にし、全体を再描画する
- `hideAdditionalSprites()` — 追加のスプライト要素（ステートアイコンなど）を一括非表示にする
- `placeActorName(actor, x, y)` — アクターの名前表示用の `Sprite_Name` を配置する
- `placeStateIcon(actor, x, y)` — ステート異常アイコン表示用の `Sprite_StateIcon` を配置する
- `placeGauge(actor, type, x, y)` — HP・MP等ゲージ用の `Sprite_Gauge` を配置する
- `createInnerSprite(key, spriteClass)` — キャッシュを確認しつつ、内部にスプライトを生成・登録する
- `placeTimeGauge(actor, x, y)` — タイムプログレスバトル用の時間ゲージを配置する
- `placeBasicGauges(actor, x, y)` — HP・MP等の基本的なゲージ類を一括配置する
- `gaugeLineHeight()` — 基本的なゲージを縦に並べる時の1つあたりの行の高さを返す
- `drawActorCharacter(actor, x, y)` — アクターの歩行グラフィックを切り出して描画する
- `drawActorName(actor, x, y, width)` — アクターの名前文字列を直接描画する（スプライト不使用時）
- `drawActorClass(actor, x, y, width)` — アクターの職業名を描画する
- `drawActorNickname(actor, x, y, width)` — アクターの二つ名（ニックネーム）を描画する
- `drawActorLevel(actor, x, y)` — アクターの現在レベル情報（「Lv 10」など）を描画する
- `drawActorIcons(actor, x, y, width)` — 対象ステートの各アイコン画像を直接描画する（スプライト不使用時）
- `drawActorSimpleStatus(actor, x, y)` — 名前、レベル、アイコン、職業、HPMPゲージ等の簡易ステータスを一括描画する
- `actorSlotName(actor, index)` — 指定インデックスの装備スロット名（「武器」「盾」等）を返す

### Window_MenuCommand

メニュー画面のコマンド選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_MenuCommand**


#### 静的メソッド
- `initCommandPosition()` — Command Positionを初期化する

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `makeCommandList()` — メニュー画面に表示するコマンドのリストを追加・構築する
- `addMainCommands()` — メインメニューコマンド（アイテム、スキル、装備、ステータス）を追加する
- `addFormationCommand()` — 並び替え（並び替え）コマンドを追加する
- `addOriginalCommands()` — オリジナルのカスタムコマンド類を追加する（空実装）
- `addOptionsCommand()` — オプション（設定）コマンドを追加する
- `addSaveCommand()` — セーブコマンドを追加する
- `addGameEndCommand()` — ゲーム終了コマンドを追加する
- `needsCommand(name)` — 指定されたコマンドをメニューに表示する設定になっているかを確認する
- `areMainCommandsEnabled()` — メインコマンド（アイテムやスキル等）が使用可能な状態かを確認する
- `isFormationEnabled()` — 並び替えコマンドが使用可能な状態かを確認する
- `isOptionsEnabled()` — オプションコマンドが使用可能な状態かを確認する
- `isSaveEnabled()` — セーブコマンドが使用可能（セーブ許可状態等）かを確認する
- `isGameEndEnabled()` — ゲーム終了コマンドが使用可能かを確認する
- `processOk()` — 決定処理を実行し、`Window_MenuCommand`クラス側に直近の選択位置を記録する
- `selectLast()` — 前回メニューを閉じた時に選択していたコマンドを再選択する

### Window_MenuStatus

メニュー画面のパーティメンバーステータス表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_MenuStatus**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxItems()` — パーティメンバーの人数を返す
- `numVisibleRows()` — 画面内に表示可能な行数（基本4）を返す
- `itemHeight()` — アクター1人分の項目ごとの高さを計算して返す
- `actor(index)` — 指定インデックスの `Game_Actor` オブジェクトを返す
- `drawItem(index)` — 指定インデックスのアクターの画像やステータスを描画する
- `drawPendingItemBackground(index)` — 並び替え中などで選択されている項目の背景を描画する
- `drawItemImage(index)` — 指定インデックスのアクターの顔画像を描画する
- `drawItemStatus(index)` — 指定インデックスのアクターの簡易ステータスを描画する
- `processOk()` — 決定入力を処理し、並び替え機能などを実行する
- `isCurrentItemEnabled()` — 現在選択中のアクター項目が選択可能かを確認する
- `selectLast()` — 前回選択したアクター（インデックス）を再選択する
- `formationMode()` — 現在が「並び替え」モードかを確認する
- `setFormationMode(formationMode)` — 「並び替え」モードのON/OFFを設定する
- `pendingIndex()` — 並び替えで最初に選択して保留中になったインデックスを返す
- `setPendingIndex(index)` — 並び替えで入れ替えるアクターのインデックスを保持する

### Window_MenuActor

アイテム・スキル画面の対象アクター選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → `Window_MenuStatus` → **Window_MenuActor**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `processOk()` — 対象アクターを決定し、アイテム等の使用を実行する
- `selectLast()` — コマンド等で対象となった直近のアクターを再選択する
- `selectForItem(item)` — 選択中のアイテム/スキルが全体対象かなどに応じ、カーソルを変化させて選択する

### Window_ItemCategory

アイテム・ショップ画面のアイテムカテゴリ選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ItemCategory**

#### インスタンスメソッド
- `initialize(rect)` — 初期化し、コマンドリストを作成する
- `maxCols()` — 同時に表示される列数（基本4）を返す
- `update()` — 毎フレーム更新し、連動するアイテムリストウィンドウのカテゴリを更新する
- `makeCommandList()` — 「アイテム」「武器」「防具」「大事なもの」のリストを構築する
- `needsCommand(name)` — 指定カテゴリコマンドをメニューに表示する設定になっているかを確認する
- `setItemWindow(itemWindow)` — 項目のカテゴリを通知するための `Window_ItemList` を設定する
- `needsSelection()` — 表示する際に強制再選択が必要か（アイテムウィンドウ側の更新のため）を判定する

### Window_ItemList

アイテム画面のアイテム選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ItemList**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setCategory(category)` — 表示対象のカテゴリ名（'item', 'weapon', 'armor', 'keyItem'等）を設定する
- `maxCols()` — 表示する項目の列数（基本2）を返す
- `colSpacing()` — 列同士の間隔（基本16）を返す
- `maxItems()` — 現在のリストにあるアイテム数を返す
- `item()` — 現在カーソルが選択中のアイテム（データオブジェクト）を返す
- `itemAt(index)` — 指定インデックスのアイテム（データオブジェクト）を返す
- `isCurrentItemEnabled()` — 現在選択中のアイテムが使用可能か等を確認する
- `includes(item)` — 引数のアイテムが現在のカテゴリに合致するかを確認する
- `needsNumber()` — アイテムの所持個数も描画するかを確認（大事なものなら通常描く等）
- `isEnabled(item)` — 引数のアイテムが現在使用画面で使用可能な状態かを確認する
- `makeItemList()` — パーティの所持品から、カテゴリに合致するアイテムリストを構築する
- `selectLast()` — 前回選択したアイテム（インデックス）を再選択する
- `drawItem(index)` — 指定インデックスのアイテム名と所持数を描画する
- `numberWidth()` — 所持数（「: 15」等）を描画するために確保する幅を返す
- `drawItemNumber(item, x, y, width)` — 所持数の数値を右詰めで描画する
- `updateHelp()` — ヘルプウィンドウに選択中のアイテムの説明文を設定する
- `refresh()` — アイテムリストを再構築してすべて再描画する

### Window_SkillType

スキル画面のスキルタイプ選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_SkillType**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — スキルタイプを表示する対象アクターを設定し再描画する
- `makeCommandList()` — アクターに付与されているすべてのスキルタイプをリストに構築する
- `update()` — 毎フレーム更新し、連動するスキルリスト等に影響を伝播させる
- `setSkillWindow(skillWindow)` — 決定したスキルタイプを通知するための `Window_SkillList` を設定する
- `selectLast()` — 当アクタ–が最後に選択したスキルタイプを再選択する

### Window_SkillStatus

スキル画面のスキル使用者ステータス表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_SkillStatus**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — ステータスを表示するアクターを設定する
- `refresh()` — スプライトをリフレッシュし、簡易ステータス等を描画し直す

### Window_SkillList

スキル画面のスキル選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SkillList**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — スキルリストの表示対象となるアクターを設定する
- `setStypeId(stypeId)` — 表示するスキルタイプリストのIDを設定する
- `maxCols()` — 表示する列数（基本2列）を返す
- `colSpacing()` — 列間のスペース（基本16）を返す
- `maxItems()` — 現在表示すべきスキルの総数を返す
- `item()` — 現在選択中のスキルオブジェクトを返す
- `itemAt(index)` — 指定インデックスのスキルオブジェクトを返す
- `isCurrentItemEnabled()` — 現在選択中のスキルが使用可能か（MP等足りるか）確認する
- `includes(item)` — 対象スキルが設定されたスキルタイプIDに一致するか確認する
- `isEnabled(item)` — 対象スキルがアクターにとって現在使用可能かを確認する
- `makeItemList()` — アクターが覚えているスキルの中から、合致するもののリストを構築する
- `selectLast()` — 当アクターが前回選択していたスキルを再選択する
- `drawItem(index)` — 指定インデクスのスキルのアイコン、名前、消費コストを描画する
- `costWidth()` — MP/TP消費などの描画に必要な幅を計算して返す
- `drawSkillCost(skill, x, y, width)` — スキルの消費MPや消費TPの数値を右詰めで別に分けて描画する
- `updateHelp()` — ヘルプウィンドウに選択中のスキルの説明文を設定する
- `refresh()` — スキルリストを再構築して全体を再描画する

### Window_EquipStatus

装備画面のパラメータ変化表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipStatus**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — 現在の装備ステータスを表示するアクターを設定する
- `colSpacing()` — 情報描画列の間隔（未使用）を返す
- `refresh()` — アクター名や基本パラメータ6種を一旦すべて描画し直す
- `setTempActor(tempActor)` — 新しい装備を装着した場合の予測用アクター（コピー）を設定する
- `drawAllParams()` — HP/MPを除く6つの能力値パラメータすべてを描画するループ処理
- `drawItem(x, y, paramId)` — 指定位置に1行分のパラメータ（名前・現在値・矢印・新値）を描画する
- `drawParamName(x, y, paramId)` — パラメータのシステム名（「攻撃力」など）を描画する
- `drawCurrentParam(x, y, paramId)` — 現在のアクターのパラメータ数値を描画する
- `drawRightArrow(x, y)` — 変化を示す「→」の文字を描画する
- `drawNewParam(x, y, paramId)` — 選択中の装備をプレビュー装着した際の新しいパラメータ数値を描画する
- `rightArrowWidth()` — 矢印文字「→」を描画するための確保幅を返す
- `paramWidth()` — パラメータ数値を描画するための確保幅を計算して返す
- `paramX()` — パラメータ名や数値を描画する基準となるX座標を返す
- `paramY(index)` — 描画行(インデックス)に基づくY座標を計算して返す

### Window_EquipCommand

装備画面のコマンド選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_EquipCommand**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxCols()` — 同時に表示される列数（基本3）を返す
- `makeCommandList()` — 「装備」「最強装備」「全て外す」のコマンドリストを構築する

### Window_EquipSlot

装備画面の装備スロット選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_EquipSlot**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — 装備スロットを表示するアクターを設定する
- `update()` — 毎フレーム更新し、連動するアイテムリストウィンドウ等の表示を更新する
- `maxItems()` — 現在のアクターにおける装備スロットの種類数を返す
- `item()` — 現在カーソルがあるスロットに装着されている装備品アイテムを返す
- `itemAt(index)` — 指定インデックスのスロットに装着されている装備品アイテムを返す
- `drawItem(index)` — スロット名（「武器」等）と装着中の品名を描画する
- `slotNameWidth()` — スロット名の表示用に確保する幅を返す
- `isEnabled(index)` — 該当スロットの装備が変更可能か（「装備固定」等でないか）を確認する
- `isCurrentItemEnabled()` — 現在選択中のスロットの装備が変更可能かを確認する
- `setStatusWindow(statusWindow)` — 装備変更時のプレビューを行うための `Window_EquipStatus` を設定する
- `setItemWindow(itemWindow)` — 着脱可能な装備リストを表示する `Window_EquipItem` を設定する
- `updateHelp()` — 選択している装備品の説明をヘルプウィンドウに表示・更新する

### Window_EquipItem

装備画面の装備品選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EquipItem**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxCols()` — 同時に並べる列数（基本1行1列）を返す
- `colSpacing()` — 列の間隔（基本8）を返す
- `setActor(actor)` — 装備を着脱する対象アクターを設定する
- `setSlotId(slotId)` — 現在リストアップ対象となる装備スロットIDを設定する
- `includes(item)` — アイテムが選択スロットに適した装備品かを確認する
- `etypeId()` — 選択中スロットの装備タイプID（1：武器、2：盾など）を返す
- `isEnabled(/*item*/)` — 装備候補として常に有効かを返す（通常true）
- `selectLast()` — （未使用）親リスト機能だが今回はオーバーライドされない挙動
- `setStatusWindow(statusWindow)` — 対象アイテムにカーソルを合わせたときプレビュー数値を描画する先のウィンドウを設定する
- `updateHelp()` — 指定しているアイテムの説明、およびステータスウィンドウにプレビューアクター情報を送る
- `playOkSound()` — （自身ではなく親のシーン等で鳴らすため）ここでの決定音再生は抑止する

### Window_Status

ステータス画面の詳細ステータス表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_Status**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — ステータス画面に表示する詳細アクターを設定する
- `refresh()` — ウィンドウ内容をクリアし、設定されたアクターの情報を再描画する
- `drawBlock1()` — ブロック1（名前や職業、レベル等の基本情報）の領域を描画する
- `block1Y()` — ブロック1を描画するY座標を返す
- `drawBlock2()` — ブロック2（歩行グラフィック等の情報ブロック）の領域を描画する
- `block2Y()` — ブロック2を描画するY座標を返す
- `drawBasicInfo(x, y)` — アクターの基本情報（HP/MP等簡易ステータス）を描画する
- `drawExpInfo(x, y)` — 経験値情報（現在のEXPと次のレベルまでのEXP）を描画する
- `expTotalValue()` — アクターの現在の総獲得経験値をテキスト形式で返す
- `expNextValue()` — アクターが次のレベルになるために必要な経験値をテキスト形式で返す

### Window_StatusParams

ステータス画面のパラメータ表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusParams**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — パラメータを表示する対象アクターを設定する
- `maxItems()` — 表示するパラメータの項目数（通常6）を返す
- `itemHeight()` — 1つのパラメータを描画する行の高さを返す
- `drawItem(index)` — 指定インデックスの基本パラメータ（攻撃力、防御力等）の名前と数値を描画する
- `drawItemBackground(/*index*/)` — ステータス画面では選択がないため、背景描画をスキップするよう上書きする

### Window_StatusEquip

ステータス画面の装備品表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_StatusEquip**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setActor(actor)` — 装備情報を表示する対象アクターを設定する
- `maxItems()` — 現在のアクターにおける装備スロットの最大数を返す
- `itemHeight()` — 1つの装備品情報を描画する行の高さを返す
- `drawItem(index)` — 指定インデックスのスロット名と現在装備しているアイテムを描画する
- `drawItemBackground(/*index*/)` — 背景描画処理をスキップする（選択カーソル等を描かないため）

### Window_Options

オプション画面の設定変更ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_Options**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `makeCommandList()` — 一般設定と音量設定のオプション項目リストを構築する
- `addGeneralOptions()` — 常時ダッシュやコマンド記憶といった一般設定の項目を追加する
- `addVolumeOptions()` — BGM、BGS、ME、SEの音量設定項目を追加する
- `drawItem(index)` — 各オプションの名称とその現在の設定状態（ON/OFFや数値）を描画する
- `statusWidth()` — 設定状態テキスト部（右寄せ部分）を描画するために確保する幅を返す
- `statusText(index)` — 指定オプション項目の現在の設定状態をテキスト（「ON」「100%」等）で取得する
- `isVolumeSymbol(symbol)` — 対象のシンボルが音量設定項目か（'bgmVolume'等）を確認する
- `booleanStatusText(value)` — 真偽値の項目について「ON」または「OFF」のテキストを返す
- `volumeStatusText(value)` — 音量の項目について「100%」のようなテキストを返す
- `processOk()` — 決定ボタンが押された時の処理（ON/OFF切り替えや音量プラス）を実行する
- `cursorRight()` — 各項目の値を増やしたり、ONにしたりする
- `cursorLeft()` — 各項目の値を減らしたり、OFFにしたりする
- `changeVolume(symbol, forward, wrap)` — テキスト選択に基づき、対象音量の設定値を増減する
- `volumeOffset()` — 1回の音量変更ボタン操作で増減する1ステップ量（通常20）を返す
- `changeValue(symbol, value)` — 対象オプションの設定値を直接書き換え、保存・反映し、再描画する
- `getConfigValue(symbol)` — `ConfigManager` から現在のオプション設定値を取得する
- `setConfigValue(symbol, volume)` — `ConfigManager` に設定値を保存し、反映する

### Window_SavefileList

セーブ・ロード画面のセーブファイル選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_SavefileList**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setMode(mode, autosave)` — 動作モード（'save' または 'load'）とオートセーブ表示の有無を設定する
- `maxItems()` — 用意されるセーブファイル枠の最大数を返す
- `numVisibleRows()` — 一画面に表示できるセーブファイル枠の数を返す
- `itemHeight()` — セーブファイル枠1つ分の描画領域の高さを返す
- `drawItem(index)` — セーブデータ枠を描画する
- `indexToSavefileId(index)` — 表示リスト内のインデックスに対応する実際のセーブファイルIDを返す
- `savefileIdToIndex(savefileId)` — 実際のセーブファイルIDからリスト内のインデックスを特定する
- `isEnabled(savefileId)` — 対象セーブファイルがロード機能で読み込めるか（セーブデータが存在するか）等を確認する
- `savefileId()` — 現在選択されているセーブファイルのIDを返す
- `selectSavefile(savefileId)` — 指定されたセーブファイルIDにカーソルを合わせる
- `drawTitle(savefileId, x, y)` — 「ファイル1」や「オートセーブ」などのタイトル表記を描画する
- `drawContents(info, rect)` — タイトル以外のセーブデータ情報詳細（プレイ時間やパーティなど）を描画する
- `drawPartyCharacters(info, x, y)` — サムネイルとして保存されたパーティメンバーの歩行グラフィックを描画する
- `drawPlaytime(info, x, y, width)` — 保存されているプレイ時間（HH:MM:SS等）を描画する
- `playOkSound()` — 「セーブ」実行時と「ロード」実行時の音を分けてここで鳴らすため、標準の決定音を鳴らさないカスタマイズをする

### Window_ShopCommand

ショップ画面の売買選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → `Window_HorzCommand` → **Window_ShopCommand**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setPurchaseOnly(purchaseOnly)` — 買い取りのみ（売却禁止）かどうかのフラグを設定する
- `maxCols()` — 同時に表示されるコマンドの数（基本3）を返す
- `makeCommandList()` — 「購入する」「売却する」「やめる」等のコマンドリストを構築する

### Window_ShopBuy

ショップ画面の購入アイテム選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopBuy**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setupGoods(shopGoods)` — イベント等で設定されたショップの商品リスト（配列）を受け取りセットアップする
- `maxItems()` — 現在の商品リストにあるアイテムの総数を返す
- `item()` — 現在選択している商品のデータベースアイテム（無ければnull）を返す
- `itemAt(index)` — 指定インデックスの表すデータベースアイテムを返す
- `setMoney(money)` — 所持金を表示価格の文字色評価などに使うため設定する
- `isCurrentItemEnabled()` — 選択している商品が購入可能（所持金が足りている等）かを確認する
- `price(item)` — 引数アイテムのショップにおける販売価格を返す
- `isEnabled(item)` — 引数アイテムが購入可能か（所持金条件や最大所持数等）を確認する
- `refresh()` — リストを再構築し、全商品を再描画する
- `makeItemList()` — イベントのショップ商品データから、実際のデータベースのアイテム・武器・防具リストへと変換・構築する
- `goodsToItem(goods)` — ショップの単一の商品情報配列(id, 種別など)から実際のデータベース項目のオブジェクトを特定する
- `drawItem(index)` — 指定インデックスの商品のアイコン、名前、価格を描画する
- `priceWidth()` — 購入価格の描画用に確保する幅（基本96）を返す
- `setStatusWindow(statusWindow)` — プレイヤーの現在の所持状況や装備比較情報を更新するための `Window_ShopStatus` を紐付ける
- `updateHelp()` — 選択した商品の詳細な説明文をヘルプウィンドウ側に更新する

### Window_ShopSell

ショップ画面の売却アイテム選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_ShopSell**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `isEnabled(item)` — 対象アイテムが売却可能（価格が0より大きい等）かを確認する

### Window_ShopNumber

ショップ画面の売買個数入力ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_ShopNumber**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `isScrollEnabled()` — マウススクロール操作が（ここでは個数変更として）機能するか確認する
- `number()` — 現在入力中の個数を返す
- `setup(item, max, price)` — 個数決定対象のアイテム、最大入力個数、および単価をセットアップする
- `setCurrencyUnit(currencyUnit)` — 合計額表示で用いる通貨単位（「G」等）を設定する
- `createButtons()` — 入力補佐用のプラスマイナスボタン（タッチUI用）のスプライトを生成する
- `placeButtons()` — 生成したボタン群をウィンドウの適切な位置に配置・整列する
- `totalButtonWidth()` — 配置したボタン領域全体の幅を確保するために返す
- `buttonSpacing()` — ボタン同士の間隔ピクセル幅を返す
- `refresh()` — 表示するアイテム名と個数、合計価格の表示を描画・更新する
- `drawCurrentItemName()` — 選択中のアイテムアイコンや名称を描画する
- `drawMultiplicationSign()` — 掛け算の記号（乗算記号：×など）を描画する
- `multiplicationSign()` — 描画に使用する乗算記号の文字（初期設定は '×'）を返す
- `multiplicationSignX()` — 乗算記号を描画するX座標を返す
- `drawNumber()` — 現在選択されている個数の数値を描画する
- `drawHorzLine()` — 表示項目名と合計金額の間に区切り線を描画する
- `drawTotalPrice()` — 個数×単価の合計金額を指定された書式で描画する
- `itemNameY()` — アイテム名を表記する基本のY座標を返す
- `totalPriceY()` — 合計金額表示欄のY座標を返す
- `buttonY()` — タッチ操作用ボタンを配置するY座標を返す
- `cursorWidth()` — 選択中の個数を装飾する点滅カーソルの幅を返す
- `cursorX()` — カーソルおよび個数を描画する基準X枠を返す
- `maxDigits()` — 最大入力個数の桁数（99なら2桁など）を返す
- `update()` — 毎フレーム更新し、ボタンのスクロール操作等による数変動を処理する
- `playOkSound()` — 個数確定の決定時にはここでは鳴らさないため処理をオーバーライドしている
- `processNumberChange()` — 左右キーなどに応じて入力個数を加算・減算し、音を鳴らす処理を呼ぶ
- `changeNumber(amount)` — 入力個数を与えられた量だけ増減（上下限の範囲内）させ、画面を更新する
- `itemRect()` — カーソルの枠表示などのために使用される架空の1項目の描画範囲を返す
- `isTouchOkEnabled()` — 画面タッチでの確定操作が有効かを確認する
- `onButtonUp()` — タッチUIの「+1」ボタンが押下・クリックされた時の処理
- `onButtonUp2()` — タッチUIの「+10(PageUp)」ボタンが押下・クリックされた時の処理
- `onButtonDown()` — タッチUIの「-1」ボタンが押下・クリックされた時の処理
- `onButtonDown2()` — タッチUIの「-10(PageDown)」ボタンが押下・クリックされた時の処理
- `onButtonOk()` — タッチUIの「決定」ボタンが押下・クリックされた時の処理

### Window_ShopStatus

ショップ画面の所持数・アクター装備状況表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_ShopStatus**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `refresh()` — 表示内容をクリアし、現在の対象アイテムの詳細情報を描画・更新する
- `setItem(item)` — 状況を表示する対象アイテム（武器や防具など）を設定する
- `isEquipItem()` — 対象アイテムが装備品（武器・防具）かを確認する
- `drawPossession(x, y)` — 「所持数: N」のテキストを描画する
- `drawEquipInfo(x, y)` — 対象が装備品の場合、アクターの「装備しているか」や「能力変化」を描画する
- `statusMembers()` — 装備状況を比較・表示する対象となるアクターの配列を返す
- `pageSize()` — 一画面（1ページ）に表示できるアクターの人数（基本4）を返す
- `maxPages()` — アクター全員の情報を表示するために必要なページ数を計算して返す
- `drawActorEquipInfo(x, y, actor)` — 指定アクターがそのアイテムを装備可能か、及び装備した際の能力変化を描画する
- `paramId()` — 対象アイテムの能力変化や比較に使用する基本パラメータIDを返す
- `currentEquippedItem(actor, etypeId)` — 対象アクターが現在装備している、同種のスロットのアイテムを返す
- `update()` — 毎フレーム更新し、ページ切り替え（アクター送り）操作を受け付ける
- `updatePage()` — ページ切り替えの入力を監視し、必要ならページを変更する
- `isPageChangeEnabled()` — アクターが多く、ページ送りが可能であるかを確認する
- `isPageChangeRequested()` — Shiftキーやタッチボタン等でページ変更の入力があったかを確認する
- `changePage()` — 次のページを表示し、ウィンドウを再描画して音を鳴らす

### Window_NameEdit

名前入力画面のアクター名編集ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_NameEdit**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setup(actor, maxLength)` — 名前変更対象のアクターと、入力可能な最大文字数を設定する
- `name()` — 現在編集中の名前テキストを返す
- `restoreDefault()` — 編集中に入力をすべて消し、アクターのデフォルト名に戻す
- `add(ch)` — 引数で受け取った1文字を現在の名前に末尾追加する
- `back()` — 現在の名前から末尾の1文字を削除する
- `faceWidth()` — アクターの顔画像（フェイス）を描画するための幅（144）を返す
- `charWidth()` — 名前1文字分を描画するために確保する幅を返す
- `left()` — 名前テキストの描画を開始するX座標（顔画像の右側）を返す
- `itemRect(index)` — 指定インデックスの文字を描画・編集する枠矩形を計算して返す
- `underlineRect(index)` — 指定文字の下線の描画矩形を計算して返す
- `underlineColor()` — 入力文字の位置を示す下線の色（CSS色文字列）を返す
- `drawUnderline(index)` — 指定インデックスの文字位置に下線を描画する
- `drawChar(index)` — 指定インデックスに入力済みの文字を描画する
- `refresh()` — 全体をクリアして顔画像、名前一覧、下線を再描画する

### Window_NameInput

名前入力画面の文字選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NameInput**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setEditWindow(editWindow)` — 入力結果を反映させるための文字編集用ウィンドウ（`Window_NameEdit`）を設定する
- `table()` — 現在表示中（ひらがな、カタカナ、英語など）の文字パレット用二次元配列を返す
- `maxCols()` — 文字パレットの列数（通常10）を返す
- `maxItems()` — 文字パレットの全入力パネル数（通常90）を返す
- `itemWidth()` — 文字1つ分の選択枠の幅（基本的に一律42ピクセル）を返す
- `groupSpacing()` — 文字パレット間の区切りスペースを返す
- `character()` — 現在カーソルが選択中のパレットにある文字を返す
- `isPageChange()` — 現在カーソルがページ切り替え（ひらがな⇔カタカナ等）の特別ボタンにあるか確認する
- `isOk()` — 現在カーソルが決定（OK）の特別ボタンにあるか確認する
- `itemRect(index)` — 指定インデックス（パレット項目の位置）の矩形枠を返す
- `drawItem(index)` — 指定インデックスに該当する文字（または表示）を描画する
- `updateCursor()` — 現在のパレットインデックスに合わせてカーソルの描画位置を更新する
- `isCursorMovable()` — 現在カーソルが移動可能かを確認する（常にtrue）
- `cursorDown(wrap)` — カーソルを下に移動する。上下ルーピング等も考慮する
- `cursorUp(wrap)` — カーソルを上に移動する
- `cursorRight(wrap)` — カーソルを右に移動する
- `cursorLeft(wrap)` — カーソルを左に移動する
- `cursorPagedown()` — PageDownキー（ページ切り替え）の操作を行う
- `cursorPageup()` — PageUpキーによるページ切り替え操作を行う
- `processCursorMove()` — 入力に応じたカーソル移動とページ切り替えを処理する
- `processHandling()` — 決定音とともに文字入力・決定を実行したりキャンセルを処理する
- `isCancelEnabled()` — キャンセル操作（文字を消す）が可能状態か確認する
- `processCancel()` — キャンセルボタン（1文字消去）の処理を行う
- `processJump()` — どの位置からでも瞬時に「決定」ボタンへカーソルを飛ばす
- `processBack()` — 文字消去（Backspace・キャンセル）の操作処理
- `processOk()` — カーソル上の文字を追加、ページ変更、または名前決定を行う
- `onNameAdd()` — 文字追加時の共通処理（音を鳴らし、編集ウィンドウに追加を命令）
- `onNameOk()` — 名前決定時の共通処理

### Window_NameBox

メッセージウィンドウ上部の話者名表示ウィンドウ

- **継承**: `Window` → `Window_Base` → **Window_NameBox**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `setMessageWindow(messageWindow)` — 本ウィンドウの表示に連動するメッセージウィンドウを設定する
- `setName(name)` — 表示する話者の名前を設定し、変更があれば再描画する
- `clear()` — 表示中の名前をクリアする
- `start()` — 表示を開始し、ウィンドウサイズ調整とリフレッシュを行い、ウィンドウを開く
- `updatePlacement()` — 紐付けられたメッセージウィンドウの位置に従い、表示座標や相対位置を更新する
- `updateBackground()` — メッセージウィンドウの背景タイプ（通常/暗く/透明）に合わせて自身の背景を同期する
- `windowWidth()` — 設定された名前テキストの長さに応じて、ウィンドウの最適な幅を計算して返す
- `windowHeight()` — ウィンドウの高さを返す
- `refresh()` — 名前テキストを描画（制御文字による色の反映など）して更新する

### Window_ChoiceList

イベントコマンド「選択肢の表示」用のウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ChoiceList**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `setMessageWindow(messageWindow)` — 紐付くメインのメッセージウィンドウ（表示タイミング等用）を設定する
- `createCancelButton()` — タッチUI用のキャンセルボタン（閉じるボタン）スプライトを生成する
- `start()` — 選択肢の表示を開始し、位置やリストを初期化してウィンドウを開く
- `update()` — 毎フレーム更新し、メッセージ表示中等のウェイト制御、キャンセルボタン等の処理を行う
- `updateCancelButton()` — タッチ用キャンセルボタンの可視性や位置を更新する
- `selectDefault()` — イベントコマンドで設定されているデフォルトの選択肢へカーソルを合わせる
- `updatePlacement()` — 選択時の位置設定やメッセージウィンドウの位置から自身の表示座標を更新する
- `updateBackground()` — メッセージウィンドウの背景設定に合わせて自身の背景を合わせる
- `placeCancelButton()` — キャンセルボタンの表示座標をウィンドウ右上などの適切な位置に配置する
- `windowX()` — 指定された表示ポジションに基づいてX座標を計算して返す
- `windowY()` — Y座標を計算し、メッセージウィンドウに重ならないようにする
- `windowWidth()` — 選択肢テキストの最大幅に基づいてウィンドウサイズを計算して返す
- `windowHeight()` — 選択肢の数とキャンセルボタンをふまえたウィンドウの高さを返す
- `numVisibleRows()` — 画面内に表示可能な選択肢の行数（全項目数と最大行数の小さい方）を返す
- `maxLines()` — リストとして一度に表示できる最大行数（基本は設定上の最大数など）を返す
- `maxChoiceWidth()` — 各選択肢テキスト＋アイコン等の幅を計算し、その最大幅を返す
- `makeCommandList()` — イベントコマンドから受け取った文字列候補を使って選択肢リストを構築する
- `drawItem(index)` — 指定インデックスの選択肢を描画し、制御文字の変換等を行う
- `isCancelEnabled()` — イベント設定でキャンセルが許可されているか確認する
- `needsCancelButton()` — タッチUI用キャンセルボタンの表示が必要かを確認する
- `callOkHandler()` — 決定された選択肢番号をイベントインタプリタへ通知するコールバック
- `callCancelHandler()` — キャンセル時に設定されたキャンセル番号をイベントインタプリタへ通知するコールバック

### Window_NumberInput

イベントコマンド「数値入力の処理」用のウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_NumberInput**

#### インスタンスメソッド
- `initialize()` — 初期化する
- `setMessageWindow(messageWindow)` — 連動するテキストメッセージウィンドウを設定する
- `start()` — 変数と桁数を初期化し、ウィンドウ位置を合わせて表示を開始する
- `updatePlacement()` — メッセージウィンドウの位置に合わせて、自身の座標（中央配置など）を更新する
- `windowWidth()` — 入力する桁数やボタンサイズに合わせて最適なウィンドウ幅を計算する
- `windowHeight()` — 決定された桁数やボタン配置スペースに従って高さを返す
- `maxCols()` — 入力する数値の桁数をそのまま列数として返す
- `maxItems()` — 入力する数値の桁数を項目数として返す
- `itemWidth()` — 1桁の数値を描画するための幅（余白と文字幅）を計算して返す
- `itemRect(index)` — 指定された各桁の描画またはタップ判定用の領域枠を返す
- `isScrollEnabled()` — マウススクロール等による数値変更が可能か確認する（基本false）
- `isHoverEnabled()` — マウスホバーでカーソル列（桁）を移動できるかを確認する（基本false）
- `createButtons()` — 桁ごとの数値増減用と決定用のタッチボタン群を生成する
- `placeButtons()` — 生成したタッチボタン群の配置座標をウィンドウ下部などに設定する
- `totalButtonWidth()` — 配置する全ボタンの合計幅を計算する
- `buttonSpacing()` — ボタン間に空ける間隔幅を返す
- `buttonY()` — ボタンの表示Y座標（一番下部）を計算して返す
- `update()` — 毎フレーム更新し、桁ごとの数値変更操作等を処理する
- `processDigitChange()` — 上下キーの入力に応じて選択中の桁の数値を増減させる
- `changeDigit(up)` — 選択桁の数値を1増減し、0〜9でループするように処理する
- `isTouchOkEnabled()` — タッチによる「OK(決定)」操作が可能かを確認する
- `isOkEnabled()` — 確定ボタン押下が有効か（常に有効）を確認する
- `isCancelEnabled()` — キャンセル操作が有効かを返す（数値入力では基本false）
- `processOk()` — 決定操作時に結果をゲーム変数に代入し、ウィンドウを閉じて終了する
- `drawItem(index)` — 指定されたインデックス（桁）の現在の数値を描画する
- `onButtonUp()` — タッチボタン「上矢印」押下時に現在の桁を＋1するコールバック
- `onButtonDown()` — タッチボタン「下矢印」押下時に現在の桁を－1するコールバック
- `onButtonOk()` — タッチボタン「決定」押下時に確定処理を呼ぶコールバック

### Window_EventItem

イベントコマンド「アイテム選択の処理」用のウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_EventItem**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setMessageWindow(messageWindow)` — 連動するテキストメッセージウィンドウを設定する
- `createCancelButton()` — タッチUI用のキャンセルボタンのスプライトを生成する
- `start()` — 項目リストの最新化とカーソルリセットを行い、ウィンドウ表示を開始する
- `update()` — 毎フレーム更新し、キャンセルボタン等の表示可視性も制御する
- `updateCancelButton()` — メッセージ等が表示されていない場合だけキャンセルボタンを有効にする
- `updatePlacement()` — メッセージウィンドウの構成に合わせてウィンドウの配置Y座標を決定する
- `placeCancelButton()` — タッチ用キャンセルボタンの表示領域・座標を配置する
- `includes(item)` — 引数のアイテムが、イベント設定されたカテゴリ（「大事なもの」等）に合致するか判定する
- `needsNumber()` — リストでのアイテム所持数描画が必要かどうか確認する（通常表示）
- `isEnabled(/*item*/)` — 選択可能か。常にtrueを返す（条件合致したアイテム全て選択可能）
- `onOk()` — アイテム決定時に対象のIDをゲーム変数へ保存し、イベントインタプリタに通知する
- `onCancel()` — キャンセル時にゲーム変数「0」を保存し、イベントインタプリタに通知する

### Window_Message

テキストメッセージ表示用のウィンドウ

- **継承**: `Window` → `Window_Base` → **Window_Message**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `initMembers()` — 内部管理フラグ（テキスト状態、表示中フラグなど）を初期化する
- `setGoldWindow(goldWindow)` — 連動する所持金ウィンドウを設定し、イベントコマンドで連携表示可能にする
- `setNameBoxWindow(nameBoxWindow)` — 話者名を表示するための `Window_NameBox` を設定する
- `setChoiceListWindow(choiceListWindow)` — 選択肢表示用の `Window_ChoiceList` を連携させる
- `setNumberInputWindow(numberInputWindow)` — 数値入力用の `Window_NumberInput` を連携させる
- `setEventItemWindow(eventItemWindow)` — アイテム選択用の `Window_EventItem` を連携させる
- `clearFlags()` — 指定待機フラグや高速表示フラグなど、メッセージ表示用の一時状態を初期化する
- `update()` — 毎フレーム更新し、文字送りやサブウィンドウとの調停を実行する
- `checkToNotClose()` — メッセージの終了時でも顔画像や名前が連続する場合、閉じないか判定する
- `synchronizeNameBox()` — 名前表示ウィンドウ設定などを同期更新する
- `canStart()` — 表示中でない場合など、次のメッセージを開始できる状況か判定する
- `startMessage()` — テキスト情報を準備し、顔画像を描き、最初の文字処理を開始する
- `newLineX(textState)` — 新しい行へ続く場合の改行後X座標（顔画像がある場合は右に寄せる等）を計算する
- `updatePlacement()` — コマンド設定の位置（上・中・下）に合わせて適切なY座標に自らを配置する
- `updateBackground()` — 背景パターン（通常・暗く・透明）に合わせて装飾描画などを更新する
- `terminateMessage()` — メッセージの表示をすべて終了させ、サブウィンドウ類を閉じる
- `updateWait()` — 制御文字（\.\|等）による特定フレーム数の一時停止カウントを消費・管理する
- `cancelWait()` — 早送り操作等でテキストが強制表示される際に一時停止状態を無効化する
- `updateLoading()` — 顔画像画像などの非同期ロードを待機している状態の処理を行う
- `updateInput()` — クリックや決定キー入力によるページ送り、待機停止解除等の処理を行う
- `isAnySubWindowActive()` — 選択肢や数値入力などの連動ウィンドウのいずれかが開いているか確認する
- `updateMessage()` — 1文字ずつテキスト描画を進行させ、制御処理等を挟みつつループ更新を管理する
- `shouldBreakHere(textState)` — ワードラップ等のため現在の描画位置で改行、または1フレーム進行を区切る（Break）べきか判定する
- `canBreakHere(textState)` — 基本的に日本語ではfalse。欧文等で空白時に単語折り返し可能かを判定する
- `onEndOfText()` — 表示中の文章全体の描画が終わった際の処理（入力待ちや次のイベント呼び出し移行）を行う
- `startInput()` — メッセージ表示完了後に連動する選択肢や数値入力を起動させる合図の処理
- `isTriggered()` — 決定ボタンやマウスクリック等、次へ進む操作がフレーム内で実行されたかを確認する
- `doesContinue()` — 次のイベントコマンドも「文章の表示」など連続表示されるコマンドか確認する
- `areSettingsChanged()` — 連続する文章で、顔画像や背景設定に変更が入っているか確認する
- `updateShowFast()` — 決定キー等の長押しによる「高速文字送り（Show Fast）」フラグを更新する
- `newPage(textState)` — テキストの描画ページを切り替え、描画内容をクリアし位置をリセットする
- `updateSpeakerName()` — 制御文字で名前の指定があれば、名前ウィンドウに反映更新する
- `loadMessageFace()` — 使われる顔画像データ（ファイルと番号）に応じて事前にBitmapをロードする
- `drawMessageFace()` — テキストで指定された顔画像（フェイスグラフィック）を左側の専用領域へ描画する
- `processControlCharacter(textState, c)` — テキスト中の制御文字（色変更、ウェイトなど）の処理を実行する
- `processNewLine(textState)` — テキストの改行文字を処理し、描画の行(Y)を一つ下げる
- `processNewPage(textState)` — テキスト中に特殊な「ページ改行」がある場合、次のページ処理の準備をする
- `isEndOfText(textState)` — テキストの全文字を描画し終えてインデックスが末尾に達したか確認する
- `needsNewPage(textState)` — 次の文字を描画するにはX/Y座標的に次のページ領域が必要か確認する
- `processEscapeCharacter(code, textState)` — メッセージ固有の追加制御文字（\C等）をオーバーライドして実行する
- `startWait(count)` — 制御文字（\.\|）指定されたフレーム数だけ文字送り進行を停止（ウェイト）させる
- `startPause()` — テキストの画面入力待ちアイコン（ポーズサイン）を表示させ決定を待つ
- `isWaiting()` — メッセージウェイト中、もしくはフェードやサブウィンドウ等の結果待ち等で待機中かを確認する

### Window_ScrollText

スクロールテキスト表示用のウィンドウ。枠なし

- **継承**: `Window` → `Window_Base` → **Window_ScrollText**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `update()` — 毎フレーム更新し、テキストのスクロールを進行させる
- `startMessage()` — スクロールテキストの表示を開始する
- `refresh()` — 全体をクリアし、テキスト内容を描画し直す
- `updatePlacement()` — ウィンドウの表示位置（常に画面全体等）を更新する
- `contentsHeight()` — スクロールすべき全テキストの高さを計算して返す
- `updateMessage()` — スクロール量がコンテンツ高さを超えたか判定し、終了処理を行う
- `scrollSpeed()` — スクロールの基本速度（イベントコマンドの設定値またはデフォルト等）を計算する
- `isFastForward()` — 決定キーが押されて早送り状態になっているかを確認する
- `fastForwardRate()` — 早送り状態の時のスクロール速度の倍率（基本3倍など）を返す
- `terminateMessage()` — スクロール終了時にテキストや進行状態をクリアする

### Window_MapName

マップ画面のマップ名表示ウィンドウ

- **継承**: `Window` → `Window_Base` → **Window_MapName**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `update()` — 毎フレーム更新し、フェードインやフェードアウトの進行状態を管理する
- `updateFadeIn()` — フェードイン中の不透明度上昇を処理する
- `updateFadeOut()` — 一定時間表示した後のフェードアウト処理を行う
- `open()` — マップ名の表示を開始する（フェードインへ移行する）
- `close()` — 強制的に表示を終了する（即座に透明にする等）
- `refresh()` — マップ名を取得して背景とテキストを描画する
- `drawBackground(x, y, width, height)` — マップ名表示用の半透明な黒背景を描画する

### Window_BattleLog

戦闘経過表示用のウィンドウ。枠なしだがWindow_Baseを継承

- **継承**: `Window` → `Window_Base` → **Window_BattleLog**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `setSpriteset(spriteset)` — アニメーション表示等で連動する `Spriteset_Battle` を設定する
- `maxLines()` — バトルログとして表示する最大行数（基本10行等）を返す
- `numLines()` — 現在実際に表示されているログの行数を返す
- `messageSpeed()` — 1行を表示する際のウェイトフレーム数（基本16）を返す
- `isBusy()` — ログ表示のウェイト中やメソッド実行の待機中でビジー状態かどうかを確認する
- `update()` — 毎フレーム更新し、溜まっているメソッドの順次実行とウェイト処理を行う
- `updateWait()` — イベントコマンド等で要求されたウェイトをカウントダウン・管理する
- `updateWaitCount()` — 単純なフレームウェイトのカウントダウンを処理する
- `updateWaitMode()` — エフェクトやモーション完了を待つ「ウェイトモード」を判定し待機状態を更新する
- `setWaitMode(waitMode)` — エフェクト・アニメーション等の終了を待機するモード（'effect', 'movement'等）を設定する
- `callNextMethod()` — 待機状態でなければ、キューに登録されている次の演出・ログ表示メソッドを実行する
- `isFastForward()` — 決定キーの長押し等により演出を早送りするフラグが立っているか確認する
- `push(methodName)` — 引数のメソッド名や関数、および引数を演出キューに登録する
- `clear()` — 表示されているすべてのログテキストと背景情報をクリアする
- `wait()` — 演出待機用のメソッドをキューに登録する（実際の待機は内部カウントで実行）
- `waitForEffect()` — アニメーションエフェクトの完了待ちをキューに登録する
- `waitForMovement()` — バトラーの移動演出の完了待ちをキューに登録する
- `addText(text)` — ログに新たな1行のテキストを追加して描画する
- `pushBaseLine()` — 現在表示中のログのベース行の状態を保存する（複数対象のアニメーション後などで戻すため）
- `popBaseLine()` — 保存しておいたベース行の状態を復元し、余分なログを消す
- `waitForNewLine()` — 新しい行へ続く際にベースラインをリセットして待機する
- `popupDamage(target)` — 対象バトラーの被ダメージや回復のポップアップ演出をキューに登録する
- `performActionStart(subject, action)` — スキル等の発動開始演出（前進等）を対象バトラーに実行させるキューを登録する
- `performAction(subject, action)` — スキル等のアクション発動モーション（武器振り等）を実行させるキューを登録する
- `performActionEnd(subject)` — アクション終了演出（元の位置に戻る等）を実行させるキューを登録する
- `performDamage(target)` — 対象のダメージ演出モーションを実行させるキューを登録する
- `performMiss(target)` — 対象への攻撃ミス演出を実行させるキューを登録する
- `performRecovery(target)` — 対象への回復演出（数値ポップアップ等）を実行させるキューを登録する
- `performEvasion(target)` — 対象の回避アクションの演出を実行させるキューを登録する
- `performMagicEvasion(target)` — 対象の魔法回避の演出を実行させるキューを登録する
- `performCounter(target)` — 対象の反撃（カウンター）の演出を実行させるキューを登録する
- `performReflection(target)` — 対象の魔法反射（リフレクション）の演出を実行させるキューを登録する
- `performSubstitute(substitute, target)` — 身代わり（かばう）を行う演出を実行させるキューを登録する
- `performCollapse(target)` — 対象の戦闘不能（倒れ）演出を実行させるキューを登録する
- `showAttackAnimation(subject, targets)` — 対象への通常攻撃アニメーションを表示する演出をキューに登録する
- `refresh()` — 全テキストと背景の描画をリフレッシュする
- `drawBackground()` — 現在表示されているログの行の数だけ、フェードアウト用等の半透明な背景を描画する
- `backRect()` — ウィンドウ背景ではなくログ1行用の黒背景としての描画矩形領域を計算して返す
- `lineRect(index)` — 指定インデックスの文字列および背景の描画矩形領域を返す
- `backColor()` — ログ行の背景色（CSS色指定、ここでは黒系の半透明）を返す
- `backPaintOpacity()` — ログ行の背景の不透明度（64等）を返す
- `drawLineText(index)` — 指定行に登録されているテキスト文字列を描画する
- `startTurn()` — ターンの開始通知等の演出を（必要に応じて）開始する
- `startAction(subject, action, targets)` — アクション開始時のログ表示と演出（前進等）を指示する
- `endAction(subject)` — アクション終了時の演出（位置戻り等）を指示する
- `displayCurrentState(subject)` — バトラーに現在かかっているステートの継続メッセージをログに表示する
- `displayRegeneration(subject)` — ターン終了時等のHP回復/毒ダメージなどの結果を反映・ポップアップさせる
- `displayAction(subject, item)` — スキルやアイテムを使用した旨のメッセージをログに追加する
- `displayItemMessage(fmt, subject, item)` — 行動（アイテム/スキル）時の特定のフォーマットメッセージを構築・表示する
- `displayCounter(target)` — カウンター発動を知らせるメッセージをログに追加する
- `displayReflection(target)` — 魔法反射（リフレクト）発動を知らせるメッセージをログに追加する
- `displaySubstitute(substitute, target)` — 身代わり（かばう）を行ったメッセージをログに追加する
- `displayActionResults(subject, target)` — アクションの結果（命中・ミス・ダメージなど）を総合して演出呼出やログ追加を行う
- `displayFailure(target)` — アクションが対象に効果が無かった場合（失敗）のメッセージをログに追加する
- `displayCritical(target)` — クリティカルヒットが発生した旨のメッセージをログに追加する
- `displayDamage(target)` — 被ダメージ量をログとしてテキスト表示する
- `displayMiss(target)` — 攻撃が外れた旨のメッセージをログとして表示する
- `displayEvasion(target)` — 攻撃を回避した旨のメッセージをログとして表示する
- `displayHpDamage(target)` — HPダメージ・回復の結果をテキスト構築し表示する
- `displayMpDamage(target)` — MPダメージ・回復の結果をテキスト構築し表示する
- `displayTpDamage(target)` — TPダメージ・回復の結果をテキスト構築し表示する
- `displayAffectedStatus(target)` — ステートやバフ・デバフの付加・解除結果をまとめてテキスト表示する
- `displayAutoAffectedStatus(target)` — 自動付加されたステート等（戦闘不能など）をテキスト表示する
- `displayChangedStates(target)` — 付加・解除された各ステートの個別メッセージを表示する
- `displayAddedStates(target)` — 新たに付加されたステートのメッセージを表示する
- `displayRemovedStates(target)` — 解除されたステートのメッセージを表示する
- `displayChangedBuffs(target)` — 変化したバフ・デバフのメッセージを表示する
- `displayBuffs(target, buffs, fmt)` — 各パラメータ対象のバフ・デバフ指定のフォーマットに沿って表示する
- `makeHpDamageText(target)` — 発生したHPダメージ・回復のメッセージ文字列を組み立てて返す
- `makeMpDamageText(target)` — 発生したMPダメージ・回復のメッセージ文字列を組み立てて返す
- `makeTpDamageText(target)` — 発生したTPダメージ・回復のメッセージ文字列を組み立てて返す

### Window_PartyCommand

戦闘画面の「戦う/逃げる」選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_PartyCommand**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `makeCommandList()` — 「戦う」と「逃げる」のコマンドリストを構築する
- `setup()` — ウィンドウ内容をクリアして構築し直し、アクターのインデックス等を準備してから表示・アクティブにする

### Window_ActorCommand

戦闘画面のアクターコマンド選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_ActorCommand**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `makeCommandList()` — 選択されているアクターに応じた行動コマンドのリストを構築する
- `addAttackCommand()` — 通常攻撃コマンドを追加する
- `addSkillCommands()` — 設定されているスキルタイプごとのコマンドをリストに追加する
- `addGuardCommand()` — 防御コマンドを追加する
- `addItemCommand()` — アイテム使用コマンドを追加する
- `setup(actor)` — 引数のアクターに基づくコマンドリストを構築し、ウィンドウを表示・アクティブにする
- `actor()` — 現在コマンドを選択している対象の `Game_Actor` オブジェクトを返す
- `processOk()` — 対象アクターの直前のコマンド選択記録を残しつつ、決定ハンドラを呼ぶ
- `selectLast()` — 対象アクターが前回選択したコマンド（インデックス）を再選択し、カーソルを合わせる

### Window_BattleStatus

戦闘画面のパーティメンバーステータス表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → **Window_BattleStatus**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `extraHeight()` — 余分な高さ（基本的に10、Window_BattleActor用等）を返す
- `maxCols()` — パーティの人数に応じて、同時に表示する最大列数を返す（基本4）
- `itemHeight()` — 1つのバトラー項目の描画行の高さを返す
- `maxItems()` — 現在戦闘に参加しているパーティメンバーの人数を返す
- `rowSpacing()` — 縦に並ぶ場合等の行間のピクセル数を返す（基本0）
- `updatePadding()` — パディングを設定・更新する
- `actor(index)` — 指定インデックスの `Game_Actor` オブジェクトを返す
- `selectActor(actor)` — 指定のアクターオブジェクトをカーソルで選択状態にする
- `update()` — 毎フレーム更新し、画面に反映させる必要に応じてリフレッシュ等を行う
- `preparePartyRefresh()` — パーティのステータス変化などで再描画が必要なフラグを立てる
- `performPartyRefresh()` — 再表示を要求された際、スプライト等を隠して全体をリフレッシュする
- `drawItem(index)` — 指定インデックスのアクターについて顔画像、名前等の各情報（アイコン・ゲージ等）を描画する
- `drawItemImage(index)` — 指定インデックスのアクターの顔画像を指定位置に描画する
- `drawItemStatus(index)` — 指定インデックスのアクターの名前、ステートアイコン、HP/MPゲージ等を描画する
- `faceRect(index)` — 顔画像の切り抜き・描画用の矩形領域を計算して返す
- `nameX(rect)` — 名前を描画するためのX座標を矩形領域から計算して返す
- `nameY(rect)` — 名前を描画するためのY座標を計算して返す
- `stateIconX(rect)` — ステートアイコンを描画するためのX座標を計算して返す
- `stateIconY(rect)` — ステートアイコンを描画するためのY座標を計算して返す
- `basicGaugesX(rect)` — HP/MP/TPゲージ群を描画するための基準X座標を計算して返す
- `basicGaugesY(rect)` — HP/MP/TPゲージ群を描画するための基準Y座標を計算して返す

### Window_BattleActor

戦闘画面の対象アクター選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_StatusBase` → `Window_BattleStatus` → **Window_BattleActor**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `show()` — ウィンドウを表示状態にする
- `hide()` — ウィンドウを非表示状態にする
- `select(index)` — 指定インデックスのアクターを選択し、カーソルを合わせる
- `processTouch()` — フリックやタップなどのタッチ・クリック入力処理をオーバーライドで受け付ける（必要時拡張向け）

### Window_BattleEnemy

戦闘画面の対象敵キャラクター選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_BattleEnemy**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxCols()` — ウィンドウに表示可能な列数を返す（基本2列等）
- `maxItems()` — 選択可能な生存している敵キャラクターの数を返す
- `enemy()` — 現在選択している対象の敵の `Game_Enemy` オブジェクトを返す
- `enemyIndex()` — 選択している敵グループ内でのインデックスを返す
- `drawItem(index)` — 指定インデックスの敵キャラクターの名前を描画する
- `show()` — デフォルトの表示処理に加え、1体目の敵を選択状態にして表示する
- `hide()` — ウィンウドウを非表示にし、敵の選択状態フラグも解除する
- `refresh()` — 全体をクリアし、選択可能な生存敵のリストを構築・描画し直す
- `select(index)` — 指定されたインデックスの敵を選択し、バトラー側の選択エフェクトを明滅させる
- `processTouch()` — クリックやタッチなどの操作情報を受け取る

### Window_BattleSkill

戦闘画面のスキル選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_SkillList` → **Window_BattleSkill**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `show()` — ウィンドウを表示状態（アクティブ化）する
- `hide()` — ウィンドウを非表示状態（非アクティブ化）にする

### Window_BattleItem

戦闘画面のアイテム選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_ItemList` → **Window_BattleItem**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `includes(item)` — アイテムがバトル時に使用可能なカテゴリであることを判定し返す
- `show()` — ウィンドウを表示状態（アクティブ化）する
- `hide()` — ウィンドウを非表示状態（非アクティブ化）にする

### Window_TitleCommand

タイトル画面の「ニューゲーム/コンティニュー」選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_TitleCommand**

#### 静的メソッド
- `initCommandPosition()` — ゲーム起動時にカーソルの初期位置（通常0:ニューゲーム）を設定する

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `makeCommandList()` — 「ニューゲーム」「コンティニュー」「オプション」のコマンドを含むリストを構築する
- `isContinueEnabled()` — セーブファイルが存在し、コンティニューが可能であるか判定する
- `processOk()` — セーブファイルの有無なども加味し、決定時の初期位置を保存してハンドラを呼ぶ
- `selectLast()` — `initCommandPosition()` で保存された直前の選択位置（ニューゲーム等）を再選択する

### Window_GameEnd

ゲーム終了画面の「タイトルへ」選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → `Window_Command` → **Window_GameEnd**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `makeCommandList()` — 「タイトルへ」「やめる」のコマンドリストを構築する

### Window_DebugRange

デバッグ画面のスイッチ/変数ブロック選択ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugRange**

#### 静的プロパティ
- `lastTopRow` — 画面遷移間で前回のスクロール状態のY座標を保持する
- `lastIndex` — 画面遷移間で前回選択していた項目のインデックスを保持する

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxItems()` — 10個単位で分割されたスイッチと変数のグループ全体数を計算して返す
- `update()` — 毎フレーム更新し、連動するデバッグ編集ウィンドウに現在の範囲情報を渡す
- `mode(index)` — 指定インデックスのグループが扱うのが「スイッチ('switch')」か「変数('variable')」かを返す
- `topId(index)` — 指定グループの開始ID（該当グループが11~20を扱う場合は11）を返す
- `isSwitchMode(index)` — そのインデックスがスイッチグループかを判定しtrueを返す
- `drawItem(index)` — インデックスに該当するグループの範囲（「S [0011-0020]」など）を描画する
- `isCancelTriggered()` — キャンセル操作が実行されたかを確認する
- `processCancel()` — キャンセル操作の際、現在の選択状態をスタティックプロパティに保持・保存して閉じる処理を行う
- `setEditWindow(editWindow)` — 実際に個々のスイッチや変数を編集・表示する対象ウィンドウを設定・同期させる

### Window_DebugEdit

デバッグ画面のスイッチ/変数表示ウィンドウ

- **継承**: `Window` → `Window_Base` → `Window_Scrollable` → `Window_Selectable` → **Window_DebugEdit**

#### インスタンスメソッド
- `initialize(rect)` — 初期化する
- `maxItems()` — 現在のグループ（範囲）内で表示可能な最大の項目数（基本的に10）を返す
- `drawItem(index)` — スイッチまたは変数のIDに応じた名前と現在の状態（ON/OFFや数値）を描画する
- `itemName(dataId)` — スイッチ・変数のシステムに登録された名称を取得し、無名なら空文字列を返す
- `itemStatus(dataId)` — 指定されたデータIDにおける現在の値（[ON]/[OFF]や数値テキスト）を返す
- `setMode(mode)` — 当編集ウィンドウが現在スイッチと変数のどちらのモード（'switch', 'variable'）を表示するか設定する
- `setTopId(id)` — 現在のリストで一番上に表示される項目のデータ参照元ID（1等）を設定する
- `currentId()` — 現在カーソルがある項目の実際のゲーム用データIDを計算して返す
- `update()` — 毎フレーム更新し、選択中の項目の値の変更ボタン入力（決定/左右など）を監視し処理を呼ぶ
- `updateSwitch()` — 決定ボタンによるスイッチのON/OFF切り替えの入力を処理する
- `updateVariable()` — 左右ボタンやLRボタンによる変数の数値の増減入力を処理する
- `deltaForVariable()` — LRボタンまたは左右ボタンの入力に応じて、変数を増減させるための変動量（1、10等）を計算する
