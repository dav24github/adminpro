import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css'],
})
export class HospitalesComponent implements OnInit {
  hospitales: Hospital[] = [];

  constructor(public _hopitalService: HospitalService) {}

  ngOnInit(): void {
    this.cargarHospitales();
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this._hopitalService
      .buscarHospital(termino)
      .subscribe((hospitales) => (this.hospitales = hospitales));
  }

  cargarHospitales() {
    this._hopitalService.cargarHospitales().subscribe((hospitales) => {
      console.log(hospitales);

      this.hospitales = hospitales;
    });
  }

  guardarHospital(hospital: Hospital) {
    this._hopitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {
    this._hopitalService
      .borrarHospital(hospital._id!)
      .subscribe(() => this.cargarHospitales());
  }

  crearHospital() {
    Swal.fire({
      title: 'Crear Hopital',
      input: 'text',
      icon: 'info',
      inputLabel: 'Ingrese el nombre del hospital',
      inputPlaceholder: 'Nombre del hospital',
    });
  }
}
