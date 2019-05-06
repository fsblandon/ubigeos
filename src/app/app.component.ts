import { Component, OnInit } from '@angular/core';
import { GetDataService } from './services/get-data.service';
import { Ubicacion } from './models/ubicacion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GetDataService]
})
export class AppComponent implements OnInit {

  dataText: any[] = [];
  departamentos: Ubicacion[] = [];
  provincias: Ubicacion[] = [];
  distritos: Ubicacion[] = [];
  ubicacion: Ubicacion = {
    codigo : '',
    nombre: '',
    codigo_padre: '',
    descripcion_padre: ''
  };


  constructor(
    private geoService: GetDataService
  ) {}

  ngOnInit() {
    this.geoService.getData().subscribe(
      (data: string) => {
        this.dataText = data.split('\n', data.length);
        this.dataText.forEach(
          (d: string) => {
            this.getDepartmento(d);
            this.getProvincia(d);
            this.getDistrito(d);
          }
        );
        const unique = [this.departamentos[0]];
        for (let index = 1; index < this.departamentos.length; index++) {
          if (this.departamentos[index].codigo !== this.departamentos[index - 1].codigo) {
            unique.push(this.departamentos[index]);
          }
        }
        this.departamentos = unique;

        this.provincias.forEach((d, index) => {
          if (d.codigo === '') {
            this.provincias.splice(index, 1);
          }
        });
        this.provincias.sort((a, b) => {
          if (a.codigo < b.codigo) {
            return -1;
          } else {
            return 1;
          }
        });
        const uniqueP = [this.provincias[0]];
        for (let index = 1; index < this.provincias.length; index++) {
          if (this.provincias[index].codigo !== this.provincias[index - 1].codigo) {
            uniqueP.push(this.provincias[index]);
         }
        }
        this.provincias = uniqueP;

        this.distritos.forEach((d, index) => {
          if (d.codigo === '') {
            this.distritos.splice(index, 1);
          }
        });

        this.distritos.filter((d, index) => {
          d.codigo === '' ? this.distritos.splice(index, 1) : this.distritos
        });
      },
      (error) => {
        console.log('Error Getting Data');
      }
    );
  }

  getDepartmento(d: string) {
    const codeD = d.split('/', d.length)[0].split(' ', 2)[0].substring(1, 3);
    const nameD = d.split('/', d.length)[0].split(' ', 2)[1];
    if (this.ubicacion.codigo !== codeD) {
      this.ubicacion.codigo = codeD;
    }
    if (this.ubicacion.nombre !== nameD) {
      this.ubicacion.nombre = nameD;
    }

    if (this.departamentos.length === 0) {
      this.departamentos.push({codigo: codeD, nombre: nameD, codigo_padre: '', descripcion_padre: ''});
    } else {
      if (!this.departamentos.includes(this.ubicacion)) {
        this.departamentos.push({codigo: codeD, nombre: nameD, codigo_padre: '', descripcion_padre: ''});
      }
    }

  }

  getProvincia(data: string) {
    const codeD = data.split('/', data.length)[1].split(' ', data.length)[1].substring(0, 2);
    const nameD = data.split('/', data.length)[1].split(' ', data.length)[2];
    const codeP = data.split('/', data.length)[0].split(' ', 2)[0].substring(1, 3);
    const desP = data.split('/', data.length)[0].split(' ', 2)[1];
    if (this.ubicacion.codigo !== codeD) {
      this.ubicacion.codigo = codeD;
    }
    if (this.ubicacion.nombre !== nameD) {
      this.ubicacion.nombre = nameD;
    }
    if (this.provincias.length === 0) {
      this.provincias.push({codigo: codeD, nombre: nameD, codigo_padre: codeP, descripcion_padre: desP});
    } else {
      if (!this.provincias.includes(this.ubicacion)) {
        this.provincias.push({codigo: codeD, nombre: nameD, codigo_padre: codeP, descripcion_padre: desP});
      }
    }
  }

  getDistrito(data: string) {
    let codeD = data.split('/', data.length)[2].split(' ', data.length)[1].substring(0, 3);
    if (codeD.includes('”')) {
      codeD = '';
    } else {
      codeD = codeD;
    }
    let nameD = data.split('/', data.length)[2].substring(5, data.length);
    if (nameD.includes('”')) {
      nameD = nameD.substring(0, nameD.length - 1);
    } else {
      nameD = nameD;
    }
    const codeP = data.split('/', data.length)[1].split(' ', 2)[1];
    const desP = data.split('/', data.length)[1].split(' ', 3)[2];
    if (this.ubicacion.codigo !== codeD) {
      this.ubicacion.codigo = codeD;
    }
    if (this.ubicacion.nombre !== nameD) {
      this.ubicacion.nombre = nameD;
    }
    if (this.distritos.length === 0) {
      this.distritos.push({codigo: codeD, nombre: nameD, codigo_padre: codeP, descripcion_padre: desP});
    } else {
      if (!this.distritos.includes(this.ubicacion)) {
        this.distritos.push({codigo: codeD, nombre: nameD, codigo_padre: codeP, descripcion_padre: desP});
      }
    }
  }
}
