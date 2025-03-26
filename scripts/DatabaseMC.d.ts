/**
 * DatabaseMC
 * @license MIT
 * @author @Nano191225
 * @version 1.2.1
 * Supported Minecraft Version
 * @version 1.21.70
 * @description DatabaseMC is a database that can be used in Minecraft Script API.
 * --------------------------------------------------------------------------
 * These databases are available in the Script API of the integrated version
 * of Minecraft. They inherit from Map Class. Database names are limited to
 * a maximum of 11 characters. (If the name exceeds 11 characters, it will
 * be automatically truncated.)
 * --------------------------------------------------------------------------
 */
interface Meta {
    id: string;
    name: string;
    keys: number;
}
type MetaKeys<K extends string | number | symbol> = Record<K, number>;
/**
 * Abstract class representing a Database.
 *
 * @template K - The type of the keys in the database. Must be a string, number, or symbol.
 * @template V - The type of the values in the database.
 *
 * @implements {Map<K, V>}
 */
declare abstract class Database<K extends string | number | symbol, V> implements Map<K, V> {
    protected abstract readonly MAX_KEY_LENGTH: number;
    protected abstract readonly MAX_VALUE_LENGTH: number;
    protected abstract readonly MAX_KEYS_LENGTH: number;
    protected readonly ALLOWED_CHARACTERS: RegExp;
    protected name: string;
    protected rawName: string;
    protected meta: Meta;
    protected metaKeys: MetaKeys<K>;
    /**
     * Creates an instance of the DatabaseMC class.
     *
     * @param name - The name of the database. Must be a string containing only alphanumeric characters and underscores, and must be 11 characters or less.
     *
     * @throws {TypeError} If the name is not a string.
     * @throws {TypeError} If the name contains invalid characters.
     * @throws {RangeError} If the name is longer than 11 characters (a warning is logged).
     */
    constructor(name: string);
    /**
     * Sets a value for a specific key in the database.
     *
     * @param key - The key to set. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @param value - The value to associate with the key.
     * @returns This database instance for method chaining.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * db.set("user_1", { name: "John", age: 30 });
     * ```
     */
    abstract set(key: K, value: V): this;
    /**
     * Asynchronously sets a key-value pair in the database.
     * @param key - The key to set in the database
     * @param value - The value to associate with the key
     * @returns A Promise that resolves to the database instance (this) when the operation completes
     * @throws Will reject the promise if the set operation fails
     */
    setAsync(key: K, value: V): Promise<this>;
    /**
     * Retrieves the value associated with the specified key.
     *
     * @param key - The key to retrieve. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @returns The value associated with the key, or `undefined` if the key does not exist.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * const user = db.get("user_1");
     * console.log(user); // { name: "John", age: 30 }
     * ```
     */
    abstract get(key: K): V | undefined;
    /**
     * Asynchronously retrieves the value associated with the specified key.
     * @param key - The key to retrieve
     * @returns A Promise that resolves to the value associated with the key, or `undefined` if the key does not exist
     * @throws Will reject the promise if the get operation fails
     */
    getAsync(key: K): Promise<V | undefined>;
    /**
     * Checks if a key exists in the database.
     *
     * @param key - The key to check for existence. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @returns `true` if the key exists in the database, `false` otherwise.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * if (db.has("user_1")) {
     *     console.log("User 1 exists");
     * }
     * ```
     */
    abstract has(key: K): boolean;
    /**
     * Asynchronously checks if a key exists in the database.
     * @param key - The key to check for existence
     * @returns A Promise that resolves to `true` if the key exists in the database, `false` otherwise
     * @throws Will reject the promise if the has operation fails
     */
    hasAsync(key: K): Promise<boolean>;
    /**
     * Deletes a key from the database.
     *
     * @param key - The key to delete. Must be a string, number, or symbol containing only alphanumeric characters and underscores.
     * @returns `true` if the key was successfully deleted, `false` otherwise.
     *
     * @throws {TypeError} If the key is not a string, number, or symbol.
     * @throws {TypeError} If the key contains invalid characters.
     * @throws {RangeError} If the key exceeds maximum length.
     *
     * @example
     * ```typescript
     * db.delete("user_1");
     * ```
     */
    abstract delete(key: K): boolean;
    /**
     * Asynchronously deletes a key from the database.
     * @param key - The key to delete
     * @returns A Promise that resolves to `true` if the key was successfully deleted, `false` otherwise
     * @throws Will reject the promise if the delete operation fails
     */
    deleteAsync(key: K): Promise<boolean>;
    /**
     * Removes all key-value pairs from the database.
     */
    abstract clear(): void;
    /**
     * Asynchronously removes all key-value pairs from the database.
     * @returns A Promise that resolves when the operation completes
     * @throws Will reject the promise if the clear operation fails
     */
    clearAsync(): Promise<void>;
    /**
     * Returns an iterator over all keys in the map.
     * @returns {IterableIterator<K>} An iterator that yields all keys in the map.
     */
    keys(): IterableIterator<K>;
    /**
     * Returns an iterator over all values in the map.
     * @returns {IterableIterator<V>} An iterator that yields all values in the map.
     */
    values(): IterableIterator<V>;
    /**
     * Returns an iterator over all entries in the map.
     * @returns {IterableIterator<[K, V]>} An iterator that yields all entries in the map.
     */
    entries(): IterableIterator<[K, V]>;
    /**
     * Executes a provided function once for each key-value pair in the map.
     * @param callbackfn - A function that accepts up to three arguments. The `forEach` method calls the callbackfn function one time for each key-value pair in the map.
     * @param thisArg - An object to which `this` can refer in the callbackfn function. If `thisArg` is omitted, `undefined` is used as the `this` value.
     */
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    /**
     * Returns the number of key-value pairs in the map.
     * @returns The number of key-value pairs in the map.
     */
    get size(): number;
    /**
     * Removes all key-value pairs from the map.
     */
    [Symbol.iterator](): IterableIterator<[K, V]>;
    /**
     * Returns a string representation of the object.
     * @returns The string representation of the object.
     */
    get [Symbol.toStringTag](): string;
    /**
     * Checks if the key is valid.
     * @param key - The key to check
     */
    protected keyCheck(key: K): void;
    /**
     * Retrieves the metadata for the current database instance.
     */
    protected getMeta(): void;
    /**
     * Sets metadata for the current database instance by converting it to a JSON string and storing it as a dynamic property.
     * The metadata is stored using the database name as the property key.
     * @returns void
     */
    protected setMeta(): void;
    /**
     * Updates the metadata by setting and then retrieving it.
     * This method first calls `setMeta` to update the metadata,
     * and then calls `getMeta` to retrieve the updated metadata.
     *
     * @protected
     */
    protected updateMeta(): void;
    /**
     * Removes metadata for the current database instance.
     * This method deletes the metadata and all associated keys.
     *
     * @protected
     */
    protected deleteMeta(): void;
}
export declare class ScoreboardDatabase<K, V> extends Database<string, V> {
    protected readonly MAX_KEY_LENGTH: number;
    protected readonly MAX_VALUE_LENGTH: number;
    protected readonly MAX_KEYS_LENGTH: number;
    private getObject;
    set(key: string, value: V): this;
    get(key: string): V | undefined;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
}
export declare class WorldPropertyDatabase<K, V> extends Database<string, V> {
    protected readonly MAX_KEY_LENGTH: number;
    protected readonly MAX_VALUE_LENGTH: number;
    protected readonly MAX_KEYS_LENGTH: number;
    set(key: string, value: V): this;
    get(key: string): V | undefined;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    private getKey;
}
export {};
