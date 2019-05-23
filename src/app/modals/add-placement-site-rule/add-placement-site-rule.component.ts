import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-placement-site-rule',
  templateUrl: './add-placement-site-rule.component.html',
  styleUrls: ['./add-placement-site-rule.component.scss', '../../pages/pages.component.css']
})
export class AddPlacementSiteRuleComponent implements OnInit {

  title = '';
  addSite = {
    preSiteId: null,
    currSiteId: null,
    foid: null,
    foname: null,
    materialId: null,
    ruleTypeId: null,
  };
  nextSite = {
    preSiteName: null,
    preStieLocName: null,
    preSiteId: null,
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
      {
        id: 31,
        name: "Loading & Unloading"
      }
    ];

    console.log("After edit open ", this.common.params.row);
    if (this.common.params.row) {

      this.status = 1;
      this.addSite.foid = this.common.params.row.foid;
      this.addSite.foname = this.common.params.row.f_name || 'N.A';
      this.nextSite.preSiteName = this.common.params.row.next_site_name || 'N.A';
      this.nextSite.preStieLocName = this.common.params.row.sd_loc_name1 || 'N.A';
      this.addSite.preSiteId = this.common.params.row.next_siteid;
      this.currSite.currSiteName = this.common.params.row.curr_site_name || 'N.A';
      this.addSite.currSiteId = this.common.params.row.current_siteid;
      this.currSite.currStieLocName = this.common.params.row.sd_loc_name2 || 'N.A';
      this.addSite.materialId = this.common.params.row.materialtype_id;
      this.addSite.ruleTypeId = this.common.params.row.ruletype_id;
      this.currSite.currSiteId = this.common.params.row.current_siteid;
      this.nextSite.preSiteId = this.common.params.row.next_siteid;
      this.refTypeNext = this.common.params.row.ref_type_next;
      this.refTypeCur = this.common.params.row.ref_type_cur;
    }

  }

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
      return this.common.showError("Please Fill foUser");
    }
    if (!this.addSite.currSiteId) {
      return this.common.showError("Please Fill Current Site");
    }
    if (!this.addSite.preSiteId) {
      return this.common.showError("Please Fill Next Site");
    }
    if (!this.addSite.ruleTypeId) {
      return this.common.showError("Please Fill ruleTypeId");
    }
    let params = {
      foid: this.addSite.foid,
      currSiteId: this.addSite.currSiteId,
      nextSiteId: this.addSite.preSiteId,
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
    if (!this.addSite.preSiteId) {
      return this.common.showError("Please Fill Next Site ");
    }
    if (!this.addSite.ruleTypeId) {
      return this.common.showError("Please Fill ruleTypeId");
    }
    let params = {
      foid: this.addSite.foid,
      currSiteId: this.addSite.currSiteId,
      nextSiteId: this.addSite.preSiteId,
      ruleTypeId: this.addSite.ruleTypeId,
      currSiteIdOld: this.currSite.currSiteId,
      nextSiteIdOld: this.nextSite.preSiteId,
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
    console.log("type:", this.refTypeNext);

  }
  selectListType(typeid) {
    this.refTypeCur = parseInt(typeid);
    console.log("type2:", this.refTypeCur);
  }


}
