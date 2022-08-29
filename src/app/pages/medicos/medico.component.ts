import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/components/modal-upload/modal.service';
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
  medico: Medico = new Medico('', '', null, null, '');
  hospitalId: string = '';

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalService: ModalService
  ) {
    activatedRoute.params.subscribe((params) => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit(): void {
    this._hospitalService
      .cargarHospitales()
      .subscribe((hospitales) => (this.hospitales = hospitales));

    this._modalService.notificacion.subscribe((resp: any) => {
      this.medico.img = resp.data.img;
    });
  }

  cargarMedico(id: string) {
    this._medicoService.cargarMedico(id).subscribe((medico) => {
      this.medico = medico;
      this.medico.hospital = medico.hospital;
      this.hospitalId = medico.hospital._id;
    });
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }

    this._medicoService.guardarMedico(this.medico).subscribe((medico) => {
      this.medico._id = medico._id;
      this.router.navigate(['/medico', medico._id]);
    });
  }

  cambioHospital(id: string) {
    this._hospitalService
      .obtenerHospital(id)
      .subscribe((hospital) => (this.medico.hospital = hospital));
  }

  cambiarFoto() {
    this._modalService.mostrarModal('medicos', this.medico._id!!);
  }
}
