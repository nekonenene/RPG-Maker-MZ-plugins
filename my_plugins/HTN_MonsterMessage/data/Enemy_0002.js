'use strict';

const ENEMY_ID = 2;

// 攻撃前のセリフ
HTN_MonsterMessage.registerBeforeAttack(ENEMY_ID, ({ skill, subject, _targets, target, messages }) => {
  // デフォルトメッセージ
  if (messages.pending.length === 0) {
    messages.push('テスト');
  }

  messages.flush();
});
