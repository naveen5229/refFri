import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGpsSupplierComponent } from '../add-gps-supplier/add-gps-supplier.component';

@Component({
  selector: 'add-gps-new-reques',
  templateUrl: './add-gps-new-reques.component.html',
  styleUrls: ['./add-gps-new-reques.component.scss']
})
export class AddGpsNewRequesComponent implements OnInit {


  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};


  isAuth=null;
  gpsSupplierList = [];
  gpsSupplierId = null;
  gpsSupplierName = '';
  gpsAuthToken=null;
  gpsPassword=null;
  gpsUsername=null;
  gpsRequestData=[];
  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
      this.common.handleModalSize('class', 'modal-lg', '1100', 'px');
      this.getGpsSupplierList();
     }

  ngOnInit(): void {
  }

  getGpsSupplierList() {
    this.common.loading++;
    this.api.get('Suggestion/getGpsSupplierList')
      .subscribe(res => {
        this.common.loading--;
        console.log("list", res);
        this.gpsSupplierList = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
        this.common.showError();
      });
  }

  addNewGpsSupplier() {
    const activeModal = this.modalService.open(AddGpsSupplierComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getGpsSupplierList();
      }
    });
  }

  selectSupplierData(gps){
    this.gpsSupplierId = gps.id;
    this.gpsSupplierName = gps.name;
    this.isAuth=gps.auth_type;
  }


  closeModal() {
    console.log("testing");
    this.activeModal.close(false);
  }

  getGpsData(){
    this.gpsRequestData=[];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this. valobj = {};
    if (this.gpsSupplierId == null) {
      this.common.showError("Please Enter Gps Supplier");
      return;
    } 
    if(this.isAuth==1){
      if(this.gpsAuthToken=='' || this.gpsAuthToken==null || this.gpsAuthToken=='undefined')
      {
        this.common.showError("Please Enter AuthToken");
        return;
      }
    }
    if(this.isAuth!=1){
      if(this.gpsUsername=='' || this.gpsUsername==null || this.gpsUsername=='undefined'){
        this.common.showError("Please Enter Username");
        return;
      }
      if(this.gpsPassword =='' || this.gpsPassword==null || this.gpsPassword=='undefined'){
        this.common.showError("Please Enter Password");
        return;
      }
    }
    let params={
      gpsSupplierId:this.gpsSupplierId,
      supplierName:this.gpsSupplierName,
      authtoken:this.gpsAuthToken,
      username:this.gpsUsername,
      password:this.gpsPassword
    }
    console.log("param:",params);

    this.common.loading++;
      this.api.getJavaPortDost(8090, 'gpsapi/downloadapidatabyprovider?providerName='+this.gpsSupplierName+'&token='+this.gpsAuthToken+'&userName='+this.gpsUsername+'&password='+this.gpsPassword)
        .subscribe(res => {
          --this.common.loading;
          console.log("Api result", res['result']);
          console.log("GpsReq:",this.gpsRequestData);
          if (res['statusCode']==200) {
            if(res['result'].length>0){
              this.common.showToast("Success");
            this.gpsRequestData=res['result'];
            let first_rec = this.gpsRequestData[0];
            let headings = {};
            for (var key in first_rec) {
            if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            headings[key] = headerObj;
              }
            }
            this.table.data = {
            headings: headings,
            columns: this.getTableColumns()
        };
      }
          } else {
            this.gpsRequestData=[];
            console.log("resData148:",res['result']);
            this.common.showError(res['message']);
          }

        },
          err => {
            --this.common.loading;
            console.error(' Api Error:', err)
          });
        }

        formatTitle(title) {
          return title.charAt(0).toUpperCase() + title.slice(1)
        }
        
        getTableColumns() {
          let columns = [];
          this.gpsRequestData.map(matrix => {
            this.valobj = {};
            for (let i = 0; i < this.headings.length; i++) {
              this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
            }
            columns.push(this.valobj);
          });
          return columns;
        }

        addGpsRequest(){
          let params={
            gpsSupplierId:this.gpsSupplierId,
            supplierName:this.gpsSupplierName,
            authtoken:this.gpsAuthToken,
            username:this.gpsUsername,
            password:this.gpsPassword
          }
          this.common.loading++;
          this.api.post('GpsData/addGpsApisRequest', params)
          .subscribe(res => {
          this.common.loading--;
          console.log('res:', res);
          if(res['success']){
            this.common.showToast(res['data'][0].y_msg);
            this.closeModal();
          }else{
            this.common.showError(res['data'][0].y_msg);
          }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

        }


}
