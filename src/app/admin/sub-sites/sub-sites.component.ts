import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'sub-sites',
  templateUrl: './sub-sites.component.html',
  styleUrls: ['./sub-sites.component.scss','../../pages/pages.component.css']
})
export class SubSitesComponent implements OnInit {
  siteId = null;
  subSites = null;
  constructor(
   public common : CommonService,
    public api : ApiService,
    public mapService : MapService
  ) {
    this.common.refresh = this.refresh.bind(this);
   }

  ngOnInit() {
  }

  refresh(){
    console.log('refresh');
  }

  getSubSites(){
   // this.getFencing();
    let params = "siteId="+this.siteId;
    this.common.loading++;
    this.api.get('SubSiteOperation/getSubSites?'+params)
            .subscribe(res =>{
              this.common.loading--;
              console.log('res: ',res);
              this.subSites=res['data'];
              this.markerCreate();
            }, err =>{
              this.common.loading--;
              this.common.showError();
            });
  }

  getFencing(){
    let params = "siteId="+this.siteId;
    this.common.loading++;
  this.api.post("SiteFencing/getSiteFences", params)
  .subscribe(res => {
    this.common.loading--;
    let data = res['data'];
    let count = Object.keys(data).length;
    console.log('Res: ', res['data']);
    
  }, err =>{
    this.common.loading--;
    this.common.showError();
  });
}

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
  }

  markerCreate(){
    this.mapService.createMarkers(this.subSites);
    let markerIndex = 0;
    for (const marker of this.mapService.markers) {
      let event = this.subSites[markerIndex];
      markerIndex++;
    }
  }
 
  rotateBounce(i,bounce) {
    console.log("index",i);
      this.mapService.toggleBounceMF(i,bounce);
  }

}
