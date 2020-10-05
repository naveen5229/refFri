import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

@Component({
  selector: 'fo-site-alias',
  templateUrl: './fo-site-alias.component.html',
  styleUrls: ['./fo-site-alias.component.scss']
})
export class FoSiteAliasComponent implements OnInit {
  site ={
    type:'site',
    name:null,
    id:null
  };
  alias ={
    type:'site',
    name:null,
    id:null
  };
  points = null;
  name = null;
  searchString ='';
  keepGoing = true;
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal){

    }

   
  ngOnInit() {
  }

   
  selectSite(event, type) {
    console.log("details",type, event);  
    if(type=='site'){
      this.site.id = event.id;
      this.site.name = event.name;
    } else if(type=='alias'){
      this.alias.id = event.id;
      this.alias.name = event.location;
    }
  }

  selectLocation(event, type){
    console.log("details",type, event);  
    if(type=='site'){
      this.site.id = event.id;
      this.site.name = event.name;
    } else if(type=='alias'){
      this.alias.id = event.id;
      this.alias.name = event.location;
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  onChangeAuto(search) {
    this.searchString = search;
  }

  takeAction(res, type) {
    setTimeout(() => {
      if (this.keepGoing && this.searchString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };
        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          if (res != null) {
            this.keepGoing = true;
            if (res.location.lat) {
              if (type == 'site') {
                this.site.name = res.location.name;
                (<HTMLInputElement>document.getElementById('siteValue')).value = this.site.name;
                this.site.id = res.id;
                this.keepGoing = true;
              }
              else if (type == 'alias') {
                this.alias.name = res.location.name;
                (<HTMLInputElement>document.getElementById('aliasValue')).value = this.alias.name;
                this.alias.id = res.id;
                this.keepGoing = true;
              }
            }
          }
        })
      }
    }, 1000);

  }

  updateSiteAlias() {
    const params = {
      aliasSiteId:this.alias.id,
      name:this.name,
      siteId:this.site.id,
      point:this.points,
      id:null
    }

    console.log("params", params);
    this.common.loading++;
    this.api.post('SitesOperation/saveFoSiteAlias', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("upload result", res);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
        }
        else {
          this.common.showToast(res['data'][0].y_msg);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }

}
