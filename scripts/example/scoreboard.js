import { system, world } from "@minecraft/server";
import { ScoreboardDatabase } from "../DatabaseMC.js";

world.afterEvents.chatSend.subscribe((chatSend) => {
    const { sender: player, message } = chatSend;
    if (!message.startsWith("!")) return;
    const args = message.split(" ");
    const command = args[0];
    const key = args[1];
    const value = args.slice(2).join(" ");
    console.warn(command, key, value);
    const db = new ScoreboardDatabase("test");
    if (command === "!set") {
        db.set(key, value);
    }
    else if (command === "!get") {
        const value = db.get(key);
        if (value !== undefined) {
            player.sendMessage(value);
        }
        else {
            player.sendMessage("Key not found");
        }
    }
    else if (command === "!delete") {
        const success = db.delete(key);
        if (success) {
            player.sendMessage("Key deleted");
        }
        else {
            player.sendMessage("Key not found");
        }
    }
    else if (command === "!reload") {
        db.reload();
    }
    else if (command === "!keys") {
        player.sendMessage([...db.keys()].join(", "));
    }
    else if (command === "!values") {
        player.sendMessage([...db.values()].join(", "));
    }
    else if (command === "!entries") {
        player.sendMessage([...db.entries()].map(([key, value]) => `${key}: ${value}`).join(", "));
    }
    else if (command === "!clear") {
        db.clear();
    }
    else if (command === "!has") {
        player.sendMessage(db.has(key).toString());
    }
    else if (command === "!size") {
        player.sendMessage(db.size.toString());
    }
    else if (command === "!forEach") {
        db.forEach((value, key) => {
            player.sendMessage(`${key}: ${value}`);
        });
    }
    else if (command === "!help") {
        player.sendMessage([
            "!set <key> <value>",
            "!get <key>",
            "!delete <key>",
            "!reload",
            "!keys",
            "!values",
            "!entries",
            "!clear",
            "!has <key>",
            "!size",
            "!forEach",
        ].join("\n"));
    } else if (command === "!max") {
        if (key === "keys") {
            for (let i = 1; i < 2 ** 10; i++) {
                try {
                    db.delete("A".repeat(i - 1));
                    db.set("A".repeat(i), i);
                } catch (e) {
                    console.error(e);
                    player.sendMessage(`Max keys: ${i - 1}`);
                    break;
                }
            }
        } else if (key === "values") {
            let integer = 1;
            const interval = system.runInterval(() => {
                const start = Date.now();
                for (let i = integer; i < 2 ** 20; i++) {
                    integer = i + 1;
                    try {
                        db.delete("A");
                        db.set("A", "A".repeat(i));
                    } catch (e) {
                        console.error(e);
                        player.sendMessage(`Max values: ${i - 1}`);
                        system.clearRun(interval);
                        break;
                    }
                    if (Date.now() - start > 2990) {
                        player.sendMessage(`Now processing: ${i}`);
                        break;
                    }
                }
            });
            
        }
    }
});
