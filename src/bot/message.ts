import { Message } from 'discord.js';

export class MessageHandler {
  onMessage = (m: Message) => {
    // Botからのメッセージは無視
    if (m.author.bot) return;

    // !ping で始まるメッセージに対して Pong! を返す
    if (m.content.startsWith('!A')) {
      m.channel.send('Pong!');
    }
  };
}
