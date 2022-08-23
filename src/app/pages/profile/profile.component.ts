import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  usuario!: Usuario;

  imagenSubir: File | null = null;
  imagenTemp!: string;

  constructor(public _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario!;
  }

  ngOnInit(): void {}

  guardar(usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario(this.usuario).subscribe((resp) => {
      console.log(resp);
    });
  }

  selecionImagen(event: any) {
    let archivo = event.target.files[0];

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire(
        'Solo Imagenes',
        'El archivo selecionado no es una imagen',
        'error'
      );
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    // -----------VANILLA JS------------
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => {
      this.imagenTemp = reader.result as string;
    };
  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen(this.imagenSubir!, this.usuario._id!);
  }
}
