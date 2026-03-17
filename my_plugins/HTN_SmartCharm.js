// --------------------------------------------------------------------------
//
// HTN_SmartCharm.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// --------------------------------------------------------------------------

/*:
 * @plugindesc 状態異常時により頭の良い行動をとるようにします。
 * @target MZ
 * @author ハトネコエ - https://hato-neko.x0.com
 *
 * @param TargetCharmLevel
 * @text 対象の行動制約(混乱・魅了レベル)
 * @desc どの行動制約のときにスマートな行動をとらせるか。1:敵を攻撃 2:誰かを攻撃 3:味方を攻撃(魅了)。0なら全ての混乱で有効。
 * @default 3
 * @type select
 * @option 全ての混乱
 * @value 0
 * @option 敵を攻撃
 * @value 1
 * @option 誰かを攻撃
 * @value 2
 * @option 味方を攻撃(魅了)
 * @value 3
 *
 * @param HealThreshold
 * @text 回復閾値(%)
 * @desc 該当ターゲットのHPがこのパーセンテージ以下の場合、HP回復スキルを使用します。
 * @default 50
 * @type number
 * @min 1
 * @max 99
 *
 * @help HTN_SmartCharm.js
 *
 * 【使い方】
 * スマートアクションをとらせたいステート（「魅了」など）のメモ欄に
 * <SmartCharm>
 * と記述してください。
 *
 * 対象の混乱状態異常（デフォルトでは行動制約「味方を攻撃」である「魅了」などを想定）になったとき、
 * 以下のような頭の良い行動（スマートアクション）をとらせることができます。
 *
 * 1. 攻撃または魔法攻撃の中で、一番威力の高いものを選択して使用します。
 * 2. ターゲットのHPが設定した閾値（デフォルト50%）以下の対象がいれば、優先してHP回復スキルを使います。
 * 3. 該当のスキルがない、またはMP不足などで使えない場合は通常攻撃をおこないます。
 *
 * 注意：
 * もともとのスキルが「全体」対象の範囲を持つ場合、スマートアクションで選ばれた場合も全体化されます。
 */

