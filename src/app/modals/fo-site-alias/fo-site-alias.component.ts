import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  foAliases = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  points = null;
  name = null;
  searchString ='';
  keepGoing = true;
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal){
      this.getFoAlias();
    }

   
  ngOnDestroy(){}
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

  refresh() {
    console.log('Refresh');
    this.getFoAlias();
  }

  getFoAlias() {
    ++this.common.loading;
    this.api.get('SitesOperation/viewFoSiteAlias?')
      .subscribe(res => {
        --this.common.loading;
        console.log('Res: ', res['data']);
        this.foAliases = res['data'];
        this.foAliases.length ? this.setTable() : this.resetTable();
      }, err => {
        --this.common.loading;
        console.error(err);
        this.common.showError();
      });
  }


  
  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }


  generateHeadings() {
    let headings = {};
    for (var key in this.foAliases[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  getTableColumns() {
    let columns = [];
    this.foAliases.map(iss => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(iss)
          };
        } else {
          column[key] = { value: iss[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(loc) {
    let icons = [
      { class: 'fa fa-trash', action: this.deleteLocation.bind(this, loc) }
     

    ];

    return icons;
  }

  deleteLocation(LocDetails) {
    let params = {
      id: LocDetails._id
    }
    if (LocDetails._id) {
      this.common.params = {
        title: 'Delete Location ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('SitesOperation/deleteFoSiteAlias', params)
            .subscribe(res => {
              console.log("data", res);
              this.common.loading--;
              if (res['data'][0].y_id > 0) {
                this.common.showToast('Success');
                this.getFoAlias();
              }
              else {
                this.common.showToast(res['data'].y_msg);
              }


            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
    
  }

}
