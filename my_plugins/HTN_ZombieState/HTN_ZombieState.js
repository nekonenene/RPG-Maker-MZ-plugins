// --------------------------------------------------------------------------
//
// HTN_ZombieState.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/03/24 v1.0.0 First release
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc Creates a "zombie" state that reverses HP recovery into HP damage (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_ZombieState
 *
 * @param HPDamageSoundType
 * @text Zombie HP damage sound
 * @desc Sound played when a zombie-state battler takes HP damage from recovery.
 * @default actorDamage
 * @type select
 * @option Actor Damage (system sound)
 * @value actorDamage
 * @option Enemy Damage (system sound)
 * @value enemyDamage
 * @option Custom SE
 * @value custom
 *
 * @param HPDamageSound
 * @text Custom HP damage SE
 * @desc Used when "Custom SE" is selected above.
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param MPDamageSoundType
 * @text Zombie MP damage sound
 * @desc Sound played when a zombie-state battler takes MP damage from recovery.
 * @default actorDamage
 * @type select
 * @option Actor Damage (system sound)
 * @value actorDamage
 * @option Enemy Damage (system sound)
 * @value enemyDamage
 * @option Custom SE
 * @value custom
 *
 * @param MPDamageSound
 * @text Custom MP damage SE
 * @desc Used when "Custom SE" is selected above.
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param AffectMpDefault
 * @text Reverse MP recovery
 * @desc If true, MP recovery also becomes MP damage for zombie states.
 * @default false
 * @type boolean
 *
 * @param AffectTpDefault
 * @text Reverse TP gain
 * @desc If true, TP gain also becomes TP damage for zombie states.
 * @default false
 * @type boolean
 *
 * @help
 * Add the following note tag to a state to make it a zombie state:
 * <ZombieState>
 *
 * Battlers with this state receive HP damage instead of healing.
 * Works with both skill/item recovery and turn-end regeneration.
 * The zombie effect is always active, including outside of battle.
 *
 * --- Per-state overrides (all optional) ---
 * <ZombieState_AffectMp: true>   Also reverse MP recovery for this state
 * <ZombieState_AffectMp: false>  Do not reverse MP recovery for this state
 *
 * <ZombieState_AffectTp: true>   Also reverse TP gain for this state
 * <ZombieState_AffectTp: false>  Do not reverse TP gain for this state
 *
 * If multiple zombie states are active simultaneously, the one with the
 * highest database priority is used for per-state settings.
 *
 * --- Known Limitations ---
 * When setHp() or setMp() are called directly, HP/MP is reversed correctly
 * but no damage popup or sound will be shown.
 * Revival via setHp(1) on a dead battler is not reversed.
 */

/*~struct~Sound:
 * @param name
 * @text SE file
 * @type file
 * @dir audio/se
 * @default
 *
 * @param volume
 * @text Volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text Pitch
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text Pan
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

/*:ja
 * @target MZ
 * @plugindesc HP回復をHPダメージに反転させる「ゾンビ」状態異常を作成できます (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_ZombieState
 *
 * @param HPDamageSoundType
 * @text HPダメージ音の種類
 * @desc ゾンビ状態でHPダメージを受けたときに鳴る音です。
 * @default actorDamage
 * @type select
 * @option アクターダメージ音（システムサウンド）
 * @value actorDamage
 * @option 敵ダメージ音（システムサウンド）
 * @value enemyDamage
 * @option カスタムSE
 * @value custom
 *
 * @param HPDamageSound
 * @text カスタムHPダメージSE
 * @desc ダメージ音の種類が「カスタムSE」のときに使用するSEです。
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param MPDamageSoundType
 * @text MPダメージ音の種類
 * @desc ゾンビ状態でMPダメージを受けたときに鳴る音です。
 * @default actorDamage
 * @type select
 * @option アクターダメージ音（システムサウンド）
 * @value actorDamage
 * @option 敵ダメージ音（システムサウンド）
 * @value enemyDamage
 * @option カスタムSE
 * @value custom
 *
 * @param MPDamageSound
 * @text カスタムMPダメージSE
 * @desc ダメージ音の種類が「カスタムSE」のときに使用するSEです。
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param AffectMpDefault
 * @text MP回復を反転
 * @desc trueにすると、MP回復もMPダメージに変換されます。
 * @default false
 * @type boolean
 *
 * @param AffectTpDefault
 * @text TP回復を反転
 * @desc trueにすると、TP増加もTPダメージに変換されます。
 * @default false
 * @type boolean
 *
 * @help
 * 【使い方】
 * ゾンビ状態にしたいステートのメモ欄に、次のタグを記述してください。
 * <ZombieState>
 *
 * このタグが付いたステートを持つバトラーは、HP回復を受けるとHPダメージを受けます。
 * スキル・アイテムによる回復と、ターン終了時のリジェネの両方に対応しています。
 * ゾンビ効果はバトル外（メニューからのアイテム使用など）でも常に有効です。
 *
 * 【ステートごとの個別設定】
 * ステートの「メモ」に以下のように記述することで、
 * プラグインパラメータの設定をステートごとに上書きできます。
 *
 * <ZombieState_AffectMp: true>   このステートでMP回復反転を有効化
 * <ZombieState_AffectMp: false>  このステートでMP回復反転を無効化
 *
 * <ZombieState_AffectTp: true>   このステートでTP回復反転を有効化
 * <ZombieState_AffectTp: false>  このステートでTP回復反転を無効化
 *
 * ゾンビステートが複数同時に付与されている場合は、
 * データベース上の優先度が最も高いステートのタグ設定が参照されます。
 *
 * 【制限事項】
 * setHp() や setMp() が直接呼び出されてHP・MPが増加する場合、ゾンビ反転は正しく機能しますが、
 * ダメージポップアップや音は表示されません。
 * 戦闘不能バトラーへの setHp(1)（蘇生）はゾンビ反転の対象外です。
 */

/*~struct~Sound:ja
 * @param name
 * @text SEファイル
 * @type file
 * @dir audio/se
 * @default
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 */

(() => {
  'use strict';

  const pluginName = 'HTN_ZombieState';
  const parameters = PluginManager.parameters(pluginName);
  const paramHpDamageSoundType = String(parameters.HPDamageSoundType || 'actorDamage');
  const paramMpDamageSoundType = String(parameters.MPDamageSoundType || 'actorDamage');
  const paramHpDamageSound = (() => {
    try {
      return JSON.parse(parameters.HPDamageSound || '{}');
    } catch (e) {
      return {};
    }
  })();
  const paramMpDamageSound = (() => {
    try {
      return JSON.parse(parameters.MPDamageSound || '{}');
    } catch (e) {
      return {};
    }
  })();
  const paramAffectMpDefault = String(parameters.AffectMpDefault) === 'true';
  const paramAffectTpDefault = String(parameters.AffectTpDefault) === 'true';

  /**
   * 文字列や真偽値の入力を真偽値へ変換
   *
   * @param {boolean | string} value 変換対象の値
   * @param {boolean} defaultValue 変換不能時の既定値
   * @returns {boolean} 変換後の真偽値
   */
  const toBoolean = (value, defaultValue) => {
    const strValue = String(value).trim().toLowerCase();

    if (strValue === 'true') {
      return true;
    } else if (strValue === 'false') {
      return false;
    }

    return defaultValue;
  };

  /**
   * ゾンビHPダメージ時の音を再生する
   */
  const playZombieDamageSound = () => {
    if (paramHpDamageSoundType === 'actorDamage') {
      SoundManager.playActorDamage();
    } else if (paramHpDamageSoundType === 'custom') {
      const se = {
        name: String(paramHpDamageSound.name || ''),
        volume: Number(paramHpDamageSound.volume ?? 90),
        pitch: Number(paramHpDamageSound.pitch ?? 100),
        pan: Number(paramHpDamageSound.pan ?? 0),
      };
      if (se.name !== '') {
        AudioManager.playSe(se);
      }
    } else {
      SoundManager.playEnemyDamage();
    }
  };

  /**
   * ゾンビMPダメージ時の音を再生する
   */
  const playZombieMpDamageSound = () => {
    if (paramMpDamageSoundType === 'actorDamage') {
      SoundManager.playActorDamage();
    } else if (paramMpDamageSoundType === 'custom') {
      const se = {
        name: String(paramMpDamageSound.name || ''),
        volume: Number(paramMpDamageSound.volume ?? 90),
        pitch: Number(paramMpDamageSound.pitch ?? 100),
        pan: Number(paramMpDamageSound.pan ?? 0),
      };
      if (se.name !== '') {
        AudioManager.playSe(se);
      }
    } else {
      SoundManager.playEnemyDamage();
    }
  };

  // performDamage 内で playActorDamage / playEnemyDamage を抑制するためのフラグ
  let _suppressNextDamageSound = false;

  /**
   * ゾンビHPダメージ時にアクターダメージ音を抑制するフック
   */
  const _SoundManager_playActorDamage = SoundManager.playActorDamage;
  SoundManager.playActorDamage = function() {
    if (_suppressNextDamageSound) {
      _suppressNextDamageSound = false;
      return;
    }

    _SoundManager_playActorDamage.call(this);
  };

  /**
   * ゾンビHPダメージ時に敵ダメージ音を抑制するフック
   */
  const _SoundManager_playEnemyDamage = SoundManager.playEnemyDamage;
  SoundManager.playEnemyDamage = function() {
    if (_suppressNextDamageSound) {
      _suppressNextDamageSound = false;
      return;
    }

    _SoundManager_playEnemyDamage.call(this);
  };

  // ============================================================
  // Game_Battler ヘルパーメソッド
  // ============================================================

  /**
   * ゾンビステートを持つかどうかを返す
   *
   * @returns {boolean} ゾンビステートを持つ場合は true
   */
  Game_Battler.prototype.hasZombieState = function() {
    return this.states().some((s) => s.meta.ZombieState != null);
  };

  /**
   * 優先度が最も高いゾンビステートを返す
   *
   * @returns {RPG.State | null} 最優先のゾンビステート、なければ null
   */
  Game_Battler.prototype.zombiePriorityState = function() {
    return this.states().find((s) => s.meta.ZombieState != null) ?? null;
  };

  /**
   * MP回復反転が有効かどうかを返す
   * ステートタグの設定がプラグインパラメータより優先される
   *
   * @returns {boolean} MP回復反転が有効な場合は true
   */
  Game_Battler.prototype.zombieAffectsMp = function() {
    const state = this.zombiePriorityState();
    if (state === null) return false;

    return toBoolean(state.meta.ZombieState_AffectMp, paramAffectMpDefault);
  };

  /**
   * TP回復反転が有効かどうかを返す
   * ステートタグの設定がプラグインパラメータより優先される
   *
   * @returns {boolean} TP回復反転が有効な場合は true
   */
  Game_Battler.prototype.zombieAffectsTp = function() {
    const state = this.zombiePriorityState();
    if (state === null) return false;

    return toBoolean(state.meta.ZombieState_AffectTp, paramAffectTpDefault);
  };

  // ============================================================
  // バトル開始・終了時の独自プロパティ初期化
  // ============================================================

  /**
   * バトル開始時に独自プロパティを初期化する
   *
   * @param {boolean} advantageous 先制攻撃かどうか
   */
  const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
  Game_Battler.prototype.onBattleStart = function(advantageous) {
    _Game_Battler_onBattleStart.call(this, advantageous);

    this._zombieHpDamaged = false;
    this._zombieMpDamaged = false;
  };

  /**
   * バトル終了時に独自プロパティをリセットする
   */
  const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function() {
    _Game_Battler_onBattleEnd.call(this);

    this._zombieHpDamaged = false;
    this._zombieMpDamaged = false;
  };

  // ============================================================
  // HP/MP/TP 回復の反転
  // ============================================================

  /**
   * HP回復をゾンビHPダメージに反転する
   * value > 0（回復）かつゾンビステートを持つとき、符号を逆にしてHPダメージとして処理する
   *
   * @param {number} value HP変化量（正=回復、負=ダメージ）
   */
  const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
  Game_Battler.prototype.gainHp = function(value) {
    if (value > 0 && this.hasZombieState()) {
      this._zombieHpDamaged = true;

      _Game_Battler_gainHp.call(this, -value);

      // バトル外では performDamage が呼ばれないため直接再生（ただし、回復音とかぶって再生される）
      if (!$gameParty.inBattle()) {
        this._zombieHpDamaged = false;
        playZombieDamageSound();
      }

      return;
    }

    this._zombieHpDamaged = false;

    _Game_Battler_gainHp.call(this, value);
  };

  /**
   * MP回復をゾンビMPダメージに反転する（AffectMp が有効なときのみ）
   *
   * @param {number} value MP変化量（正=回復、負=ダメージ）
   */
  const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
  Game_Battler.prototype.gainMp = function(value) {
    if (value > 0 && this.zombieAffectsMp()) {
      this._zombieMpDamaged = true;

      _Game_Battler_gainMp.call(this, -value);

      // バトル外では displayMpDamage が呼ばれないため直接再生（ただし、回復音とかぶって再生される）
      if (!$gameParty.inBattle()) {
        this._zombieMpDamaged = false;
        playZombieMpDamageSound();
      }

      return;
    }

    this._zombieMpDamaged = false;

    _Game_Battler_gainMp.call(this, value);
  };

  /**
   * TP増加をゾンビTPダメージに反転する（AffectTp が有効なときのみ）
   *
   * @param {number} value TP変化量（正=増加、負=減少）
   */
  const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
  Game_Battler.prototype.gainTp = function(value) {
    if (value > 0 && this.zombieAffectsTp()) {
      _Game_Battler_gainTp.call(this, -value);
      return;
    }

    _Game_Battler_gainTp.call(this, value);
  };

  /**
   * サイレントTP増加（リジェネ）をゾンビTP反転に対応させる
   * AffectTp が有効なとき gainTp 経由に切り替え、result.tpDamage を記録してポップアップを表示させる
   * フック済みの gainTp が内部で -value に反転して処理する
   *
   * @param {number} value TP増加量
   */
  const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
  Game_Battler.prototype.gainSilentTp = function(value) {
    if (value > 0 && this.zombieAffectsTp()) {
      this.gainTp(value);
      return;
    }

    _Game_Battler_gainSilentTp.call(this, value);
  };

  // ============================================================
  // setHp / setMp / setTp の直接呼び出しへの対応
  // gain系メソッドを経由しないサードパーティプラグイン向け
  // ============================================================

  /**
   * HP増加をゾンビHPダメージに反転する（ゾンビステートを持ち生存中のとき）
   * gainHp 経由の呼び出しはゾンビ反転後に hp < this._hp になるためこのフックを通過しない
   * this._hp === 0 のとき（戦闘不能からの蘇生）はスキップする
   *
   * @param {number} hp 設定するHP値
   */
  const _Game_BattlerBase_setHp = Game_BattlerBase.prototype.setHp;
  Game_BattlerBase.prototype.setHp = function(hp) {
    if (hp > this._hp && this._hp > 0 && this.hasZombieState?.()) {
      const delta = hp - this._hp;

      _Game_BattlerBase_setHp.call(this, this._hp - delta);
      return;
    }

    _Game_BattlerBase_setHp.call(this, hp);
  };

  /**
   * MP増加をゾンビMPダメージに反転する（AffectMp が有効なとき）
   * gainMp 経由の呼び出しはゾンビ反転後に mp < this._mp になるためこのフックを通過しない
   *
   * @param {number} mp 設定するMP値
   */
  const _Game_BattlerBase_setMp = Game_BattlerBase.prototype.setMp;
  Game_BattlerBase.prototype.setMp = function(mp) {
    if (mp > this._mp && this.zombieAffectsMp?.()) {
      const delta = mp - this._mp;

      _Game_BattlerBase_setMp.call(this, this._mp - delta);
      return;
    }

    _Game_BattlerBase_setMp.call(this, mp);
  };

  /**
   * initTp の setTp 呼び出しをゾンビ反転から除外するためのフラグを設定する
   */
  const _Game_Battler_initTp = Game_Battler.prototype.initTp;
  Game_Battler.prototype.initTp = function() {
    this._zombieIgnoreSetTp = true;

    _Game_Battler_initTp.call(this);

    this._zombieIgnoreSetTp = false;
  };

  /**
   * TP増加をゾンビTPダメージに反転する（AffectTp が有効かつ initTp 以外の呼び出しのとき）
   * gainTp / gainSilentTp 経由の呼び出しはゾンビ反転後に tp < this._tp になるためこのフックを通過しない
   * clearTp は常に tp = 0 <= this._tp のためこのフックを通過しない
   *
   * @param {number} tp 設定するTP値
   */
  const _Game_BattlerBase_setTp = Game_BattlerBase.prototype.setTp;
  Game_BattlerBase.prototype.setTp = function(tp) {
    if (tp > this._tp && !this._zombieIgnoreSetTp && this.zombieAffectsTp?.()) {
      const delta = tp - this._tp;

      _Game_BattlerBase_setTp.call(this, this._tp - delta);
      return;
    }

    _Game_BattlerBase_setTp.call(this, tp);
  };

  // ============================================================
  // ダメージ音の差し替え（スキル・アイテム時）
  // displayHpDamage → performDamage の流れで呼ばれる
  // ============================================================

  /**
   * アクターのダメージ演出をフックし、ゾンビHPダメージ時は通常音をゾンビ音に差し替える
   */
  const _Game_Actor_performDamage = Game_Actor.prototype.performDamage;
  Game_Actor.prototype.performDamage = function() {
    if (this._zombieHpDamaged) {
      this._zombieHpDamaged = false;
      _suppressNextDamageSound = true; // playActorDamage を抑制

      _Game_Actor_performDamage.call(this); // ダメージモーション + 抑制された音

      playZombieDamageSound();
    } else {
      _Game_Actor_performDamage.call(this);
    }
  };

  /**
   * 敵のダメージ演出をフックし、ゾンビHPダメージ時は通常音をゾンビ音に差し替える
   */
  const _Game_Enemy_performDamage = Game_Enemy.prototype.performDamage;
  Game_Enemy.prototype.performDamage = function() {
    if (this._zombieHpDamaged) {
      this._zombieHpDamaged = false;
      _suppressNextDamageSound = true; // playEnemyDamage を抑制

      _Game_Enemy_performDamage.call(this); // ブリンクエフェクト + 抑制された音

      playZombieDamageSound();
    } else {
      _Game_Enemy_performDamage.call(this);
    }
  };

  // ============================================================
  // ダメージ音の追加（リジェネ時）
  // displayRegeneration は performDamage を呼ばないため個別に対応する
  // ============================================================

  /**
   * ゾンビHPダメージ音をバトルログキュー経由で再生する
   */
  Window_BattleLog.prototype.playZombieDamageSound = function() {
    playZombieDamageSound();
  };

  /**
   * ゾンビMPダメージ音をバトルログキュー経由で再生する
   */
  Window_BattleLog.prototype.playZombieMpDamageSound = function() {
    playZombieMpDamageSound();
  };

  /**
   * MPダメージ表示をフックし、ゾンビMPダメージ時にダメージ音をキューへ追加する
   *
   * @param {Game_Battler} target 対象バトラー
   */
  const _Window_BattleLog_displayMpDamage = Window_BattleLog.prototype.displayMpDamage;
  Window_BattleLog.prototype.displayMpDamage = function(target) {
    if (target._zombieMpDamaged === true && target.result().mpDamage > 0) {
      target._zombieMpDamaged = false;
      this.push('playZombieMpDamageSound');
    }

    _Window_BattleLog_displayMpDamage.call(this, target);
  };

  /**
   * リジェネ表示をフックし、ゾンビHPダメージ時にダメージ音をキューへ追加する
   *
   * @param {Game_Battler} subject 対象バトラー
   */
  const _Window_BattleLog_displayRegeneration = Window_BattleLog.prototype.displayRegeneration;
  Window_BattleLog.prototype.displayRegeneration = function(subject) {
    // gainHp の時点でフラグが立っていることを確認し、result も整合しているかチェック
    const isZombieHpDamage = subject._zombieHpDamaged === true
      && subject.result().hpAffected
      && subject.result().hpDamage > 0;

    if (isZombieHpDamage) {
      subject._zombieHpDamaged = false;
      this.push('playZombieDamageSound'); // ポップアップより前に音をキューへ積む
    }

    _Window_BattleLog_displayRegeneration.call(this, subject);
  };
})();
