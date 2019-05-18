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
  Rules = {
    foid: '',
    ruleType: '0',
    angleFrom: '',
    angleTo: '',
    siteId: null,
    pumpStationId: null
  };


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.title = this.common.params.title ? this.common.params.title : 'Add Fuel Rule';
    if (this.common.params.rule) {

      this.status = 1;
      this.Rules.foid = this.common.params.rule.foid;
      this.Rules.ruleType = this.common.params.rule.type || '0';
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
  }

  getSite(site) {
    this.Rules.siteId = site.id;
  }

  getPump(pump) {
    this.Rules.pumpStationId = pump.id;
  }

  saveRule() {

    if (this.status == 1) {
      let params = {
        foid: this.Rules.foid,
        ruleType: this.Rules.ruleType,
        angleFrom: this.Rules.angleFrom,
        angleTo: this.Rules.angleTo,
        siteId: this.Rules.siteId,
        pumpStationId: this.Rules.pumpStationId
      };
      console.log('params to save', params);
      this.common.loading++;
      this.api.post('Fuel/insertFuelFullNorms', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res['data'])
        }, err => {
          this.common.loading--
          this.common.showError();
        })
    } else {
      let params = {
        foid: this.Rules.foid
      };
      console.log('params to save', params);
      this.common.loading++;
      this.api.post('Fuel/insertFuelFullNorms', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res['data'])
        }, err => {
          this.common.loading--
          this.common.showError();
        })

    }
  }

}
