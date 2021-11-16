import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dinosaurio',
  templateUrl: './dinosaurio.component.html',
  styleUrls: ['./dinosaurio.component.scss'],
})
export class DinosaurioComponent {
  constructor() {}
  //    time: any = new Date();
  //    deltaTime: any = 0;
  //    sueloY = 22;
  //    velY = 0;
  //    impulso = 900;
  //    gravedad = 2500;

  //    dinoPosX = 42;
  //    dinoPosY = this.sueloY;

  //    sueloX = 0;
  //    velEscenario = 1280 / 3;
  //    gameVel = 1;
  //    score = 0;

  //    parado = false;
  //    saltando = false;

  //    tiempoHastaObstaculo = 2;
  //    tiempoObstaculoMin = 0.7;
  //    tiempoObstaculoMax = 1.8;
  //    obstaculoPosY = 16;
  //    obstaculos: any = [];

  //    tiempoHastaNube = 0.5;
  //    tiempoNubeMin = 0.7;
  //    tiempoNubeMax = 2.7;
  //    maxNubeY = 270;
  //    minNubeY = 100;
  //    nubes: any = [];
  //    velNube = 0.5;

  //    contenedor: any;
  //    dino: any;
  //    textoScore: any;
  //    suelo: any;
  //    gameOver: any;

  ngOnInit(): void {
    //     if (
    //       document.readyState === 'complete' ||
    //       document.readyState === 'interactive'
    //     ) {
    //       setTimeout(this.Init, 1);
    //     } else {
    //       document.addEventListener('DOMContentLoaded', this.Init);
    //     }
  }

  //   //****** GAME LOOP ********//

  //   Init() {
  //     this.time = new Date();
  //     this.Start();
  //     this.Loop();
  //   }

  //   Loop() {
  //     this.deltaTime = (new Date() - this.time) / 1000;
  //     this.time = new Date();
  //     this.Update();
  //     requestAnimationFrame(this.Loop);
  //   }

  //   //****** GAME LOGIC ********//

  //   Start() {
  //     this.gameOver = document.querySelector('.game-over');
  //     this.suelo = document.querySelector('.suelo');
  //     this.contenedor = document.querySelector('.contenedor');
  //     this.textoScore = document.querySelector('.score');
  //     this.dino = document.querySelector('.dino');
  //     document.addEventListener('keydown', this.HandleKeyDown);
  //   }

  //   Update() {
  //     if (this.parado) return;

  //     this.MoverDinosaurio();
  //     this.MoverSuelo();
  //     this.DecidirCrearObstaculos();
  //     this.DecidirCrearNubes();
  //     this.MoverObstaculos();
  //     this.MoverNubes();
  //     this.DetectarColision();

  //     this.velY -= this.gravedad * this.deltaTime;
  //   }

  //   HandleKeyDown(ev: any) {
  //     if (ev.keyCode == 32) {
  //       this.Saltar();
  //     }
  //   }

  //   Saltar() {
  //     if (this.dinoPosY === this.sueloY) {
  //       this.saltando = true;
  //       this.velY = this.impulso;
  //       this.dino.classList.remove('dino-corriendo');
  //     }
  //   }

  //   MoverDinosaurio() {
  //     this.dinoPosY += this.velY * this.deltaTime;
  //     if (this.dinoPosY < this.sueloY) {
  //       this.TocarSuelo();
  //     }
  //     this.dino.style.bottom = this.dinoPosY + 'px';
  //   }

  //   TocarSuelo() {
  //     this.dinoPosY = this.sueloY;
  //     this.velY = 0;
  //     if (this.saltando) {
  //       this.dino.classList.add('dino-corriendo');
  //     }
  //     this.saltando = false;
  //   }

  //   MoverSuelo() {
  //     this.sueloX += this.CalcularDesplazamiento();
  //     this.suelo.style.left = -(this.sueloX % this.contenedor.clientWidth) + 'px';
  //   }

  //   CalcularDesplazamiento() {
  //     return this.velEscenario * this.deltaTime * this.gameVel;
  //   }

  //   Estrellarse() {
  //     this.dino.classList.remove('dino-corriendo');
  //     this.dino.classList.add('dino-estrellado');
  //     this.parado = true;
  //   }

  //   DecidirCrearObstaculos() {
  //     this.tiempoHastaObstaculo -= this.deltaTime;
  //     if (this.tiempoHastaObstaculo <= 0) {
  //       this.CrearObstaculo();
  //     }
  //   }

