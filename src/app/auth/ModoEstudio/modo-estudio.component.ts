import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroCapmExamenDTO } from 'src/app/Models/ExamenDTO';
import { DominioService } from 'src/app/shared/Services/Dominio/dominio.service';
import { ExamenService } from 'src/app/shared/Services/Examen/examen.service';
import { TareaService } from 'src/app/shared/Services/Tarea/tarea.service';


@Component({
  selector: 'app-modo-estudio',
  templateUrl: './modo-estudio.component.html',
  styleUrls: ['./modo-estudio.component.scss']
})
export class ModoEstudioComponent implements OnInit {

  constructor(
    private _router: Router,
    private _ExamenService:ExamenService,
    private _DominioService: DominioService,
    private _TareaService: TareaService

  ) { }

  public migaPan = [
    {
      titulo: 'Simulador CAPM',
      urlWeb: '/',
    },
    {
      titulo: 'Modo estudio',
      urlWeb: '/ModoEstudio',
    },
  ];
  public RegistrarExamenEnvio:RegistroCapmExamenDTO={
    id:0,
    idSimuladorCapmModo:0,
    nombreExamen:'',
    tiempo:0,
    idSimuladorCapmDominio:0,
    idSimuladorCapmTarea:0
  }
  public Dominio:any;
  public Tarea:any;
  public IdExamen=0;
  public userForm :UntypedFormGroup=new UntypedFormGroup({
    NombreSimulacion: new UntypedFormControl('',Validators.required),
  })
  public DominioSeleccionado=0;
  public TareaSeleccionado=0;
  public SimulacionesTotales=0;
  public SimulacionesInconclusas=0;
  public CantMEstudio=0;
  public ListaEstudio:any;
  public ListaLogo: any = []
  public TiempoTotalEstudio=0;
  public Hora=0;
  public Minuto=0;
  public HoraMostrar='';
  public MinutoMostrar='';
  public SimulacionesIncompletas:any;
  public ContSimulacionesIncompletas=0;
  public SimulacionesCompletadas:any;
  public ContSimulacionesCompletadas=0;
  public ResultadosPorDominio:any;
  public ResultadosPorTarea:any;
  public BotonResgistrar=false;
  public Take=0;

  ngOnInit(): void {
    this.ListaDominioCombo();
    this.ListaTareaCombo();
    this.ListaExamenesPorModo();
    this.ListaExamenesIncompletos();
    this.ListaExamenesConcluidos();
    this.ObtenerPromedioDominioPorModo();
    // this.ObtenerLogo();
  }

  RegistrarExamen(){
    if(this.userForm.valid && this.TareaSeleccionado!=0){
      this.BotonResgistrar=true;
      this.RegistrarExamenEnvio.id=0,
      this.RegistrarExamenEnvio.idSimuladorCapmModo=1,
      this.RegistrarExamenEnvio.nombreExamen=this.userForm.get('NombreSimulacion')?.value;
      this.RegistrarExamenEnvio.tiempo=0,
      this.RegistrarExamenEnvio.idSimuladorCapmDominio=1;
      this.RegistrarExamenEnvio.idSimuladorCapmTarea=this.TareaSeleccionado;
      console.log(this.RegistrarExamenEnvio)
      this._ExamenService.Registrar(this.RegistrarExamenEnvio).subscribe({
        next:(x)=>{
          this.IdExamen=x.id
          this._router.navigate(['/ModoEstudio/EstudioPregunta/'+this.IdExamen]);
        }
      })
    }
  }
  ListaDominioCombo(){
    this._DominioService.ListaDominioCombo().subscribe({
      next:(x)=>{
        this.Dominio=x;
        console.log(this.Dominio)
      }
    })
  }

  ListaTareaCombo(){
    this._TareaService.ListaTareaCombo().subscribe({
      next:(x)=>{
        this.Tarea=x;
      }
    })

  }

  // ObtenerLogo(){
  //   this._DominioService.ObtenerLogo().subscribe({
  //     next:(x)=>{
  //       this.ListaLogo = x;
  //       console.log(this.ListaLogo)
  //     }
  //   })
  // }




  ListaExamenesPorModo(){
    this.TiempoTotalEstudio=0;
    this.SimulacionesInconclusas=0;
    this._ExamenService.ResumenSimulacionesPorModo(1).subscribe({
      next:(x)=>{
        this.SimulacionesTotales=x.simulacionesTotales
        this.SimulacionesInconclusas=x.simulacionesInconclusas
        this.TiempoTotalEstudio=x.tiempoPromedio
      },
      complete: () => {
        this.Hora = Math.floor(this.TiempoTotalEstudio / 3600);
        this.HoraMostrar = (this.Hora < 10) ? '0' + this.Hora : this.Hora.toString();
        this.Minuto = Math.floor((this.TiempoTotalEstudio / 60) % 60);
        this.MinutoMostrar = (this.Minuto < 10) ? '0' + this.Minuto : this.Minuto.toString();
      }
    });


  }
  ListaExamenesIncompletos(){
    this._ExamenService.ListaExamenesIncompletos().subscribe({
      next:(x)=>{
        this.SimulacionesIncompletas=x;
        this.SimulacionesIncompletas.forEach((y:any)=>{
          if(y.idEstadoExamen!=3 && y.idSimuladorCapmModo==1){
            this.ContSimulacionesIncompletas=x.length;
          }
        })
      }
    })
  }
  ListaExamenesConcluidos(){
    this._ExamenService.ListaExamenesConcluidos().subscribe({
      next:(x)=>{
        this.SimulacionesCompletadas=x;
        this.SimulacionesCompletadas.forEach((y:any)=>{
          if(y.idEstadoExamen==3 && y.idSimuladorCapmModo==1){
            this.ContSimulacionesCompletadas=x.length;
          }
        })
      }
    })
  }
  ObtenerPromedioDominioPorModo(){
    this._ExamenService.ObtenerPromedioDominioPorModo(1,this.Take).subscribe({
      next:(x)=>{
        this.ResultadosPorDominio=x
      }
    })
  }


}
