import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-placement-site-rule',
  templateUrl: './add-placement-site-rule.component.html',
  styleUrls: ['./add-placement-site-rule.component.scss', '../../pages/pages.component.css']
})
export class AddPlacementSiteRuleComponent implements OnInit {

  title = '';
  addSite = {
    nextSiteId: null,
    currSiteId: null,
    foid: null,
    foname: null,
    ruleTypeId: null,
  };
  nextSite = {
    nextSiteName: null,
    nextSiteLocName: null,
    nextSiteId: null,
  }

  currSite = {
    currSiteName: null,
    currStieLocName: null,
    currSiteId: null,
  }

  result = [];
  status = 0;

  ruleType = [{
    id: -1,
    name: ''
  }];


  refTypeNext = 1;
  refTypeCur = 1;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.common.handleModalSize('class', 'modal-lg', '600');
    this.title = this.common.params.title ? this.common.params.title : 'Add Site Rule';
    this.ruleType = [
      {
        id: 11,
        name: "Loading"
      },
      {
        id: 21,
        name: "UnLoading"
      },

    ];

    console.log("After edit open ", this.common.params.row);
    if (this.common.params.row) {

      this.status = 1;
      this.addSite.foid = this.common.params.row.foid;
      this.addSite.foname = this.common.params.row.f_name || 'N.A';
      this.nextSite.nextSiteName = this.common.params.row.next_site_name || 'N.A';
      this.nextSite.nextSiteLocName = this.common.params.row.sd_loc_name1 || 'N.A';
      this.addSite.nextSiteId = this.common.params.row.next_siteid;
      this.currSite.currSiteName = this.common.params.row.curr_site_name || 'N.A';
      this.addSite.currSiteId = this.common.params.row.current_siteid;
      this.currSite.currStieLocName = this.common.params.row.sd_loc_name2 || 'N.A';
      this.addSite.ruleTypeId = this.common.params.row.ruletype_id;
      this.currSite.currSiteId = this.common.params.row.current_siteid;
      this.nextSite.nextSiteId = this.common.params.row.next_siteid;
      this.refTypeNext = this.common.params.row.ref_type_next;
      this.refTypeCur = this.common.params.row.ref_type_cur;
    }

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
  selectFoUser(user) {
    console.log("user", user);
    this.addSite.foid = user.id;
  }




  submit() {
    if (this.status == 1) {
      this.editSiteRule();
    }
    else {
      this.addSiteRule();
    }
  }

  addSiteRule() {
    console.log("data:", this.addSite);
    if (!this.addSite.foid) {
      return this.common.showError("Please Fill Fo");
    }
    if (!this.addSite.currSiteId) {
      return this.common.showError("Please Fill Current Site");
    }
    if (!this.addSite.nextSiteId) {
      return this.common.showError("Please Fill Next Site");
    }
    if (!this.addSite.ruleTypeId) {
      return this.common.showError("Please Fill ruleType");
    }
    let params = {
      foid: this.addSite.foid,
      currSiteId: this.addSite.currSiteId,
      nextSiteId: this.addSite.nextSiteId,
      ruleTypeId: this.addSite.ruleTypeId,
      refTypeNext: this.refTypeNext,
      refTypeCur: this.refTypeCur,

    }
    console.log("params:", params);

    this.common.loading++;
    this.api.post('PlacementSiteRule/add', params)
      .subscribe(res => {
        this.common.loading--;
        this.result = res['data'];
        console.log("data:");
        console.log(this.result);
        this.common.showToast(res['msg']);
        this.activeModal.close({ response: this.result });

      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }


  editSiteRule() {
    if (!this.addSite.foid) {
      return this.common.showError("Please Fill foUser");
    }
    if (!this.addSite.currSiteId) {
      return this.common.showError("Please Fill Current Site");
    }
    if (!this.addSite.nextSiteId) {
      return this.common.showError("Please Fill Next Site ");
    }
    if (!this.addSite.ruleTypeId) {
      return this.common.showError("Please Fill ruleTypeId");
    }
    let params = {
      foid: this.addSite.foid,
      currSiteId: this.addSite.currSiteId,
      nextSiteId: this.addSite.nextSiteId,
      ruleTypeId: this.addSite.ruleTypeId,
      currSiteIdOld: this.currSite.currSiteId,
      nextSiteIdOld: this.nextSite.nextSiteId,
    }
    this.common.loading++;
    this.api.post('PlacementSiteRule/edit ', params)
      .subscribe(res => {
        this.common.loading--;
        this.result = res['data'];
        console.log("data:");
        console.log(this.result);
        this.common.showToast(res['msg']);
        this.activeModal.close({ response: this.result });

      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }

  selectRule() {

  }


  selectList(id) {
    this.refTypeNext = parseInt(id);
    this.addSite.nextSiteId = null;
    console.log("type:", this.refTypeNext);

  }
  selectListType(typeid) {
    this.refTypeCur = parseInt(typeid);
    this.addSite.currSiteId = null;
    console.log("type2:", this.refTypeCur);
  }


}
