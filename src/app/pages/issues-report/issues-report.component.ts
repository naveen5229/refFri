import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { GenericModelComponent } from '../../modals/generic-modals/generic-model/generic-model.component';
import { ShowDataMapComponent } from '../../modals/generic-modals/show-data-map/show-data-map.component';

@Component({
  selector: 'issues-report',
  templateUrl: './issues-report.component.html',
  styleUrls: ['./issues-report.component.scss']
})
export class IssuesReportComponent implements OnInit {
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination:true
    }
  };
  reportType = 'misTripReject';
  reportData = [];
  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date().getDate() - 15));
  clusterSize = 100
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
  
  ) {

    this.getReportData(this.reportType);
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getReportData(this.reportType);
  }

  getReportData(type) {
    this.reportType = type;
    this.common.loading++;
    let url = "TripsOperation/tripReports?"
    let params = 'fromDate='+ this.common.dateFormatter1(this.startDate)+
    '&toDate='+this.common.dateFormatter1(this.endDate)+
    '&level=1'+
    '&vehicleId='+
    '&locName='+
    '&clusterSize='+this.clusterSize+
    '&reportType='+this.reportType;
    this.api.get(url+params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
          this.reportData = res['data'] || [];
          this.gettingTableHeader(this.reportData);
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  gettingTableHeader(tableData) {

    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: true
      },
      
    };

    let first_rec = tableData[0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings.push(key);
        let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        this.table.data.headings[key] = headerObj;
      }
    }

    this.table.data.columns = this.getTableColumns(tableData);
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns(tableData) {
    // this.headings.push('Action');
    // this.table.data.headings['Action'] = { title: 'Action', placeholder: 'Action' };
    this.valobj = {};
    let columns = [];
    tableData.map(tbldt => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == 'Action') {
          this.valobj[this.headings[i]] = {
            value: '', isHTML: true, action: null,
            icons: this.actionIcons(tbldt)
          }
        }
        else if (this.headings[i] == 'Location' ||this.headings[i] =='Unload Location') {
          this.valobj[this.headings[i]] = { value: tbldt[this.headings[i]], class: 'blue', action: this.openGenericModel.bind(this,tbldt),isHTML: true, };
        }
        else if (this.headings[i] == 'Original' ||this.headings[i] =='Cluster Name' || this.headings[i] =='location') {
          this.valobj[this.headings[i]] = { value: tbldt[this.headings[i]], class: 'blue', action: this.showDataOnMap.bind(this,tbldt),isHTML: true, };
        }
          
         else if (this.headings[i] == 'Trip') {
          this.valobj[this.headings[i]] = {
            value: this.common.getTripStatusHTML(tbldt._trip_status_type, tbldt._showtripstart, tbldt._showtripend, tbldt._p_placement_type, tbldt._p_loc_name),

            isHTML: true,
          }
        }
        else {
          this.valobj[this.headings[i]] = { value: tbldt[this.headings[i]], class: 'black', action: '',isHTML: true, };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(data) {
    // let icons = [{
    //   class: 'fa fa-cog delete',
    //   action: this.enterTicket.bind(this, data)
    // }];
    // return icons;
  }
  

  openGenericModel(data){
    console.log('data',data);
    let dataparams = {
      view: {
        api: 'TripsOperation/tripReports',
        param: {
          fromDate: this.common.dateFormatter1(this.startDate),
          toDate : this.common.dateFormatter1(this.endDate),
          level : 2,
          locName : data['Location']  || data['Unload Location'],
          loadLocName : data['Location']  || data['Unload Location'],
          reportType : this.reportType,
          clusterSize : this.clusterSize
        }
      },
      viewModal: {
        api: 'TripExpenseVoucher/getRouteTripSummaryDril',
        param: {
          startDate: '_start',
          endDate: '_end',
          type: '_type',
          levelId: '_id'
        }
      },
      title: "Details - " +data['Location'] || + data['Unload Location']
    }
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { data: dataparams };
    const activeModal = this.modalService.open(GenericModelComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  showDataOnMap(data) {
    // this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = { mapData: data._map };
    const activeModal = this.modalService.open(ShowDataMapComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }

  }


 

