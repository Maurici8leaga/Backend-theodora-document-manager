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
}
