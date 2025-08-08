/**
 * Utility module for handling custom localized messages in a Discord bot.
 * It provides a function to retrieve the content of a custom message based on its type and parameters.
 *
 * Français : Module utilitaire pour la gestion des messages localisés personnalisés dans un bot Discord.
 * Il fournit une fonction pour récupérer le contenu d'un message personnalisé en fonction de son type et de ses paramètres.
 */

import { BaseMessageOptions, Locale } from 'discord.js';
import { CustomLocalizedMessage, CustomLocalizedMessageContent } from '../typings';
import { CustomMessageType } from '../typings/enum';

/**
 * Retrieves the content of a custom localized message.
 * If the content is a function, it calls the function with the provided parameters.
 *
 * Français : Récupère le contenu d'un message localisé personnalisé.
 * Si le contenu est une fonction, elle est appelée avec les paramètres fournis.
 *
 * @param content The content of the custom localized message, which can be a string, BaseMessageOptions, or a function.
 * @param params Optional parameters to pass to the function if the content is a function.
 * @returns A promise that resolves to the content of the message, which can be a string or BaseMessageOptions.
 */
export const getCustomMessageContent = async (
  content: CustomLocalizedMessageContent,
  params = {}
): Promise<string | BaseMessageOptions> => {
  if (typeof content !== 'function') return content;
  return content(params);
};

const messages: Record<CustomMessageType, CustomLocalizedMessage> = {
  // # Error Messages
  [CustomMessageType.UNKNOWN_ERROR]: {
    default: 'An unknown error occurred.',
    [Locale.French]: "Une erreur inconnue s'est produite.",
  },

  [CustomMessageType.ACTION_IDENTIFIER_ALREADY_EXISTS]: {
    default: 'An action with this identifier already exists.',
    [Locale.French]: 'Une action avec cet identifiant existe déjà.',
  },

  [CustomMessageType.ACTION_DISABLED]: {
    default: 'This action is currently disabled.',
    [Locale.French]: 'Cette action est actuellement désactivée.',
  },

  [CustomMessageType.ACTION_NOT_FOUND]: {
    default: 'The specified action was not found.',
    [Locale.French]: "L'action spécifiée est introuvable.",
  },

  [CustomMessageType.ACTION_WITHOUT_CALLBACK]: {
    default: 'The action does not have a valid callback function.',
    [Locale.French]: "L'action n'a pas de fonction de rappel valide.",
  },

  [CustomMessageType.EVENT_IDENTIFIER_ALREADY_EXISTS]: {
    default: 'An event with this identifier already exists.',
    [Locale.French]: 'Un événement avec cet identifiant existe déjà.',
  },

  [CustomMessageType.EVENT_NOT_FOUND]: {
    default: 'The specified event was not found.',
    [Locale.French]: "L'événement spécifié est introuvable.",
  },

  [CustomMessageType.EVENT_DISABLED]: {
    default: 'This event is currently disabled.',
    [Locale.French]: 'Cet événement est actuellement désactivé.',
  },

  [CustomMessageType.EVENT_WITHOUT_CALLBACK]: {
    default: 'The event does not have a valid callback function.',
    [Locale.French]: "L'événement n'a pas de fonction de rappel valide.",
  },

  [CustomMessageType.INTERACTION_TYPE_NOT_SUPPORTED]: {
    default: 'The interaction type is not supported.',
    [Locale.French]: "Le type d'interaction n'est pas pris en charge.",
  },

  [CustomMessageType.FILE_NOT_FOUND]: {
    default: 'The specified file was not found.',
    [Locale.French]: 'Le fichier spécifié est introuvable.',
  },

  [CustomMessageType.INVALID_FILE_TYPE]: {
    default: 'The file type is invalid.',
    [Locale.French]: 'Le type de fichier est invalide.',
  },

  [CustomMessageType.NO_DEFAULT_EXPORT]: {
    default: 'The file does not export a default action.',
    [Locale.French]: "Le fichier n'exporte pas une action par défaut.",
  },

  [CustomMessageType.FOLDER_NOT_FOUND]: {
    default: 'The specified folder was not found.',
    [Locale.French]: 'Le dossier spécifié est introuvable.',
  },

  [CustomMessageType.INVALID_FOLDER_TYPE]: {
    default: 'The specified folder is not a valid directory.',
    [Locale.French]: "Le dossier spécifié n'est pas un répertoire valide.",
  },
};

export default messages;
