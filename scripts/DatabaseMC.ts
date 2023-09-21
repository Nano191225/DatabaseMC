/**
 * DatabaseMC
 * @license MIT
 * @author @Nano191225
 * @version 1.0.1
 * Supported Minecraft Version
 * @version 1.20.30
 * @description DatabaseMC is a database that can be used in Minecraft Script API.
 * --------------------------------------------------------------------------
 * These databases are available in the Script API of the integrated version
 * of Minecraft. They inherit from Map Class. Database names are limited to
 * a maximum of 11 characters. (If the name exceeds 11 characters, it will
 * be automatically truncated.)
 * --------------------------------------------------------------------------
 */

import {
    world,
    ScoreboardObjective,
    Player,
    DynamicPropertiesDefinition,
    ItemStack,
    system,
} from "@minecraft/server";

const MAX_KEY_LENGTH = 512;
const MAX_SCOREBOARD_KEYS_LENGTH = 32768;
const MAX_SCOREBOARD_VALUE_LENGTH = 32768;
const MAX_PLAYER_PROPERTY_LENGTH = 131072;
const MAX_WORLD_PROPERTY_KEYS_LENGTH = 10;
const MAX_WORLD_PROPERTY_LENGTH = 1048576;
const MAX_ITEM_LORE_LINE_LENGTH = 20;
const MAX_ITEM_LORE_VALUE_LENGTH = 398;
const PLAYER_PROPERTIES: Property[] = [];
const WORLD_PROPERTIES: Property[] = [];

class Database extends Map {
    constructor(name: string) {
        super();

        if (typeof name !== "string")
            throw new TypeError("Database name must be a string");
        if (name.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError(
                "Database name must only contain alphanumeric characters and underscores"
            );
        if (name.length > 11)
            console.warn(
                new RangeError("Database name must be 11 characters or less")
            );
    }
}

export class ScoreboardDatabase extends Database {
    #name: string;
    /**
     * @param {string} name
     */
    constructor(name: string) {
        super(name);
        this.#name = name.slice(0, 11) + "_dbMC";

        this.reload();
    }

    /**
     * @returns {ScoreboardDatabase}
     */
    public reload(): ScoreboardDatabase {
        const object = this.#getObject();
        const participants = object.getParticipants();
        for (const participant of participants) {
            const display = participant.displayName;
            const key = display.split("§:")[0];
            const value = display.slice(key.length + 2);
            super.set(key, JSON.parse(value));
        }
        return this;
    }

    /**
     * @returns {Promise<ScoreboardDatabase>}
     */
    public reloadAsync(): Promise<ScoreboardDatabase> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.reload());
            });
        });
    }

    /**
     * @param {string} key
     * @returns {any | undefined}
     */
    public get(key: string): any | undefined {
        this.#keyCheck(key);
        return super.get(key);
    }

    /**
     * @param {string} key
     * @param {any} value
     * @returns {ScoreboardDatabase}
     */
    public set(key: string, value: any): this {
        if (this.size >= MAX_SCOREBOARD_KEYS_LENGTH)
            throw new RangeError(
                "The maximum number of entries has been exceeded"
            );

        this.#keyCheck(key);
        const string = JSON.stringify(value);

        if (string.length > MAX_SCOREBOARD_VALUE_LENGTH)
            throw new RangeError(
                `Value must be ${MAX_SCOREBOARD_VALUE_LENGTH} (now ${string.length}) characters or less (after JSON.stringify)`
            );

        this.delete(key);

        const object = this.#getObject();
        object.setScore(key + "§:" + string, 0);
        super.set(key, value);

        return this;
    }

    /**
     * @param {string} key
     * @param {any} value
     * @returns {Promise<ScoreboardDatabase>}
     */
    public setAsync(key: string, value: any): Promise<this> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.set(key, value));
            });
        });
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    public delete(key: string): boolean {
        const object = this.#getObject();
        const participants = object.getParticipants();
        const participant = participants.find(
            participant => participant.displayName.split("§:")[0] === key
        );
        if (!participant) return false;
        return object.removeParticipant(participant);
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    public deleteAsync(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.delete(key));
            });
        });
    }

    public clear(): void {
        const object = this.#getObject();
        world.scoreboard.removeObjective(object);

        super.clear();
    }

    public clearAsync(): Promise<void> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.clear());
            });
        });
    }

    #keyCheck(key: string): void {
        if (typeof key !== "string")
            throw new TypeError("Key must be a string");
        if (key.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError(
                "Key must only contain alphanumeric characters and underscores"
            );
        if (key.length > MAX_KEY_LENGTH)
            throw new RangeError(
                `Key must be ${MAX_KEY_LENGTH} characters or less`
            );
    }

    #getObject(): ScoreboardObjective {
        const object = world.scoreboard.getObjective(this.#name);
        if (object) return object;
        try {
            world.scoreboard.addObjective(this.#name, this.#name);
            return this.#getObject();
        } catch (error) {
            throw error;
        }
    }
}

