import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  constructor(private http:HttpClient){}

  getProjects(): Observable<any> {
    return this.http.get('http://localhost:8000/api/ressources/projets');
  }
  countViews(id:any): Observable<any> {
    return this.http.get(`http://localhost:8000/api/usecases/addview/${id}`);
  }

  updateProjectStatus(projectId: number, status: string): Observable<any> {
    return this.http.patch(`http://localhost:8000/api/usecases/status/projects/${projectId}`, { status });
  }



  // getProjects(): Observable<any[]>{
  //   return this.http.get<any[]>('http://localhost:8000/api/ressources/projets').pipe(
  //     tap((response)=>console.table(response)),
  //     catchError((error) =>{
  //       console.log(error);
  //       return of([]);
  //     })
  //   )
  // }



  getProjectsTypes(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:8000/api/usecases/listing/getprojectstype').pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }

  addProject(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/ressources/projets', formData);
  }

  deleteProject(id:number):Observable<any>{
    return this.http.delete(`http://localhost:8000/api/ressources/projets/${id}`);
  }

  updateProject(id:string ,titre_projet:string , descript_projet:string , user_id:string, tbl_niveau_id:string, tbl_categorie_id:string):Observable<any>{
    return this.http.put<any>(`http://localhost:8000/api/ressources/projets/${id}`, {titre_projet , descript_projet , user_id, tbl_niveau_id, tbl_categorie_id});
  }

  countProjectsByStatus(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:8000/api/usecases/listing/count').pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }
}
