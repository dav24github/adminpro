import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  usuario!: Usuario | null;

  constructor(public _usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuario = this._usuarioService.usuario;
  }
}
