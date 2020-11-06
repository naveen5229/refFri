import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'site-trip-details',
  templateUrl: './site-trip-details.component.html',
  styleUrls: ['./site-trip-details.component.scss']
})
export class SiteTripDetailsComponent implements OnInit {
  siteTripData = [];
  headings = [];
dataForView = null;
  table = {
    data: {
      headings: {        
      },
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal : NgbActiveModal
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1400');
    this.dataForView = this.common.params.dataForView;
    console.log("dataForView",this.dataForView)
    this.getReport();
   }

  ngOnInit() {
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if(pos > 0) {
      return strval.toLowerCase().split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

 

  getReport() {
    this.common.loading++;
    this.headings = [];
    let params = {
      userId :this.dataForView.userId,
      siteId : this.dataForView.siteId,
      status : this.dataForView.status,
      location : this.dataForView.location
    };

    console.log("params",params);
    this.api.post('TripsOperation/tripDetailsSiteWise',params)
      .subscribe(res => {
        this.common.loading--;
        this.resetDisplayTable();
        console.log("siteTripData",res['data']);
       this.siteTripData = JSON.parse(res['data'][0].fn_site_tripdetails);
        if(this.siteTripData == null || res['data'] == null) {
          console.log("siteTripData",this.siteTripData);
          this.siteTripData = [];
          this.resetDisplayTable();
        }
        console.info("siteTripData Data", this.siteTripData);

        let first_record = this.siteTripData[0];
        this.table.data.headings = {};
        console.log("first_record",first_record);
        for(var key in first_record) {
          if(key.charAt(0) != "_") {
            this.headings.push(key);
            let hdgobj = {title: this.formatTitle(key), placeholder: this.formatTitle(key)};
            this.table.data.headings[key] = hdgobj;
          }
        }
        console.log("this.headings",this.headings);

     

        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetDisplayTable() {
    this.table = {
      data: {
        headings: {        
        },
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }

  getTableColumns() {
    let columns = [];
    this.siteTripData.map(std => {
      let valobj = {};
      for(var i = 0; i < this.headings.length; i++) {
        let val = std[this.headings[i]];
        let status = '';
        
        valobj[this.headings[i]] = { value: val, class: 'black', action: '' };       

      }
     
      columns.push(valobj);     
    });
    return columns;
  }

  closeModal() {
    this.activeModal.close();
  }
  

}
