import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'update-site-details',
  templateUrl: './update-site-details.component.html',
  styleUrls: ['./update-site-details.component.scss']
})
export class UpdateSiteDetailsComponent implements OnInit {
  // updateSiteDetails:any= [s_name:'',latitude:'',longitude:''];
  s_name;
  latitude;
  longitude;
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,




  ) {
    this.s_name = this.common.params.site.site_name;
    console.log(this.common.params.site);
  }


  ngOnInit() {
  }
  dismiss() {
    this.activeModal.close();
  }

}
