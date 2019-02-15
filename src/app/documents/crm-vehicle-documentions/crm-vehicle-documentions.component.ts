import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
@Component({
  selector: 'crm-vehicle-documentions',
  templateUrl: './crm-vehicle-documentions.component.html',
  styleUrls: ['./crm-vehicle-documentions.component.scss']
})
export class CrmVehicleDocumentionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
