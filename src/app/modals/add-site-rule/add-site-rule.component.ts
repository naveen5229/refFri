import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'add-site-rule',
  templateUrl: './add-site-rule.component.html',
  styleUrls: ['./add-site-rule.component.scss','../../pages/pages.component.css']
})
export class AddSiteRuleComponent implements OnInit {
  addSite = {
    preSiteId:0,
    currSiteId:0,
    foid: null,
    materialId:null,
    materialName:null,
    ruleTypeId :null,
    selectedBodyTypeId :null,
  
  };
  result=[];

 
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
    private modalService: NgbModal ) { 
      this.ruleType=[
        {
          id:11,
          name:"Loading"
        },
        {
          id:21,
          name:"UnLoading"
        },
        {
          id:31,
          name:"Loading & Unloading"
        }
      ];
      this.bodyType=[
        {
          id:11,
          name:"3axle"
        },
        {
          id:21,
          name:"4axle"
        },
        {
          id:31,
          name:"6axle"
        }
      ];


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
  

  addSiteRule(){
    console.log("data:",this.addSite);
    let params = {
      foid:this.addSite.foid,
      pre_site_name:this.addSite.preSiteId,
      currSiteId:this.addSite.currSiteId,
      preSiteId:this.addSite.preSiteId,
      materialId:this.addSite.materialId,
      bodyTypeId:this.addSite.selectedBodyTypeId,
      ruleTypeId:this.addSite.ruleTypeId
    }
    this.common.loading++;
    this.api.post('TripSiteRule/add', params)
      .subscribe(res => {
        this.common.loading--;
        this.result = res['data'];
        console.log("data:");
        console.log(this.result);
        
      }, err => {

        this.common.loading--;
        console.log(err);
      });

  }


}
