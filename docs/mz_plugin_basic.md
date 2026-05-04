# RPGツクールMZ プラグイン開発における基本的なコードパターン

## プラグイン開発パターン

### メソッドのオーバーライド（エイリアス方式）

MZプラグインでは、既存メソッドを拡張する際に以下のパターンを使用する：

```js
const _OriginalClass_methodName = OriginalClass.prototype.methodName;
OriginalClass.prototype.methodName = function() {
  _OriginalClass_methodName.call(this);

  // 追加処理
};
```

引数がある場合：

```js
const _Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
  _Game_Actor_setup.call(this, actorId);

  this._customProperty = 0;
};
```

### プラグインパラメータの取得

```js
const pluginName = "MyPlugin";
const parameters = PluginManager.parameters(pluginName);
const myParam = Number(parameters["paramName"] || 0);
```

### プラグインコマンドの登録 (MZ固有)

```js
PluginManager.registerCommand(pluginName, "commandName", args => {
  const value = Number(args.value);
  // 処理
});
```

### メモ欄(Note)の利用

データベースのメモ欄に記載されたメタデータは `meta` プロパティでアクセスできる：

```js
// メモ欄に <CustomTag:100> と書いた場合
const value = $dataActors[actorId].meta.CustomTag; // "100" (文字列)
```
