# DatabaseMC
このデータベースは、統合版マインクラフトのScript APIで利用可能なデータベースです。
これらは [Map Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) を継承しています。
データベースの名前は、最大11文字までです。（11文字を超える場合は、自動的に切り捨てられます。）

# スコアボードデータベース
このデータベースは、スコアボードを利用してデータを保存します。

## データベースのメソッド
```ts
import { ScoreboardDatabase } from "path/to/ScoreboardDatabase.js";
const db = new ScoreboardDatabase("database_name");

/* データを保存 */
db.set("key", "value"): ScoreboardDatabase

/* データを取得 */
db.get("key"): any | undefined

/* データが存在するか確認 */
db.has("key"): boolean

/* データを削除 */
db.delete("key"): boolean

/* すべてのデータを削除 */
db.clear(): void

/* すべてのkeyを取得 */
db.keys(): IterableIterator<string>

/* すべてのvalueを取得 */
db.values(): IterableIterator<any>

/* すべてのkeyとvalueを取得 */
db.entries(): IterableIterator<[string, any]>

/* データベースをリロード */
db.reload(): ScoreboardDatabase

/* すべてのデータに対して、コールバック関数を実行 */
db.forEach(callbackfn: (value: any, key: any, map: ScoreboardDatabase<string, any>) => void, thisArg?: any): void
```

## データベースのプロパティ
```ts
import { ScoreboardDatabase } from "path/to/ScoreboardDatabase.js";
const db = new ScoreboardDatabase("database_name");

/* データの数 */
db.size: number
```

## 保存容量

- keyは、最大512文字までです。（512文字を超えるとエラーが発生します。）
- valueは、最大32,254文字までです。（32,254文字を超えるとエラーが発生します。）
- 保存できるデータの数は、最大32,768個までです。（32,768個を超えるとエラーが発生します。）
- すべてを合わせて1,056,899,072文字まで一つのデータベースに保存できます。
- この保存容量はファイル内で変更できます。（保存可能な最大値を超えるとエラーが発生します。）