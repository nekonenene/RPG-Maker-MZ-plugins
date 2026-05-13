// --------------------------------------------------------------------------
//
// HTN_ForcedSkillState.js
//
// Copyright (c) 2026 hatonekoe
// This software is released under the MIT License.
// https://opensource.org/license/mit
//
// 2026/05/13 v0.0.1 開発中
//
// --------------------------------------------------------------------------

/*:
 * @target MZ
 * @plugindesc States that randomly force the battler to use specified skills (v1.0.0)
 * @author hatonekoe - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_ForcedSkillState
 *
 * @param Rate
 * @text Forced Skill Rate (%)
 * @desc Probability (%) of forcing one of the specified skills.
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @param ShowStateMessageBeforeAction
 * @text Show State Message Before Action
 * @desc If true, the state's continuation message is shown before the battler acts. If false, shown after.
 * @default true
 * @type boolean
 *
 * @help
 * [How to Use]
 * Add tags like the following to the state's Note field:
 * <ForcedSkillState>
 * <ForcedSkillState_Rate: 50>
 * <ForcedSkillState_Skill: 2>
 *
 * In this example, a character affected by this state has a 50% chance
 * to use skill ID 2, usually Guard, on their own.
 *
 * [Per-State Settings]
 * You can override plugin parameter settings per state by writing tags
 * like the following in the state's Note field.
 *
 * Setting list:
 * <ForcedSkillState> (Required)
 * <ForcedSkillState_Rate: 10> (Forced skill probability)
 * <ForcedSkillState_Skill: 2> (Skill ID)
 * <ForcedSkillState_SkillName: Guard> (Skill name. Used when ForcedSkillState_Skill is not specified)
 * <ForcedSkillState_ShowStateMessageBeforeAction: true> (Show continuation message before action)
 *
 * You can specify multiple skills separated by commas, like
 * <ForcedSkillState_Skill: 2,2,7,9>.
 * Each entry has the same chance to be selected, so in this example
 * skill ID 2 has a 50% chance to be selected.
 *
 * Forced skills ignore MP/TP shortage, skill seals, whether the battler
 * has learned the skill, and other normal use conditions.
 * If the battler is confused due to another state, the skill's original
 * scope is still used.
 *
 * [About ForcedSkillState_SkillName]
 * ForcedSkillState_SkillName is referenced only when ForcedSkillState_Skill
 * does not have a valid setting.
 * In general, using ForcedSkillState_Skill to specify skill IDs is recommended,
 * but consider SkillName if you are worried that skill IDs may change later.
 *
 * When using SkillName, if multiple skills have the same name, the skill
 * with the lowest skill ID is selected.
 * If a skill name contains <, >, or ,, write them as &lt;, &gt;, or &comma;.
 * Example: if the skill name is Strong Attack (>_<), write
 * <ForcedSkillState_SkillName: Strong Attack (&gt;_&lt;)>
 *
 * [When Multiple States Exist]
 * If multiple states with the <ForcedSkillState> tag exist and are active
 * at the same time, each state is checked in priority order, and the first
 * selected skill is used.
 *
 * [About Continuation Message Timing]
 * RPG Maker MZ only shows one state continuation message per turn:
 * the one belonging to the highest-priority state.
 * Therefore, even if Show State Message Before Action is set to false,
 * the continuation message is not guaranteed to appear after the action.
 */

