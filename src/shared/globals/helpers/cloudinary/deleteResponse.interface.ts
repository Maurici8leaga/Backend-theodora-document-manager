// ya que cloudinary no tiene una interfaz de respuesta para los delete file, creamos una en base a lo que responde el result

export interface IDeleteResponse {
  deleted: Record<string, string>; // Un objeto con claves de tipo string y valores de tipo string
  // Record<string, string>: Representa un objeto donde todas las claves y todos los valores son de tipo string
  deleted_counts: Record<string, { original: number; derived: number }>; // Un objeto con claves de tipo string y valores de tipo objeto
  // Record<string, { original: number; derived: number }>: Representa un objeto donde las claves son de tipo string y los valores son objetos con las propiedades original y derived, ambas de tipo number
  partial: boolean;
  rate_limit_allowed: number;
  rate_limit_reset_at: Date;
  rate_limit_remaining: number;
}
