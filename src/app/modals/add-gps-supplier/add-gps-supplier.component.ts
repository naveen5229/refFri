import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'add-gps-supplier',
  templateUrl: './add-gps-supplier.component.html',
  styleUrls: ['./add-gps-supplier.component.scss']
})
export class AddGpsSupplierComponent implements OnInit {

  gpsSupplier='';
  constructor(public activeModel: NgbActiveModal,
    public common:CommonService,
    public api:ApiService) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModel.close({ response: false });
  }

  saveMvGpsSupplier(){
    if(this.gpsSupplier==''){
      this.common.showError("Please Enter Gps Supplier ")
    }else{
      let params={
        supplierName:this.gpsSupplier,
      }
      this.common.loading++;
      this.api.post('GpsData/addGpsSupplier', params)
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
