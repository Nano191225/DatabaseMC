# DatabaseMC

このデータベースは、統合版マインクラフトのScript APIで利用可能なデータベースです。
これらは [Map Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) を継承しています。
データベースの名前は、最大11文字までです。（11文字を超える場合は、自動的に切り捨てられます。）

# スコアボードデータベース

このデータベースは、スコアボードを利用してデータを保存します。

## データベースのメソッド

```ts
import { ScoreboardDatabase } from "path/to/DatabaseMC.js";
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
import { ScoreboardDatabase } from "path/to/DatabaseMC.js";
const db = new ScoreboardDatabase("database_name");

/* データの数 */
db.size: number
```

## 保存容量

- keyは、最大 512 文字までです。（ 512 文字を超えるとエラーが発生します。）
- valueは、最大 32,768 文字までです。（ 32,768 文字を文字を超えるとエラーが発生します。）
- 保存できるデータの数は、最大 32,768 個までです。（ 32,768 個を超えるとエラーが発生します。）
- すべてを合わせて 1,073,741,824 文字まで一つのデータベースに保存できます。
- この保存容量はファイル内で変更できます。（保存可能な最大値を超えるとエラーが発生します。）

# プレイヤープロパティデータベース

このデータベースは、プレイヤーに対するダイナミックプロパティを利用してデータを保存します。

## データベースのメソッド

```ts
import { world } from "@minecraft/server";
import { PlayerPropertyDatabase } from "path/to/DatabaseMC.js";
const db = new PlayerPropertyDatabase("database_name");
const player = world.getAllPlayers()[0]; // プレイヤーを取得

/* データを保存 */
db.set(player, "value"): PlayerPropertyDatabase

/* データを取得 */
db.get(player): any | undefined

/* データが存在するか確認 */
db.has(player): boolean

/* データを削除 */
db.delete(player): boolean

/* すべてのデータを削除 */
db.clear(): void

/* すべてのkeyを取得 */
db.keys(): IterableIterator<string>

/* すべてのvalueを取得 */
db.values(): IterableIterator<any>

/* すべてのkeyとvalueを取得 */
db.entries(): IterableIterator<[string, any]>

/* データベースをリロード */
db.reload(): PlayerPropertyDatabase

/* すべてのデータに対して、コールバック関数を実行 */
db.forEach(callbackfn: (value: any, key: any, map: PlayerPropertyDatabase<string, any>) => void, thisArg?: any): void
```

## データベースのプロパティ

```ts
import { PlayerPropertyDatabase } from "path/to/DatabaseMC.js";
const db = new PlayerPropertyDatabase("database_name");

/* データの数 */
db.size: number
```

## 保存容量

- keyは、最大 512 文字までです。（ 512 文字を超えるとエラーが発生します。）
- valueは、最大 131,054 文字までです。（ 131,054 文字を文字を超えるとエラーが発生します。）
- 保存できるデータの数は、プレイヤー数に依存します。
- すべてを合わせて 131,054 × プレイヤー数 文字まで一つのデータベースに保存できます。