import { MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';

export type Emoji = {
  name: string; // e.g. "👆"
  fn: (reaction: MessageReaction | PartialMessageReaction, u: User | PartialUser) => Promise<void>;
};

export class EmojiHandler {
  private readonly emojis: Emoji[];

  constructor(emojis: Emoji[]) {
    this.emojis = emojis;
  }

  onReaction = (reaction: MessageReaction | PartialMessageReaction, u: User | PartialUser) => {
    if (u.bot) return; // Botからのリアクションは無視

    const emoji = reaction.emoji.name;

    // eslint-disable-next-line
    this.emojis.forEach(async (e) => {
      if (e.name == emoji) {
        await e.fn(reaction, u);
      }
    });
  };
}
