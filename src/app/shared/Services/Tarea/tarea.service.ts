import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  public urlBase=environment.url_api+'Tarea';
  constructor(private http: HttpClient) { }

  public Lista():Observable<any>{
    return this.http.get<any>(this.urlBase+'/Lista');
  }
  
  public ListaTareaCombo():Observable<any>{
    return this.http.get<any>(this.urlBase+'/ListaTareaCombo');
  }

}
