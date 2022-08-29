import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];

  constructor(public _medicoService: MedicoService) {}

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this._medicoService
      .cargarMedicos()
      .subscribe((medicos) => (this.medicos = medicos));
  }

  buscarMedicos(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this._medicoService
      .buscarMedico(termino)
      .subscribe((medicos) => (this.medicos = medicos));
  }

  borrarMedico(id: string) {
    this._medicoService.borrarMedico(id).subscribe(() => this.cargarMedicos());
  }

  crearMedico() {}

  editarMedico(medico: Medico) {}
}
