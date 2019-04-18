import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'vehicle-lr',
  templateUrl: './vehicle-lr.component.html',
  styleUrls: ['./vehicle-lr.component.scss','../../pages/pages.component.css']
})
export class VehicleLrComponent implements OnInit {
  startDate = null;
  endDate = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal) { 
    let today = new Date();
    this.startDate = (this.common.dateFormatter(today)).split(' ')[0];
    this.endDate=(this.common.dateFormatter(new Date(today.setDate(today.getDate() + 1)))).split(' ')[0];
    console.log('dates ',this.endDate,this.startDate);
  }

  ngOnInit() {
  }


  ViewLr(){

  }
}
