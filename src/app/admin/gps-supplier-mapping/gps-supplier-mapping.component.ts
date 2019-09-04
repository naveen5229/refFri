import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManualHaltComponent } from '../../modals/manual-halt/manual-halt.component';

@Component({
  selector: 'gps-supplier-mapping',
  templateUrl: './gps-supplier-mapping.component.html',
  styleUrls: ['./gps-supplier-mapping.component.scss','../../pages/pages.component.css']
})
export class GpsSupplierMappingComponent implements OnInit {

  supplierData={
    param1:'',
    param2:'',
    param3:'',
    param4:''
  }

  constructor(public common: CommonService,
    public api: ApiService,public user: UserService,
    public modalService: NgbModal) {
      this.common.refresh = this.refresh.bind(this);
     }

  ngOnInit() {
  }

  refresh(){
    console.log("Refresh");
  }

  insertSupplierDetails(){
    const activeModel = this.modalService.open(ManualHaltComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
  }

  getFoList(fo){

  }

  getSupplierList(supplier){
    
  }

}
