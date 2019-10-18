import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { AddGpsSupplierComponent } from '../add-gps-supplier/add-gps-supplier.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'add-gps-web-url',
  templateUrl: './add-gps-web-url.component.html',
  styleUrls: ['./add-gps-web-url.component.scss']
})
export class AddGpsWebUrlComponent implements OnInit {

  gpsSupplierList=[];
  gpsSupplierId=null;
  gpsUrl=''
  rowId=this.common.params;

  constructor(public common:CommonService,
    public activeModel: NgbActiveModal,
    public api:ApiService,
    private modalService: NgbModal,) { 
    this.common.handleModalSize('class', 'modal-lg', '480');
    this.getGpsSupplierList();
  }

  ngOnInit() {
  }

  addNewGpsSupplier(){
    const activeModal = this.modalService.open(AddGpsSupplierComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getGpsSupplierList();
      }
    });

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

  closeModal() {
    this.activeModel.close({ response: false });
  }

  addGpsWebUrl(){
    if(this.gpsSupplierId==null){
      this.common.showError("Please Enter Gps Supplier")
    }else if(this.gpsUrl==''){
      this.common.showError("Please Enter Gps Url")
    }else{
      let params={
        gpsSupplierId:this.gpsSupplierId,
        url:this.gpsUrl,
        rowId:this.rowId,
      }
      this.common.loading++;
      this.api.post('GpsData/addGpsWebUrl', params)
        .subscribe(res => {
          --this.common.loading;
          this.activeModel.close({ response: true });
        },
          err => {
            --this.common.loading;
            console.error(' Api Error:', err)
          });
    }
    
  }

}
