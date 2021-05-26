import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGpsSupplierComponent } from '../add-gps-supplier/add-gps-supplier.component';
import { AddVehicleComponent } from '../add-vehicle/add-vehicle.component';

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
  gpsSupplierCode='';
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

  reset(){
    this.gpsAuthToken=null;
    this.gpsUsername=null;
    this.gpsPassword=null;
    this.gpsRequestData=[];
  }

  selectSupplierData(gps){
    this.reset();
    this.gpsSupplierId = gps.id;
    this.gpsSupplierName = gps.name;
    this.gpsSupplierCode=gps.code;
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
    if(this.isAuth==1 || this.isAuth==3){
      if(this.gpsAuthToken=='' || this.gpsAuthToken==null || this.gpsAuthToken=='undefined')
      {
        this.common.showError("Please Enter AuthToken");
        return;
      }
    }
    if(this.isAuth==2 || this.isAuth==3){
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
      // gpsSupplierId:this.gpsSupplierId,
      apiprovider:this.gpsSupplierCode,
      authtoken:this.gpsAuthToken,
      apiusername:this.gpsUsername,
      apipwd:this.gpsPassword
    }
    // console.log("param:",params);

    // ?providerName='+this.gpsSupplierCode+'&token='+this.gpsAuthToken+'&userName='+this.gpsUsername+'&password='+this.gpsPassword
    this.common.loading++;
      this.api.postJavaPortDost(8090, 'gpsapi/downloadapidatabyprovider',params)
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
      }else{
        this.common.showToast("Record Not Found");
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
              if (this.headings[i] == 'action') {
                this.valobj[this.headings[i]] = {
                  value: "",
                  isHTML: false,
                  action: null,
                  icons: this.actionIcon(matrix)
              }

              this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
            }
            this.valobj['Action'] = { class: '', icons: this.actionIcon(matrix) }
            columns.push(this.valobj);
          } 
        });
          return columns
        }
      

        actionIcon(data) {
          console.log("dataaction:",data);
          let actionIcons = [];
          if (data['vid']==0) {
            actionIcons.push(
              {
                class: "far fa-eye",
                action: this.addVehicle.bind(this, data),
              });
          
           return actionIcons;
        }
      }
      
        addVehicle(data){
          this.common.params = { isAddVehicle:true,regNo:data['vehicleName']}
            
            const activeModal = this.modalService.open(AddVehicleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        }

        addGpsRequest(){
          let params={
            gpsSupplierId:this.gpsSupplierId,
            supplierName:this.gpsSupplierCode,
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
