import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service'
@Component({
  selector: 'ware-house',
  templateUrl: './ware-house.component.html',
  styleUrls: ['./ware-house.component.scss']
})
export class WareHouseComponent implements OnInit {

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
  
  }

  ngOnInit() {
  }

}
