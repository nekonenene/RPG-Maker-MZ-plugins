# RPGツクールMZ クラス一覧

RPGツクールMZ v1.10.0 のコアスクリプトに含まれる全クラスのリファレンス

## ファイル構成

ソースファイルごとにリファレンスが分割されている。
リファレンスには、クラスの説明、継承元、メソッドの一覧、各メソッドの説明が記載されている。
リファレンス内のクラスの並び順は、ソースファイル内の定義順と一致している。クラスは h3 見出しで区切られている。

| ソースファイル | リファレンス | 主なクラス |
|---|---|---|
| `rmmz_core.js` | [mz_classes/core.md](mz_classes/core.md) | Utils, Graphics, Bitmap, Sprite, Tilemap, Input, TouchInput, WebAudio |
| `rmmz_managers.js` | [mz_classes/managers.md](mz_classes/managers.md) | DataManager, ImageManager, AudioManager, SoundManager, SceneManager, BattleManager, PluginManager |
| `rmmz_objects.js` | [mz_classes/objects.md](mz_classes/objects.md) | Game_Battler, Game_Actor, Game_Enemy, Game_Party, Game_Map, Game_Event, Game_Interpreter |
| `rmmz_scenes.js` | [mz_classes/scenes.md](mz_classes/scenes.md) | Scene_Base, Scene_Map, Scene_Battle, Scene_Menu |
| `rmmz_sprites.js` | [mz_classes/sprites.md](mz_classes/sprites.md) | Sprite_Character, Sprite_Battler, Sprite_Actor, Sprite_Enemy, Spriteset_Map, Spriteset_Battle |
| `rmmz_windows.js` | [mz_classes/windows.md](mz_classes/windows.md) | Window_Base, Window_Selectable, Window_Command, Window_BattleLog, Window_Message |

## 用途別ガイド

実装内容に応じて読み込むファイルを判断する目安。
objects.md のように1000行以上ある重いファイルもあるので、すべてを最初に読むよりも、
例えばバトル処理の実装なら managers.md をまず読み、BattleManager のメソッド一覧を読み、
実装に関連しそうなメソッドの詳細をソースファイルで確認する。
ソースファイルの行数が多そうであれば、リファレンスに戻ってメソッド一覧をまず確認する、という流れが効率的。

| 目的 | 読むファイル | まず確認するクラス |
|---|---|---|
| プラグインパラメータ・コマンドの仕組みを理解する | managers.md | PluginManager |
| バトルの処理フローを把握する | managers.md | BattleManager |
| 音声再生（BGM・SE など）を扱う | managers.md | AudioManager, SoundManager |
| アクター・敵キャラのHP/MP/スキル・ステートを扱う | objects.md | Game_Battler, Game_Action |
| パーティ・所持品・お金を扱う | objects.md | Game_Party |
| コモンイベントを扱う | objects.md | Game_Interpreter |
| メニュー画面・戦闘画面などのレイアウトをカスタマイズする | scenes.md | Scene_Base |
| 戦闘画面の敵キャラにHPバーを描画する | sprites.md | Sprite_Enemy, Sprite_Gauge |
| ウィンドウのレイアウト・テキスト描画を変更する | windows.md | Window_Base |
| 入力・タッチ操作を扱う | core.md | Input, TouchInput |
| ゲームがどんな環境で起動されているか確認する | core.md | Utils |

互いが密接に関わるので一概には言えないが、
ソフトウェアとしての大枠が core、ゲームとしての管理が managers、
ゲームの１画面を表現する scenes、画面を構成する windows と sprites、
細かなロジックが objects に書かれてRPGが構成されている。

困ったらまずは managers.md を読む。

## グローバル変数

### データベース変数 (`$data*`)

ゲーム起動時にJSONファイルから読み込まれる読み取り専用データ

| 変数名 | ソース | 説明 |
|---|---|---|
| `$dataActors` | Actors.json | アクター |
| `$dataClasses` | Classes.json | 職業 |
| `$dataSkills` | Skills.json | スキル |
| `$dataItems` | Items.json | アイテム |
| `$dataWeapons` | Weapons.json | 武器 |
| `$dataArmors` | Armors.json | 防具 |
| `$dataEnemies` | Enemies.json | 敵キャラ |
| `$dataTroops` | Troops.json | 敵グループ |
| `$dataStates` | States.json | ステート |
| `$dataAnimations` | Animations.json | アニメーション |
| `$dataTilesets` | Tilesets.json | タイルセット |
| `$dataCommonEvents` | CommonEvents.json | コモンイベント |
| `$dataSystem` | System.json | システム1・システム2・タイプ・用語。その他、スイッチ名・変数名など |
| `$dataMapInfos` | MapInfos.json | マップツリー（すべてのマップ） |
| `$dataMap` | Map*NNN*.json | 各マップデータ（地形やマップ内のイベントデータ） |

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
| `$gamePlayer` | `Game_Player` | ✓ | プレイヤー |
