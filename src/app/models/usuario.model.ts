export class Usuario {
  // Typescript
  constructor(
    public nombre: string | null,
    public email: string,
    public password: string,
    public img?: string,
    public role?: string,
    public google?: boolean,
    public _id?: string
  ) {}
}
