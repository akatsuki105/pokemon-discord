import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { CacheType, CommandInteraction, Interaction } from 'discord.js';

export type Command = {
  name: string;
  description: string;
  fn: (interaction: CommandInteraction<CacheType>) => Promise<void>;
};

export class Commander {
  private initalized = false;
  private readonly clientID: string;
  private readonly guildID: string;
  private readonly token: string;
  private commands: Command[];

  constructor(clientID: string, guildID: string, token: string) {
    this.clientID = clientID;
    this.guildID = guildID;
    this.token = token;
    this.commands = [];
  }

  init = async (commands: Command[]) => {
    if (!this.initalized) {
      this.commands = commands;
      const slashCommands = commands
        .map((c) => {
          return new SlashCommandBuilder().setName(c.name).setDescription(c.description);
        })
        .map((command) => command.toJSON());

      const rest = new REST({ version: '9' }).setToken(this.token);
      await rest.put(Routes.applicationGuildCommands(this.clientID, this.guildID), { body: slashCommands });

      this.initalized = true;
    }
  };

  onInteraction = (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    // eslint-disable-next-line
    this.commands.forEach(async (command) => {
      if (command.name === commandName) {
        await command.fn(interaction);
      }
    });
  };
}