  //   DecidirCrearNubes() {
  //     this.tiempoHastaNube -= this.deltaTime;
  //     if (this.tiempoHastaNube <= 0) {
  //       this.CrearNube();
  //     }
  //   }

  //   CrearObstaculo() {
  //     let obstaculo = document.createElement('div');
  //     this.contenedor.appendChild(obstaculo);
  //     obstaculo.classList.add('cactus');
  //     if (Math.random() > 0.5) obstaculo.classList.add('cactus2');
  //     obstaculo.posX = this.contenedor.clientWidth;
  //     obstaculo.style.left = this.contenedor.clientWidth + 'px';

  //     this.obstaculos.push(obstaculo);
  //     this.tiempoHastaObstaculo =
  //       this.tiempoObstaculoMin +
  //       (Math.random() * (this.tiempoObstaculoMax - this.tiempoObstaculoMin)) / this.gameVel;
  //   }

  //   CrearNube() {
  //     let nube = document.createElement('div');
  //     this.contenedor.appendChild(nube);
  //     nube.classList.add('nube');
  //     nube.posX = this.contenedor.clientWidth;
  //     nube.style.left = this.contenedor.clientWidth + 'px';
  //     nube.style.bottom = this.minNubeY + Math.random() * (this.maxNubeY - this.minNubeY) + 'px';

  //     this.nubes.push(nube);
  //     this.tiempoHastaNube =
  //       this.tiempoNubeMin +
  //       (Math.random() * (this.tiempoNubeMin - this.tiempoNubeMin)) / this.gameVel;
  //   }

  //   MoverObstaculos() {
  //     for (let i = this.obstaculos.length - 1; i >= 0; i--) {
  //       if (this.obstaculos[i].posX < -this.obstaculos[i].clientWidth) {
  //         this.obstaculos[i].parentNode.removeChild(this.obstaculos[i]);
  //         this.obstaculos.splice(i, 1);
  //         this.GanarPuntos();
  //       } else {
  //         this.obstaculos[i].posX -= this.CalcularDesplazamiento();
  //         this.obstaculos[i].style.left = this.obstaculos[i].posX + 'px';
  //       }
  //     }
  //   }

  //   MoverNubes() {
  //     for (let i = this.nubes.length - 1; i >= 0; i--) {
  //       if (this.nubes[i].posX < -this.nubes[i].clientWidth) {
  //         this.nubes[i].parentNode.removeChild(this.nubes[i]);
  //         this.nubes.splice(i, 1);
  //       } else {
  //         this.nubes[i].posX -= this.CalcularDesplazamiento() * this.velNube;
  //         this.nubes[i].style.left = this.nubes[i].posX + 'px';
  //       }
  //     }
  //   }

  //   GanarPuntos() {
  //     this.score++;
  //     this.textoScore.innerText = this.score;
  //     if (this.score == 5) {
  //       this.gameVel = 1.5;
  //       this.contenedor.classList.add('mediodia');
  //     } else if (this.score == 10) {
  //       this.gameVel = 2;
  //       this.contenedor.classList.add('tarde');
  //     } else if (this.score == 20) {
  //       this.gameVel = 3;
  //       this.contenedor.classList.add('noche');
  //     }
  //     this.suelo.style.animationDuration = 3 / this.gameVel + 's';
  //   }

  //   GameOver() {
  //     this.Estrellarse();
  //     this.gameOver.style.display = 'block';
  //   }

  //   DetectarColision() {
  //     for (let i = 0; i < this.obstaculos.length; i++) {
  //       if (this.obstaculos[i].posX > this.dinoPosX + this.dino.clientWidth) {
  //         //EVADE
  //         break; //al estar en orden, no puede chocar con más
  //       } else {
  //         if (this.IsCollision(this.dino, this.obstaculos[i], 10, 30, 15, 20)) {
  //           this.GameOver();
  //         }
  //       }
  //     }
  //   }

  //   IsCollision(
  //     a: any,
  //     b: any,
  //     paddingTop: any,
  //     paddingRight: any,
  //     paddingBottom: any,
  //     paddingLeft: any
  //   ) {
  //     let aRect = a.getBoundingClientRect();
  //     let bRect = b.getBoundingClientRect();

  //     return !(
  //       aRect.top + aRect.height - paddingBottom < bRect.top ||
  //       aRect.top + paddingTop > bRect.top + bRect.height ||
  //       aRect.left + aRect.width - paddingRight < bRect.left ||
  //       aRect.left + paddingLeft > bRect.left + bRect.width
  //     );
  //   }
}
