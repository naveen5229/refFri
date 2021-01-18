import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'driver-ledger-mapping',
  templateUrl: './driver-ledger-mapping.component.html',
  styleUrls: ['./driver-ledger-mapping.component.scss']
})
export class DriverLedgerMappingComponent implements OnInit {
  driver = {
    names: [],
  };
  ledgers = [];
  tables = {
    driver: {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    },
    ledger: {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    }
  };
  driverId = null;
  DriverName = '';
  driverUserGroupId = null;
  aliasName = null;
  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public common: CommonService) {
   this.getDriverLedgers();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getDriverLedgers() {
      let params = `driverId=${this.common.params.driverId}`;
      this.common.loading++;
      this.api.get('Drivers/getDriverLedgerMapping?' + params)
        .subscribe(res => {
          console.log('Res:', res);
          this.common.loading--;
          if (!res['data']){
            return;
          } 
           this.clearAllTableData();
           this.driver.names = res['data']['DriverDetails'];
            this.driverId = res['data']['DriverDetails'][0]._id;
            this.DriverName = res['data']['DriverDetails'][0].DriverName;
          //  this.aliasName = '';
           this.driverUserGroupId = res['data']['DriverDetails'][0]._user_group_id;
          // console.log("party data1", this.partyId);
            this.ledgers = res['data']['LedgerDetails'];
           this.setTable('driver');
           this.setTable('ledger');
        },
          err => {
            this.common.loading--;
            this.common.showError(err);
          });   
  }

  setTable(type: 'driver' | 'ledger') {
    this.tables[type].data = {
      headings: this.generateHeadings(type == 'driver' ? this.driver.names[0] : this.ledgers[0]),
      columns: this.getColumns(type == 'driver' ? this.driver.names : this.ledgers, type == 'driver' ? this.driver.names[0] : this.ledgers[0], type)
    };
  }

  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getColumns(list, type, tableType?) {
    let columns = [];
    list.map(item => {
      let column = {};
      for (let key in this.generateHeadings(type)) {
        if (key == "Action") {
          column[key] = { value: "MAP", class: 'text-colour', action: this.driverMapping.bind(this, item) };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  driverMapping(item) {
    this.common.loading++;
    console.log("ledger item", item);
    let params = {
      rowId: this.driverId,
      ledgerId: item._ledid,
    }
    console.log("mapping param", params)
    this.api.post('Drivers/driverLedgerMapping', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
         //this.activeModal.close({ response: res['data'][0].y_msg  });
        } else {
          this.common.showError(res['data'][0].y_msg);
        }
      },
        err => {
          this.common.loading--;
          console.error(' Api Error:', err)
        });
  }

  clearAllTableData() {
    this.tables = {
      driver: {
        data: {
          headings: {},
          columns: []
        },
        settings: {
          hideHeader: true
        }
      },
      ledger: {
        data: {
          headings: {},
          columns: []
        },
        settings: {
          hideHeader: true
        }
      }
    };
  }

  addLedger() {
      this.common.loading++;
      let params = {
        userGroupId: this.driverUserGroupId,
        partyName: this.DriverName,
        aliasName: '',
      }
      console.log("params",params);
      this.api.post('ManageParty/addPartyLedger', params)
        .subscribe(res => {
          this.common.loading--;
          if (res['success']) {
            this.common.showToast(res['msg']);
            this.getDriverLedgers();
          } else {
            this.common.showError(res['msg']);
          }
        },
          err => {
            this.common.loading--;
            console.error(' Api Error:', err);
            this.common.showError();
          });
  }

  closeModal() {
    this.activeModel.close();
  }

}
