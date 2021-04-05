import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { ReportIssueComponent } from '../report-issue/report-issue.component';
declare var google: any;

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'update-site-details',
  templateUrl: './update-site-details.component.html',
  styleUrls: ['./update-site-details.component.scss', '../../pages/pages.component.css']
})
export class UpdateSiteDetailsComponent implements OnInit {
  // updateSiteDetails:any= [s_name:'',latitude:'',longitude:''];
  s_name;
  flag_success: boolean = false;
  latitude;
  longitude;
  moveLoc = '';
  siteLoc = null;
  isStrictLoading = "null";
  siteId = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    public mapService: MapService,
  ) {
    this.s_name = this.common.params.site.site_name;
    this.siteId = this.common.params.site.site_id;
    console.log(this.common.params.site);
  }


  ngOnDestroy(){}
ngOnInit() {

  }
  updateSiteDetails() {
    console.log("site loction:", this.siteLoc);
    let params = {
      siteId: this.siteId,
      locationName: this.siteLoc.split(',')[0],
      isStrictLoading: this.isStrictLoading,
    }
    console.log("params", params);

    ++this.common.loading;
    this.api.post('Site/updateSiteDetails', params)
      .subscribe(res => {
        console.log('Res:', res);
        var flag = "success";
        --this.common.loading;
        if (res['msg'] == "success") {
          alert(res['msg']);
          this.dismiss();
        }
        else {
          alert("site location is not updated");
        }
      }, err => {
        --this.common.loading;
        alert("site location is not updated");
        console.log('Err:', err);
      });
  }
  dismiss() {
    this.activeModal.close();
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("update-site-details-map");
    setTimeout(() => {
      this.mapService.autoSuggestion("siteLoc", (place, lat, lng) => this.siteLoc = place);
      this.mapService.createMarkers([{ lat: this.common.params.site.lat, long: this.common.params.site.lng, type: 'site' }]);
      this.mapService.zoomMap(10.5);

    }, 2000);
  }

  // updateLocation(elementId,autocomplete) {
  //   console.log('tets');
  //   let place = autocomplete.getPlace();
  //   let lat = place.geometry.location.lat();
  //   let lng = place.geometry.location.lng();
  //   place = autocomplete.getPlace().formatted_address;

  //   this.setLocations(elementId,place,lat,lng);
  // }

  // setLocations(elementId,place,lat,lng){
  //   console.log("elementId",elementId,"place",place,"lat",lat,"lng",lng);
  //   //this.vehicleTrip.startName = place;
  //  // this.vehicleTrip.startLat = lat;
  //  // this.vehicleTrip.startLng = lng;
  // }
  reportIssue() {
    this.common.params = { refPage: 'sd' };
    console.log("reportIssue", this.siteId);
    const activeModal = this.modalService.open(ReportIssueComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data => data.status && this.common.reportAnIssue(data.issue, this.siteId));

  }
}
