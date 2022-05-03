import { MessageAttachment } from 'discord.js';
import { config } from 'dotenv';
import { createEmojis, createSlashCommand } from './helper';
import { DiscordBot, Commander, EmojiHandler } from 'bot';
import { OmegaHandler } from 'omega';

type Env = {
  token: string;
  clientID: string;
  guildID: string;
  channelID: string;
  omegaPath: string;
  romPath: string;
};

const SECOND = 1000;

const main = async () => {
  const { data, error } = readEnv();
  if (error) {
    console.error(error);

    return;
  }
  const { token, clientID, guildID, channelID, omegaPath, romPath } = data!;

  const omega = new OmegaHandler(omegaPath, romPath);

  const fn = (bot: DiscordBot) => {
    const run = () => {
      omega.run();
      const { data } = omega.screen();
      const file = new MessageAttachment(data, 'screen.png');
      bot.sendMessage(channelID, {
        files: [file],
      });
    };

    run();
    setInterval(() => {
      if (omega.updated()) {
        run();
      }
    }, SECOND * 3);
  };

  const commander = new Commander(clientID, guildID, token);
  await commander.init(createSlashCommand(omega));

  const emojiHandler = new EmojiHandler(createEmojis(omega));

  const bot = new DiscordBot(token, commander, emojiHandler, undefined, fn);
  bot.init();
};

const readEnv = (): { data?: Env; error?: Error } => {
  config();

  const token = process.env.TOKEN;
  if (!token) {
    return {
      error: new Error('No token'),
    };
  }

  const clientID = process.env.CLIENT_ID;
  if (!clientID) {
    return {
      error: new Error('No client ID'),
    };
  }

  const guildID = process.env.GUILD_ID;
  if (!guildID) {
    return {
      error: new Error('No guild ID'),
    };
  }

  const channelID = process.env.CHANNEL_ID;
  if (!channelID) {
    return {
      error: new Error('No channel ID'),
    };
  }

  const omegaPath = process.env.OMEGA_PATH;
  if (!omegaPath) {
    return {
      error: new Error('No Omega emulator path'),
    };
  }

  const romPath = process.env.ROM_PATH;
  if (!romPath) {
    return {
      error: new Error('No ROM path'),
    };
  }

  return {
    data: {
      token,
      clientID,
      guildID,
      channelID,
      omegaPath,
      romPath,
    },
  };
};

main();
