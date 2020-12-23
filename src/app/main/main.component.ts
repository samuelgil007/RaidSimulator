import { Component, OnInit } from '@angular/core';
import { discos } from '../main/discos'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }
  arrayDisk = []
  tipo = "tipo1"
  raid = "raid0"
  restriccion = "El número mínimo de discos en un conjunto RAID 0 es 2."
  capacidades = ["16", "14", "12", "10", "8", "6", "4", "3", "2", "1"]
  error = true
  contieneNuevoTipo = false
  personalizado = {
    "RotationalDelay": "",
    "SeekTime": "",
    "DiskTransfer": ""
  }
  aleatorio = "";
  secuencial = "";
  errorCampos = false;
  errorPerso = false;
  ngOnInit(): void {
  }

  asignarColor(valor) {
    this.tipo = valor;
    if (valor == "tipo4") { this.contieneNuevoTipo = true; } else { this.contieneNuevoTipo = false; }
  }
  asignarRaid(valor) {
    this.raid = valor;
    this.verificarRestriccion();
  }
  addDisk(capacidad) {
    let array;
    if (this.tipo != "tipo4") {
      array = discos[this.tipo][capacidad]
      this.errorPerso = false
    } else {
      if (this.personalizado.RotationalDelay == "" || this.personalizado.RotationalDelay == null || this.personalizado.SeekTime == "" || this.personalizado.SeekTime == null
        || this.personalizado.DiskTransfer == "" || this.personalizado.DiskTransfer == null || parseInt(this.personalizado.DiskTransfer) < 1 || parseInt(this.personalizado.RotationalDelay) < 1 || parseInt(this.personalizado.SeekTime) < 1) {
        this.errorPerso = true
        return
      }
      this.errorPerso = false
      array = {
        "nombre": "PERSONALIZADO",
        "capacidad": parseInt(capacidad),
        "Rotational delay": parseInt(this.personalizado.RotationalDelay),
        "Seek Time": parseInt(this.personalizado.SeekTime),
        "Disk transfer rate": parseInt(this.personalizado.DiskTransfer)
      }
    }
    array.tipo = this.tipo;
    this.arrayDisk.push(array);
    this.verificarRestriccion();
  }
  removeDisk(disco) {
    this.arrayDisk.splice(disco, 1)
    this.verificarRestriccion();
  }

  verificarRestriccion() {
    switch (this.raid) {
      case 'raid0':
        if (this.arrayDisk.length < 2) {
          this.restriccion = "El número mínimo de discos en un conjunto RAID 0 es 2."
          this.error = true;
        } else {
          this.restriccion = "RAID 0"
          this.error = false;
        }
        break;
      case 'raid1':
        if (this.arrayDisk.length < 2) {
          this.restriccion = "El número mínimo de discos en un conjunto RAID 1 es 2."
          this.error = true;
        } else {
          this.restriccion = "RAID 1"
          this.error = false;
        }
        break;
      case 'raid4':
        if (this.arrayDisk.length < 2) {
          this.restriccion = "El número mínimo de discos en un conjunto RAID 4 es 2."
          this.error = true;
        } else {
          this.restriccion = "RAID 4"
          this.error = false;
        }
        break;
      case 'raid5':
        if (this.arrayDisk.length < 3) {
          this.restriccion = "El número mínimo de discos en un conjunto RAID 5 es 3."
          this.error = true;
        } else {
          this.restriccion = "RAID 5"
          this.error = false;
        }
        break;
      case 'raid10':
        if (this.arrayDisk.length >= 4 && this.arrayDisk.length % 2 == 0) {
          this.restriccion = "RAID 10"
          this.error = false;
        } else {
          this.restriccion = "El número mínimo de discos en un conjunto RAID 10 es 4 y debe ser un número par."
          this.error = true;
        }
        break;
      case 'raid01':
        if (this.arrayDisk.length >= 4 && this.arrayDisk.length % 2 == 0) {
          this.restriccion = "RAID 01"
          this.error = false;
        } else {
          this.restriccion = "El número mínimo de discos en un conjunto RAID 01 es 4 y debe ser un número par."
          this.error = true;
        }
        break;
      default:
        break;
    }
  }

  calcularMetricas() {
    if (this.aleatorio == "" || this.aleatorio == null || this.secuencial == "" || this.secuencial == null
        ||  parseInt(this.aleatorio) < 1 || parseInt(this.secuencial) < 1 || this.error == true) {
        this.errorCampos = true
        return
      } else {
        this.errorCampos = false
        //ENVIAR METODOS
        let metricas = {
          "raid" : this.raid.replace("raid",""),
          "secuencial": parseInt(this.secuencial),
          "aleatorio": parseInt(this.aleatorio)
        }
        //ENVIAR
        console.log(this.arrayDisk)
        console.log(metricas)
      
      }
  }
}