/*:ja
 * @target MZ
 * @plugindesc 一定確率で指定スキルを勝手に使ってしまうステート (v1.0.0)
 * @author ハトネコエ - https://hato-neko.x0.com
 * @url https://github.com/nekonenene/RPG-Maker-MZ-plugins/tree/main/my_plugins/HTN_ForcedSkillState
 *
 * @param Rate
 * @text 強制スキル発動率(%)
 * @desc 指定スキルを勝手に使ってしまう確率 (%) のデフォルト値
 * @default 50
 * @type number
 * @min 0
 * @max 100
 *
 * @param ShowStateMessageBeforeAction
 * @text 継続メッセージを行動前に表示
 * @desc ステートの継続メッセージを行動の前に表示するか。falseの場合、ツクールMZの本来の挙動同様、行動後に表示されます
 * @default true
 * @type boolean
 *
 * @help
 * 【使い方】
 * ステートの「メモ」の欄に例えば以下のようにタグを記述します。
 * <ForcedSkillState>
 * <ForcedSkillState_Rate: 50>
 * <ForcedSkillState_Skill: 2>
 *
 * この例の場合、このステートが付与されたキャラクターは、
 * 50%の確率でスキルID: 2（通常は防御）のスキルを勝手に使います。
 *
 * 【ステートごとの個別設定】
 * ステートの「メモ」に以下のように記述することで、
 * プラグインパラメータの設定をステートごとに上書きできます。
 *
 * 設定項目一覧：
 * <ForcedSkillState> （※この記述は必須です）
 * <ForcedSkillState_Rate: 10> （指定スキルを勝手に使う確率）
 * <ForcedSkillState_Skill: 2> （スキルID）
 * <ForcedSkillState_SkillName: 防御> （スキル名。 ForcedSkillState_Skill が指定されていない場合に使用されます）
 * <ForcedSkillState_ShowStateMessageBeforeAction: true> （継続メッセージを行動前に表示するか）
 *
 * スキルは複数指定が可能で、 <ForcedSkillState_Skill: 2,2,7,9> のようにカンマ区切りで記述します。
 * 複数の中から同じ確率で選ばれるので、この場合 スキルID: 2 が選ばれる確率が 50% となります。
 *
 * 指定されたスキルは、MP/TP不足やスキル封印、覚えているかなどを無視して実行されます。
 * また、別のステートによって混乱状態であっても、スキルの範囲は元のものが反映されます。
 *
 * 【ForcedSkillState_SkillName の使用に関して】
 * ForcedSkillState_SkillName は ForcedSkillState_Skill の設定が有効でないときのみ参照されます。
 * 基本的にはID指定である ForcedSkillState_Skill の使用が推奨ですが、
 * スキルIDをあとから変更しそうで心配な方は SkillName の使用をご検討ください。
 *
 * SkillName 使用時の注意事項として、同じスキル名が複数存在する場合は、スキルIDが小さいものが選ばれます。
 * また、スキル名に < や > や , が含まれる場合は、 &lt; や &gt; や &comma; と記述してください。
 * （例：スキル名が「つよいこうげき(>_<)」の場合、 <ForcedSkillState_SkillName: つよいこうげき(&gt;_&lt;)> と記述）
 *
 * 【ステートが複数ある場合】
 * <ForcedSkillState> タグを持つステートが複数存在し、それらに同時にかかっている場合、
 * 各ステートで「優先度」の順に確率判定がおこなわれ、最初に選ばれたスキルが使用されます。
 *
 * 【継続メッセージの表示タイミングについて】
 * ツクールMZは、ステートの継続メッセージに関して「優先度」が
 * もっとも高い１つだけを表示します。そのため、
 * 「継続メッセージを行動前に表示」を false にしても、
 * 必ずしも行動後に継続メッセージが表示されるわけではありません。
 */

