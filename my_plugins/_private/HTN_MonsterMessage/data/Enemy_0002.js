'use strict';

const ENEMY_ID = 2;
const S = HTN_MonsterMessage.STATE;
const GV = HTN_MonsterMessage.GAME_VARIABLE;
const CE = HTN_MonsterMessage.COMMON_EVENT;
let targetBeforeAttackStateIds = [];

// 遭遇時のセリフ
HTN_MonsterMessage.registerEncountering(ENEMY_ID, ({ subject, targets, target, messages, callCommonEvent }) => {
  messages.push('遭遇時のセリフのテスト');
});

// 攻撃前のセリフ
HTN_MonsterMessage.registerBeforeAttack(ENEMY_ID, ({ skill, subject, targets, target, messages, callCommonEvent, comboCount }) => {
  targetBeforeAttackStateIds = target ? target.states().map(state => state.id) : [];

  messages.push('攻撃前のセリフのテスト');
});

// 攻撃後のセリフ
HTN_MonsterMessage.registerAfterAttack(ENEMY_ID, ({ skill, subject, targets, target, messages, callCommonEvent, comboCount, addComboAttack }) => {
  // 敵すべてに攻撃が当たった後のセリフ
  if (targets.every(t => t.result().success)) {
    messages.push('攻撃成功時のセリフ');
  }

  // デフォルトメッセージ
  if (messages.pending.length === 0) {
    messages.push('攻撃後のセリフのテスト');
  }
});
