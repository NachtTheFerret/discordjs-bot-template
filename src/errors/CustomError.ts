/**
 * CustomError class for handling application-specific errors.
 * It extends the built-in Error class and includes additional properties such as severity and loggable.
 * It is used to provide more context and control over error handling in the application.
 *
 * Français: Classe CustomError pour gérer les erreurs spécifiques à l'application.
 * Elle étend la classe Error intégrée et inclut des propriétés supplémentaires telles que la sévérité et la possibilité de log les erreurs.
 * Elle est utilisée pour fournir plus de contexte et de contrôle sur la gestion des erreurs dans le application.
 */

import { CustomErrorSeverity, CustomErrorType } from '../typings/enum';
import errors from '../utils/errors';

export class CustomError extends Error {
  /**
   * The error code for this custom error.
   * This should be one of the predefined error codes in the `errors` module.
   * It is used to identify the type of error that occurred.
   *
   * Français: Le code d'erreur pour cette erreur personnalisée.
   * Cela doit être l'un des codes d'erreur prédéfinis dans le module `errors`.
   * Il est utilisé pour identifier le type d'erreur qui s'est produite.
   */
  public code: CustomErrorType;

  /**
   * The urgency level of the error.
   * This indicates how critical the error is and whether it should be logged.
   *
   * Français: Le niveau d'urgence de l'erreur.
   * Cela indique à quel point l'erreur est critique et si elle doit être enregistrée
   */
  public severity: CustomErrorSeverity;

  /**
   * The logging status of the error.
   * This indicates whether the error should be logged or not.
   *
   * Français: Le statut d'enregistrement de l'erreur.
   * Cela indique si l'erreur doit être enregistrée ou non.
   */
  public loggable: boolean;

  /**
   * Constructs a new CustomError instance.
   * It initializes the error with a message based on the provided code and optional custom message.
   * If the code is not found in the predefined errors, it defaults to a generic unknown error message.
   *
   * Français: Construit une nouvelle instance de CustomError.
   * Il initialise l'erreur avec un message basé sur le code fourni et un message personnalisé
   * optionnel. Si le code n'est pas trouvé dans les erreurs prédéfinies, il utilise un message d'erreur inconnu générique.
   */
  constructor(code: CustomErrorType, message?: string, public context: Record<string, unknown> = {}) {
    const msg = errors[code]?.message?.default || message || errors.UNKNOWN_ERROR.message.default;

    super(msg);

    this.name = 'CustomError';
    this.code = code;
    this.severity = errors[code]?.severity || CustomErrorSeverity.HIGH;
    this.loggable = errors[code]?.loggable ?? true;
    this.message = msg;
  }
}
