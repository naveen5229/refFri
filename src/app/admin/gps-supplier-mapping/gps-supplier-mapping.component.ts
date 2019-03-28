import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    public modalService: NgbModal) { }

  ngOnInit() {
  }

}
