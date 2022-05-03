import { Command } from 'bot/command';
import { Emoji } from 'bot/emoji';
import { OmegaHandler } from 'omega';

export const createSlashCommand = (_: OmegaHandler): Command[] => {
  // `/server`
  const server = {
    name: 'server',
    description: 'get server info',
    fn: async (interaction) => {
      await interaction.reply(
        `Server name: ${interaction.guild?.name}\nTotal members: ${interaction.guild?.memberCount}`,
      );
    },
  } as Command;

  // `/info`
  const info = {
    name: 'info',
    description: 'get game info',
    fn: async (interaction) => {
      await interaction.reply('');
    },
  } as Command;

  // `/townmap`
  const townmap = {
    name: 'townmap',
    description: 'get townmap',
    fn: async (interaction) => {
      await interaction.reply({
        embeds: [
          {
            image: {
              url: 'URL',
            },
          },
        ],
      });
    },
  } as Command;

  return [server, info, townmap];
};

export const createEmojis = (o: OmegaHandler): Emoji[] => {
  return [
    {
      name: '⬆️',
      fn: (r, _) => {
        o.inputs.set('Up', r.count || 0);
      },
    },
    {
      name: '⬇️',
      fn: (r, _) => {
        o.inputs.set('Down', r.count || 0);
      },
    },
    {
      name: '⬅️',
      fn: (r, _) => {
        o.inputs.set('Left', r.count || 0);
      },
    },
    {
      name: '➡️',
      fn: (r, _) => {
        o.inputs.set('Right', r.count || 0);
      },
    },
    {
      name: '🅰️',
      fn: (r, _) => {
        o.inputs.set('A', r.count || 0);
      },
    },
    {
      name: '🅱',
      fn: (r, _) => {
        o.inputs.set('B', r.count || 0);
      },
    },
    {
      name: '▶️',
      fn: (r, _) => {
        o.inputs.set('Start', r.count || 0);
      },
    },
    {
      name: '👆',
      fn: (r, _) => {
        o.inputs.set('Select', r.count || 0);
      },
    },
    {
      name: '🔄',
      fn: () => {
        o.refresh();
      },
    },
  ] as Emoji[];
};
