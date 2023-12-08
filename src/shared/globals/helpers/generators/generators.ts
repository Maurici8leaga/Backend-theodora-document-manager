// Class for abstraction functions
export class Generators {
  // Method for transfor a str to uppercase
  static firstLetterCapitalized(str: string): string {
    const stringCapitalized = str.toLowerCase();

    return stringCapitalized
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }

  // Method to transform a buffer to base64
  static convertToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  // Method to create a random ID of 3 digits
  static randomIdGenerator(): number {
    return Math.floor(Math.random() * (999 - 100) + 100);
  }
}
