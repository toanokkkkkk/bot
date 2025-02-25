module.exports.config = {
    name: "add",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "YourName",
    description: "Thêm thành viên vào nhóm chat của bạn bằng ID",
    commandCategory: "Quản lý nhóm",
    usages: "add [ID thành viên]",
    cooldowns: 5
};

module.exports.languages = {
    "vi": {
        "missingID": "Vui lòng nhập ID của thành viên bạn muốn thêm vào nhóm.",
        "addSuccess": "Đã thêm thành công thành viên có ID %1 vào nhóm.",
        "addFail": "Không thể thêm thành viên có ID %1 vào nhóm."
    },
    "en": {
        "missingID": "Please provide the ID of the member you want to add to the group.",
        "addSuccess": "Successfully added the member with ID %1 to the group.",
        "addFail": "Unable to add the member with ID %1 to the group."
    }
};

module.exports.run = async ({ api, event, args, getText }) => {
    const { threadID, messageID } = event;

    if (args.length === 0) {
        return api.sendMessage(getText("missingID"), threadID, messageID);
    }

    const targetID = args[0];

    try {
        await api.addUserToGroup(targetID, threadID);
        api.sendMessage(getText("addSuccess", targetID), threadID, messageID);
    } catch (error) {
        api.sendMessage(getText("addFail", targetID), threadID, messageID);
    }
};
