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
import { PendingLicenceDetailComponent } from '../../modals/pending-licence-detail/pending-licence-detail.component';

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

  showDetails(row) {
    let rowData = [];
    
    this.common.loading++;
    this.api.post('Drivers/getPendingLicenceDetail', { x_user_id: this.user._details.id, x_driver_id: row._drvid, x_advreview: this.listtype })
      .subscribe(res => {
        this.common.loading--;
        if(res['success'] && res['data'].length) {
          rowData = res['data'][0];
        }
        
        this.common.params = { rowData, title: 'License Details', canUpdate: 1};
        this.common.handleModalSize('class', 'modal-lg', '1200');
        const activeModal = this.modalService.open(PendingLicenceDetailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
            activeModal.result.then(mdldata => {
              console.log("response:", mdldata);
            });
        
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    
  }
}
