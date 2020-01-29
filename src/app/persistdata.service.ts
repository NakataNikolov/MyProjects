import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersistdataService {

  constructor() { 
    
  }
  saveBacgroundColors(index, newDivData){
    var divOptions = [];

    if(newDivData){
      divOptions.splice(index,0,newDivData)
    }
    return divOptions;
  }
}