(() => {
  'use strict';

  /**
   * 文字列や真偽値の入力を真偽値へ変換
   *
   * @param {boolean|string} value 変換対象の値
   * @param {boolean} defaultValue 変換不能時の既定値
   * @returns {boolean} 変換後の真偽値を返す
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

  const pluginName = 'HTN_ForcedSkillState';
  const pluginParams = PluginManager.parameters(pluginName);
  const paramRate = Number(pluginParams.Rate || 50);
  const paramShowStateMessageBeforeAction = toBoolean(pluginParams.ShowStateMessageBeforeAction, true);

  /**
   * ステートに設定された強制スキル発動率を取得
   *
   * @param {object} state ステートデータ
   * @returns {number} 発動率を返す
   */
  const forcedSkillRate = (state) => {
    let rate = paramRate;

    if (state.meta.ForcedSkillState_Rate !== undefined) {
      rate = Number(state.meta.ForcedSkillState_Rate);
    }

    return Math.min(Math.max(rate, 0), 100);
  };

  /**
   * カンマ区切り文字列を要素配列へ変換
   *
   * @param {string} value カンマ区切り文字列
   * @returns {string[]} 各要素の前後の空白を除いた上で、空文字を除いた配列
   */
  const splitByComma = (value) => {
    return String(value).split(',').map(str => str.trim()).filter(str => str !== '');
  };

  /**
   * スキルIDタグから有効な候補スキルを取得
   *
   * @param {object} state ステートデータ
   * @returns {object[]} 候補スキルの配列
   */
  const skillCandidatesById = (state) => {
    let skillIds = state.meta.ForcedSkillState_Skill ?? state.meta.ForcedSkillState_Skills; // 複数形の Skills も許容
    if (skillIds === undefined) {
      return [];
    }

    return splitByComma(skillIds)
      .map(str => Number(str))
      .filter(skillId => Number.isInteger(skillId) && skillId > 0 && $dataSkills[skillId] !== undefined)
      .map(skillId => $dataSkills[skillId]);
  };

  /**
   * スキル名タグから有効な候補スキルを取得
   *
   * @param {object} state ステートデータ
   * @returns {object[]} 候補スキルの配列
   */
  const skillCandidatesByName = (state) => {
    let skillNames = state.meta.ForcedSkillState_SkillName ?? state.meta.ForcedSkillState_SkillNames; // 複数形の SkillNames も許容
    if (skillNames === undefined) {
      return [];
    }

    // スキル名に <, >, カンマ が含まれる場合のエスケープを元に戻す
    const unescapedSkillNames = String(skillNames).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&comma;/g, ',');

    return splitByComma(unescapedSkillNames)
      .map(skillName => $dataSkills.find(skill => skill !== null && skill !== undefined && skill.name.trim() === skillName.trim()))
      .filter(skill => skill !== undefined); // find で見つからなかったものを除外
  };

  /**
   * ステートの「メモ」欄に設定されたタグから、候補となるスキル一覧を取得
   *
   * @param {object} state ステートデータ
   * @returns {object[]} 候補スキルの配列
   */
  const skillCandidates = (state) => {
    const skillsById = skillCandidatesById(state);
    if (skillsById.length > 0) {
      return skillsById;
    }

    return skillCandidatesByName(state);
  };

  /**
   * 候補から等確率でスキルを選ぶ
   *
   * @param {object[]} skills 候補スキルの配列
   * @returns {object|null} 選ばれたスキル
   */
  const selectRandomSkill = (skills) => {
    if (skills.length === 0) {
      return null;
    }

    return skills[Math.randomInt(skills.length)];
  };

  /**
   * バトル開始時に独自プロパティを初期化する
   *
   * @param {boolean} advantageous
   * @returns {void}
   */
  const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
  Game_Battler.prototype.onBattleStart = function(advantageous) {
    _Game_Battler_onBattleStart.call(this, advantageous);

    this._forcedSkillState_ShownStateIdsBefore = new Set();
  };

  /**
   * バトル終了時に独自プロパティをリセットする
   *
   * @returns {void}
   */
  const _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
  Game_Battler.prototype.onBattleEnd = function() {
    _Game_Battler_onBattleEnd.call(this);

    this._forcedSkillState_ShownStateIdsBefore = new Set();
  };

  /**
   * ForcedSkillState ステートの継続メッセージ表示と強制スキル判定をおこなう
   *
   * @returns {void}
   */
  const _BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function() {
    const subject = this._subject;
    const forcedSkillStates = subject.states().filter(state => state.meta.ForcedSkillState !== undefined);

    if (subject._forcedSkillState_ShownStateIdsBefore === undefined) {
      subject._forcedSkillState_ShownStateIdsBefore = new Set();
    }

    // 対象ステートにかかっていないなら通常の startAction を呼び出して終了
    if (forcedSkillStates.length === 0) {
      _BattleManager_startAction.call(this);
      return;
    }

    // ステート継続メッセージの表示
    for (const state of forcedSkillStates) {
      const showStateMessageBeforeAction = toBoolean(
        state.meta.ForcedSkillState_ShowStateMessageBeforeAction,
        paramShowStateMessageBeforeAction
      );

      if (showStateMessageBeforeAction && state.message3 !== '') {
        this._logWindow.push('addText', state.message3.format(subject.name()));
        this._logWindow.push('wait');
        this._logWindow.push('clear');

        subject._forcedSkillState_ShownStateIdsBefore.add(state.id);
      }
    }

    // 上書きするスキルを選択し設定
    for (const state of forcedSkillStates) {
      if (Math.random() * 100 >= forcedSkillRate(state)) {
        continue;
      }

      const skill = selectRandomSkill(skillCandidates(state));
      if (skill === null) {
        continue;
      }

      const action = new Game_Action(subject, true);
      action.setSkill(skill.id);

      if (action.item() === null) {
        continue;
      }

      subject.setAction(0, action);
      break;
    }

    _BattleManager_startAction.call(this);
  };

  /**
   * 行動前に継続メッセージを表示済みの場合、重複表示を避けつつ未表示のステートのメッセージを表示する
   *
   * @param {Game_Battler} subject 対象バトラー
   * @returns {void}
   */
  const _Window_BattleLog_displayCurrentState = Window_BattleLog.prototype.displayCurrentState;
  Window_BattleLog.prototype.displayCurrentState = function(subject) {
    if (
      subject._forcedSkillState_ShownStateIdsBefore === undefined ||
      subject._forcedSkillState_ShownStateIdsBefore.size === 0
    ) {
      _Window_BattleLog_displayCurrentState.call(this, subject);
      return;
    }

    // 一時的に subject._states から表示済みのステートを除外して、元の displayCurrentState を呼び出す
    const savedStates = subject._states;
    subject._states = savedStates.filter(stateId => !subject._forcedSkillState_ShownStateIdsBefore.has(stateId));

    try {
      _Window_BattleLog_displayCurrentState.call(this, subject);
    } finally {
      subject._states = savedStates;
    }
  };
})();
