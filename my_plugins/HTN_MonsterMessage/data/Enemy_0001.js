// --------------------------------------------------------------------------
//
// HTN_MonsterMessage - エネミーID:1 のセリフデータ
//
// Copyright (c) 2026 hatonekoe
//
// --------------------------------------------------------------------------

'use strict';

HTN_MonsterMessage.register(1, ({ skillId, subject, _targets, actor, messages }) => {
  messages.name = subject.name();

  if (skillId === 16) {
    messages.push('混乱しましょうね〜');

    if (actor?.isStateAffected(32)) {
      messages.push('あら、もう混乱してる？');
    }
  }

  if (skillId === 17) {
    messages.push('あなたは何も考えられない');
  }

  if (skillId === 18) {
    messages.push('ゆっくりお眠りになって');
  }

  if (messages.pending.length === 0) {
    messages.push('いきますわ！');
  }

  messages.flush();
});
