import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFuelFullRuleComponent } from '../../modals/add-fuel-full-rule/add-fuel-full-rule.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fuel-rules',
  templateUrl: './fuel-rules.component.html',
  styleUrls: ['./fuel-rules.component.scss']
})
export class FuelRulesComponent implements OnInit {

  table = null;
  fuelNorms = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.getFuelNorms();

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    console.log("Refresh");
    this.getFuelNorms();
  }

  addFuelRule() {
    this.common.params = {};
    const activeModal = this.modalService.open(AddFuelFullRuleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelNorms();
      }
    });
  }

  getFuelNorms() {
    this.fuelNorms = [];
    this.common.loading++;
    this.api.get('Fuel/getFuelFullNorms')
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.fuelNorms = res['data'] || [];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  setTable() {
    let headings = {
      FoName: { title: 'Fo Name', placeholder: 'Fo Name' },
      RuleType: { title: 'Rule Type ', placeholder: 'Rule Type' },
      Name: { title: 'Name ', placeholder: 'Name' },
      AngleFrom: { title: 'Angle From ', placeholder: 'Angle From' },
      AngleTo: { title: 'Angle To ', placeholder: 'Angle To' },
      action: { title: 'Action ', placeholder: 'Action', hideSearch: true, class: 'tag' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "72vh"

      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.fuelNorms.map(norm => {
      let column = {
        FoName: { value: norm.fo_name },
        RuleType: { value: norm.type },
        Name: { value: norm.name },
        AngleFrom: { value: norm.angle_from },
        AngleTo: { value: norm.angle_to },
        action: {
          value: '', isHTML: false, action: null, icons: [
            { class: 'fas fa-edit  edit-btn', action: this.updateRule.bind(this, norm) },
            { class: " fa fa-trash remove", action: this.deleteRule.bind(this, norm) }
          ]
        },
        rowActions: {
          click: 'selectRow'
        }

      };
      columns.push(column);
    });
    return columns;
  }

  updateRule(rule) {

    console.log("rule", rule);
    this.common.params = { title: 'Edit fuel Rule', rule };
    const activeModal = this.modalService.open(AddFuelFullRuleComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelNorms();
      }
    });

  }

  deleteRule(rule) {
    if (window.confirm("Are You Want Delete Record")) {
      const params = {
        rowid: rule.id,

      }
      console.log('params', params);
      this.common.loading++;
      this.api.post('Fuel/deleteRule', params)
        .subscribe(res => {
          this.common.loading--;
          let output = res['data'];
          console.log("data:");
          console.log(output);
          this.common.showToast(res['msg']);
          this.getFuelNorms();

        }, err => {

          this.common.loading--;
          console.log(err);
        });
    }
  }

}
