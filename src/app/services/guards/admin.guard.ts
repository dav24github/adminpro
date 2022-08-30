import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../service.index';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this._usuarioService.usuario!.role === 'ADMIN_ROLE') {
      console.log('ok ADMIN GUARD');
      return true;
    } else {
      this._usuarioService.logout();
      return false;
    }
  }
}
