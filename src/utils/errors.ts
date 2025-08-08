/**
 * Utility module for handling custom errors in the application.
 * It defines a set of predefined errors with their messages, severity levels, and whether they are loggable.
 *
 * Français : Utilitaire pour la gestion des erreurs personnalisées dans l'application.
 * Il définit un ensemble d'erreurs prédéfinies avec leurs messages, niveaux de sévérité et si elles sont enregistrables.
 */

import { CustomErrorPayload } from '../typings';
import { CustomErrorSeverity, CustomErrorType, CustomMessageType } from '../typings/enum';

const errors: Record<CustomErrorType, CustomErrorPayload> = {
  [CustomErrorType.UNKNOWN_ERROR]: {
    message: {
      default: 'An unknown error occurred.',
      code: CustomMessageType.UNKNOWN_ERROR,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.ACTION_IDENTIFIER_ALREADY_EXISTS]: {
    message: {
      default: 'An action with this identifier already exists.',
      code: CustomMessageType.ACTION_IDENTIFIER_ALREADY_EXISTS,
    },
    severity: CustomErrorSeverity.MEDIUM,
    loggable: true,
  },

  [CustomErrorType.ACTION_DISABLED]: {
    message: {
      default: 'This action is currently disabled.',
      code: CustomMessageType.ACTION_DISABLED,
    },
    severity: CustomErrorSeverity.MEDIUM,
    loggable: true,
  },

  [CustomErrorType.ACTION_NOT_FOUND]: {
    message: {
      default: 'The specified action was not found.',
      code: CustomMessageType.ACTION_NOT_FOUND,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.ACTION_WITHOUT_CALLBACK]: {
    message: {
      default: 'The action does not have a valid callback function.',
      code: CustomMessageType.ACTION_WITHOUT_CALLBACK,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.EVENT_IDENTIFIER_ALREADY_EXISTS]: {
    message: {
      default: 'An event with this identifier already exists.',
      code: CustomMessageType.EVENT_IDENTIFIER_ALREADY_EXISTS,
    },
    severity: CustomErrorSeverity.MEDIUM,
    loggable: true,
  },

  [CustomErrorType.EVENT_NOT_FOUND]: {
    message: {
      default: 'The specified event was not found.',
      code: CustomMessageType.EVENT_NOT_FOUND,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.EVENT_DISABLED]: {
    message: {
      default: 'This event is currently disabled.',
      code: CustomMessageType.EVENT_DISABLED,
    },
    severity: CustomErrorSeverity.MEDIUM,
    loggable: true,
  },

  [CustomErrorType.EVENT_WITHOUT_CALLBACK]: {
    message: {
      default: 'The event does not have a valid callback function.',
      code: CustomMessageType.EVENT_WITHOUT_CALLBACK,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.INTERACTION_TYPE_NOT_SUPPORTED]: {
    message: {
      default: 'The interaction type is not supported.',
      code: CustomMessageType.INTERACTION_TYPE_NOT_SUPPORTED,
    },
    severity: CustomErrorSeverity.MEDIUM,
    loggable: true,
  },

  [CustomErrorType.FILE_NOT_FOUND]: {
    message: {
      default: 'The specified file was not found.',
      code: CustomMessageType.FILE_NOT_FOUND,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.INVALID_FILE_TYPE]: {
    message: {
      default: 'The file type is invalid.',
      code: CustomMessageType.INVALID_FILE_TYPE,
    },
    severity: CustomErrorSeverity.MEDIUM,
    loggable: true,
  },

  [CustomErrorType.NO_DEFAULT_EXPORT]: {
    message: {
      default: 'The file does not export a default action.',
      code: CustomMessageType.NO_DEFAULT_EXPORT,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.FOLDER_NOT_FOUND]: {
    message: {
      default: 'The specified folder was not found.',
      code: CustomMessageType.FOLDER_NOT_FOUND,
    },
    severity: CustomErrorSeverity.HIGH,
    loggable: true,
  },

  [CustomErrorType.INVALID_FOLDER_TYPE]: {
    message: {
      default: 'The specified folder is not a valid directory.',
      code: CustomMessageType.INVALID_FOLDER_TYPE,
    },
    severity: CustomErrorSeverity.MEDIUM,
    loggable: true,
  },
};

export default errors;
