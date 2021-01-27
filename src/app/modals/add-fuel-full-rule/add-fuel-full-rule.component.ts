import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-fuel-full-rule',
  templateUrl: './add-fuel-full-rule.component.html',
  styleUrls: ['./add-fuel-full-rule.component.scss']
})
export class AddFuelFullRuleComponent implements OnInit {
  title = '';
  status = 0;
  foname = '';
  pumpArea = '';
  pumpName = '';
  result = [];
  Rules = {
    foid: '',
    ruleType: '0',
    ref_id: '',
    rowid: '',
    angleFrom: '0',
    angleTo: '360',
    isNegative: false
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
        this.pumpName = this.common.params.rule.name || ''
      } else {
        this.pumpArea = this.common.params.rule.name || ''
      }
      this.Rules.ref_id = this.common.params.rule.ref_id || 'null';
      // this.Rules.pumpStationId = this.common.params.rule.pump_station_area_id || 'null';
      this.Rules.angleFrom = this.common.params.rule.angle_from || '0';
      this.Rules.angleTo = this.common.params.rule.angle_to || '360';

    }
  }

  ngOnDestroy(){}
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
    this.Rules.ref_id = site.id;
    return this.Rules.ref_id;
  }

  getPump(pump) {
    this.Rules.ref_id = pump.id;
    this.Rules.angleFrom = pump.angle_from;
    this.Rules.angleTo = pump.angle_to;
    return this.Rules.ref_id;
  }

  saveRule() {

    if (parseInt(this.Rules.angleFrom) < 0 || parseInt(this.Rules.angleTo) < 0 || parseInt(this.Rules.angleTo) > 360) {
      this.common.showToast('Invalid Angle !!');
      return;
    }
    let val
    if (this.Rules.isNegative) {
      val = 1;
    } else {
      val = 0;
    }
    let params = {
      foid: null,
      ruleType: this.Rules.ruleType,
      angleFrom: parseInt(this.Rules.angleFrom),
      angleTo: parseInt(this.Rules.angleTo),
      // siteId: parseInt(this.Rules.siteId),
      // pumpStationId: this.Rules.pumpStationId,
      ref_id: parseInt(this.Rules.ref_id),
      is_negative: val,
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

  resetAngleVal() {
    if (this.status == 0) {

      if (this.Rules.ruleType == "2") {
        this.Rules.angleFrom = '';
        this.Rules.angleTo = '';
      } else {
        this.Rules.angleFrom = '0';
        this.Rules.angleTo = '360';
      }

    }

  }


}
