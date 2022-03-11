import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  getProductsList(){
    return this.http.get('https://testapi.io/api/Laxman/resource/shopbridge',{observe: 'response'})
  }
  saveProduct(data:any){
    return this.http.post('https://testapi.io/api/Laxman/resource/shopbridge',data,{observe: 'response'})
  }
  editProduct(data:any){
    return this.http.put('https://testapi.io/api/Laxman/resource/shopbridge/'+data.id,data,{observe: 'response'})
  }
  deleteProduct(id:any){
    return this.http.delete('https://testapi.io/api/Laxman/resource/shopbridge/'+id,{observe: 'response'})
  }
}
