import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public routes = {
    cost: [],
    profit: []
  };
  public costRoutes = [];

  constructor() { }
}
