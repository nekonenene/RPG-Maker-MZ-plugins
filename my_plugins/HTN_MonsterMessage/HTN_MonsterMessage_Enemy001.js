// --------------------------------------------------------------------------
//
// HTN_MonsterMessage_Enemy001
//
// Copyright (c) 2026 hatonekoe
//
// --------------------------------------------------------------------------

/*:ja
 * @target MZ
 * @plugindesc エネミーID:1 のセリフ定義 (HTN_MonsterMessage が必要)
 * @author hatonekoe
 */

(() => {
  'use strict';

  // ルールは先頭から評価され、最初に一致したものが使われる
  HTN_MonsterMessage.register(1, [
    // スキルID:5 かつ 対象がステートID:4 を持つとき
    {
      skill: 5,
      state: 4,
      name: 'スライム',
      message: '弱ったところを狙うぞ！',
    },
    // スキルID:5 を使うとき（ステート条件なし）
    {
      skill: 5,
      name: 'スライム',
      message: '炎を食らえ！',
    },
    // 対象がステートID:4 を持つとき（スキル条件なし）
    {
      state: 4,
      name: 'スライム',
      message: '弱ったな……',
    },
    // それ以外すべて（デフォルト）
    {
      name: 'スライム',
      message: 'いくぞ！',
    },
  ]);

})();
