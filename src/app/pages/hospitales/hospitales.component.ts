import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/components/modal-upload/modal.service';
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

  constructor(
    public _hopitalService: HospitalService,
    public _modalUploadService: ModalService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe(() =>
      this.cargarHospitales()
    );
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
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
    }).then((input: any) => {
      if (!input || input.value.length === 0) {
        return;
      }

      this._hopitalService
        .crearHospital(input.value)
        .subscribe(() => this.cargarHospitales());
    });
  }

  actualizarImagen(hospital: Hospital) {
    this._modalUploadService.mostrarModal('hospitales', hospital._id!);
  }
}
