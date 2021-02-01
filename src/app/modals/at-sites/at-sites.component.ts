import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CsvErrorReportComponent } from '../csv-error-report/csv-error-report.component';

@Component({
  selector: 'at-sites',
  templateUrl: './at-sites.component.html',
  styleUrls: ['./at-sites.component.scss']
})
export class AtSitesComponent implements OnInit {

  foid=null;
  name=null;
  mobileno=null;
  axesId=null;

  constructor(public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public api: ApiService) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.activeModal.close();
  }

  selectFoUser(event) {
    this.foid = event.id;
    this.name = event.name;
    this.mobileno = event.mobileno;
    this.axesId=event.ax_company_id
  }

  saveSites(){
    let params = {
      axesId: this.axesId,
      foid: this.foid
    }
    console.log("params", params);
    this.common.loading++;
    this.api.post('Site/getFoSitesWithCompanyId',params)
      .subscribe(res => {
      this.common.loading--;
      let successData =  res['data']['success'];
      let errorData =res['data']['fail'];
      alert(res["msg"]);
      this.common.params = { apiData: params,successData, errorData, title: 'Bulk Site csv Report',isUpdate:false };
      const activeModal = this.modalService.open(CsvErrorReportComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    }, err => {
      this.common.loading--;
      console.log(err);
    });
  }

}
