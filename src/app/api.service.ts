import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }
  httpOptions = {
    headers:new HttpHeaders({
      'Content-Type': 'aplication/json',
      'Authorization': 'Basic' + btoa('hard:hard')
    })
  }
  //returns all categories
  public getCategories(){
    var username = 'hard';
    var password = 'hard';
   // const credentials = username+':'+password;
    let headers = new HttpHeaders();
   // headers = headers.append("Authorization", "Basic " + btoa(credentials));
    //headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient.get('https://localhost:44397/api/Categories',{headers: headers});
  }
  //makes new category
  public createNewCategory(categoryObj){
    return this.httpClient.post('https://localhost:44397/api/Categories',categoryObj);
  }
  //delete category 
  public deleteCategory(categoryId){
    return this.httpClient.delete('https://localhost:44397/api/Categories/'+categoryId, {responseType: 'text'});
  }
  //update exsiting category
  public updateCategory(categoryObj,categoryId){
    return this.httpClient.put('https://localhost:44397/api/Categories/'+categoryId, categoryObj);
  }
  //retrive products from db
  getProducts(){
    var username = 'hard';
    var password = 'hard';
   // const credentials = username+':'+password;
    let headers = new HttpHeaders();
   // headers = headers.append("Authorization", "Basic " + btoa(credentials));
    //headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient.get('https://localhost:44397/api/Stocks',{headers: headers});
  }
  createNewProduct(productObj){
    return this.httpClient.post('https://localhost:44397/api/Stocks',productObj);
  }
  deleteProduct(productId){
    return this.httpClient.delete('https://localhost:44397/api/Stocks/'+productId,{responseType: 'text'})
  }
}
