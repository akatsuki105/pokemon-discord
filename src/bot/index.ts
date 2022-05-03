import {
  CacheType,
  Client,
  Intents,
  Interaction,
  Message,
  MessageOptions,
  MessagePayload,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  TextChannel,
  User,
} from 'discord.js';
import { Commander } from './command';
import { EmojiHandler } from './emoji';
import { MessageHandler } from './message';

export class DiscordBot extends Client {
  private initalized = false;
  private readonly accessToken: string;
  private readonly commander?: Commander;
  private readonly emoji?: EmojiHandler;
  private readonly message?: MessageHandler;
  private fn?: (b: DiscordBot) => void;

  constructor(
    token: string,
    commander?: Commander,
    emoji?: EmojiHandler,
    message?: MessageHandler,
    fn?: (b: DiscordBot) => void,
  ) {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    });

    this.accessToken = token;
    this.commander = commander;
    this.emoji = emoji;
    this.message = message;
    this.fn = fn;
    this.addEventListeners();
  }

  init = () => {
    if (!this.initalized) {
      this.login(this.accessToken);
      this.initalized = true;
    }
  };

  private addEventListeners() {
    this.once('ready', this.onReady);
    this.on('messageCreate', this.onMessage);
    this.on('messageReactionAdd', this.onReaction);
    this.on('messageReactionRemove', this.onReaction);
    this.on('interactionCreate', this.onInteraction);
  }

  private onReady = () => {
    console.log('Ready!');
    if (this.fn) this.fn(this);
  };

  private onMessage = (message: Message) => {
    if (this.message) {
      return this.message.onMessage(message);
    }
  };

  private onReaction = (reaction: MessageReaction | PartialMessageReaction, u: User | PartialUser) => {
    if (this.emoji) {
      return this.emoji.onReaction(reaction, u);
    }
  };

  private onInteraction = (interaction: Interaction<CacheType>) => {
    if (this.commander) {
      return this.commander.onInteraction(interaction);
    }
  };

  sendMessage = async (
    channelID: string,
    payload: string | MessagePayload | MessageOptions,
  ): Promise<Error | undefined> => {
    const { ch, error } = await this.getTextChannel(channelID);
    if (error) {
      return error;
    }
    if (!ch) return;

    ch.send(payload);
  };

  private getTextChannel = async (channelID: string): Promise<{ ch?: TextChannel; error?: Error }> => {
    const channel = await this.channels.fetch(channelID);
    if (channel == null) {
      return {
        error: new Error(`Channel not found: ${channelID}`),
      };
    }

    if (!(channel instanceof TextChannel)) {
      return {
        error: new Error(`Channel is not text channel: ${channelID}`),
      };
    }

    return {
      ch: channel,
    };
  };
}

export * from './command';
export * from './emoji';
export * from './message';
