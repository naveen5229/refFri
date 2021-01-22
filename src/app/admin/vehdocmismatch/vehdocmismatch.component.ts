import { Component, OnInit } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehdocmismatch',
  templateUrl: './vehdocmismatch.component.html',
  styleUrls: ['./vehdocmismatch.component.scss']
})
export class VehdocmismatchComponent implements OnInit {

  vehdocmismatch=[];

  table = {
    data: {
      headings: {},
      columns: [],
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal
    ) { 
      this.vehDocMismatchSummary()
    }

  ngOnDestroy(){}
ngOnInit() {
  }

  vehDocMismatchSummary(){
    ++this.common.loading;
    this.api.get('Documents/vahenDocumentMismatchSummary')
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res['data']);
        this.vehdocmismatch=res['data'];
        this.vehdocmismatch.length ? this.setTable() : this.resetTable();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }
  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.vehdocmismatch[0]) {
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
    this.vehdocmismatch.map(vehdoc => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(vehdoc)
          };
        } else {
          column[key] = { value: vehdoc[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })
    return columns;
  }

  actionIcons(vehdoc) {
    let icons=[];
    
     icons = [
       {txt:'Reject EL',   class: "txtstyle", action: this.rejectEL.bind(this, vehdoc) },
       {txt:'Reject GOVT', class: "txtstyle1", action: this.updateGOVT.bind(this, vehdoc) },
       {class:"fa fa-eye",action: this.vehicleDetail.bind(this,vehdoc)}
    ];
    return icons;
  
}

updateGOVT(vehdoc){
  let params = {
    prdId: vehdoc._id,
    docTypeId: vehdoc._doctypeid,
    isReject:1
  };

  
  if (vehdoc._id) {
    this.common.params = {
      title: 'Reject GOVT ',
      description: `<b>&nbsp;` + 'Are you sure want to reject' + `<b>`,
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {

  this.common.loading++;
  this.api.post('Documents/insertDocumentVahenLogs', params)
    .subscribe(res => {
      this.common.loading--;
      console.log('res', res['data']);
      this.common.showToast(res['msg']);
      this.vehDocMismatchSummary();

    }, err => {
      this.common.loading--;
      this.common.showError();
        });
      }
    });
  }
}

rejectEL(vehdoc){
  let params = {
    docId: vehdoc._docid,
    docTypeId: vehdoc._doctypeid,
    isVerified:0
  };

  if (vehdoc._docid) {
    this.common.params = {
      title: 'Reject EL ',
      description: `<b>&nbsp;` + 'Are you sure want to reject' + `<b>`,
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {
  this.common.loading++;
  this.api.post('Documents/updateVehicleDocumentVerifyFlag', params)
    .subscribe(res => {
      this.common.loading--;
      console.log('res', res['data']);
      this.common.showToast(res['msg']);
      this.vehDocMismatchSummary();
    }, err => {
      this.common.loading--;
      this.common.showError();
    });
  }
});
}
}

vehicleDetail(doc){
  console.log("VehicleDetail:",doc);
    let images = [{
      name: "image",
      image: doc._img_url
    },
    {
      name: "image",
      image: doc._img_url2
    },
    {
      name: "image",
      image: doc._img_url3
    },
    ];
    // if (this.checkForPdf(images[0].image)) {
    //   window.open(images[0].image);
    //   return;
    // }
    this.common.params = { images, title: 'Image' };
    this.common.handleModalSize('class', 'modal-lg', '1024');
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
}

}
