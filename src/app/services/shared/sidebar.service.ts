import { Injectable } from '@angular/core';
import { UsuarioService } from '../service.index';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  menu: any[] = [];
  constructor(public _usuarioService: UsuarioService) {}

  cargarMenu() {
    if (this._usuarioService.menu) this.menu = this._usuarioService.menu;
  }
}
