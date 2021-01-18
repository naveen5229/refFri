import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'group-managements',
  templateUrl: './group-managements.component.html',
  styleUrls: ['./group-managements.component.scss', '../../pages/pages.component.css']
})
export class GroupManagementsComponent implements OnInit {

  groupFlag = false;
  userFlag = false;
  vehicleFlag=false; 
  vehicleGroupFlag=false;
  
  getGroupUsers=[];
  getUserGroups=[];
  getVehicles=[];
  getVehicleGroups=[];
  addGroupDetails = {
    foid: "",
    groupName: ""

  };
  addUserGroupAss = {
    grpid: "",
    fid: ""
  };
  addVehicleGroupAss = {
    grpid: "",
    vid: null,
    csv:null
  };
  selectOption='single';

  constructor(private modalService: NgbModal, public api: ApiService,
    public common: CommonService,
    public user: UserService) {
      this.common.refresh = this.refresh.bind(this);
     }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    console.log("refresh");
  }

  searchUserId(groupUser) {
    this.addGroupDetails.foid = groupUser.id;

  }


  addGroup() {
    let params = {
      foid: this.addGroupDetails.foid,
      groupName: this.addGroupDetails.groupName
    };
    console.log('foid: ', this.addGroupDetails.foid);
    console.log('groupName: ', this.addGroupDetails.groupName);
    this.common.loading++;
    this.api.post('GroupManagment/insertGroup', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ' + res);
        console.log('success: ' + res['success'])
        if (res['success'] == "true") {
          this.common.showToast("Group Created");
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  searchGroupId(userList) {
    this.addUserGroupAss.fid = userList.foaid;
  }
  searchGroup(groupList) {
    this.addUserGroupAss.grpid = groupList.id;
  }
  addUserGroup() {
    let params = {
      fid: this.addUserGroupAss.fid,
      grpid: this.addUserGroupAss.grpid

    };
    this.common.loading++;
    this.api.post('GroupManagment/insertGroupUserAssoc', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        if (res['success'] == "true") {
          this.common.showToast("User Created");
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  showGroups() {
    this.groupFlag = true;
    console.log('groupFlag',this.groupFlag);
    let params = {
      user_id: this.addUserGroupAss.fid
    };
    this.common.loading++;
    this.api.post('GroupManagment/getUsersGroups', params)
      .subscribe(res => {
        this.common.loading--;
        this.getUserGroups=res['data'];
        console.log('res: ', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  showUsers() {
    this.userFlag = true;
    console.log('userFlag',this.userFlag);
    let params = {
      gid: this.addUserGroupAss.grpid
    };
    this.common.loading++;
    this.api.post('GroupManagment/getGroupsUsers', params)
      .subscribe(res => {
        this.common.loading--;
        this.getGroupUsers=res['data'];
        console.log('res: ', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  searchVGroup(vGroupList){
    this.addVehicleGroupAss.grpid=vGroupList.id;
  }

  searchVehicle(vehicleList){
    this.addVehicleGroupAss.vid=vehicleList.id;
  }

  addVehicleGroup(){
    let params = {
      vid: this.addVehicleGroupAss.vid,
      grpid: this.addVehicleGroupAss.grpid,
      csv:this.addVehicleGroupAss.csv
    };
    console.log("result:",params);
    this.common.loading++;
    this.api.post('GroupManagment/insertGroupVehicleAssoc', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        let msg = res['msg'].split(":")[1];
        this.common.showToast(msg?msg:res['msg']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  showVehicles(){
    this.vehicleFlag=true; 
    let params = {
      gid: this.addVehicleGroupAss.grpid
    };
    this.common.loading++;
    this.api.post('GroupManagment/getGroupsVehicles', params)
      .subscribe(res => {
        this.common.loading--;
        this.getVehicles=res['data'];
        console.log('res: ', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  showvehicleGroups(){
    this.vehicleGroupFlag=true;
    let params = {
      vId: this.addVehicleGroupAss.vid
    };
    this.common.loading++;
    this.api.post('GroupManagment/getVehiclesGroups', params)
      .subscribe(res => {
        this.common.loading--;
        this.getVehicleGroups=res['data'];
        console.log('res: ', res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
    
  removeField(selectFlag,id,type){
    console.log('selectFlag',selectFlag);
    let params;
    if(selectFlag=='groupFlag'){
      if(type=='gid')
        params={
          gId:id,
          uId:this.addUserGroupAss.fid
        };
      else
        params={
          gId:this.addUserGroupAss.grpid,
          uId:id
        };
      console.log('params: ',params);
  
      this.common.loading++;
      this.api.post('GroupManagment/deleteGroupsUsers',params)
              .subscribe(res =>{
                this.common.loading--;
                this.showUsers();
                console.log('res: '+res['data']);
              }, err =>{
                this.common.loading--;
                this.common.showError();
              })
    }if(selectFlag=='vehicleFlag'){
      if(type=='gid')
      params={
        gId:id,
        vId:this.addVehicleGroupAss.vid,
      };
    else
      params={
        gId:this.addVehicleGroupAss.grpid,
        vId:id,
      };
      console.log('params: ',params);
  
      this.common.loading++;
      this.api.post('GroupManagment/deleteGroupsVehicles',params)
              .subscribe(res =>{
                this.common.loading--;
                this.showVehicles();
                console.log('res: '+res['data']);
              }, err =>{
                this.common.loading--;
                this.common.showError();
              })
    }
  }
  // csv base 64 convert
  handleFileSelection(event) {
    this.common.loading++;
    this.common.getBase64(event.target.files[0])
      .then(res => {
        this.common.loading--;


        let file = event.target.files[0];
        console.log("Type", file.type);
        if (file.type == "application/vnd.ms-excel") {
        }
        else {
          alert("valid Format Are : csv");
          return false;
        }

        res = res.toString().replace('vnd.ms-excel', 'csv');
        console.log('Base 64: ', res);
        this.addVehicleGroupAss.csv = res;
      }, err => {
        this.common.loading--;
        console.error('Base Err: ', err);
      })
  }
 

}
