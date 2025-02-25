module.exports.config = {
    name: "baucua",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Người tạo ra bạn",
    description: "Chơi Bầu Cua.",
    commandCategory: "Giải trí",
    usages: "baucua [con vật] [số tiền đặt]",
    cooldowns: 5
  };
  
  module.exports.run = async function({ api, event, args, Users }) {
    const { threadID, messageID, senderID } = event;
  
    const choice = args[0]; // Con vật người chơi chọn (bầu, cua, tôm, cá, gà, nai)
    const betAmount = parseInt(args[1]); // Số tiền đặt
  
    // Kiểm tra dữ liệu đầu vào
    if (!choice || !betAmount || isNaN(betAmount) || betAmount <= 0) {
      return api.sendMessage("Vui lòng nhập đúng định dạng: baucua [con vật] [số tiền đặt]", threadID, messageID);
    }
  
    // Danh sách các con vật
    const animals = ["bầu", "cua", "tôm", "cá", "gà", "nai"];
  
    // Kiểm tra xem con vật người chơi chọn có hợp lệ không
    if (!animals.includes(choice)) {
      return api.sendMessage("Con vật bạn chọn không hợp lệ.", threadID, messageID);
    }
  
    try {
      const userData = await Users.getData(senderID);
  
      if (!userData) {
        return api.sendMessage("Bạn chưa có dữ liệu người dùng.", threadID, messageID);
      }
  
      if (betAmount > userData.money) {
        return api.sendMessage("Bạn không đủ tiền để đặt cược.", threadID, messageID);
      }
  
      // Lắc bầu cua
      const result = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * animals.length);
        result.push(animals[randomIndex]);
      }
  
      // Tính toán kết quả
      let message = `
      Kết quả: ${result.join(" - ")}
      `;
  
      let winAmount = 0;
  
      // Kiểm tra xem con vật người chơi chọn có xuất hiện trong kết quả không
      const count = result.filter(animal => animal === choice).length;
      if (count > 0) {
        winAmount = betAmount * count; // Nhân số tiền đặt cược với số lần xuất hiện
        userData.money += winAmount;
        message += `
      Bạn đã thắng ${winAmount} VNĐ!
      `;
      } else {
        userData.money -= betAmount;
        message += `
      Bạn đã thua ${betAmount} VNĐ.
      `;
      }
  
      await Users.setData(senderID, userData);
  
      api.sendMessage(message, threadID, messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Có lỗi xảy ra khi chơi Bầu Cua.", threadID, messageID);
    }
  };