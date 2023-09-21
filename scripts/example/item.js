// @ts-check
import { Container, ItemStack, system, world } from "@minecraft/server";
import { ItemDatabase } from "../DatabaseMC.js";

world.afterEvents.chatSend.subscribe(chatSend => {
    const { sender: player, message } = chatSend;
    if (!message.startsWith("-")) return;
    const args = message.split(" ");
    const command = args[0];
    /** @type {Container} */
    // @ts-ignore
    const container = player.getComponent("inventory")?.container;
    const key = container.getSlot(player.selectedSlot).getItem();
    if (!key) {
        player.sendMessage("No item in hand");
        return;
    }

    const value = args.slice(1).join(" ");
    console.warn(command, key, value);
    const db = new ItemDatabase();
    if (command === "-set") {
        db.set(key, value);
        container.setItem(player.selectedSlot, key);
    } else if (command === "-get") {
        const value = db.get(key);
        if (value !== undefined) {
            player.sendMessage(value);
        } else {
            player.sendMessage("Key not found");
        }
    } else if (command === "-delete") {
        const success = db.delete(key);
        if (success) {
            player.sendMessage("Key deleted");
            container.setItem(player.selectedSlot, key);
        } else {
            player.sendMessage("Key not found");
        }
    } else if (command === "-reload") {
        player.sendMessage("This method is not implemented");
    } else if (command === "-keys") {
        player.sendMessage([...db.keys()].join(", "));
    } else if (command === "-values") {
        player.sendMessage([...db.values()].join(", "));
    } else if (command === "-entries") {
        player.sendMessage(
            [...db.entries()]
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
        );
    } else if (command === "-clear") {
        db.clear();
    } else if (command === "-has") {
        player.sendMessage(db.has(key).toString());
    } else if (command === "-size") {
        player.sendMessage(db.size.toString());
    } else if (command === "-forEach") {
        player.sendMessage("This method is not implemented");
        // db.forEach((value, key) => {
        //     player.sendMessage(`${key}: ${value}`);
        // });
    } else if (command === "-help") {
        player.sendMessage(
            [
                "-set <key> <value>",
                "-get <key>",
                "-delete <key>",
                "-has <key>"
            ].join("\n")
        );
    } else if (command === "-max") {
        if (value === "values") {
            let integer = 1;
            const interval = system.runInterval(() => {
                const start = Date.now();
                for (let i = integer; i < 2 ** 20; i++) {
                    integer = i + 1;
                    try {
                        db.delete(key);
                        db.set(key, "A".repeat(i));
                        container.setItem(player.selectedSlot, key);
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
