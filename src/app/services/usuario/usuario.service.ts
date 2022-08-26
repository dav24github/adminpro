import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../service.index';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuario!: Usuario | null;
  token!: string;

  constructor(
    private http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogeado() {
    return this.token.length > 5 ? true : false;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle(usuario: any) {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
      })
    );
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')!;
      this.usuario = JSON.parse(localStorage.getItem('usuario')!);
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        Swal.fire('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        let usuarioDB = resp.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
        Swal.fire('Usuario actualizado', usuario.nombre!, 'success');

        return true;
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    const formData = new FormData();
    formData.append('imagen', archivo);

    let url = URL_SERVICIOS + '/upload/usuarios/' + id;

    this.http.put(url, formData).subscribe((resp: any) => {
      this.usuario!.img = resp.usuario.img;

      Swal.fire('imagen Actualizada', resp.usuario.nombre, 'success');

      this.guardarStorage(id, this.token, this.usuario!);
    });

    // ---------------VANILLA JS--------------
    // this._subirArchivoService
    //   .subirArchivo(archivo!, 'usuarios', id)
    //   .then((resp: any) => {
    //     this.usuario!.img = resp.usuario.img;

    //     Swal.fire('imagen Actualizada', resp.usuario.nombre, 'success');

    //     this.guardarStorage(id, this.token, this.usuario!);
    //   })
    //   .catch((resp) => {
    //     console.log(resp);
    //   });
  }

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }
}