export class PlayerPropertyDatabase extends Database {
    #name: string;
    /**
     * @param {string} name
     */
    constructor(name: string) {
        super(name);
        this.#name = name.slice(0, 11) + "_dbMC";

        if (!PLAYER_PROPERTIES.map(v => v.name).includes(this.#name))
            throw new ReferenceError("Property is not registered");

        if (MAX_PLAYER_PROPERTY_LENGTH > 2 ** 17)
            throw new RangeError(
                "Maximum value length must be 2^17 (131072) characters or less"
            );

        this.reload();
    }

    /**
     * @returns {PlayerPropertyDatabase}
     */
    public reload(): PlayerPropertyDatabase {
        for (const player of world.getAllPlayers()) {
            const value = player.getDynamicProperty(this.#name) as string;
            if (typeof value !== "string" && typeof value !== "undefined")
                throw new ReferenceError("Value must be string or undefined");
            if (value) super.set(player.id, JSON.parse(value));
        }
        return this;
    }

    /**
     * @returns {Promise<PlayerPropertyDatabase>}
     */
    public reloadAsync(): Promise<PlayerPropertyDatabase> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.reload());
            });
        });
    }

    /**
     * @param {Player} key
     * @returns {any | undefined}
     */
    public get(key: Player): any | undefined {
        this.#keyCheck(key);
        return super.get(key.id);
    }

    /**
     * @param {Player} key
     * @param {any} value
     * @returns {PlayerPropertyDatabase}
     */
    public set(key: Player, value: any): this {
        this.#keyCheck(key);
        key.setDynamicProperty(this.#name, JSON.stringify(value));
        super.set(key.id, value);
        return this;
    }

    /**
     * @param {Player} key
     * @param {any} value
     * @returns {Promise<PlayerPropertyDatabase>}
     */
    public setAsync(key: Player, value: any): Promise<this> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.set(key, value));
            });
        });
    }

    /**
     * @param {Player} key
     * @returns {boolean}
     */
    public has(key: Player): boolean {
        this.#keyCheck(key);
        return super.has(key.id);
    }

    /**
     * @param {Player} key
     * @returns {boolean}
     */
    public delete(key: Player): boolean {
        this.#keyCheck(key);
        key.removeDynamicProperty(this.#name);
        return super.delete(key.id);
    }

    /**
     * @param {Player} key
     * @returns {Promise<boolean>}
     */
    public deleteAsync(key: Player): Promise<boolean> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.delete(key));
            });
        });
    }

    /**
     * Method is not available
     * @private
     * @deprecated Use delete method
     * @throws {Error} Method is not available
     */
    clear(): void {
        throw new Error("Method is not available");
    }

    #keyCheck(key: Player): void {
        if (!(key instanceof Player))
            throw new TypeError("Key must be a Player");

        if (!key.isValid())
            throw new ReferenceError("Player is not valid (not online?)");
    }

    /**
     * Register the database and make it available.
     * @static
     * @param {string} name
     * @param {number} maxValue
     */
    static register(name: string, maxValue: number): void {
        if (typeof name !== "string")
            throw new TypeError("Database name must be a string");
        if (name.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError(
                "Database name must only contain alphanumeric characters and underscores"
            );

        if (PLAYER_PROPERTIES.map(v => v.name).includes(name))
            throw new ReferenceError("Property is already registered");

        if (name.length > 11)
            console.warn(
                new RangeError("Database name must be 11 characters or less")
            );
        name = name.slice(0, 11) + "_dbMC";
        PLAYER_PROPERTIES.push({name: name, max: maxValue});
    }
}

