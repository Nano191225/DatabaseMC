import { world } from "@minecraft/server";
class Database extends Map {
    constructor(name) {
        super();
        if (typeof name !== "string")
            throw new TypeError("Database name must be a string");
        if (name.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError("Database name must only contain alphanumeric characters and underscores");
        if (name.length > 11)
            console.warn(new RangeError("Database name must be 11 characters or less"));
    }
}
export class ScoreboardDatabase extends Database {
    #name;
    constructor(name) {
        super(name);
        this.#name = name.slice(0, 11) + "_dbMC";
        this.reload();
    }
    /**
     * @returns ScoreboardDatabase
     */
    reload() {
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
    get(key) {
        this.#keyCheck(key);
        const value = super.get(key);
        return value;
    }
    /**
     * @param key string
     * @param value any
     * @returns ScoreboardDatabase
     */
    set(key, value) {
        this.#keyCheck(key);
        this.delete(key);
        const object = this.#getObject();
        object.setScore(key + "§:" + JSON.stringify(value), 0);
        super.set(key, value);
        return this;
    }
    /**
     * @param key string
     */
    delete(key) {
        const object = this.#getObject();
        const participants = object.getParticipants();
        const participant = participants.find(participant => participant.displayName.split("§:")[0] === key);
        if (!participant)
            return false;
        return object.removeParticipant(participant);
    }
    clear() {
        const object = this.#getObject();
        const participants = object.getParticipants();
        for (const participant of participants) {
            object.removeParticipant(participant);
        }
        super.clear();
    }
    #keyCheck(key) {
        if (typeof key !== "string")
            throw new TypeError("Key must be a string");
        if (key.search(/[^a-z0-9_]/gi) !== -1)
            throw new TypeError("Key must only contain alphanumeric characters and underscores");
        if (key.length > 16)
            throw new RangeError("Key must be 16 characters or less");
    }
    #getObject() {
        const object = world.scoreboard.getObjective(this.#name);
        if (object)
            return object;
        try {
            world.scoreboard.addObjective(this.#name, this.#name);
            return this.#getObject();
        }
        catch (error) {
            throw error;
        }
    }
}
