/**
 * This module provides utility functions for string manipulation.
 * It includes functions to convert strings to different cases such as camelCase, kebab-case,
 * snake_case, PascalCase, and Title Case.
 *
 * Français : Ce module fournit des fonctions utilitaires pour la manipulation de chaînes de caractères.
 * Il comprend des fonctions pour convertir des chaînes en différentes casses telles que camelCase, kebab-case,
 * snake_case, PascalCase et Title Case.
 */

export class StringUtils {
  static toCamelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ''; // Remove spaces and numbers
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      })
      .replace(/\s+/g, ''); // Remove spaces
  }

  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2') // Add hyphen before uppercase letters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase(); // Convert to lowercase
  }

  static toSnakeCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2') // Add underscore before uppercase letters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .toLowerCase(); // Convert to lowercase
  }

  static toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
        if (+match === 0) return ''; // Remove spaces and numbers
        return match.toUpperCase();
      })
      .replace(/\s+/g, ''); // Remove spaces
  }

  static toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (match) => match.toUpperCase()) // Capitalize first letter of each word
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/-/g, ' '); // Replace hyphens with spaces
  }
}
