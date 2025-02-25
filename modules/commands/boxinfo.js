module.exports.config = {
    name: "boxinfo",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Người tạo ra bạn",
    description: "Lấy thông tin của box chat.",
    commandCategory: "Tiện ích",
    usages: "boxinfo",
    cooldowns: 5
  };
  
  module.exports.run = async function({ api, event, args, Threads }) {
    const { threadID, messageID } = event;
  
    try {
      const threadData = await Threads.getData(threadID);
  
      if (!threadData || !threadData.threadInfo) {
        return api.sendMessage("Không tìm thấy thông tin box chat trong dữ liệu cục bộ.", threadID, messageID);
      }
  
      const { threadInfo } = threadData;
      const { threadName, emoji, adminIDs, participantIDs, isGroup, createTime } = threadInfo;
  
      const adminCount = adminIDs ? adminIDs.length : 0;
      const participantCount = participantIDs ? participantIDs.length : 0;
  
      let message = `
      Thông tin box chat:
      - Tên: ${threadName || "Không có"}
      - Emoji: ${emoji || "Không có"}
      - Số thành viên: ${participantCount}
      - Số admin: ${adminCount}
      - Đây là nhóm: ${isGroup ? "Có" : "Không"}
      `;
     //`🔹 Thời gian tạo nhóm: ${new Date(threadInfo.creation_time * 1000).toLocaleString()}
      api.sendMessage(message, threadID, messageID);
  
    } catch (error) {
      console.error("Lỗi trong lệnh boxinfo:", error);
      api.sendMessage("Có lỗi xảy ra khi lấy thông tin box chat.", threadID, messageID);
    }
  };