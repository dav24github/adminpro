import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/components/modal-upload/modal.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;

  totalResgistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();

    this._modalService.notificacion.subscribe((resp) => this.cargarUsuarios());
  }

  mostarModal(id: string) {
    this._modalService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;

    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {
      this.totalResgistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    if (desde >= this.totalResgistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService
      .buscarUsuario(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id == this._usuarioService.usuario!._id) {
      Swal.fire(
        'No puede borrar usuario',
        'No se puede borrar a si mismo',
        'error'
      );
      return;
    }

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Está a punto de borrar al usuario' + usuario.nombre + '.',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this._usuarioService.borrarUsuario(usuario._id!).subscribe((resp) => {
          console.log(resp);
          this.desde = 0;
          this.cambiarDesde(this.desde);
        });
      } else if (result.isDenied) {
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario).subscribe();
  }
}
