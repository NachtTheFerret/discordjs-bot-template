export class JsonUtils {
  static parse<T>(json: string): T {
    try {
      return JSON.parse(json) as T;
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  static stringify<T>(data: T): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      throw new Error(`Failed to stringify data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  static isValid(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
    }
  }

  static format(json: string): string {
    if (!this.isValid(json)) throw new Error('Invalid JSON string provided for formatting.');
    return JSON.stringify(JSON.parse(json), null, 2);
  }
}
