import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'checkloginandredirect',
  templateUrl: './checkloginandredirect.component.html',
  styleUrls: ['./checkloginandredirect.component.scss']
})
export class CheckloginandredirectComponent implements OnInit {
  frompage: string;
  token: string;
  page: string;
  oldtoken: string;

  constructor(private route: ActivatedRoute, private common: CommonService,
    private user: UserService, private router: Router, private dataService: DataService,
    private api: ApiService) {
    console.log("Testing");
    let params = window.location.href.substr(window.location.href.indexOf('?') + 1).split('&');
    console.log(params);
    params.forEach(param => {
      if (param.startsWith('token=')) {
        this.token = param.split('token=')[1];
      } else if (param.startsWith('page=')) {
        this.page = param.split('page=')[1].replace(/%2F/g, '/');
      } else if (param.startsWith('frompage=')) {
        this.frompage = param.split('frompage=')[1].replace(/%2F/g, '/');
      } else if (param.startsWith('oldtoken=')) {
        this.oldtoken = param.split('oldtoken=')[1];
      }
    })
    console.log('Token:', this.token);
    console.log('page:', this.page);
    console.log('frompage:', this.frompage);
    let details = this.common.parseJwt(this.token);
    let walle8details = this.common.parseJwt(this.oldtoken);
    console.log("Walle8Details:", walle8details);

    console.log('Details:', details, walle8details);
    if (details) {
      this.user._details = details;
      this.user._details.authkey = this.token;
      this.user._details.authkeyOld = this.oldtoken;
      this.user._details.fo_mobileno = walle8details.fo_mobile;
      this.user._details.foid = walle8details.foid;
      this.user._token = this.token;
      this.user._loggedInBy = 'walle8customer';
      let url = window.location.href;
      url = url.toLowerCase();
      // let iswallet = url.search("walle8customer") > -1 ? '1' : '0';
      let iswallet = '1';

      localStorage.setItem('USER_TOKEN', this.user._token);
      localStorage.setItem('USER_DETAILS', JSON.stringify(this.user._details));
      localStorage.setItem('iswallet', iswallet);
      localStorage.setItem('LOGGED_IN_BY', this.user._loggedInBy);
      if (this.frompage)
        localStorage.setItem('DOST_FVTS_FROM_PAGE', this.frompage);

      // this.dataService._menu.user.push({
      //   title: 'Back',
      //   link: '#'
      // });
      // this.router.navigate([this.page || '/pages']);

      this.getUserPagesList(iswallet);
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    document.getElementById('nb-global-spinner').style.display = 'none';
  }

  getUserPagesList(iswallet) {
    this.user._pages = null;
    let userTypeId = this.user._loggedInBy == 'admin' ? 1 : 3;
    const params = {
      userId: this.user._details.id,
      userType: userTypeId,
      iswallet: iswallet
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        this.user._pages = res['data'].filter(page => {
          // return page.userid;
          return true;
        });

        localStorage.setItem('DOST_USER_PAGES', JSON.stringify(this.user._pages));
        this.user.filterMenu("pages", "pages");
        this.user.filterMenu("admin", "admin");
        this.user.filterMenu("tyres", "tyres");
        this.user.filterMenu("battery", "battery");
        this.user.filterMenu("vehicleMaintenance", "vehicleMaintenance");
        this.user.filterMenu("wareHouse", "wareHouse");
        this.user.filterMenu("account", "account");
        this.user.filterMenu("challan", "challan");
        this.user.filterMenu("walle8", "walle8");
        this.user.filterMenu("loadIntelligence", "loadIntelligence");
        this.router.navigate([this.page || '/pages']);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

}
