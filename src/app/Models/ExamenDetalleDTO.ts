export interface RegistroCapmExamenDetalleDTO{
  id:number,
  idSimuladorCapmExamen:number,
  idSimuladorCapmDominio:number,
  idSimuladorCapmTarea?:number,
  idSimuladorCapmPregunta:number,
  ejecutado:boolean,
  idSimuladorCapmPreguntaRespuesta?:number,
  puntaje?:number,
  idAspNetUsers:string,
  usuario:string
}
