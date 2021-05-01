import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnMergeStateComponent } from '../../modals/un-merge-state/un-merge-state.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { UserService } from '../../services/user.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'unmerge-lrstate',
  templateUrl: './unmerge-lrstate.component.html',
  styleUrls: ['./unmerge-lrstate.component.scss']
})
export class UnmergeLRStateComponent implements OnInit {
  unMerge = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public common: CommonService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public user: UserService,
    public api: ApiService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getUnmergeStateList();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getUnmergeStateList();
  }

  getUnmergeStateList() {
    this.common.loading++;
    this.api.get("HaltOperations/getUnmergedLrVehicles?")
      .subscribe(res => {
        this.common.loading--;
        console.log("Res:", res);
        this.unMerge = res['data'] || [];
        this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
        console.log('Error:', err);
      });
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.genearateColumns()
    }
  }

  generateHeadings() {
    let headings = {};
    for (let key in this.unMerge[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  genearateColumns() {
    let columns = [];
    this.unMerge.map(unMergeState => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column['Action'] = { class: "fas fa-eye", action: this.lrState.bind(this, unMergeState) }

        } else {
          column[key] = { value: unMergeState[key], class: "black" };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }


  lrState(row) {
    let unMergeStateData = {
      vehicleId: row.vehicle_id,
      regno: row.regno

    }
    this.common.params = { unMergeStateData };
    const activeModal = this.modalService.open(UnMergeStateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Report: '+'UnMerge-LR-Status']
    ];
    this.pdfService.jrxTablesPDF(['unmergeLrStatus'], 'unmerge-LR-status', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,report:"Report:UnMerge-LR-Status"}
    ];
    this.csvService.byMultiIds(['unmergeLrStatus'], 'unmerge-LR-status', details);
  }
}



