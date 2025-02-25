const os = require('os');
const si = require('systeminformation');

module.exports.config = {
    name: "botInfo",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "YourName",
    description: "Kiểm tra thông tin của bot",
    commandCategory: "System",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID } = event;
    try {
        const uptime = os.uptime();
        const freemem = os.freemem();
        const totalmem = os.totalmem();
        const loadavg = os.loadavg();
        const cpus = os.cpus();

        const cpuInfo = await si.cpu();
        const memInfo = await si.mem();
        const osInfo = await si.osInfo();
        const networkInterfaces = await si.networkInterfaces();
        const diskLayout = await si.diskLayout();
        const processes = await si.processes();

        const botInfoMessage = `📊 Thông tin của bot 📊\n\n` +
                               `🕒 Thời gian hoạt động: ${Math.floor(uptime / 60)} phút\n` +
                               `📊 RAM khả dụng: ${(freemem / 1024 / 1024).toFixed(2)} MB\n` +
                               `📊 Tổng RAM: ${(totalmem / 1024 / 1024).toFixed(2)} MB\n` +
                               `📊 CPU Load Average: ${loadavg.map(avg => avg.toFixed(2)).join(', ')}\n\n` +
                               `💻 Thông tin CPU:\n` +
                               `- Model: ${cpuInfo.brand}\n` +
                               `- Speed: ${cpuInfo.speed} GHz\n` +
                               `- Cores: ${cpuInfo.cores}\n` +
                               `- Physical Cores: ${cpuInfo.physicalCores}\n\n` +
                               `💾 Thông tin RAM:\n` +
                               `- Total: ${(memInfo.total / 1024 / 1024).toFixed(2)} MB\n` +
                               `- Free: ${(memInfo.free / 1024 / 1024).toFixed(2)} MB\n` +
                               `- Used: ${(memInfo.used / 1024 / 1024).toFixed(2)} MB\n\n` +
                               `🖥️ Thông tin Hệ Điều Hành:\n` +
                               `- OS: ${osInfo.distro}\n` +
                               `- Platform: ${osInfo.platform}\n` +
                               `- Arch: ${osInfo.arch}\n\n` +
                               `🌐 Thông tin Mạng:\n` +
                               `${networkInterfaces.map(net => `- ${net.iface}: ${net.ip4} (${net.speed} Mbps)`).join('\n')}\n\n` +
                               `💾 Thông tin Ổ Cứng:\n` +
                               `${diskLayout.map(disk => `- ${disk.device}: ${disk.size / 1024 / 1024 / 1024} GB (${disk.type})`).join('\n')}\n\n` +
                               `⚙️ Các Tiến Trình Đang Chạy:\n` +
                               `- Tổng số tiến trình: ${processes.all}\n` +
                               `- Đang chạy: ${processes.running}\n` +
                               `- Kích thước bộ nhớ: ${(processes.mem / 1024 / 1024).toFixed(2)} MB`;

        api.sendMessage(botInfoMessage, threadID, messageID);
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy thông tin hệ thống:', error.message);
        api.sendMessage(`Đã xảy ra lỗi khi lấy thông tin hệ thống: ${error.message}`, threadID, messageID);
    }
};
