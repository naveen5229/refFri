import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../admin.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateSiteDetailsComponent } from '../../modals/update-site-details/update-site-details.component';
import { ReportIssueComponent } from '../../modals/report-issue/report-issue.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss']
})
export class SiteDetailsComponent implements OnInit {
  siteDetails = [];
  constructor(
    public api:ApiService,
    public common:CommonService,public user: UserService,
    public modalService: NgbModal) {
    this.getsiteDetails();
    this.common.refresh = this.refresh.bind(this);

   }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getsiteDetails();
  }

  getsiteDetails() {
    ++this.common.loading;
    this.api.post('Site/getSiteDetails', {})
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        this.siteDetails = res['data'];
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });

}
updateSiteDetail(site){
  console.log(site);
  // let s_name=site.site_name;
  // let latitude=site.lat;
  // let longitude=site.lng;
  this.common.params= {site};
  this.common.handleModalSize('class', 'modal-lg', '1200');
  const activeModal= this.modalService.open(UpdateSiteDetailsComponent, {size: 'lg', container: 'nb-layout', backdrop: 'static'});
     activeModal.result.then(data =>{
        this.getsiteDetails();
       });
    
}

}
