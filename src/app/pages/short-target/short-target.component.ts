import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddShortTargetComponent } from '../../modals/add-short-target/add-short-target.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'short-target',
  templateUrl: './short-target.component.html',
  styleUrls: ['./short-target.component.scss']
})
export class ShortTargetComponent implements OnInit {

  showTable = false;

  shortTarget = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getOnwardKmpd();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {

    this.getOnwardKmpd();
  }
  getOnwardKmpd() {

    this.shortTarget = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    //  console.log('params: ', params);
    this.common.loading++;
    this.api.get('Placement/getShortTarget')
      .subscribe(res => {
        this.common.loading--;
        this.shortTarget = JSON.parse(res['data'][0].result);
        //this.shortTarget = res['data'];
        if (this.shortTarget != null) {
          console.log('shortTarget', this.shortTarget);
          let first_rec = this.shortTarget[0];
          console.log("first_Rec", first_rec);

          for (var key in first_rec) {
            if (key.charAt(0) != "_") {
              this.headings.push(key);
              let headerObj = { title: key, placeholder: this.formatTitle(key) };
              this.table.data.headings[key] = headerObj;
            }

          }

          this.table.data.columns = this.getTableColumns();
          console.log("table:");
          console.log(this.table);
          this.showTable = true;
        } else {
          this.common.showToast('No Record Found !!');
        }


      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.shortTarget.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {

        this.valobj[this.headings[j]] = { value: this.shortTarget[i][this.headings[j]], class: 'black', action: '' };


      }
      this.valobj['style'] = { background: this.shortTarget[i]._rowcolor };
      columns.push(this.valobj);
    }

    console.log('Columns:', columns);
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }




  // addShortTarget(target) {
  //   this.common.params = {
  //     vehicleId: target._vid,
  //     vehicleRegNo: target.vehicle

  //   };

  //   const activeModal = this.modalService.open(AddShortTargetComponent, {
  //     size: "sm",
  //     container: "nb-layout"
  //   });
  // }

}


