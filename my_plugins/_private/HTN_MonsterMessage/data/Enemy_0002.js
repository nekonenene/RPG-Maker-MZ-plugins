'use strict';

const ENEMY_ID = 2;
const S = HTN_MonsterMessage.STATE;
const GV = HTN_MonsterMessage.GAME_VARIABLE;
const CE = HTN_MonsterMessage.COMMON_EVENT;

let encounterMessageShown = false; // 遭遇時のセリフを表示済みか保存
let targetBeforeAttackStateIds = []; // 攻撃前の時点で対象に付与されていたステートID一覧

// 戦闘開始時に変数を初期化する
HTN_MonsterMessage.registerBattleStart(() => {
  encounterMessageShown = false;
  targetBeforeAttackStateIds = [];
});

// 遭遇時のセリフ
HTN_MonsterMessage.registerEncountering(ENEMY_ID, ({ enemy, targets, target, messages, callCommonEvent }) => {
  // 同一の敵キャラIDのセリフが表示済みなら、セリフ表示をスキップ
  if (encounterMessageShown) return;

  messages.push('遭遇時のセリフのテスト');
  encounterMessageShown = true;
});

// 攻撃前のセリフ
HTN_MonsterMessage.registerBeforeAttack(ENEMY_ID, ({ enemy, skill, targets, target, messages, callCommonEvent, comboCount }) => {
  targetBeforeAttackStateIds = target ? target.states().map(state => state.id) : [];

  messages.push('攻撃前のセリフのテスト');
});

// 攻撃後のセリフ
HTN_MonsterMessage.registerAfterAttack(ENEMY_ID, ({ enemy, skill, targets, target, messages, callCommonEvent, comboCount, addComboAttack }) => {
  // 敵すべてに攻撃が当たった後のセリフ
  if (targets.every(t => t.result().success)) {
    messages.push('攻撃成功時のセリフ');
  }

  // デフォルトメッセージ
  if (messages.pending.length === 0) {
    messages.push('攻撃後のセリフのテスト');
  }
});

// ターン終了時のセリフ
HTN_MonsterMessage.registerTurnEnd(ENEMY_ID, ({ enemy, targets, target, messages, callCommonEvent, setNextAction }) => {
  messages.push('ターン終了時のセリフのテスト');
});
