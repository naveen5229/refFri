import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { PAGES_MENU_ITEMS } from '../pages/pages-menu';
import { ADMIN_MENU_ITEMS } from '../admin/admin-menu';
import { TYRES_MENU_ITEMS } from '../tyres/tyres-menu';
import { BATTERY_MENU_ITEMS } from '../battery/battery-menu';
import { MAINTENANCE_MENU_ITEMS } from '../vehicle-maintenance/vehicle-maintenance-menu';
import { WAREHOUSE_MENU_ITEMS } from '../ware-house/ware-house-menu';
import { ACCOUNTS_MENU_ITEMS } from '../accounts/accountes-menu';
import { CHALLAN_MENU_ITEMS } from '../challan/challan-menu';

const COLLECTION = {
  admin: ADMIN_MENU_ITEMS,
  pages: PAGES_MENU_ITEMS,
  tyres: TYRES_MENU_ITEMS,
  battery: BATTERY_MENU_ITEMS,
  vehicleMaintenance: MAINTENANCE_MENU_ITEMS,
  wareHouse: WAREHOUSE_MENU_ITEMS,
  account: ACCOUNTS_MENU_ITEMS,
  challan: CHALLAN_MENU_ITEMS
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _token = '';
  _details = null;
  _customer = {
    name: '',
    id: '',
  };

  _loggedInBy = '';
  _pages = null;
  _menu = {
    admin: [],
    pages: [],
    tyres: [],
    battery: [],
    vehicleMaintenance: [],
    wareHouse: [],
    account: [],
    challan: [],
  };

  permission = {
    add: false,
    edit: false,
    delete: false,
  };


  constructor(public dataService: DataService) {
    console.log('Details: ', localStorage.getItem('USER_DETAILS'));
    this._token = localStorage.getItem('USER_TOKEN') || '';
    this._details = JSON.parse(localStorage.getItem('USER_DETAILS')) || null;
    this._loggedInBy = localStorage.getItem('LOGGED_IN_BY') || '';
    this._customer = JSON.parse(localStorage.getItem('CUSTOMER_DETAILS')) || { name: '', id: '' };

    if (!this._pages)
      this._pages = JSON.parse(localStorage.getItem("DOST_USER_PAGES"));
  }

  filterMenu(type?, collection?) {
    this._menu[type] = JSON.parse(COLLECTION[collection])
      .map((menuItem) => {
        if (menuItem.children) {
          menuItem.children = menuItem.children.filter(childItem => {
            if (this._pages.find(page => {
              if (childItem.link == page.route) return true;
              return false;
            }))
              return true;
            return false;
          });
        }
        return menuItem;
      })
      .filter(menuItem => {
        if (menuItem.link) {
          if (this._pages.find(page => {
            if (menuItem.link == page.route) return true;
            return false;
          }))
            return true;
          return false;
        } else if (!menuItem.children.length) return false;
        return true;
      });
  }

}
