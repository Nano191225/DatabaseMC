# DatabaseMC
このデータベースは、統合版マインクラフトのScript APIで利用可能なデータベースです。
これらは [Map Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) を継承しています。
データベースの名前は、最大11文字までです。（11文字を超える場合は、自動的に切り捨てられます。）

# スコアボードデータベース
このデータベースは、スコアボードを利用してデータを保存します。

## データベースの作成
```js
import { ScoreboardDatabase } from "path/to/ScoreboardDatabase.js";
const db = new ScoreboardDatabase("database_name");
```

## データの保存
```js
db.set("key", "value");
```