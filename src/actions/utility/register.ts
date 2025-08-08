import { Locale } from 'discord.js';
import { Action } from '../../typings';
import { ActionType, CustomErrorType } from '../../typings/enum';
import { CustomError } from '../../errors/CustomError';
import { database } from '../../database';
import { UserModel } from '../../models/UserModel';

export default <Action<ActionType.ChatInput>>{
  identifier: 'register',
  type: ActionType.ChatInput,

  data: {
    name: 'register',
    nameLocalizations: {
      [Locale.French]: 'enregistrer',
    },
    description: 'Register your account',
    descriptionLocalizations: {
      [Locale.French]: 'Enregistrer votre compte',
    },
  },

  callback: async (interaction) => {
    const user = await UserModel.findOne({ where: { discordId: interaction.user.id } });
    if (user) return interaction.reply({ content: 'You are already registered.' });

    await UserModel.create({
      discordId: interaction.user.id,
      lastUsername: interaction.user.username,
      lastDisplayName: interaction.user.displayName,
      lastAvatar: interaction.user.avatar,
    });

    return interaction.reply({
      content: 'You have been successfully registered. You can now use the bot.',
    });
  },
};
