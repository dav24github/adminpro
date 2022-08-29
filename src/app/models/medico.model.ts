import { Hospital } from './hospital.model';
import { Usuario } from './usuario.model';

export class Medico {
  constructor(
    public nombre?: string | null,
    public img?: string,
    public usuario?: Usuario | null,
    public hospital?: Hospital | null,
    public _id?: string
  ) {}
}
