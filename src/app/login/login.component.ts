import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/service.index';

declare function init_plugins(): any;

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  email!: string;
  recuerdame: boolean = false;

  constructor(public router: Router, public _usuarioService: UsuarioService) {}

  ngAfterViewInit(): void {
    let handleCredentialResponse = (response: any) => {
      this.loginWithGoogle(response.credential);
    };

    google.accounts.id.initialize({
      client_id:
        '296190540237-m4ddjcopr2852gqoutgs71ddmfue2h5u.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(document.getElementById('buttonDiv'), {
      type: 'icon',
    });
  }

  ngOnInit(): void {
    init_plugins();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  loginWithGoogle(credential: string) {
    const responsePayload = this.decodeJwtResponse(credential);
    // console.log('ID: ' + responsePayload.sub);
    // console.log('Full Name: ' + responsePayload.name);
    // console.log('Given Name: ' + responsePayload.given_name);
    // console.log('Family Name: ' + responsePayload.family_name);
    // console.log('Image URL: ' + responsePayload.picture);
    // console.log('Email: ' + responsePayload.email);
    let usuario = new Usuario(
      responsePayload.name,
      responsePayload.email,
      '',
      responsePayload.picture
    );

    this._usuarioService.loginGoogle(usuario).subscribe((resp) => {
      // this.router.navigate(['/dashboard']);
      window.location.href = '#/dashboard';
    });
  }

  ingresar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    let usuario = new Usuario(null, form.value.email, form.value.password);

    this._usuarioService
      .login(usuario, form.value.recuerdame)
      .subscribe((resp) => {
        // this.router.navigate(['/dashboard']);
        window.location.href = '#/dashboard';
      });
  }

  decodeJwtResponse(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
