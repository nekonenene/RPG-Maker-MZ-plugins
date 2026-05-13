// --------------------------------------------------------------------------
//
// HTN_ZombieState.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/02 v1.0.0 First release
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
 * @param MpReverse
 * @text Reverse MP recovery
 * @desc If true, MP recovery also becomes MP damage for zombie states.
 * @default false
 * @type boolean
 *
 * @param TpReverse
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
 * <ZombieState_MpReverse: true>   Also reverse MP recovery for this state
 * <ZombieState_MpReverse: false>  Do not reverse MP recovery for this state
 *
 * <ZombieState_TpReverse: true>   Also reverse TP gain for this state
 * <ZombieState_TpReverse: false>  Do not reverse TP gain for this state
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
 * @desc HP回復によってHPダメージを受けたときに鳴る音
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
 * @desc ダメージ音の種類が「カスタムSE」のときに使用されるSE
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param MPDamageSoundType
 * @text MPダメージ音の種類
 * @desc MP回復によってMPダメージを受けたときに鳴る音
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
 * @desc ダメージ音の種類が「カスタムSE」のときに使用されるSE
 * @type struct<Sound>
 * @default {"name":"","volume":"90","pitch":"100","pan":"0"}
 *
 * @param MpReverse
 * @text MP回復を反転
 * @desc MP回復をMPダメージに変換するかどうか
 * @default false
 * @type boolean
 *
 * @param TpReverse
 * @text TP回復を反転
 * @desc TP回復をTPダメージに変換するかどうか
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
 * <ZombieState_MpReverse: true>   このステートでMP回復反転を有効化
 * <ZombieState_MpReverse: false>  このステートでMP回復反転を無効化
 *
 * <ZombieState_TpReverse: true>   このステートでTP回復反転を有効化
 * <ZombieState_TpReverse: false>  このステートでTP回復反転を無効化
 *
 * ゾンビステートが複数同時に付与されている場合は、
 * データベース上の優先度が最も高いステートのタグ設定が参照されます。
 *
 * 【制限事項】
 * setHp() や setMp() が直接呼び出されてHP・MPが増加する場合、反転は正しく機能しますが、
 * ダメージポップアップや音は表示されません。
 * 戦闘不能バトラーへの setHp(1)（蘇生）は反転の対象外です。
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

  const pluginName = 'HTN_ZombieState';
  const pluginParams = PluginManager.parameters(pluginName);
  const paramHpDamageSoundType = String(pluginParams.HPDamageSoundType || 'actorDamage');
  const paramMpDamageSoundType = String(pluginParams.MPDamageSoundType || 'actorDamage');
  const paramHpDamageSound = (() => {
    try {
      return JSON.parse(pluginParams.HPDamageSound || '{}');
    } catch (_e) {
      return {};
    }
  })();
  const paramMpDamageSound = (() => {
    try {
      return JSON.parse(pluginParams.MPDamageSound || '{}');
    } catch (_e) {
      return {};
    }
  })();
  const paramMpReverse = toBoolean(pluginParams.MpReverse, false);
  const paramTpReverse = toBoolean(pluginParams.TpReverse, false);

  // performDamage 内でダメージ音を鳴らさないためのフラグ
  let _zombieState_SuppressDamageSound = false;

  /**
   * 回復反転によるダメージ音を再生する
   *
   * @param {string} damageType ダメージ種別
   */
  const playReverseDamageSound = (damageType) => {
    const soundType = damageType === 'mp' ? paramMpDamageSoundType : paramHpDamageSoundType;
    const customSound = damageType === 'mp' ? paramMpDamageSound : paramHpDamageSound;

    if (soundType === 'actorDamage') {
      SoundManager.playActorDamage();
    } else if (soundType === 'custom') {
      const se = {
        name: String(customSound.name || ''),
        volume: Number(customSound.volume ?? 90),
        pitch: Number(customSound.pitch ?? 100),
        pan: Number(customSound.pan ?? 0),
      };

      if (se.name !== '') {
        AudioManager.playSe(se);
      }
    } else {
      SoundManager.playEnemyDamage();
    }
  };

  /**
   * アクターのダメージ音を再生。 _zombieState_SuppressDamageSound が true のときは再生しない
   */
  const _SoundManager_playActorDamage = SoundManager.playActorDamage;
  SoundManager.playActorDamage = function() {
    if (_zombieState_SuppressDamageSound) {
      _zombieState_SuppressDamageSound = false;
      return;
    }

    _SoundManager_playActorDamage.call(this);
  };

  /**
   * 敵キャラのダメージ音を再生。 _zombieState_SuppressDamageSound が true のときは再生しない
   */
  const _SoundManager_playEnemyDamage = SoundManager.playEnemyDamage;
  SoundManager.playEnemyDamage = function() {
    if (_zombieState_SuppressDamageSound) {
      _zombieState_SuppressDamageSound = false;
      return;
    }

    _SoundManager_playEnemyDamage.call(this);
  };

  /**
   * バトラーのゾンビステートのうち、もっとも「優先度」が高いものを返す
   *
   * @param {Game_BattlerBase} battler 対象バトラー
   * @returns {RPG.State | null} ゾンビステート、なければ null
   */
  const zombieStateByBattler = (battler) => {
    if (typeof battler.states !== 'function') return null;

    return battler.states().find((s) => s.meta.ZombieState != null) ?? null;
  };

  /**
   * バトル開始時に独自プロパティを初期化する
   *
   * @param {boolean} advantageous 先制攻撃かどうか
   */
  const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
  Game_Battler.prototype.onBattleStart = function(advantageous) {
    _Game_Battler_onBattleStart.call(this, advantageous);

    this._zombieState_InitTpProcessing = false;
    this._zombieState_HpReverseDamaged = false;
    this._zombieState_MpReverseDamaged = false;
  };

  /**
   * バトル終了時に独自プロパティを削除する
   */
  const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function() {
    _Game_Battler_onBattleEnd.call(this);

    delete this._zombieState_InitTpProcessing;
    delete this._zombieState_HpReverseDamaged;
    delete this._zombieState_MpReverseDamaged;
  };

  /**
   * HP回復をHPダメージに反転する
   * value > 0（回復）かつゾンビステートを持つとき、符号を逆にしてHPダメージとして処理する
   *
   * @param {number} value HP変化量（正=回復、負=ダメージ）
   */
  const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
  Game_Battler.prototype.gainHp = function(value) {
    if (value > 0 && zombieStateByBattler(this) !== null) {
      this._zombieState_HpReverseDamaged = true;

      _Game_Battler_gainHp.call(this, -value);

      // バトル外では performDamage が呼ばれないため直接再生（ただし、回復音とかぶって再生される）
      if (!$gameParty.inBattle()) {
        this._zombieState_HpReverseDamaged = false;
        playReverseDamageSound('hp');
      }

      return;
    }

    this._zombieState_HpReverseDamaged = false;

    _Game_Battler_gainHp.call(this, value);
  };

  /**
   * HP増加をHPダメージに反転する
   *
   * @param {number} hp 設定するHP値
   */
  const _Game_BattlerBase_setHp = Game_BattlerBase.prototype.setHp;
  Game_BattlerBase.prototype.setHp = function(hp) {
    // 指定HPが現在HPより大きく、かつ現在HPが0より大きく（戦闘不能でない）、ゾンビステートを持つ場合に反転処理
    // gainHp 経由のHP回復は gainHp 側で先に反転処理があるため、この条件には入らない
    if (hp > this._hp && this._hp > 0 && zombieStateByBattler(this) !== null) {
      const delta = hp - this._hp;

      _Game_BattlerBase_setHp.call(this, this._hp - delta);
      return;
    }

    _Game_BattlerBase_setHp.call(this, hp);
  };

  /**
   * MP回復をMPダメージに反転する
   *
   * @param {number} value MP変化量（正=回復、負=ダメージ）
   */
  const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
  Game_Battler.prototype.gainMp = function(value) {
    if (value > 0) {
      const zombieState = zombieStateByBattler(this);
      const isMpReverse = zombieState !== null && toBoolean(zombieState.meta.ZombieState_MpReverse, paramMpReverse);

      if (isMpReverse) {
        this._zombieState_MpReverseDamaged = true;

        _Game_Battler_gainMp.call(this, -value);

        // バトル外では displayMpDamage が呼ばれないため直接再生（ただし、回復音とかぶって再生される）
        if (!$gameParty.inBattle()) {
          this._zombieState_MpReverseDamaged = false;
          playReverseDamageSound('mp');
        }

        return;
      }
    }

    this._zombieState_MpReverseDamaged = false;

    _Game_Battler_gainMp.call(this, value);
  };

  /**
   * MP増加をMPダメージに反転する
   *
   * @param {number} mp 設定するMP値
   */
  const _Game_BattlerBase_setMp = Game_BattlerBase.prototype.setMp;
  Game_BattlerBase.prototype.setMp = function(mp) {
    // 指定MPが現在MPより大きい場合
    // gainMp 経由のMP回復は gainMp 側で先に反転処理があるため、この条件には入らない
    if (mp > this._mp) {
      const zombieState = zombieStateByBattler(this);
      const isMpReverse = zombieState !== null && toBoolean(zombieState.meta.ZombieState_MpReverse, paramMpReverse);

      if (isMpReverse) {
        const delta = mp - this._mp;

        _Game_BattlerBase_setMp.call(this, this._mp - delta);
        return;
      }
    }

    _Game_BattlerBase_setMp.call(this, mp);
  };

  /**
   * 初期TP設定中であることを記録する
   */
  const _Game_Battler_initTp = Game_Battler.prototype.initTp;
  Game_Battler.prototype.initTp = function() {
    // initTp から setTp を呼び出すときに setTp の反転処理を走らせないようにするフラグ
    this._zombieState_InitTpProcessing = true;

    try {
      _Game_Battler_initTp.call(this);
    } finally {
      this._zombieState_InitTpProcessing = false;
    }
  };

  /**
   * TP増加をTPダメージに反転する
   *
   * @param {number} value TP変化量（正=増加、負=減少）
   */
  const _Game_Battler_gainTp = Game_Battler.prototype.gainTp;
  Game_Battler.prototype.gainTp = function(value) {
    if (value > 0) {
      const zombieState = zombieStateByBattler(this);
      const isTpReverse = zombieState !== null && toBoolean(zombieState.meta.ZombieState_TpReverse, paramTpReverse);

      if (isTpReverse) {
        _Game_Battler_gainTp.call(this, -value);
        return;
      }
    }

    _Game_Battler_gainTp.call(this, value);
  };

  /**
   * ターン終了時などにおこなわれる自動的なTP増加を反転させる
   *
   * @param {number} value TP増加量
   */
  const _Game_Battler_gainSilentTp = Game_Battler.prototype.gainSilentTp;
  Game_Battler.prototype.gainSilentTp = function(value) {
    if (value > 0) {
      const zombieState = zombieStateByBattler(this);
      const isTpReverse = zombieState !== null && toBoolean(zombieState.meta.ZombieState_TpReverse, paramTpReverse);

      if (isTpReverse) {
        // gainSilentTp は result.tpDamage を記録しないため
        // gainTp を呼び出すことでTP減少を記録し、TP減少ポップアップを表示させる
        this.gainTp(value);
        return;
      }
    }

    _Game_Battler_gainSilentTp.call(this, value);
  };

  /**
   * TP増加をTPダメージに反転する
   *
   * @param {number} tp 設定するTP値
   */
  const _Game_BattlerBase_setTp = Game_BattlerBase.prototype.setTp;
  Game_BattlerBase.prototype.setTp = function(tp) {
    // 指定TPが現在TPより大きく、かつ initTp メソッドからの呼び出しでないときに処理を実行
    // gainTp や gainSilentTp 経由のTP増加は、各メソッド側で先にTPの反転処理があるためこの条件に入らない
    if (tp > this._tp && !this._zombieState_InitTpProcessing) {
      const zombieState = zombieStateByBattler(this);
      const isTpReverse = zombieState !== null && toBoolean(zombieState.meta.ZombieState_TpReverse, paramTpReverse);

      if (isTpReverse) {
        const delta = tp - this._tp;

        _Game_BattlerBase_setTp.call(this, this._tp - delta);
        return;
      }
    }

    _Game_BattlerBase_setTp.call(this, tp);
  };

  /**
   * アクターのダメージ演出をフックし、HPダメージ時はダメージ音を設定した音に差し替える
   */
  const _Game_Actor_performDamage = Game_Actor.prototype.performDamage;
  Game_Actor.prototype.performDamage = function() {
    if (this._zombieState_HpReverseDamaged === true) {
      this._zombieState_HpReverseDamaged = false;
      _zombieState_SuppressDamageSound = true; // ダメージ音を鳴らさないためのフラグ

      _Game_Actor_performDamage.call(this); // 内部で SoundManager.playActorDamage() が呼ばれる

      playReverseDamageSound('hp'); // ここでダメージ音を鳴らす
    } else {
      _Game_Actor_performDamage.call(this);
    }
  };

  /**
   * 敵キャラのダメージ演出をフックし、HPダメージ時はダメージ音を設定した音に差し替える
   */
  const _Game_Enemy_performDamage = Game_Enemy.prototype.performDamage;
  Game_Enemy.prototype.performDamage = function() {
    if (this._zombieState_HpReverseDamaged === true) {
      this._zombieState_HpReverseDamaged = false;
      _zombieState_SuppressDamageSound = true; // ダメージ音を鳴らさないためのフラグ

      _Game_Enemy_performDamage.call(this); // 内部で SoundManager.playEnemyDamage() が呼ばれる

      playReverseDamageSound('hp'); // ここでダメージ音を鳴らす
    } else {
      _Game_Enemy_performDamage.call(this);
    }
  };

  /**
   * ダメージ音をバトルログキュー経由で再生する
   *
   * @param {string} damageType ダメージ種別
   */
  Window_BattleLog.prototype.zombieState_PlayDamageSound = function(damageType) {
    playReverseDamageSound(damageType);
  };

  /**
   * MPダメージ表示をフックし、MPダメージ時にダメージ音をキューへ追加する
   *
   * @param {Game_Battler} target 対象バトラー
   */
  const _Window_BattleLog_displayMpDamage = Window_BattleLog.prototype.displayMpDamage;
  Window_BattleLog.prototype.displayMpDamage = function(target) {
    if (target._zombieState_MpReverseDamaged === true && target.result().mpDamage > 0) {
      target._zombieState_MpReverseDamaged = false;
      this.push('zombieState_PlayDamageSound', 'mp');
    }

    _Window_BattleLog_displayMpDamage.call(this, target);
  };

  /**
   * リジェネ表示をフックし、HPダメージ時にダメージ音をキューへ追加する
   *
   * @param {Game_Battler} subject 対象バトラー
   */
  const _Window_BattleLog_displayRegeneration = Window_BattleLog.prototype.displayRegeneration;
  Window_BattleLog.prototype.displayRegeneration = function(subject) {
    // gainHp の時点でフラグが立っていることを確認し、result も整合しているかチェック
    const isZombieHpDamage = subject._zombieState_HpReverseDamaged === true
      && subject.result().hpAffected
      && subject.result().hpDamage > 0;

    if (isZombieHpDamage) {
      subject._zombieState_HpReverseDamaged = false;
      this.push('zombieState_PlayDamageSound', 'hp'); // ポップアップより前に音をキューへ積む
    }

    _Window_BattleLog_displayRegeneration.call(this, subject);
  };
})();
