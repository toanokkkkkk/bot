const characters = {
    warrior: { hp: 100, attack: 20, defense: 15, skill: "strike", skillUses: 3 },
    mage: { hp: 80, attack: 25, defense: 10, skill: "fireball", skillUses: 3 },
    rogue: { hp: 70, attack: 30, defense: 5, skill: "backstab", skillUses: 3 }
};

let player1 = null;
let player2 = null;

module.exports.config = {
    name: "battle",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Assistant",
    description: "Trò chơi đối kháng",
    commandCategory: "Giải trí",
    usages: "battle [start|attack|skill]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    if (args[0] === "start") {
        api.sendMessage("Chọn nhân vật:\n1. Warrior\n2. Mage\n3. Rogue", threadID, (err, info) => {
            global.client.handleReply.push({
                type: "selectCharacter",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        });
    } else if (args[0] === "attack" || args[0] === "skill") {
        if (!player1 || !player2) {
            return api.sendMessage("Cả hai người chơi cần chọn nhân vật trước khi bắt đầu trận đấu.", threadID, messageID);
        }

        const action = args[0];
        const player = senderID === player1.id ? player1 : player2;
        const opponent = senderID === player1.id ? player2 : player1;

        if (action === "attack") {
            const damage = Math.max(player.attack - opponent.defense, 0);
            opponent.hp -= damage;
            if (opponent.hp <= 0) {
                return api.sendMessage(`Người chơi ${player.name} đã chiến thắng!`, threadID, () => {
                    player1 = null;
                    player2 = null;
                });
            } else {
                return api.sendMessage(
                    `Người chơi ${player.name} đã tấn công! ${opponent.name} mất ${damage} máu.\nSố máu còn lại: ${player.name}: ${player.hp}, ${opponent.name}: ${opponent.hp}\nLượt của ${opponent.name}`,
                    threadID,
                    messageID
                );
            }
        }

        if (action === "skill") {
            if (player.skillUses > 0) {
                const skillDamage = player.attack * 2;
                opponent.hp -= skillDamage;
                player.skillUses -= 1;

                if (opponent.hp <= 0) {
                    return api.sendMessage(`Người chơi ${player.name} đã chiến thắng!`, threadID, () => {
                        player1 = null;
                        player2 = null;
                    });
                } else {
                    return api.sendMessage(
                        `Người chơi ${player.name} đã sử dụng kỹ năng ${player.skill}! ${opponent.name} mất ${skillDamage} máu.\nSố máu còn lại: ${player.name}: ${player.hp}, ${opponent.name}: ${opponent.hp}\nLượt của ${opponent.name}\nSố lần dùng kỹ năng còn lại của ${player.name}: ${player.skillUses}`,
                        threadID,
                        messageID
                    );
                }
            } else {
                return api.sendMessage(`${player.name} đã hết lượt sử dụng kỹ năng. Vui lòng sử dụng lệnh khác.`, threadID, messageID);
            }
        }
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    const choice = body.trim();

    if (handleReply.type === "selectCharacter") {
        const playerName = senderID === handleReply.author ? "Người chơi 1" : "Người chơi 2";
        
        if (choice === "1") {
            if (!player1) {
                player1 = { ...characters.warrior, id: senderID, name: playerName };
                api.sendMessage(`${playerName} đã chọn Warrior. Đợi người chơi 2 chọn nhân vật.`, threadID, messageID);
            } else if (!player2) {
                player2 = { ...characters.warrior, id: senderID, name: playerName };
                api.sendMessage(`${playerName} đã chọn Warrior. Trận đấu bắt đầu!`, threadID, () => {
                    api.sendMessage(`Lượt của ${player1.name} (attack hoặc skill)`, threadID);
                });
            }
        } else if (choice === "2") {
            if (!player1) {
                player1 = { ...characters.mage, id: senderID, name: playerName };
                api.sendMessage(`${playerName} đã chọn Mage. Đợi người chơi 2 chọn nhân vật.`, threadID, messageID);
            } else if (!player2) {
                player2 = { ...characters.mage, id: senderID, name: playerName };
                api.sendMessage(`${playerName} đã chọn Mage. Trận đấu bắt đầu!`, threadID, () => {
                    api.sendMessage(`Lượt của ${player1.name} (attack hoặc skill)`, threadID);
                });
            }
        } else if (choice === "3") {
            if (!player1) {
                player1 = { ...characters.rogue, id: senderID, name: playerName };
                api.sendMessage(`${playerName} đã chọn Rogue. Đợi người chơi 2 chọn nhân vật.`, threadID, messageID);
            } else if (!player2) {
                player2 = { ...characters.rogue, id: senderID, name: playerName };
                api.sendMessage(`${playerName} đã chọn Rogue. Trận đấu bắt đầu!`, threadID, () => {
                    api.sendMessage(`Lượt của ${player1.name} (attack hoặc skill)`, threadID);
                });
            }
        } else {
            api.sendMessage("Lựa chọn không hợp lệ. Vui lòng chọn lại nhân vật: 1. Warrior, 2. Mage, 3. Rogue", threadID, (err, info) => {
                global.client.handleReply.push({
                    type: "selectCharacter",
                    name: handleReply.name,
                    author: senderID,
                    messageID: info.messageID
                });
            });
        }
    }
};
