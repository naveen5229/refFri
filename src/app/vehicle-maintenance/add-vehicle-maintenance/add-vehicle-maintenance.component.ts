import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-vehicle-maintenance',
  templateUrl: './add-vehicle-maintenance.component.html',
  styleUrls: ['./add-vehicle-maintenance.component.scss']
})
export class AddVehicleMaintenanceComponent implements OnInit {

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

}
