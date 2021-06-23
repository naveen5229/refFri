import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddGpsSupplierComponent } from '../add-gps-supplier/add-gps-supplier.component';
import { AddVehicleComponent } from '../add-vehicle/add-vehicle.component';
import { AddMapVehicleComponentComponent } from '../add-map-vehicle-component/add-map-vehicle-component.component';

@Component({
  selector: 'add-gps-new-reques',
  templateUrl: './add-gps-new-reques.component.html',
  styleUrls: ['./add-gps-new-reques.component.scss']
})
export class AddGpsNewRequesComponent implements OnInit {

  table=null;
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
    this.table=null;
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
      apiprovider:this.gpsSupplierCode,
      authtoken:this.gpsAuthToken,
      apiusername:this.gpsUsername,
      apipwd:this.gpsPassword
    }
    
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
            this.table = this.setTable();
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

        setTable() {
          let headings = {
            vid: { title: 'Vehicle Id', placeholder: 'Vehicle Id' },
            vehicleName: { title: 'Vehicle Name', placeholder: 'Vehicle Name' },
            dateAndTime: { title: 'Date ', placeholder: 'Date' },
            angle: { title: 'Angle', placeholder: 'Angle' },
            speed: { title: 'Speed', placeholder: 'Speed' },
            latLongValid: { title: 'Lat Long Valid', placeholder: 'Lat Long Valid' },
            latitude: { title: 'Latitude', placeholder: 'Latitude' },
            longitude: { title: 'Longitude', placeholder: 'Longitude' },
            ignition: { title: 'Ignition', placeholder: 'Ignition' },
            gmt: { title: 'GMT', placeholder: 'GMT' },
            action: { title: 'Action', placeholder: 'Action', hideSearch: true, class: '' },
          };
          return {
            data: {
              headings: headings,
              columns: this.getTableColumns()
            },
            settings: {
              hideHeader: true,
              tableHeight: "auto"
            }
          }
        }
        getTableColumns() {
          console.log("SITES:", this.gpsRequestData);
          let columns = [];
          this.gpsRequestData.map(res => {
            let column = {
              vid: {value:res.vid},
              vehicleName: { value: res.vehicleName },
              dateAndTime: { value: res.dateAndTime },
              angle: { value: res.angle },
              speed: { value: res.speed },
              latLongValid: { value: res.latLongValid },
              latitude: { value: res.latitude },
              longitude: { value: res.longitude },
              ignition: { value: res.ignition },
              gmt: { value: res.gmt },
              action: { value: res.vid==0? 'Add Vehicle':'Map Vehicle', isHTML: true, action: res.vid==0 ? this.addVehicle.bind(this, res, true) : this.addVehicle.bind(this, res, false), class: 'icon'  },
            };
            columns.push(column);
          });
          return columns;
        }

        addVehicle(data, type){
          console.log('data is:', data, type)

          this.common.params = {isMap: type, data: data}
          const activeModal = this.modalService.open(AddMapVehicleComponentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });    
          
          activeModal.result.then(response => {
            console.log('activemodel receipt-bank res:', response)
            if(!response.response){
              this.getGpsData();
            }
          })
        }
        
      
        // addVehicle(data){
        //   this.common.params = { isAddVehicle:true,regNo:data['vehicleName']}
            
        //     const activeModal = this.modalService.open(AddVehicleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        // }

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
