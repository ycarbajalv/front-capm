import { Component, ElementRef, OnInit,ViewChild, ViewEncapsulation } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject,takeUntil } from 'rxjs';
import { AvatarDTO } from 'src/app/Models/AvatarDTO';
import { RegistroCapmExamenDTO } from 'src/app/Models/ExamenDTO';
import { AvatarService } from 'src/app/shared/Services/Avatar/avatar.service';
import { ExamenService } from 'src/app/shared/Services/Examen/examen.service';
import { SessionStorageService } from 'src/app/shared/Services/session-storage.service';
import { ResultadoExamenPorDominioDTO } from 'src/app/Models/DominioDTO';
import { DominioService } from 'src/app/shared/Services/Dominio/dominio.service';
import { ConfiguracionSimuladorService } from 'src/app/shared/Services/ConfiguracionSimulador/configuracion-simulador.service';
import { TareaService } from 'src/app/shared/Services/Tarea/tarea.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {
  constructor(
    private _SessionStorageService:SessionStorageService,
    private _AvatarService:AvatarService,
    private _ExamenService:ExamenService,
    private _DominioService:DominioService,
    private elementRef: ElementRef,
    private _TareaService:TareaService,
    private _ConfiguracionService: ConfiguracionSimuladorService
  ) { }
  private signal$ = new Subject();

  ngOnDestroy(): void {
    this.signal$.next(true)
    this.signal$.complete()
  }
  public NombreAlumno=''
  public resise=false;
  public NivelUsuario='';
  public SiguienteNivelUsuario=''
  public listaConfiguracion:any=[]

  public urlAvatar='';
  public Avatar: AvatarDTO = {
    accessories: '',
    clothes: '',
    clothes_Color: '',
    eyes: '',
    eyesbrow: '',
    facial_Hair: '',
    facial_Hair_Color: '',
    hair_Color: '',
    idAlumno: 0,
    idAspNetUsers: '',
    idAvatar: 0,
    mouth: '',
    skin: '',
    topC: ''
  };
  public MejorExamenEnvio:RegistroCapmExamenDTO={
    id:0,
    idSimuladorCapmModo:0,
    nombreExamen:'',
    tiempo:0,
    idAspNetUsers:'',
    usuario:'',
    estadoExamen:0,
    puntaje:0,
    desempenio:0,
    percentil:0,
    idSimuladorCapmTarea:0,
    idSimuladorCapmDominio:0
  }
  public ExamenesCompletados=0;
  public ExamenesActivos=0;
  public CantMEstudio=0;
  public CantMEntrenamiento=0;
  public CantMExamen=0;
  public ListaEstudio:any;
  public ListaEntrenamiento:any;
  public ListaExamen:any;
  public token: boolean = this._SessionStorageService.validateTokken();
  public TareaResultado:any;
  public DominioResultado:any;
  public Examen:any;
  public Puntos=0;
  public PuntosNivel=0;
  public TotalPuntos=0;
  public ResultadoDominio1=0;
  public ResultadoDominio2=0;
  public ResultadoDominio3=0;
  public ResultadoDominio4=0;
  public ResultadoTarea1=0;
  public ResultadoTarea2=0;
  public ResultadoTarea3=0;
  public ResultadoTarea4=0;
  public ContadorEntrenamiento=0;
  public ResultadosPorDominio:any;
  public ResultadosPorTarea:any;
  public Dominio:any;
  public Tarea:any;
  public Take=4;

  ngOnInit(): void {

    if (this.token) {
      this.ObtenerAvatar();
      this.ObtenerMejorExamenPorUsuario();
      this.ObtenerNivelUsuario();
      this.ListaExamenesPorModo();
      this.ObtenerPromedioDominioPorModo();
      this.ListaDominioCombo();
      this.ListaTareaCombo();
      this.ObtenerConfiguracionSimulador();
    }
  }

  ObtenerAvatar() {
    this._AvatarService.ObtenerAvatar().pipe(takeUntil(this.signal$)).subscribe({
      next: (x) => {
        this.Avatar = x;
        this.NombreAlumno = x.nombres
        this.urlAvatar=this._AvatarService.GetUrlImagenAvatar(this.Avatar);
      },
    });
  }
  ObtenerMejorExamenPorUsuario(){
    this._ExamenService.ObtenerMejorExamenPorUsuario().subscribe({
      next:(x)=>{
        if(x!=null){
          this.TareaResultado=x.tareaResultado;
          console.log(this.TareaResultado);
        this.ResultadoTarea1=Math.floor(x.tareaResultado[0].promedio);
        this.ResultadoTarea2=Math.floor(x.tareaResultado[1].promedio);
        this.ResultadoTarea3=Math.floor(x.tareaResultado[2].promedio);
        this.ResultadoTarea4=Math.floor(x.tareaResultado[3].promedio);

        this.Examen=x.examen;
        this.Puntos=Math.floor(x.examen.desempenio);
        console.log(this.Puntos)

        }
        console.log(this.TareaResultado)
        this.TareaResultado.forEach((x:any) => {
          let NumTarea = x.nombreTarea.split(' - ')
          x.ordenTarea=NumTarea[0]
          x.nombreTareaFinal=NumTarea[1]

        });
      },
      error:(e)=>{
        this.ExamenesCompletados=0
        this.ExamenesActivos=0
      }
    })
  }
  ObtenerNivelUsuario(){
    this._ExamenService.ObtenerNivelUsuario().subscribe({
      next:(x)=>{
        this.NivelUsuario=x.rango.nivel;
        this.SiguienteNivelUsuario=x.rango.siguienteNivel;
        this.PuntosNivel = x.puntosNivel;
        this.TotalPuntos=x.rango.hasta
      }
    })
  }
  ListaExamenesPorModo(){
    this._ExamenService.ResumenSimulacionesPorModo(1).subscribe({
      next:(x)=>{
        this.CantMEstudio=x.simulacionesTotales;
      }
    });
    this._ExamenService.ResumenSimulacionesPorModo(2).subscribe({
      next:(x)=>{
        this.CantMEntrenamiento=x.simulacionesTotales;
      }
    });
    this._ExamenService.ResumenSimulacionesPorModo(3).subscribe({
      next:(x)=>{
        this.CantMExamen=x.simulacionesTotales;
        this.ExamenesActivos=x.simulacionesInconclusas;
        this.ExamenesCompletados=this.CantMExamen-this.ExamenesActivos
      }
    });
    this._ExamenService.ListaExamenesPorModoResumen(2).subscribe({
      next:(x)=>{
        this.ListaEntrenamiento=x
      }
    });
  }
  ObtenerPromedioDominioPorModo(){
    this._ExamenService.ObtenerPromedioDominioPorModo(1,this.Take).subscribe({
      next:(x)=>{
        if(x!=null){
          console.log(x)
          this.ResultadosPorDominio=x
        }
      }
    })
  }
  ListaDominioCombo(){
    this._DominioService.ListaDominioCombo().subscribe({
      next:(x)=>{
        this.Dominio=x;
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

  ObtenerConfiguracionSimulador(){
    this._ConfiguracionService.ObtenerConfiguracionSimulador().subscribe({
      next:(x)=>{
       this.listaConfiguracion = x
       console.log(this.listaConfiguracion)
      }
    })
  }

}
