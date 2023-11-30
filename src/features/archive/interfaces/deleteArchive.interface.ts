// (SOLID Interface Segregation)
export interface IDeleteArchive {
  // esta estructura se logro haciendo console a lo que devuelve la funcion al eliminar un archivo
  acknowledged: boolean;
  deletedCount: number;
}
