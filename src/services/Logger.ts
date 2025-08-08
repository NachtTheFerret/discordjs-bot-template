import { CustomError } from '../errors/CustomError';
import { CustomErrorType } from '../typings/enum';

/**
 * Logger class for handling application-specific logging and error management.
 * It provides methods to set, add, and remove context, as well as to create custom errors.
 *
 * Français: Classe Logger pour gérer les journaux et la gestion des erreurs spécifiques à l'application.
 * Elle fournit des méthodes pour définir, ajouter et supprimer le contexte, ainsi que pour créer des
 * erreurs personnalisées.
 *
 * @example
 * ```ts
 * const logger = new Logger();
 * logger.setContext({ userId: '12345' });
 * logger.addContext('action', 'login');
 *
 * // ... some operations
 *
 * if (someErrorCondition) throw logger.error(CustomErrorType.SOME_ERROR);
 * ```
 */
export class Logger {
  constructor(private context: Record<string, unknown> = {}) {}

  /**
   * Sets the context for the logger.
   * This will overwrite any existing context.
   *
   * Français : Définit le contexte pour le logger.
   * Cela écrasera tout contexte existant.
   *
   * @param context The context to set for the logger.
   */
  public setContext(context: Record<string, unknown>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Adds a key-value pair to the logger's context.
   * This allows for dynamic context addition without overwriting existing context.
   *
   * Français : Ajoute une paire clé-valeur au contexte du logger.
   * Cela permet d'ajouter dynamiquement un contexte sans écraser le contexte existant.
   *
   * @param key The key to add to the context.
   * @param value The value associated with the key.
   */
  public addContext(key: string, value: unknown): void {
    this.context[key] = value;
  }

  /**
   * Removes a key from the logger's context.
   * This is useful for cleaning up context that is no longer needed.
   *
   * Français : Supprime une clé du contexte du logger.
   * Cela est utile pour nettoyer le contexte qui n'est plus nécessaire.
   *
   * @param key The key to remove from the context.
   */
  public removeContext(key: string): void {
    delete this.context[key];
  }

  /**
   * Retrieves the current context of the logger.
   * This returns a copy of the context to prevent external modifications.
   *
   * Français : Récupère le contexte actuel du logger.
   * Cela retourne une copie du contexte pour éviter les modifications externes.
   */
  public getContext(): Record<string, unknown> {
    return { ...this.context };
  }

  /**
   * Creates a new CustomError with the provided code and optional message.
   * The error will include the current context for additional information.
   *
   * Français : Crée une nouvelle CustomError avec le code fourni et un message optionnel.
   * L'erreur inclura le contexte actuel pour des informations supplémentaires.
   *
   * @param code The error code to use for the CustomError.
   * @param message Optional custom message for the error.
   * @returns A new instance of CustomError.
   */
  public error(code: CustomErrorType, message?: string): CustomError {
    const error = new CustomError(code, message, this.context);

    return error;
  }
}
