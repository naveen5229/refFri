import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-fuel-full-rule',
  templateUrl: './add-fuel-full-rule.component.html',
  styleUrls: ['./add-fuel-full-rule.component.scss']
})
export class AddFuelFullRuleComponent implements OnInit {
  title = '';
  status = 0;
  foname = '';
  siteName = '';
  pumpName = '';
  result = [];
  Rules = {
    foid: '',
    ruleType: '0',
    siteId: null,
    pumpStationId: null,
    rowid: '',
    angleFrom: '',
    angleTo: ''
  };


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.title = this.common.params.title ? this.common.params.title : 'Add Fuel Rule';
    if (this.common.params.rule) {
      console.log(this.common.params.rule);
      this.status = 1;
      this.Rules.foid = this.common.params.rule.foid;
      this.foname = this.common.params.rule.fo_name;
      this.Rules.ruleType = this.common.params.rule.rule_type || '0';
      this.Rules.rowid = this.common.params.rule.id;
      if (this.Rules.ruleType == '1') {
        this.siteName = this.common.params.rule.name || ''
      } else {
        this.pumpName = this.common.params.rule.name || ''
      }
      this.Rules.siteId = this.common.params.rule.siteid || 'null';
      this.Rules.pumpStationId = this.common.params.rule.pump_station_area_id || 'null';
      this.Rules.angleFrom = this.common.params.rule.angle_from || 'N.A';
      this.Rules.angleTo = this.common.params.rule.angle_to || 'N.A';

    }
  }

  ngOnInit() {
  }


  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  selectFoUser(user) {
    this.Rules.foid = user.id;
    return this.Rules.foid;
  }

  getSite(site) {
    this.Rules.siteId = site.id;
    return this.Rules.siteId;
  }

  getPump(pump) {
    this.Rules.pumpStationId = pump.id;
    this.Rules.angleFrom = pump.angle_from;
    this.Rules.angleTo = pump.angle_to;
    return this.Rules.pumpStationId;
  }

  saveRule() {


    let params = {
      foid: this.Rules.foid,
      ruleType: this.Rules.ruleType,
      angleFrom: parseInt(this.Rules.angleFrom),
      angleTo: parseInt(this.Rules.angleTo),
      siteId: parseInt(this.Rules.siteId),
      pumpStationId: this.Rules.pumpStationId,
      rowid: this.Rules.rowid ? this.Rules.rowid : 'null'
    };
    console.log('params to save', params);
    if (this.status == 1) {
      this.common.loading++;
      this.api.post('Fuel/updateFuelFullNorm', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res['data'])
          this.result = res['data'];
          this.common.showToast(res['msg']);
          this.activeModal.close({ response: this.result });
        }, err => {
          this.common.loading--
          this.common.showError();
        })
    } else {
      this.common.loading++;
      this.api.post('Fuel/insertFuelFullNorms', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res['data'])
          this.result = res['data'];
          this.common.showToast(res['msg']);
          this.activeModal.close({ response: this.result });
        }, err => {
          this.common.loading--
          this.common.showError();
        })

    }
  }


}