(() => {
  'use strict';

  const pluginName = "HTN_SmartCharm";
  const parameters = PluginManager.parameters(pluginName);
  const paramTargetCharmLevel = Number(parameters['TargetCharmLevel'] || 3);
  const paramHealThreshold = Number(parameters['HealThreshold'] || 50) / 100;

  const _Game_Action_setConfusion = Game_Action.prototype.setConfusion;
  Game_Action.prototype.setConfusion = function() {
    // デフォルトでは通常攻撃がセットされる
    _Game_Action_setConfusion.call(this);

    const subject = this.subject();
    let isTarget = false;

    // ステートのメモ欄に <SmartCharm> の記述があるかチェック
    const hasSmartCharmState = subject.states().some(state => state.meta.SmartCharm);

    if (!hasSmartCharmState) {
      this._smartCharmTarget = null;
      return;
    }

    if (paramTargetCharmLevel === 0) {
      if (subject.isConfused()) isTarget = true;
    } else {
      if (subject.confusionLevel() === paramTargetCharmLevel) isTarget = true;
    }

    if (!isTarget) {
      this._smartCharmTarget = null;
      return;
    }

    const friends = subject.friendsUnit().aliveMembers();
    const opponents = subject.opponentsUnit().aliveMembers();
    const confusionLevel = subject.confusionLevel();

    let targetUnitForHeal = [];
    let targetUnitForAttack = [];

    if (confusionLevel === 3) {
      // 魅了: 回復は敵部隊へ、攻撃は味方部隊へ
      targetUnitForHeal = opponents;
      targetUnitForAttack = friends;
    } else if (confusionLevel === 2) {
      // 混乱: 全てが対象。誰か回復が必要なら回復。
      targetUnitForHeal = friends.concat(opponents);
      targetUnitForAttack = targetUnitForHeal;
    } else {
      // 1(敵を攻撃)など
      targetUnitForHeal = friends;
      targetUnitForAttack = opponents;
    }

    // 使用可能なスキルを取得 (MP不足や封印状態などを考慮)
    const usableSkills = subject.skills().filter(skill => subject.canUse(skill));

    // 通常攻撃も候補に入れる
    const attackSkill = $dataSkills[subject.attackSkillId()];
    if (attackSkill && subject.canUse(attackSkill) && !usableSkills.includes(attackSkill)) {
      usableSkills.push(attackSkill);
    }

    let decidedSkill = null;
    let decidedTarget = null;

    // 1. HP回復スキルの判定
    let targetNeedHeal = null;
    // HP割合が低い順などで選んでもよいが、ここでは最初の閾値以下のメンバーを選ぶ
    for (const member of targetUnitForHeal) {
      if (member.hp <= member.mhp * paramHealThreshold) {
        targetNeedHeal = member;
        break;
      }
    }

    if (targetNeedHeal) {
      // HP回復スキル (damage.type === 3) を探す
      const healSkills = usableSkills.filter(s => s.damage && s.damage.type === 3);
      if (healSkills.length > 0) {
        let bestHealScore = 0;
        let bestSkill = null;

        for (const skill of healSkills) {
          this.setSkill(skill.id);
          const rawVal = this.evalDamageFormula(targetNeedHeal); // 回復量に応じたマイナスの値

          if (rawVal < bestHealScore) {
            bestHealScore = rawVal;
            bestSkill = skill;
          }
        }

        if (bestSkill) {
          decidedSkill = bestSkill;
          decidedTarget = targetNeedHeal;
        }
      }
    }

    // 2. 攻撃または魔法攻撃スキルの判定
    if (!decidedSkill && targetUnitForAttack.length > 0) {
      // HPダメージスキル (damage.type === 1) を探す
      const atkSkills = usableSkills.filter(s => s.damage && s.damage.type === 1);

      // ターゲットをランダムに一つ選んで、そのターゲットに対する最大ダメージのスキルを選ぶ
      const targetForAtk = targetUnitForAttack[Math.randomInt(targetUnitForAttack.length)];
      let bestAtkScore = -1;
      let bestSkill = null;

      for (const skill of atkSkills) {
        this.setSkill(skill.id);
        // hitType: 0(必中), 1(物理), 2(魔法)
        // ダメージ計算をおこない、最も威力が大きなものを選ぶ
        const rawVal = this.evalDamageFormula(targetForAtk);
        if (rawVal > bestAtkScore) {
          bestAtkScore = rawVal;
          bestSkill = skill;
        }
      }

      if (bestSkill) {
        decidedSkill = bestSkill;
        decidedTarget = targetForAtk;
      }
    }

    // 決定したスキルとターゲットをセット (見つからなければ通常攻撃のまま)
    if (decidedSkill) {
      this.setSkill(decidedSkill.id);
      this._smartCharmTarget = decidedTarget;
    } else {
      this.setAttack();
      if (targetUnitForAttack.length > 0) {
        this._smartCharmTarget = targetUnitForAttack[Math.randomInt(targetUnitForAttack.length)];
      } else {
        this._smartCharmTarget = null;
      }
    }
  };

  /**
   * スマートアクション用のターゲット指定があれば、それを利用する
   */
  const _Game_Action_confusionTarget = Game_Action.prototype.confusionTarget;
  Game_Action.prototype.confusionTarget = function() {
    if (this._smartCharmTarget) {
      return this._smartCharmTarget;
    }
    return _Game_Action_confusionTarget.apply(this, arguments);
  };

  /**
   * スキルの対象範囲(全体など)を混乱時にも適用する
   */
  const _Game_Action_makeTargets = Game_Action.prototype.makeTargets;
  Game_Action.prototype.makeTargets = function() {
    if (!this._forcing && this.subject().isConfused() && this._smartCharmTarget) {
      let targets = [];
      // スキルが全体対象の場合、ターゲットが属しているユニットの生存者全体を対象にする
      if (this.isForAll()) {
        const unit = this._smartCharmTarget.friendsUnit();
        targets = unit.aliveMembers();
      } else {
        targets.push(this.confusionTarget());
      }
      return this.repeatTargets(targets);
    }
    return _Game_Action_makeTargets.apply(this, arguments);
  };

})();
