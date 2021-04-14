import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'addmissingtoll',
  templateUrl: './addmissingtoll.component.html',
  styleUrls: ['./addmissingtoll.component.scss']
})
export class AddmissingtollComponent implements OnInit {

  table = null;
  missingTollDetails=[]

  activeTab='addByImage';
  uploadImage=null;
  tollName=null;
  tollCost=null;
  vehId=null;
  vehClass=null;
  startDt=null;
  endDt=null;
  encounterTime=null;
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal) {

      if(this.common.params && this.common.params.vehData){
        this.vehId=this.common.params.vehData.vid;
        this.vehClass=this.common.params.vehData.vClass;
        this.startDt=this.common.params.vehData.sdate;
        this.endDt=this.common.params.vehData.edate;
      }
      this.viewUserTolls();
   }

  ngOnDestroy(){}
ngOnInit(): void {
  }

  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;
        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "image/jpeg" || file.type == "image/jpg" ||
          file.type == "image/png" || file.type == "application/pdf" ||
          file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          // this.common.showToast("SuccessFull File Selected");
        }
        else {
          this.common.showError("valid Format Are : jpeg,png,jpg,doc,docx,csv,xlsx,pdf");
          return false;
        }
        console.log('Base 64: ', res);
        this.uploadImage = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }

  uploadMissingTollDetails(){
    let params={
      vid:this.vehId,
      vehicleClass:this.vehClass,
      startTime:this.startDt,
      endTime:this.endDt
    }
    if(this.activeTab=='addByImage'){
      params['img']=this.uploadImage;
    }else{
      params['tollEncounterTime']=this.encounterTime;
      params['tollName']=this.tollName;
      params['tollCost']=this.tollCost;
    }
    
    console.log("data:",params);
    this.api.post('Toll/saveUserTolls', params)
      .subscribe(res => {
       console.log(res['data'])
       if(res['success']){
         this.common.showToast(res['msg']);
         this.viewUserTolls();
         this.closeModal();
       }else{
         this.common.showError(res['msg']);
       }
      }, err => {
        console.log(err);
      });
  }

  viewUserTolls() {
    // console.log("api hit");
    this.common.loading++;
    this.api.get('Toll/viewUserTolls')
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.missingTollDetails = res['data'];
        console.log("MissingTollData:",this.missingTollDetails);
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      Regno: { title: 'Reg No', placeholder: 'Reg No' },
      VehicleClass: { title: 'Vehicle Class', placeholder: 'Vehicle Class' },
      TollReceipt: { title: 'Toll Receipt', placeholder: 'Toll Receipt' },
      TollName: { title: 'Toll Name', placeholder: 'Toll Name' },
      TollEncTime: { title: 'Toll Enc. Time', placeholder: 'Toll Enc. Time' },
      TollCost:{title:'Toll Cost',placeholder:'Toll Cost'},
      AddedOn:{title:'Added On',placeholder:'Added On'},
      Status:{title:'Status',placeholder:'Status'},
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
    let columns = [];
    this.missingTollDetails.map(doc => {
      let column = {
        Regno: { value: doc['Regno'] },
        VehicleClass: { value:doc['Vehicle Class'] },
        TollReceipt: { value: doc['Toll Receipt'], class:doc._image?'blue':'black', action: doc['Toll Receipt']=='Show Image'? this.showImg.bind(this, doc):''},
        TollName: { value:doc['Toll Name']},
        TollEncTIme: { value:doc['Toll Enc. Time']},
        TollCost:{value:doc['Toll Cost']},
        AddedOn:{value:doc['Added On']},
        Status:{value:doc['Status']}
      };
      columns.push(column);
    });
    return columns;
  }

  showImg(doc){
    if(doc._image!=null){
      window.open(doc._image, "_blank");
    }
  }

  closeModal(){
    this.activeModal.close();
  }

}
