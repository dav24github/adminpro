import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { catchError, map } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../service.index';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuario!: Usuario | null;
  token!: string;
  menu: any[] = [];

  constructor(
    private http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', resp.token);
        console.log('Token renovado');

        return true;
      }),
      catchError((err) => {
        this.router.navigate(['/login']);
        Swal.fire(
          'No se pudo renovar token',
          'No fue posible renovar token',
          'error'
        );

        return throwError(err);
      })
    );
  }

  estaLogeado() {
    return this.token.length > 5 ? true : false;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle(usuario: any) {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      })
    );
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')!;
      this.usuario = JSON.parse(localStorage.getItem('usuario')!);
      this.menu = JSON.parse(localStorage.getItem('menu')!);
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
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
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      }),
      catchError((err) => {
        Swal.fire('Error en el login', err.error.mensaje, 'error');

        return throwError(err);
      })
    );
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        Swal.fire('Usuario creado', usuario.email, 'success');
        return resp.usuario;
      }),
      catchError((err) => {
        Swal.fire(
          err.error.mensaje,
          'Ya existe una cuenta con este correo',
          'error'
        );

        return throwError(err);
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        if (usuario._id === this.usuario?._id) {
          // Si el usuario es yo mismo
          let usuarioDB = resp.usuario;
          this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
        }
        Swal.fire('Usuario actualizado', usuario.nombre!, 'success');

        return true;
      }),
      catchError((err) => {
        Swal.fire(err.error.mensaje, err.error.errors.message, 'error');

        return throwError(err);
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    const formData = new FormData();
    formData.append('imagen', archivo);

    let url = URL_SERVICIOS + '/upload/usuarios/' + id;

    this.http.put(url, formData).subscribe((resp: any) => {
      this.usuario!.img = resp.data.img;

      Swal.fire('imagen Actualizada', resp.data.nombre, 'success');

      this.guardarStorage(id, this.token, this.usuario!, this.menu);
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

  buscarUsuario(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url).pipe(
      map((resp) => {
        Swal.fire(
          'Usuario borrar',
          'El usuario ha sido eliminado correctamente',
          'success'
        );
        return true;
      })
    );
  }
}
