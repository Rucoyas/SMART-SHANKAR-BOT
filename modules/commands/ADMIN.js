module.exports.config = {
  name: "admin",
  version: "1.0.7",
  hasPermssion: 3,
  credits: "SHANKAR SUMAN",
  description: "Toggle admin-only command mode",
  commandCategory: "System",
  usages: "Toggle admin and moderators only command mode",
  cooldowns: 0,
  dependencies: {
    "fs-extra": ""
  }
};

module.exports.languages = {
  "vi": {
    "listAdmin": `[ADMIN]\n\n%1`,
    "listNDH": `[MODERATOR]\n\n%1`,
    "notHavePermssion": 'You do not have permission to use the "%1" function',
    "addedNewAdmin": 'Added %1 user(s) as [ADMIN PREMIUM]:\n\n%2',
    "removedAdmin": 'Removed %1 user(s) from [ADMIN PREMIUM]:\n\n%2',
    "adminsupport": 'Added %1 user(s) as [BOT SUPPORT]:\n\n%2',
    "resp": 'Removed %1 user(s) from [BOT SUPPORT]:\n\n%2'
  },
  "en": {
    "listAdmin": '[Admin] Admin list: \n\n%1',
    "notHavePermssion": '[Admin] You have no permission to use "%1"',
    "addedNewAdmin": '[Admin] Added %1 Admin :\n\n%2',
    "removedAdmin": '[Admin] Removed %1 Admin:\n\n%2'
  }
}
module.exports.onLoad = function() {
  const { writeFileSync, existsSync } = require('fs-extra');
  const { resolve } = require("path");
  const path = resolve(__dirname, 'system', 'data.json');
  if (!existsSync(path)) {
    const obj = {
      adminbox: {}
    };
    writeFileSync(path, JSON.stringify(obj, null, 4));
  } else {
    const data = require(path);
    if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
    writeFileSync(path, JSON.stringify(data, null, 4));
  }
}

