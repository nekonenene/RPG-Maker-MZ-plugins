# RPGツクールMZ クラス一覧

RPGツクールMZ v1.10.0 のコアスクリプトに含まれる全クラスのリファレンス

## ファイル構成

ソースファイルごとにリファレンスが分割されている。
リファレンスには、クラスの説明、継承元、メソッドの一覧、各メソッドの説明が記載されている。
リファレンス内のクラスの並び順は、ソースファイル内の定義順と一致している。クラスは h3 見出しで区切られている。

| ソースファイル | リファレンス | 主なクラス |
|---|---|---|
| `rmmz_core.js` | [mz_classes/core.md](mz_classes/core.md) | Utils, Graphics, Bitmap, Sprite, Tilemap, Input, TouchInput, WebAudio |
| `rmmz_managers.js` | [mz_classes/managers.md](mz_classes/managers.md) | DataManager, SceneManager, BattleManager, PluginManager, AudioManager, SoundManager, ImageManager |
| `rmmz_objects.js` | [mz_classes/objects.md](mz_classes/objects.md) | Game_Battler, Game_Actor, Game_Enemy, Game_Party, Game_Map, Game_Event, Game_Interpreter |
| `rmmz_scenes.js` | [mz_classes/scenes.md](mz_classes/scenes.md) | Scene_Base, Scene_Map, Scene_Battle, Scene_Menu とその派生クラス群 |
| `rmmz_sprites.js` | [mz_classes/sprites.md](mz_classes/sprites.md) | Sprite_Character, Sprite_Battler, Sprite_Actor, Sprite_Enemy, Spriteset_Map, Spriteset_Battle |
| `rmmz_windows.js` | [mz_classes/windows.md](mz_classes/windows.md) | Window_Base, Window_Selectable, Window_Command, Window_BattleLog, Window_Message とその派生クラス群 |

## 用途別ガイド

実装内容に応じて読み込むファイルを判断する目安。
objects.md のように1000行以上ある重いファイルもあるので、すべてを最初に読むよりも、
例えばバトル処理の実装なら managers.md をまず読み、BattleManager のメソッド一覧を読み、
実装に関連しそうなメソッドの詳細をソースファイルで確認する。
ソースファイルの行数が多そうであれば、リファレンスに戻ってメソッド一覧をまず確認する、という流れが効率的。

| 実装内容 | 読むファイル | まず確認するクラス |
|---|---|---|
| プラグインパラメータ・コマンドの仕組みを理解する | managers.md | PluginManager |
| バトルの処理フローを把握する | managers.md | BattleManager |
| 音声再生（BGM・SE など）を扱う | managers.md | AudioManager, SoundManager |
| アクター・エネミーのHP/MP/スキル・ステートを扱う | objects.md | Game_Battler, Game_Actor |
| パーティ・所持品・お金を扱う | objects.md | Game_Party |
| マップイベント・コモンイベント・スクリプトコマンドを扱う | objects.md | Game_Map, Game_Event, Game_Interpreter |
| 画面遷移・シーン初期化を扱う | scenes.md | Scene_Base（継承先のシーンクラス） |
| キャラクタースプライト・バトラースプライトの描画を変更する | sprites.md | Sprite_Character, Sprite_Battler |
| ウィンドウのレイアウト・テキスト描画を変更する | windows.md | Window_Base（継承先のウィンドウクラス） |
| 入力・タッチ操作を扱う | core.md | Input, TouchInput |
| 画像・ビットマップの低レベル描画処理を扱う | core.md | Graphics, Bitmap |

## グローバル変数

### データベース変数 (`$data*`)

ゲーム起動時にJSONファイルから読み込まれる読み取り専用のデータベース

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

ゲームの実行状態を保持するオブジェクト。多くはセーブデータに含まれる

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
