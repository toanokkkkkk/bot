const fs = require('fs');
const path = require('path');
const busyFilePath = path.join(__dirname, 'cache', 'busy.json');

let busyList = {};

if (fs.existsSync(busyFilePath)) {
    busyList = JSON.parse(fs.readFileSync(busyFilePath));
} else {
    fs.writeFileSync(busyFilePath, JSON.stringify(busyList));
}

module.exports.config = {
    name: "busy",
    version: "1.2.2",
    hasPermssion: 0,
    credits: "YourName",
    description: "Bật/Tắt chế độ không làm phiền",
    commandCategory: "Hệ thống",
    usages: "busy [on/off] [lý do]",
    cooldowns: 5
};

module.exports.languages = {
    "vi": {
        "turnedOff": "X | Đã tắt chế độ không làm phiền",
        "turnedOn": "O | Đã bật chế độ không làm phiền",
        "turnedOnWithReason": "✅ | Đã bật chế độ không làm phiền với lý do: %1",
        "turnedOnWithoutReason": "✅ | Đã bật chế độ không làm phiền",
        "alreadyOn": "Hiện tại người dùng %1 đang bận",
        "alreadyOnWithReason": "Hiện tại người dùng %1 đang bận với lý do: %2",
        "missingArgs": "Vui lòng sử dụng đúng cú pháp: dnd [on/off] [lý do]"
    },
    "en": {
        "turnedOff": "✅ | Do not disturb mode has been turned off",
        "turnedOn": "✅ | Do not disturb mode has been turned on",
        "turnedOnWithReason": "✅ | Do not disturb mode has been turned on with reason: %1",
        "turnedOnWithoutReason": "✅ | Do not disturb mode has been turned on",
        "alreadyOn": "User %1 is currently busy",
        "alreadyOnWithReason": "User %1 is currently busy with reason: %2",
        "missingArgs": "Please use the correct format: dnd [on/off] [reason]"
    }
};

module.exports.run = async ({ api, event, args, getText }) => {
    const { senderID, threadID, messageID } = event;
    const senderName = (await api.getUserInfo([senderID]))[senderID].name;

    if (args.length < 1) {
        return api.sendMessage(getText("missingArgs"), threadID, messageID);
    }

    const command = args[0].toLowerCase();
    const reason = args.slice(1).join(" ");

    if (command === "on") {
        if (!reason) {
            return api.sendMessage(getText("missingArgs"), threadID, messageID);
        }
        busyList[senderID] = { reason, name: senderName };
        fs.writeFileSync(busyFilePath, JSON.stringify(busyList));
        api.sendMessage(getText("turnedOnWithReason", reason), threadID, messageID);
    } else if (command === "off") {
        delete busyList[senderID];
        fs.writeFileSync(busyFilePath, JSON.stringify(busyList));
        api.sendMessage(getText("turnedOff"), threadID, messageID);
    } else {
        api.sendMessage(getText("missingArgs"), threadID, messageID);
    }
};

module.exports.handleEvent = async ({ api, event, getText }) => {
    const { mentions, threadID, messageID } = event;

    if (mentions && Object.keys(mentions).length > 0) {
        const mentionIDs = Object.keys(mentions);

        for (const userID of mentionIDs) {
            if (busyList[userID]) {
                const { reason, name } = busyList[userID];
                return api.sendMessage(getText("alreadyOnWithReason", name, reason), threadID, messageID);
            }
        }
    }
};
