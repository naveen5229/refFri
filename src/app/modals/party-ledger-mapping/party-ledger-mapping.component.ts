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
    list: [],
    names: [],
    selected: null,
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

  constructor(public activeModel: NgbActiveModal,
    public api: ApiService,
    public common: CommonService) {
    this.getPartyList();
  }

  ngOnInit() {
  }

  getPartyList() {
    this.common.loading++;
    this.api.get('Suggestion/getPartyWrtFo')
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        this.party.list = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error:', err);
        this.common.showError();
      });
  }

  getPartyLedgers() {
    let params = `partyAssocId=${this.party.selected.id}&userGroupId=${this.party.selected.user_group_id}`;
    this.common.loading++;
    this.api.get('ManageParty/getPartyLedgerMapping?' + params)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        if (!res['data']) return;
        this.party.names = res['data']['Party'];
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
      columns: this.getColumns(type == 'party' ? this.party.names : this.ledgers, type == 'party' ? this.party.names[0] : this.ledgers[0])
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

  getColumns(list, type) {
    let columns = [];
    list.map(item => {
      let column = {};
      for (let key in this.generateHeadings(type)) {
        column[key] = { value: item[key], class: 'black', action: '' };
      }
      columns.push(column);
    });
    return columns;
  }

  closeModal() {
    this.activeModel.close();
  }

}
