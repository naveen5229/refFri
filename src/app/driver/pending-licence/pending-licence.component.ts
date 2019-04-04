import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';
import { from } from 'rxjs';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'pending-licence',
  templateUrl: './pending-licence.component.html',
  styleUrls: ['./pending-licence.component.scss']
})
export class PendingLicenceComponent implements OnInit {
  data = [];
  columns = [];
  listtype = 0;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
      this.getPendingLicences();
      this.common.refresh = this.refresh.bind(this);
    }

  ngOnInit() {
  }

  refresh() {
    window.location.reload();
  }

  selectList(id) {
    this.listtype = parseInt(id);
    this.getPendingLicences();        
  }

  getPendingLicences() {
    this.common.loading++;
    let params = { x_user_id : this.user._details.id, x_admin: 1, x_advreview: 0};
    if(this.listtype == 1) {
      params = { x_user_id : this.user._details.id, x_admin: 1, x_advreview: 1};
    }
    this.api.post('Drivers/getPendingLicenceList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("data", res);
        this.data = res['data'];
        this.columns = [];
        if(this.data.length) {
          for(var key in this.data[0]) {
            if(key.charAt(0) != "_")
              this.columns.push(key);
          }
          console.log("columns");
          console.log(this.columns);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
