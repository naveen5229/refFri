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
import { WALLE8_MENU_ITEMS } from '../walle8/walle8-menu';
import { BIDSYSTEM_MENU_ITEMS } from '../bid-system/bid-system-menu'
import { LOAD_INTELLIGENCE_MENU_ITEMS } from '../load-intelligence/load-intelligence-menu';

const COLLECTION = {
  admin: ADMIN_MENU_ITEMS,
  pages: PAGES_MENU_ITEMS,
  tyres: TYRES_MENU_ITEMS,
  battery: BATTERY_MENU_ITEMS,
  vehicleMaintenance: MAINTENANCE_MENU_ITEMS,
  wareHouse: WAREHOUSE_MENU_ITEMS,
  account: ACCOUNTS_MENU_ITEMS,
  challan: CHALLAN_MENU_ITEMS,
  walle8: WALLE8_MENU_ITEMS,
  bidSystem: BIDSYSTEM_MENU_ITEMS,
  loadIntelligence: LOAD_INTELLIGENCE_MENU_ITEMS
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
    mobileNo: null,
    foid: null
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
    walle8: [],
    bidSystem: [],
    loadIntelligence: [],
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

    if (!this._pages && localStorage.getItem("DOST_USER_PAGES")) {
      this._pages = JSON.parse(localStorage.getItem("DOST_USER_PAGES"));
      this.filterMenu("pages", "pages");
      this.filterMenu("admin", "admin");
      this.filterMenu("tyres", "tyres");
      this.filterMenu("battery", "battery");
      this.filterMenu("vehicleMaintenance", "vehicleMaintenance");
      this.filterMenu("wareHouse", "wareHouse");
      this.filterMenu("account", "account");
      this.filterMenu("challan", "challan");
      this.filterMenu("walle8", "walle8");
      this.filterMenu("bidSystem", "bidSystem");
      this.filterMenu("loadIntelligence", "loadIntelligence");
    }
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

    if (type === 'pages' && localStorage.getItem('DOST_axesToken')) {
      console.log('test');
      this._menu[type].push({
        title: 'GPS',
        icon: 'fa-chalkboard-teacher',
        link: '#'
      })
    }
  }

  resetUserService() {
    this._token = '';
    this._details = null;
    this._customer = {
      name: '',
      id: '',
      mobileNo: null,
      foid: null
    };

    this._loggedInBy = '';
    this._pages = null;
    this._menu = {
      admin: [],
      pages: [],
      tyres: [],
      battery: [],
      vehicleMaintenance: [],
      wareHouse: [],
      account: [],
      challan: [],
      walle8: [],
      bidSystem: [],
      loadIntelligence: [],
    };

    this.permission = {
      add: false,
      edit: false,
      delete: false,
    };
  }

  findPageIdByRoute(route: string) {
    const page = this._pages.find(page => page.route === route);
    if (page)
      return page.id
    return 0;
  }

}
