import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RaidSimulatorService {
  array: [];
  constructor() { }

   RaidCalculate(server, info) {
    let resultado;
    //suma de TB en el raid
    let totalTeras = 0;
    //capacidad del menor disco, capacidad del mayor disco.
    let tamanoMinimo = 1000, tamanoMaximo = 1;
    for (let i = 0; i < server.length; i++) {
      if (server[i].capacidad > tamanoMaximo) {
        tamanoMaximo = server[i].capacidad;
      }
      if (server[i].capacidad < tamanoMinimo) {
        tamanoMinimo = server[i].capacidad;
      }
      totalTeras = totalTeras + server[i].capacidad;
    }
    //numero de discos
    let nroDiscos = server.length;
    let nivel = info.raid; //
    //capacidad
    let almacenamiento, paridad, noUsado;
    //confiabilidad
    let nroFallosPermitidos;

    switch (nivel) {
      case '0':
        //console.log("entró");
        almacenamiento = totalTeras + " TB";
        paridad = "0 TB";
        noUsado = "0 TB";
        resultado =  this.calcularThroughput("0", nroDiscos, 0, 0, server, info);
        //console.log("resultado", resultado)
        nroFallosPermitidos = "No permite el fallo de ningun disco.";
        resultado.almacenamiento = almacenamiento;
        resultado.paridad = paridad;
        resultado.noUsado = noUsado;
        resultado.nroFallosPermitidos = nroFallosPermitidos;
        break;

      case '1':
        almacenamiento = tamanoMinimo + " TB";
        let paridadX = tamanoMinimo * (nroDiscos - 1);
        paridad = paridadX + " TB";
        noUsado = totalTeras - (paridadX + tamanoMinimo) + " TB";
        resultado =  this.calcularThroughput("1", nroDiscos, 0, 0, server, info);
        nroFallosPermitidos = `Permite 1 fallo de un disco, ${Math.floor(nroDiscos/2)} con suerte.`;
        resultado.almacenamiento = almacenamiento;
        resultado.paridad = paridad;
        resultado.noUsado = noUsado;
        resultado.nroFallosPermitidos = nroFallosPermitidos;
        break;

      case '4':
        almacenamiento = tamanoMinimo * (nroDiscos - 1) + " TB";
        paridad = tamanoMinimo + " TB";
        noUsado = totalTeras - ((tamanoMinimo * (nroDiscos - 1)) + tamanoMinimo) + " TB";
        resultado =  this.calcularThroughput("4", nroDiscos, tamanoMinimo, tamanoMaximo, server, info);
        nroFallosPermitidos = "Permite 1 fallo de un disco.";
        resultado.almacenamiento = almacenamiento;
        resultado.paridad = paridad;
        resultado.noUsado = noUsado;
        resultado.nroFallosPermitidos = nroFallosPermitidos;
        break;

      case '5':
        almacenamiento = tamanoMinimo * (nroDiscos - 1) + " TB";
        paridad = tamanoMinimo + " TB";
        noUsado = totalTeras - ((tamanoMinimo * (nroDiscos - 1)) + tamanoMinimo) + " TB";
        resultado =  this.calcularThroughput("5", nroDiscos, 0, 0, server, info);
        nroFallosPermitidos = "Permite 1 fallo de un disco.";
        resultado.almacenamiento = almacenamiento;
        resultado.paridad = paridad;
        resultado.noUsado = noUsado;
        resultado.nroFallosPermitidos = nroFallosPermitidos;
        break;

      case '10':
        almacenamiento = (nroDiscos * tamanoMinimo) / 2 + " TB";
        paridad = (nroDiscos * tamanoMinimo) / 2 + " TB";
        noUsado = totalTeras - (nroDiscos * tamanoMinimo) + " TB";
        resultado =  this.calcularThroughput("10", nroDiscos, 0, 0, server, info);
        nroFallosPermitidos = "Permite la rotura de un disco distinto en cada subnivel, o la rotura de dos en un mismo subnivel, pero no otras combinaciones.";
        resultado.almacenamiento = almacenamiento;
        resultado.paridad = paridad;
        resultado.noUsado = noUsado;
        resultado.nroFallosPermitidos = nroFallosPermitidos;
        break;

      case '01':
        almacenamiento = (nroDiscos * tamanoMinimo) / 2 + " TB";
        paridad = (nroDiscos * tamanoMinimo) / 2 + " TB";
        noUsado = totalTeras - (nroDiscos * tamanoMinimo) + " TB";
        resultado =  this.calcularThroughput("01", nroDiscos, 0, 0, server, info);
        nroFallosPermitidos = "Permite que se puedan romper todos los discos de un subnivel a excepción de uno";
        resultado.almacenamiento = almacenamiento;
        resultado.paridad = paridad;
        resultado.noUsado = noUsado;
        resultado.nroFallosPermitidos = nroFallosPermitidos;
        break;
    }
    //console.log("perro");
    //console.log(resultado);

    return resultado;
  }

  //Calculo throughput (resultado)

   calcularThroughput(raid, nroDiscos, minimo, maximo, server, info) {
    let R, S;
    let secuencialRead, secuencialWrite, randomRead, randomWrite;
    switch (raid) {
      case '0':
        S =  this.recorrerDiscosS(nroDiscos, server, info);
        /* console.log("S" , S); */
        R =  this.recorrerDiscosA(nroDiscos, server, info);
        /* console.log("R" , R); */
        secuencialRead = nroDiscos * S;
        secuencialWrite = nroDiscos * S;
        randomRead = nroDiscos * R;
        randomWrite = nroDiscos * R;
        break;

      case '1':
        S =  this.recorrerDiscosS(nroDiscos, server, info);
        R =  this.recorrerDiscosA(nroDiscos, server, info);
        secuencialRead = (nroDiscos / 2) * S;
        secuencialWrite = (nroDiscos / 2) * S;
        randomRead = nroDiscos * R;
        randomWrite = (nroDiscos / 2) * R;
        break;

      case '4':
        S =  this.recorrerDiscos4S(nroDiscos, minimo, maximo, server, info);
        R =  this.recorrerDiscos4A(nroDiscos, minimo, maximo, server, info);
        secuencialRead = (nroDiscos - 1) * S;
        secuencialWrite = (nroDiscos - 1) * S;
        randomRead = (nroDiscos - 1) * R;
        randomWrite = R / 2;
        break;

      case '5':
        S =  this.recorrerDiscosS(nroDiscos, server, info);
        R =  this.recorrerDiscosA(nroDiscos, server, info);
        secuencialRead = (nroDiscos - 1) * S;
        secuencialWrite = (nroDiscos - 1) * S;
        randomRead = nroDiscos * R;
        randomWrite = (nroDiscos / 4) * R;
        break;

      case '10':
        S =  this.recorrerDiscosS(nroDiscos, server, info);
        R =  this.recorrerDiscosA(nroDiscos, server, info);
        secuencialRead = (nroDiscos / 2) * S;
        secuencialWrite = (nroDiscos / 2) * S;
        randomRead = nroDiscos * R;
        randomWrite = (nroDiscos / 2) * R;
        break;

      case '01':
        S =  this.recorrerDiscosS(nroDiscos, server, info);
        R =  this.recorrerDiscosA(nroDiscos, server, info);
        secuencialRead = (nroDiscos / 2) * S;
        secuencialWrite = (nroDiscos / 2) * S;
        randomRead = nroDiscos * R;
        randomWrite = (nroDiscos / 2) * R;
        break;


    }
    let objeto = {
      secuencialRead: secuencialRead,
      secuencialWrite: secuencialWrite,
      randomRead: randomRead,
      randomWrite: randomWrite
    }
    //console.log("objetoo", objeto)
    return (objeto);
  }

  // TODOS LOS RAIDS menos RAID 4
   recorrerDiscosS(nroDiscos, server, info) {
    let resultado = 0;
    let acumulado;
    for (let k = 0; k < nroDiscos; k++) {
      acumulado =  this.calcularS(server[k].seekTime, server[k].rotationalDelay, server[k].diskTransfer, info.secuencial); //de cada disco
      resultado = resultado + acumulado;
    }
    //console.log("secuencial", resultado / nroDiscos)
    return resultado / nroDiscos;
  }
   recorrerDiscosA(nroDiscos, server, info) {
    let resultado = 0;
    let acumulado;
    for (let k = 0; k < nroDiscos; k++) {
      acumulado =  this.calcularR(server[k].seekTime, server[k].rotationalDelay, server[k].diskTransfer, info.aleatorio); //de cada disco
      resultado = resultado + acumulado;
    }
    //console.log("aleatorio", resultado / nroDiscos)
    return resultado / nroDiscos;
  }

  // Para el RAID 4
   recorrerDiscos4S(nroDiscos, minimo, maximo, server, info) {
    let discoParidad: Boolean = false;
    //compruebo si todos los tamanos son iguales, en ese caso, se manda como el de paridad al primero, en otro caso se busca al de paridad para que este sea el S o R.
    if(minimo===maximo){
      return  this.calcularS(server[0].seekTime, server[0].rotationalDelay, server[0].diskTransfer, info.secuencial); //del disco de paridad (el mas pequeño que encuentra primero)
    }
    for (let k = 0; k < nroDiscos; k++) {
      if (discoParidad === false) {
        if (minimo === server[k].capacidad) {
          discoParidad = true;
          return  this.calcularS(server[k].seekTime, server[k].rotationalDelay, server[k].diskTransfer, info.secuencial); //del disco de paridad (el mas pequeño que encuentra primero)
        }
      }
    }
  }
   recorrerDiscos4A(nroDiscos, minimo, maximo, server, info) {
    let discoParidad: Boolean = false;
    //compruebo si todos los tamanos son iguales, en ese caso, se manda como el de paridad al primero, en otro caso se busca al de paridad para que este sea el S o R.
    if(minimo===maximo){
      return  this.calcularS(server[0].seekTime, server[0].rotationalDelay, server[0].diskTransfer, info.aleatorio); //del disco de paridad (el mas pequeño que encuentra primero)
    }
    for (let k = 0; k < nroDiscos; k++) {
      if (discoParidad === false) {
        if (minimo === server[k].capacidad) {
          discoParidad = true;
          return  this.calcularR(server[k].seekTime, server[k].rotationalDelay, server[k].diskTransfer, info.aleatorio); //del disco de paridad (el mas pequeño que encuentra primero)
        }
      }
    }
  }

  //METODOS PARA CALCULAR S Y R
   calcularS(seekTime, rotationalDelay, diskTransfer, secuencial) {
    let resultado, tiempoTransferencia;
    tiempoTransferencia = (secuencial * 1000) / diskTransfer;
    resultado = tiempoTransferencia + seekTime + rotationalDelay;
    let resultadoX = (secuencial*1000) / resultado;
    return resultadoX;
  }

   calcularR(seekTime, rotationalDelay, diskTransfer, aleatorio) {
    let resultado, tiempoTransferencia;
    tiempoTransferencia = (aleatorio * 1000) / (diskTransfer * 1024);
    resultado = tiempoTransferencia + seekTime + rotationalDelay;
    let resultadoX = aleatorio / resultado;
    return resultadoX;
  }



}
