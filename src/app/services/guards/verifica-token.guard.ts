import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../service.index';

@Injectable({
  providedIn: 'root',
})
export class VerificaTokenGuard implements CanActivate {
  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
    let token = this._usuarioService.token;
    let payload = JSON.parse(atob(token.split('.')[1])); // ver login component ->  decodeJwtResponse()

    let expirado = this.expirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload); // asyncrono ok!
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let tokenExp = new Date(fechaExp * 1000);
      let ahora = new Date(); // Date From Server is safer

      ahora.setTime(ahora.getTime() + 4 * 60 * 60 * 100); // + 4hr a la hora actual, cuando expira el token.
      // +4 porque los tooken expiran en 4hr y queremos que siempre se actualice

      if (tokenExp.getTime() > ahora.getTime()) {
        console.log('Token no expirado');

        resolve(true); // No hace nada
      } else {
        console.log('Token renovado!!!');
        this._usuarioService.renuevaToken().subscribe(
          () => {
            resolve(true);
          },
          () => {
            reject(false);
            this.router.navigate(['/login']);
          }
        );
      }
    });
  }

  expirado(fechaExp: number) {
    let ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
