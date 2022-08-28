import { Usuario } from './usuario.model';

export class Hospital {
  constructor(
    public nombre: string | null,
    public img: string,
    public usuario?: Usuario,
    public _id?: string
  ) {}
}
