import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/service.index';

declare function init_plugins(): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  sonIguales(campo1: string, campo2: string): any {
    return (group: FormGroup) => {
      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true,
      };
    };
  }

  ngOnInit(): void {
    init_plugins();

    this.form = new FormGroup(
      {
        nombre: new FormControl(null, Validators.required),
        correo: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, Validators.required),
        password2: new FormControl(null, Validators.required),
        condiciones: new FormControl(false),
      },
      { validators: this.sonIguales('password', 'password2') }
    );
  }

  registrarUsuario() {
    if (this.form.invalid) {
      return;
    }

    if (!this.form.value.condiciones) {
      Swal.fire('Importante', 'Debe de aceptar las condiciones', 'warning');
      return;
    }

    let usuario = new Usuario(
      this.form.value.nombre,
      this.form.value.correo,
      this.form.value.password
    );

    this._usuarioService.crearUsuario(usuario).subscribe((resp) => {
      console.log(resp);
      this.router.navigate(['/login']);
    });
  }
}
