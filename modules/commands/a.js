module.exports.config = {
    name: "a",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "YourName",
    description: "Bật hoặc tắt chế độ bảo vệ ảnh đại diện",
    commandCategory: "Utilities",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID, senderID } = event;
    const action = args[0] && args[0].toLowerCase();

    if (!action || (action !== 'bật' && action !== 'tắt')) {
        return api.sendMessage("Vui lòng sử dụng lệnh với 'bật' hoặc 'tắt' để thay đổi chế độ bảo vệ ảnh đại diện. Ví dụ: /setProfileGuard bật", threadID, messageID);
    }

    try {
        await api.setProfileGuard(senderID, action === 'bật');
        api.sendMessage(`Chế độ bảo vệ ảnh đại diện của bạn đã được ${action === 'bật' ? 'bật' : 'tắt'}.`, threadID, messageID);
    } catch (error) {
        console.error('Đã xảy ra lỗi khi thay đổi chế độ bảo vệ ảnh đại diện:', error.message);
        api.sendMessage(`Đã xảy ra lỗi khi thay đổi chế độ bảo vệ ảnh đại diện: ${error.message}`, threadID, messageID);
    }
};
