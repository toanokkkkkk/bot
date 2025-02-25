const axios = require('axios');
const fs = require('fs-extra');
const { createReadStream, unlinkSync } = require('fs-extra');
const { resolve } = require('path');

module.exports.config = {
    name: "4k",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "YourName",
    description: "Gửi yêu cầu để cải thiện ảnh và gửi lại ảnh được cải thiện",
    commandCategory: "Utilities",
    cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID, messageReply } = event;
    let imageUrl;

    if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
        const attachment = messageReply.attachments[0];
        if (attachment.type === 'photo') {
            imageUrl = attachment.url;
        }
    } else {
        imageUrl = args[0];
    }

    if (!imageUrl) return api.sendMessage("Vui lòng cung cấp URL của ảnh cần cải thiện hoặc reply vào ảnh bạn muốn cải thiện.", threadID, messageID);

    try {
        const response = await axios.get(`http://localhost:3000/enhanceImage?url=${encodeURIComponent(imageUrl)}`);
        const { enhancedImageUrl } = response.data;

        // Tải ảnh từ URL đã cải thiện
        const enhancedImageResponse = await axios.get(enhancedImageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(enhancedImageResponse.data, 'binary');

        // Lưu ảnh tạm thời
        const tempImagePath = resolve(__dirname, 'cache', `enhancedImage_${Date.now()}.jpeg`);
        fs.writeFileSync(tempImagePath, buffer);

        // Gửi ảnh trực tiếp
        api.sendMessage({
            body: "Đây là ảnh đã được cải thiện!",
            attachment: createReadStream(tempImagePath)
        }, threadID, () => {
            unlinkSync(tempImagePath); // Xóa ảnh tạm thời sau khi gửi
        }, messageID);
    } catch (error) {
        console.error('Đã xảy ra lỗi khi yêu cầu API:', error.message);
        api.sendMessage(`Đã xảy ra lỗi khi yêu cầu API: ${error.message}`, threadID, messageID);
    }
};
