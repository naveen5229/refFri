import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date/date.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'site-in-out',
  templateUrl: './site-in-out.component.html',
  styleUrls: ['./site-in-out.component.scss']
})
export class SiteInOutComponent implements OnInit {
  sitesDatalist = [];
  siteName = null;
  siteId = null;
  data = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 7));
  isFlag = 1;

  bGConditions = [
    { key: 'is_flag', value: 1, class: 'normal' },
    { key: 'is_flag', value: 2, class: 'abnormal' }
  ];

  constructor(
    public apiService: ApiService,
    public common: CommonService,
    public DateService: DateService,
    public user: UserService
  ) {
    this.getAllFoSites();
    this.common.refresh = this.refresh.bind(this);

  }
  ngOnInit() {
  }
  refresh() {
    this.getAllFoSites();
  }
  getAllFoSites() {
    this.common.loading++;
    this.apiService.get('Site/getAllFoSites')
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.sitesDatalist = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getReport() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.data = [];

    let url = null;
    if (this.isFlag == 2) {
      url = "Site/getLocalSiteInOutHistory";
    }
    else {
      url = "Site/getSiteInAndOut"
    }

    let params = {

      startDate: this.common.dateFormatter(this.startDate),
      endDate: this.common.dateFormatter(this.endDate),
      siteId: this.siteId
    }
    console.log(params);
    this.common.loading++;
    this.apiService.post(url, params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);

    });

    return columns;
  }
  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.apiService.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Site In And Out";
        let lower_left_heading = "Site Name : " + this.siteName;
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '', lower_left_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.apiService.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "Customer Name::" + fodata['name'];
        let center_heading = "Report Name::" + "Site In And Out";
        let lower_left_heading = "Site Name ::" + this.siteName;
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '', lower_left_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  changeRefernceType(type) {
    this.siteName = type.name;
    this.siteId = this.sitesDatalist.find((element) => {
      console.log(element.name == type);
      if (element.is_flag == 2) {
        this.isFlag = 2;
      }
      else {
        this.isFlag = 1;
      }
      return element.id == type.id;
    }).id;

  }

}
