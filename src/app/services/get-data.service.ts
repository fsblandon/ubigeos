import { Injectable } from '@angular/core';
import { Ubicacion } from '../models/ubicacion';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(
    private http: HttpClient
  ) { }

  getData(): Observable<any> {
    return this.http.get('assets/datageo.txt', {responseType: 'text'});
  }
}
