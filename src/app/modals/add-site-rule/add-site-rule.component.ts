import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'add-site-rule',
  templateUrl: './add-site-rule.component.html',
  styleUrls: ['./add-site-rule.component.scss', '../../pages/pages.component.css']
})
export class AddSiteRuleComponent implements OnInit {
  title = '';
  addSite = {
    preSiteId: null,
   
    currSiteId: null,
    foid: null,
    foname: null,
    materialId: null,
    materialName: null,
    ruleTypeId: null,
    selectedBodyTypeId: null,


  };
  preSite ={
    preSiteName:null,
    preStieLocName :null,
    preSiteId:null,
  }
 
currSite={
    currSiteName:null,
    currStieLocName :null,
    currSiteId:null,
}
 
  result = [];
  status = 0;

  ruleType = [{
    id: -1,
    name: ''
  }];

  bodyType = [{
    id: -1,
    name: ''
  }];
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
    this.bodyType = [
      {
        id: 11,
        name: "3axle"
      },
      {
        id: 21,
        name: "4axle"
      },
      {
        id: 31,
        name: "6axle"
      }
    ];
    console.log("After edit open ", this.common.params.row);
    if (this.common.params.row) {

      this.status = 1;
      this.addSite.foid=this.common.params.row.foid;
      this.addSite.foname = this.common.params.row.f_name||'N.A';
      this.preSite.preSiteName = this.common.params.row.pre_site_name||'N.A';
      this.preSite.preStieLocName = this.common.params.row.sd_loc_name1||'N.A';
      this.addSite.preSiteId = this.common.params.row.pre_siteid;
      this.currSite.currSiteName = this.common.params.row.curr_site_name||'N.A';
      this.addSite.currSiteId = this.common.params.row.current_siteid;
      this.currSite.currStieLocName = this.common.params.row.sd_loc_name2||'N.A';
      this.addSite.materialName= this.common.params.row.mt_name||'N.A';
      this.addSite.materialId= this.common.params.row.materialtype_id;
      this.addSite.selectedBodyTypeId = this.common.params.row.bodytype_id;
      this.addSite.ruleTypeId= this.common.params.row.ruletype_id;

      this.currSite.currSiteId = this.common.params.row.current_siteid;
      this.preSite.preSiteId = this.common.params.row.pre_siteid;
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

  searchMaterialType(MaterialList) {
    this.addSite.materialId = MaterialList.id;
    this.addSite.materialName = MaterialList.name;
    return this.addSite.materialId;
  }


  submit(){
    if(this.status==1){
     this.editSiteRule();
    }
    else{
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
    if (!this.addSite.ruleTypeId) {
      return this.common.showError("Please Fill ruleTypeId");
    }
    let params = {
      foid: this.addSite.foid,
      pre_site_name: this.addSite.preSiteId,
      currSiteId: this.addSite.currSiteId,
      preSiteId: this.addSite.preSiteId,
      materialId: this.addSite.materialId,
      bodyTypeId: this.addSite.selectedBodyTypeId,
      ruleTypeId: this.addSite.ruleTypeId
    }
    this.common.loading++;
    this.api.post('TripSiteRule/add', params)
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


  editSiteRule(){
    console.log("data:", this.addSite);
  
    let params = {
      foid: this.addSite.foid,
      pre_site_name: this.addSite.preSiteId,
      currSiteId: this.addSite.currSiteId,
      preSiteId: this.addSite.preSiteId,
      materialId: this.addSite.materialId,
      bodyTypeId: this.addSite.selectedBodyTypeId,
      ruleTypeId: this.addSite.ruleTypeId,
      currSiteIdOld:this.currSite.currSiteId,
      preSiteIdOld:this.preSite.preSiteId,
    }
    this.common.loading++;
    this.api.post('TripSiteRule/edit', params)
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


}
