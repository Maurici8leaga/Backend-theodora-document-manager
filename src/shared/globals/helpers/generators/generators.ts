// aqui iran abstraciones de clases las cuales podran ser implementadas en otros files
// de esta forma se mantiene un arquitectura limpia

export class Generators {
  // metodo para solo tener texto con primeras letras en mayusculaa
  static firstLetterCapitalized(str: string): string {
    const stringCapitalized = str.toLowerCase();

    return stringCapitalized
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }

  // metodo para convertir un buffer en base64
  static convertToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  // metodo para crear un random id de 3 digitos
  static randomIdGenerator(): number {
    return Math.floor(Math.random() * (999 - 100) + 100);
  }
}
