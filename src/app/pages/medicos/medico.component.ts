import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService, MedicoService } from 'src/app/services/service.index';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css'],
})
export class MedicoComponent implements OnInit {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico();

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this._hospitalService
      .cargarHospitales()
      .subscribe((hospitales) => (this.hospitales = hospitales));
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }

    this._medicoService.guardarMedico(this.medico).subscribe((medico) => {
      console.log(medico);
    });
  }
}
