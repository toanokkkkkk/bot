module.exports = async ({ api }) => {
  const logger = require('./utils/log');
  const configCustom = {
    autoRestart: {
      status: true,
      time: 40, // 40 minutes
      note: 'To avoid problems, enable periodic bot restarts'
    },
    acceptPending: {
      status: true,
      time: 30, // 30 minutes
      note: 'Approve waiting messages after a certain time'
    }
  };

  function autoRestart(config) {
    if (config.status) {
      setInterval(() => {
        logger(`Start rebooting the system!`, "[ Auto Restart ]");
        process.exit(1);
      }, config.time * 60 * 1000);
    }
  }

  async function acceptPending(config) {
    if (config.status) {
      setInterval(async () => {
        try {
          const list = [
            ...(await api.getThreadList(1, null, ['PENDING'])),
            ...(await api.getThreadList(1, null, ['OTHER']))
          ];
          if (list[0]) {
            api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
          }
        } catch (error) {
          logger(`Error in accepting pending messages: ${error.message}`, "[ Accept Pending ]");
        }
      }, config.time * 60 * 1000);
    }
  }

  autoRestart(configCustom.autoRestart);
  acceptPending(configCustom.acceptPending);
};
