# DatabaseMC

このデータベースは、統合版マインクラフトの Script API で利用可能なデータベースです。
これらは [Map Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) を継承しています。
データベースの名前は、最大 11 文字までです。（11 文字を超える場合は、自動的に切り捨てられます。）

# スコアボードデータベース

このデータベースは、スコアボードを利用してデータを保存します。

## データベースのメソッド

```ts
import { ScoreboardDatabase } from "path/to/DatabaseMC.js";
const db = new ScoreboardDatabase("database_name");

/* データを保存 */
db.set("key", "value"): ScoreboardDatabase
db.setAsync("key", "value"): Promise<ScoreboardDatabase>

/* データを取得 */
db.get("key"): any | undefined

/* データが存在するか確認 */
db.has("key"): boolean

/* データを削除 */
db.delete("key"): boolean
db.deleteAsync("key"): Promise<boolean>

/* すべてのデータを削除 */
db.clear(): void
db.clearAsync(): Promise<void>

/* すべてのkeyを取得 */
db.keys(): IterableIterator<string>

/* すべてのvalueを取得 */
db.values(): IterableIterator<any>

/* すべてのkeyとvalueを取得 */
db.entries(): IterableIterator<[string, any]>

/* データベースをリロード */
db.reload(): ScoreboardDatabase
db.reloadAsync(): Promise<ScoreboardDatabase>

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

-   key は、最大 512 文字までです。（ 512 文字を超えるとエラーが発生します。）
-   value は、最大 32,768 文字までです。（ 32,768 文字を文字を超えるとエラーが発生します。）
-   保存できるデータの数は、最大 32,768 個までです。（ 32,768 個を超えるとエラーが発生します。）
-   すべてを合わせて 1,073,741,824 文字まで一つのデータベースに保存できます。
-   この保存容量はファイル内で変更できます。

# プレイヤープロパティデータベース

このデータベースは、プレイヤーに対するダイナミックプロパティを利用してデータを保存します。

## データベースのメソッド

```ts
import { world } from "@minecraft/server";
import { PlayerPropertyDatabase } from "path/to/DatabaseMC.js";

/* データベースを登録 */
PlayerPropertyDatabase.register("database_name", 1024): void // データベースの名前と保存容量を指定

const db = new PlayerPropertyDatabase("database_name");
const player = world.getAllPlayers()[0]; // プレイヤーを取得

/* データを保存 */
db.set(player, "value"): PlayerPropertyDatabase
db.setAsync(player, "value"): Promise<PlayerPropertyDatabase>

/* データを取得 */
db.get(player): any | undefined

/* データが存在するか確認 */
db.has(player): boolean

/* データを削除 */
db.delete(player): boolean
db.deleteAsync(player): Promise<boolean>

/* すべてのkeyを取得 */
db.keys(): IterableIterator<string>

/* すべてのvalueを取得 */
db.values(): IterableIterator<any>

/* すべてのkeyとvalueを取得 */
db.entries(): IterableIterator<[string, any]>

/* データベースをリロード */
db.reload(): PlayerPropertyDatabase
db.reloadAsync(): Promise<PlayerPropertyDatabase>

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

-   key は、最大 512 文字までです。（ 512 文字を超えるとエラーが発生します。）
-   value は、すべてのデータベースを合わせて最大 131,072 文字までです。（ 131,072 文字を文字を超えるとエラーが発生します。）
-   保存できるデータの数は、プレイヤー数に依存します。
-   この保存容量はファイル内で変更できます。（保存可能な理論値を超えるとエラーが発生します。）

# ワールドプロパティデータベース

このデータベースは、ワールドに対するダイナミックプロパティを利用してデータを保存します。

## データベースのメソッド

```ts
import { world } from "@minecraft/server";
import { WorldPropertyDatabase } from "path/to/DatabaseMC.js";

/* データベースを登録 */
WorldPropertyDatabase.register("database_name", 32768): void // データベースの名前と保存容量を指定

const db = new WorldPropertyDatabase("database_name");

/* データを保存 */
db.set("key", "value"): WorldPropertyDatabase
db.setAsync("key", "value"): Promise<WorldPropertyDatabase>

/* データを取得 */
db.get("key"): any | undefined

/* データが存在するか確認 */
db.has("key"): boolean

/* データを削除 */
db.delete("key"): boolean
db.deleteAsync("key"): Promise<boolean>

/* すべてのデータを削除 */
db.clear(): void
db.clearAsync(): Promise<void>

/* すべてのkeyを取得 */
db.keys(): IterableIterator<string>

/* すべてのvalueを取得 */
db.values(): IterableIterator<any>

/* すべてのkeyとvalueを取得 */
db.entries(): IterableIterator<[string, any]>

/* データベースをリロード */
db.reload(): WorldPropertyDatabase
db.reloadAsync(): Promise<WorldPropertyDatabase>

/* すべてのデータに対して、コールバック関数を実行 */
db.forEach(callbackfn: (value: any, key: any, map: WorldPropertyDatabase<string, any>) => void, thisArg?: any): void
```

## データベースのプロパティ

```ts
import { WorldPropertyDatabase } from "path/to/DatabaseMC.js";
WorldPropertyDatabase.register("database_name");
const db = new WorldPropertyDatabase("database_name");

/* データの数 */
db.size: number
```

## 保存容量

-   key は、最大 512 文字までです。（ 512 文字を超えるとエラーが発生します。）
-   value は、すべてのデータベースを合わせて最大 1,048,576 文字までです。（ 1,048,576 文字を文字を超えるとエラーが発生します。）
-   保存できるデータの数は、最大 10 個までです。（ 10 個を超えるとエラーが発生します。）
-   この保存容量はファイル内で変更できます。（保存可能な理論値を超えるとエラーが発生します。）

# アイテムデータベース

このデータベースは、アイテムのロールを利用してデータを保存します。
また、このデータベースは名前を持ちません。
値の変更後はアイテムをセットする必要があります。

## データベースのメソッド

```ts
import { world } from "@minecraft/server";
import { ItemDatabase } from "path/to/DatabaseMC.js";
const db = new ItemDatabase();

const player = world.getAllPlayers()[0]; // プレイヤーを取得
/** @type {Container} */
const container = player.getComponent("inventory").container; // インベントリを取得
const item = container.getSlot(player.selectedSlot).getItem(); // アイテムを取得

/* データを保存 */
db.set("key", "value"): ItemDatabase
container.setItem(player.selectedSlot, item); // アイテムをセット（アイテムのロールが変わるので、アイテムのロールを変更したい場合は、この処理を行ってください。）

/* データを取得 */
db.get("key"): any | undefined

/* データが存在するか確認 */
db.has("key"): boolean

/* データを削除 */
db.delete("key"): boolean
container.setItem(player.selectedSlot, item); // アイテムをセット（アイテムのロールが変わるので、アイテムのロールを変更したい場合は、この処理を行ってください。）
```

## 保存容量

-   value は、最大 398 文字までです。（ 398 文字を文字を超えるとエラーが発生します。）
-   この保存容量はファイル内で変更できます。（保存可能な理論値を超えるとエラーが発生します。）