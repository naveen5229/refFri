import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'party-ledger-mapping',
  templateUrl: './party-ledger-mapping.component.html',
  styleUrls: ['./party-ledger-mapping.component.scss']
})
export class PartyLedgerMappingComponent implements OnInit {
  party = {
    names: [],
  };
  ledgers = [];
  tables = {
    party: {
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
  partyId = null;
  partyName = '';
  partyUserGroupId = null;
  aliasName = null;
  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    public common: CommonService) {
    //this.getPartyList();
    this.getPartyLedgers();
  }

  ngOnInit() {
  }

  // getPartyList() {
  //   this.common.loading++;
  //   this.api.get('Suggestion/getPartyWrtFo')
  //     .subscribe(res => {
  //       console.log('Res:', res);
  //       this.common.loading--;
  //       this.party.list = res['data'];
  //     }, err => {
  //       this.common.loading--;
  //       console.log('Error:', err);
  //       this.common.showError();
  //     });
  // }

  getPartyLedgers() {
      let params = `partyAssocId=${this.common.params.partyId}&userGroupId=${this.common.params.userGroupId}`;
      this.common.loading++;
      this.api.get('ManageParty/getPartyLedgerMapping?' + params)
        .subscribe(res => {
          console.log('Res:', res);
          this.common.loading--;
          if (!res['data']){
            return;
          } 
          this.clearAllTableData();
          this.party.names = res['data']['Party'];
          console.log("party data1", this.party.names);
          this.partyId = res['data']['Party'][0]._id;
          this.partyName = res['data']['Party'][0].PartyName;
          this.aliasName = res['data']['Party'][0]['Alias Name'];
          this.partyUserGroupId = res['data']['Party'][0]._user_group_id;
          console.log("party data1", this.partyId);
          this.ledgers = res['data']['Ledger'];
          this.setTable('party');
          this.setTable('ledger');
        },
          err => {
            this.common.loading--;
            this.common.showError(err);
          });
    
  }

  setTable(type: 'party' | 'ledger') {
    this.tables[type].data = {
      headings: this.generateHeadings(type == 'party' ? this.party.names[0] : this.ledgers[0]),
      columns: this.getColumns(type == 'party' ? this.party.names : this.ledgers, type == 'party' ? this.party.names[0] : this.ledgers[0], type)
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
          column[key] = { value: "MAP", class: 'text-colour', action: this.partyMapping.bind(this, item) };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      if (tableType === 'ledger') {
        column['rowActions'] = { click: 'selectRow' };
      }
      columns.push(column);
    });
    return columns;
  }

  partyMapping(item) {
    this.common.loading++;
    console.log("ledger item", item);
    let params = {
      rowId: this.partyId,
      ledgerId: item._ledid,
    }
    console.log("mapping param", params)
    this.api.post('ManageParty/partyLedgerMapping', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
         this.activeModal.close({ response: res['data'][0].y_msg  });
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
      party: {
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
        userGroupId: this.partyUserGroupId,
        partyName: this.partyName,
        aliasName: this.aliasName,
      }
      this.api.post('ManageParty/addPartyLedger', params)
        .subscribe(res => {
          this.common.loading--;
          if (res['success']) {
            this.common.showToast(res['msg']);
            this.getPartyLedgers();
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
