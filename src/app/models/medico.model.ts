import { Hospital } from './hospital.model';
import { Usuario } from './usuario.model';

export class Medico {
  constructor(
    public nombre?: string | null,
    public img?: string,
    public usuario?: Usuario,
    public hospital?: Hospital,
    public _id?: string
  ) {}
}