module.exports.run = async function({ api, event, args, Users, permission, getText }) {
  const content = args.slice(1, args.length);
  if (args.length == 0) 
    return api.sendMessage(`「 ADMIN CONFIG 」\n◆━━━━━━━━━━━━━━◆\n\nMODE - admin add => Add user as ADMIN PREMIUM\nMODE - admin rm => Remove admin role\nMODE - admin sp => Add user as BOT SUPPORT\nMODE - admin resp => Remove BOT SUPPORT role\nMODE - admin list => View admin and BOT SUPPORT list\nMODE - admin box => Toggle QTVonly mode\nFor usage: ${global.config.PREFIX}admin command needed 😋`, event.threadID, event.messageID);
  
  const { threadID, messageID, mentions } = event;
  const { configPath } = global.client;
  const { ADMINBOT } = global.config;
  const { NDH } = global.config;
  const { userName } = global.data;
  const { writeFileSync } = global.nodemodule["fs-extra"];
  const mention = Object.keys(mentions);

  delete require.cache[require.resolve(configPath)];
  var config = require(configPath);

  switch (args[0]) {
    case "list": {
      listAdmin = ADMINBOT || config.ADMINBOT || [];
      var msg = [];
      for (const idAdmin of listAdmin) {
        if (parseInt(idAdmin)) {
          const name = (await Users.getData(idAdmin)).name
          msg.push(`• ${name}\n• Link: fb.me/${idAdmin}`);
        }
      }
      listNDH = NDH || config.NDH || [];
      var msg1 = [];
      for (const idNDH of listNDH) {
        if (parseInt(idNDH)) {
          const name1 = (await Users.getData(idNDH)).name
          msg1.push(`• ${name1}\n• Link: fb.me/${idNDH}`);
        }
      }
      return api.sendMessage(`[ADMIN PREMIUM]\n»===================«\n\n${msg.join("\n")}\n\n————————🔱————————\n\n[Support Users]\n»===================«\n\n${msg1.join("\n\n")}`, event.threadID, event.messageID)
    }

    case "add":
    case "a": {
      const permission = ["61571540572091" permission.includes(event.senderID)) return api.sendMessage("[DEV MODE] This command is only for Developers 💻", event.threadID, event.messageID);
      
      if (event.type == "message_reply") { content[0] = event.messageReply.senderID }
      
      if (mention.length != 0 && isNaN(content[0])) {
        var listAdd = [];

        for (const id of mention) {
          ADMINBOT.push(id);
          config.ADMINBOT.push(id);
          listAdd.push(`[ ${id} ] → ${event.mentions[id]}`);
        };

        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
      } else if (content.length != 0 && !isNaN(content[0])) {
        ADMINBOT.push(content[0]);
        config.ADMINBOT.push(content[0]);
        const name = (await Users.getData(content[0])).name
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("addedNewAdmin", 1, `[ADMIN PREMIUM → ${name}`), threadID, messageID);
      } else return global.utils.throwError(this.config.name, threadID, messageID);
    }

    case "sp": {
      const permission = ["61564459952029", ""];
      if (!permission.includes(event.senderID)) return api.sendMessage("[DEV MODE] This command is only for Developers 💻", event.threadID, event.messageID);

      if (event.type == "message_reply") { content[0] = event.messageReply.senderID }

      if (mention.length != 0 && isNaN(content[0])) {
        var listAdd = [];

        for (const id of mention) {
          NDH.push(id);
          config.NDH.push(id);
          listAdd.push(`[ ${id} ] → ${event.mentions[id]}`);
        };

        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("adminsupport", 1, `[BOT SUPPORT]→ ${name}`), threadID, messageID);
      } else if (content.length != 0 && !isNaN(content[0])) {
        NDH.push(content[0]);
        config.NDH.push(content[0]);
        const name = (await Users.getData(content[0])).name
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("adminsupport", 1, `[BOT SUPPORT] → ${name}`), threadID, messageID);
      } else return global.utils.throwError(this.config.name, threadID, messageID);
    }

    case "remove":
    case "rm":
    case "delete": {
      const permission = ["61564459952029", ""];
      if (!permission.includes(event.senderID)) return api.sendMessage("[DEV MODE] This command is only for Developers 💻", event.threadID, event.messageID);

      if (event.type == "message_reply") { content[0] = event.messageReply.senderID }

      if (mentions.length != 0 && isNaN(content[0])) {
        const mention = Object.keys(mentions);
        var listAdd = [];

        for (const id of mention) {
          const index = config.ADMINBOT.findIndex(item => item == id);
          ADMINBOT.splice(index, 1);
          config.ADMINBOT.splice(index, 1);
          listAdd.push(`[ ${id} ] » ${event.mentions[id]}`);
        };

        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
      } else if (content.length != 0 && !isNaN(content[0])) {
        const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
        ADMINBOT.splice(index, 1);
        config.ADMINBOT.splice(index, 1);
        const name = (await Users.getData(content[0])).name
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("removedAdmin", 1, `[ ${content[0]} ] → ${name}`), threadID, messageID);
      } else global.utils.throwError(this.config.name, threadID, messageID);
    }

    case "resp": {
      const permission = ["61564459952029", ""];
      if (!permission.includes(event.senderID)) return api.sendMessage("[DEV MODE] This command is only for Developers 💻", event.threadID, event.messageID);

      if (event.type == "message_reply") { content[0] = event.messageReply.senderID }

      if (mentions.length != 0 && isNaN(content[0])) {
        const mention = Object.keys(mentions);
        var listAdd = [];

        for (const id of mention) {
          const index = config.NDH.findIndex(item => item == id);
          NDH.splice(index, 1);
          config.NDH.splice(index, 1);
          listAdd.push(`[ ${id} ] » ${event.mentions[id]}`);
        };

        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("resp", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
      } else if (content.length != 0 && !isNaN(content[0])) {
        const index = config.NDH.findIndex(item => item.toString() == content[0]);
        NDH.splice(index, 1);
        config.NDH.splice(index, 1);
        const name = (await Users.getData(content[0])).name
        writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
        return api.sendMessage(getText("resp", 1, `[ ${content[0]} ] → ${name}`), threadID, messageID);
      } else global.utils.throwError(this.config.name, threadID, messageID);
    }

    case "box":
    case "only":
    case "-qtvonly": {
      const { resolve } = require("path");
      const { readFileSync, writeFileSync } = require("fs-extra");
      const pathData = resolve(__dirname, 'system/data.json');
      const dataJson = JSON.parse(readFileSync(pathData));

      if (Object.keys(dataJson.adminbox).includes(threadID)) {
        delete dataJson.adminbox[threadID];
        api.sendMessage("[ QTV ONLY ] Disabled admin-only mode in this group.", threadID, messageID);
      } else {
        dataJson.adminbox[threadID] = true;
        api.sendMessage("[ QTV ONLY ] Enabled admin-only mode in this group.", threadID, messageID);
      }

      return writeFileSync(pathData, JSON.stringify(dataJson, null, 4));
    }

    default: {
      return global.utils.throwError(this.config.name, threadID, messageID);
    }
  }
}