export class WorldPropertyDatabase extends Database {
    #name: string;
    /**
     * @param {string} name
     */
    constructor(name: string) {
        super(name);
        this.#name = name.slice(0, 11) + "_dbMC";

        if (!WORLD_PROPERTIES.map(v => v.name).includes(this.#name))
            throw new ReferenceError("Property is not registered");

        if (
            (MAX_WORLD_PROPERTY_LENGTH + MAX_KEY_LENGTH) *
                MAX_WORLD_PROPERTY_KEYS_LENGTH >
            2 ** 20
        )
            throw new RangeError(
                "Maximum value length must be 2^20 (1048576) characters or less"
            );

        this.reload();
    }

    /**
     * @returns {WorldPropertyDatabase}
     */
    public reload(): WorldPropertyDatabase {
        const object = this.#getObject();
        for (const [key, value] of object) {
            super.set(key, JSON.parse(value));
        }
        return this;
    }

    /**
     * @returns {Promise<WorldPropertyDatabase>}
     */
    public reloadAsync(): Promise<WorldPropertyDatabase> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.reload());
            });
        });
    }

    /**
     * @param {string} key
     * @returns {any | undefined}
     */
    public get(key: string): any | undefined {
        this.#keyCheck(key);
        return super.get(key);
    }

    /**
     * @param {string} key
     * @param {any} value
     * @returns {WorldPropertyDatabase}
     */
    public set(key: string, value: any): this {
        this.#keyCheck(key);

        if (this.size >= MAX_WORLD_PROPERTY_KEYS_LENGTH)
            throw new RangeError(
                "The maximum number of entries has been exceeded"
            );

        const string = JSON.stringify(value);

        if (string.length > MAX_WORLD_PROPERTY_LENGTH)
            throw new RangeError(
                `Value must be ${MAX_WORLD_PROPERTY_LENGTH} (now ${string.length}) characters or less (after JSON.stringify)`
            );

        this.delete(key);

        const object = this.#getObject();
        object.push([key, string]);
        world.setDynamicProperty(this.#name, JSON.stringify(object));

        super.set(key, value);

        return this;
    }

    /**
     * @param {string} key
     * @param {any} value
     * @returns {Promise<WorldPropertyDatabase>}
     */
    public setAsync(key: string, value: any): Promise<this> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.set(key, value));
            });
        });
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    public has(key: string): boolean {
        this.#keyCheck(key);
        return super.has(key);
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    public delete(key: string): boolean {
        let object = this.#getObject();
        object = object.filter(([_key]) => _key !== key);
        world.setDynamicProperty(this.#name, JSON.stringify(object));
        return super.delete(key);
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    public deleteAsync(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.delete(key));
            });
        });
    }

    public clear(): void {
        world.setDynamicProperty(this.#name, JSON.stringify([]));
        super.clear();
    }
    
    public clearAsync(): Promise<void> {
        return new Promise((resolve) => {
            system.run(() => {
                resolve(this.clear());
            });
        });
    }

    #keyCheck(key: string): void {
        if (typeof key !== "string")
            throw new TypeError("Key must be a string");
        if (key.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError(
                "Key must only contain alphanumeric characters and underscores"
            );
        if (key.length > MAX_KEY_LENGTH)
            throw new RangeError(
                `Key must be ${MAX_KEY_LENGTH} characters or less`
            );
    }

    #getObject(): any[] {
        const property = world.getDynamicProperty(this.#name);
        if (typeof property !== "string") {
            console.warn("property is not string");
            world.setDynamicProperty(this.#name, JSON.stringify([]));
        }
        return JSON.parse(world.getDynamicProperty(this.#name) as string);
    }

    /**
     * Register the database and make it available.
     * @static
     * @param {string} name
     * @param {number} maxValue
     */
    static register(name: string, maxValue: number): void {
        if (typeof name !== "string")
            throw new TypeError("Database name must be a string");
        if (name.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError(
                "Database name must only contain alphanumeric characters and underscores"
            );

        if (WORLD_PROPERTIES.map(v => v.name).includes(name))
            throw new ReferenceError("Property is already registered");

        if (name.length > 11)
            console.warn(
                new RangeError("Database name must be 11 characters or less")
            );
        name = name.slice(0, 11) + "_dbMC";
        WORLD_PROPERTIES.push({name: name, max: maxValue});
    }
}

export class ItemDatabase extends Database {
    constructor() {
        super("item");

        if (MAX_ITEM_LORE_VALUE_LENGTH / MAX_ITEM_LORE_LINE_LENGTH > 20)
            throw new RangeError(
                "Maximum value length must be 20 characters or less"
            );
    }

    /**
     * @param {ItemStack} key
     * @returns {any | undefined}
     */
    public get(key: ItemStack): any | undefined {
        this.#keyCheck(key);
        const value = key.getLore().join("");
        if (!value) return undefined;
        if (!value.startsWith("§:")) return undefined;
        return JSON.parse(value.slice(2));
    }

    /**
     * @param {ItemStack} key
     * @param {any} value
     * @returns {ItemDatabase}
     */
    public set(key: ItemStack, value: any): this {
        this.#keyCheck(key);
        const string = "§:" + JSON.stringify(value);
        if (string.length - 2 > MAX_ITEM_LORE_VALUE_LENGTH)
            throw new RangeError(
                `Value must be ${MAX_ITEM_LORE_VALUE_LENGTH} (now ${string.length - 2}) characters or less (after JSON.stringify)`
            );
        const array = this.#splitString(string);
        key.setLore(array);
        console.warn(JSON.stringify(array, null, 4));
        return this;
    }

    /**
     * @param {ItemStack} key
     * @returns {boolean}
     */
    public has(key: ItemStack): boolean {
        this.#keyCheck(key);
        const value = key.getLore().join("");
        if (!value) return false;
        if (!value.startsWith("§:")) return false;
        return true;
    }

    /**
     * 
     * @param {ItemStack} key
     * @returns {boolean}
     */
    public delete(key: ItemStack): boolean {
        this.#keyCheck(key);
        key.setLore(undefined);
        return true;
    }

    /**
     * Method is not available
     * @private
     * @deprecated Use delete method
     * @throws {Error} Method is not available
     */
    clear(): void {
        throw new Error("Method is not available");
    }

    /**
     * Method is not available
     * @private
     * @deprecated
     * @throws {Error} Method is not available
     */
    entries(): IterableIterator<[any, any]> {
        throw new Error("Method is not available");
    }

    /**
     * Method is not available
     * @private
     * @deprecated
     * @throws {Error} Method is not available
     */
    keys(): IterableIterator<any> {
        throw new Error("Method is not available");
    }

    /**
     * Method is not available
     * @private
     * @deprecated
     * @throws {Error} Method is not available
     */
    values(): IterableIterator<any> {
        throw new Error("Method is not available");
    }

    /**
     * Method is not available
     * @private
     * @deprecated
     * @throws {Error} Method is not available
     */
    forEach(): void {
        throw new Error("Method is not available");
    }

    /**
     * Method is not available
     * @private
     * @deprecated
     * @throws {Error} Method is not available
     */
    [Symbol.iterator](): IterableIterator<[any, any]> {
        throw new Error("Method is not available");
    }

    /**
     * Property is not available
     * @private
     * @deprecated
     * @returns {NaN}
     */
    size: number = NaN;

    #keyCheck(key: ItemStack): void {
        if (!(key instanceof ItemStack))
            throw new TypeError("Key must be a ItemStack");
    }

    #splitString(string: string): string[] {
        const array: string[] = [];
        for (let i = 0; i < string.length; i += 20) {
            array.push(string.slice(i, i + 20));
        }
        return array;
    }
}

world.afterEvents.worldInitialize.subscribe(worldInitialize => {
    const _player = new DynamicPropertiesDefinition();
    const _world = new DynamicPropertiesDefinition();

    PLAYER_PROPERTIES.forEach(property => {
        _player.defineString(property.name, property.max);
    });

    WORLD_PROPERTIES.forEach(property => {
        _world.defineString(property.name, property.max);
    });

    worldInitialize.propertyRegistry.registerEntityTypeDynamicProperties(
        _player,
        "minecraft:player"
    );

    worldInitialize.propertyRegistry.registerWorldDynamicProperties(_world);
});

interface Property {
    name: string;
    max: number;
}