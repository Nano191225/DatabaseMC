import {
    world,
    ScoreboardObjective,
    Player,
    DynamicPropertiesDefinition,
    MinecraftEntityTypes,
} from "@minecraft/server";

const MAX_KEY_LENGTH = 512;
const MAX_VALUE_LENGTH = 32254;
const PLAYER_PROPERTIES: string[] = [];

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
    constructor(name: string) {
        super(name);
        this.#name = name.slice(0, 11) + "_dbMC";

        this.reload();

        if (2 ** 15 - MAX_KEY_LENGTH - MAX_VALUE_LENGTH - 2 < 0)
            throw new RangeError(
                "The maximum number of entries has been exceeded"
            );
    }

    /**
     * @returns ScoreboardDatabase
     */
    public reload(): this {
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
     * @param key string
     * @returns any | undefined
     */
    public get(key: string): any | undefined {
        this.#keyCheck(key);
        const value = super.get(key);
        return value;
    }

    /**
     * @param key string
     * @param value any
     * @returns ScoreboardDatabase
     */
    public set(key: string, value: any): this {
        if (this.size >= 2 ** 15)
            throw new RangeError(
                "The maximum number of entries has been exceeded"
            );

        this.#keyCheck(key);
        const string = JSON.stringify(value);

        if (string.length > MAX_VALUE_LENGTH)
            throw new RangeError(
                `Value must be ${MAX_VALUE_LENGTH} (now ${string.length}) characters or less (after JSON.stringify)`
            );

        this.delete(key);

        const object = this.#getObject();
        object.setScore(key + "§:" + string, 0);
        super.set(key, value);

        return this;
    }

    /**
     * @param key string
     */
    public delete(key: string): boolean {
        const object = this.#getObject();
        const participants = object.getParticipants();
        const participant = participants.find(
            (participant) => participant.displayName.split("§:")[0] === key
        );
        if (!participant) return false;
        return object.removeParticipant(participant);
    }

    public clear(): void {
        const object = this.#getObject();
        world.scoreboard.removeObjective(object);

        super.clear();
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
    constructor(name: string) {
        super(name);
        this.#name = name.slice(0, 11) + "_dbMC";

        if (!PLAYER_PROPERTIES.includes(this.#name))
            throw new ReferenceError("Property is not registered");
        // this.reload();
    }

    public reload(): this {
        for (const player of world.getAllPlayers()) {
            const value = player.getDynamicProperty(this.#name) as string;
            if (typeof value !== "string" || typeof value !== "undefined")
                throw new ReferenceError("Value must be string or undefined");
            if (value) super.set(player.id, JSON.parse(value));
        }
        return this;
    }

    public get(key: Player): any | undefined {
        // return key.getDynamicProperty(this.#name);
        return super.get(key.id);
    }

    public set(key: Player, value: any): this {
        key.setDynamicProperty(this.#name, JSON.stringify(value));
        super.set(key.id, value);
        return this;
    }

    static register(name: string): void {
        PLAYER_PROPERTIES.push(name);
    }
}

world.afterEvents.worldInitialize.subscribe((worldInitialize) => {
    const player = new DynamicPropertiesDefinition();

    PLAYER_PROPERTIES.forEach((property) => {
        player.defineString(property, MAX_VALUE_LENGTH);
    });

    worldInitialize.propertyRegistry.registerEntityTypeDynamicProperties(
        player,
        MinecraftEntityTypes.player
    );
});
