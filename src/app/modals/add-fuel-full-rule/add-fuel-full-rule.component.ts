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



  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

  Rules = {
    foUserId: '',
    ruleType: '0',
    angleFrom: '',
    angleTo: '',
    siteId: null,
    pumpStationId: null
  };

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  selectFoUser(user) {
    this.Rules.foUserId = user.id;
  }

  getSite(site) {
    this.Rules.siteId = site.id;
  }

  getPump(pump) {
    this.Rules.pumpStationId = pump.id;
  }

  saveRule() {
    let params = {
      foUserId: this.Rules.foUserId,
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
  }

}
