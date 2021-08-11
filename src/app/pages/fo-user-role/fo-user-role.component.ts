import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import * as _ from 'lodash';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'fo-user-role',
  templateUrl: './fo-user-role.component.html',
  styleUrls: ['./fo-user-role.component.scss', '../pages.component.css']
})
export class FoUserRoleComponent implements OnInit {
  getUsersList = [];
  getAllPagesList = [];
  formattedData = [];
  formattedDataApp = [];
  dashBoardPages = [];
  appPages = [];
  selectedUser = {
    details: null,
    oldPreferences: []
  };
  istaskOpertion = false;


  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public user: UserService) {
    this.common.isComponentActive = false;
    this.common.refresh = this.refresh.bind(this);
    this.getAllUserList();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {
    this.common.isComponentActive = false;
    this.getAllUserList();
    document.getElementById('name')['value'] = '';
    this.formattedData = [];
    this.formattedDataApp = [];
  }
  //Confirmation that before Leave the PAge
  canDeactivate() {
    console.log("activity Start", this.common.isComponentActive);
    if (this.common.isComponentActive) {
      this.common.params = {
        title: 'Confirmation ',
        description: `<b>&nbsp;` + 'Are Sure To Leave This Page' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.isComponentActive = false;
          console.log('no, you wont navigate anywhere');
        }
      });
      return false;
    }
    console.log('you are going away, goodby');
    return true;
  }

  getAllUserList() {
    this.common.loading++;
    this.api.get('Suggestion/getAllFoAdminUsersWrtFo?')
      .subscribe(res => {
        this.common.loading--;
        this.getUsersList = res['data'];
        console.log("api Data:", this.getUsersList);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }


  getUserDetails(user) {
    this.getAllPagesList = [];
    this.formattedData = [];
    this.dashBoardPages = [];
    this.appPages = [];
    this.selectedUser.details = user;
    const params = {
      userId: user.id,
      userType: 3,
      iswallet : localStorage.getItem('iswallet') || '0' 
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPagesWrtFo', params)
      .subscribe(res => {
        this.common.loading--;
      
        this.getAllPagesList = res['data'];
      
        this.selectedUser.oldPreferences = res['data'];
        this.getAllPagesList.map(dt=>{
          console.log('dt',dt);
          if(dt.type=='Dashboard'){
            this.dashBoardPages.push(dt);
          }
          else if(dt.type=='App'){
            this.appPages.push(dt);
          }
        });
        console.log("dashboardPages",this.dashBoardPages);
        console.log("app pages",this.appPages);
        this.managedata();
        this.manageAppData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  managedata() {
    this.formattedData = [];
    let firstGroup = _.groupBy(this.dashBoardPages, 'module');
    console.log(firstGroup);
    this.formattedData = Object.keys(firstGroup).map(key => {
      return {
        name: key,
        groups: firstGroup[key],
        isSelected: false,
        isOp: false,
      }
    });

    this.formattedData.map(module => {
      let isMasterAllSelected = true;
      let pageGroup = _.groupBy(module.groups, 'group_name');
      console.log(pageGroup);
      console.log(Object.keys(pageGroup));
      module.groups = Object.keys(pageGroup).map(key => {
        let isAllSelected = true;
        let pages = pageGroup[key].map(page => {
          page.isSelected = page.userid ? true : false;
          page.isadd = page.isadd ? true : false;
          page.isedit = page.isedit ? true : false;
          page.isdeleted = page.isdeleted ? true : false;
          page.isOp = false;
          if (isAllSelected)
            isAllSelected = page.isSelected;
          return page;
        });
        if (isMasterAllSelected) {
          isMasterAllSelected = isAllSelected;
        }
        return {
          name: key,
          pages: pages,
          isSelected: isAllSelected,
        }
      });
      module.isSelected = isMasterAllSelected;
    });

    this.formattedData = _.sortBy(this.formattedData, ['name'], ['asc']).map(module => {
      module.groups = _.sortBy(module.groups, ['name'], ['asc']).map(groups => {
        groups.pages = _.sortBy(groups.pages, ['title'], ['asc']);
        return groups;
      });
      return module;
    });
  }

  manageAppData() {
    this.formattedDataApp = [];
    let firstGroup = _.groupBy(this.appPages, 'module');
    console.log(firstGroup);
    this.formattedDataApp = Object.keys(firstGroup).map(key => {
      return {
        name: key,
        groups: firstGroup[key],
        isSelected: false,
        isOp: false,
      }
    });
  
    this.formattedDataApp.map(module => {
      let isMasterAllSelected = true;
      let pageGroup = _.groupBy(module.groups, 'group_name');
      console.log(pageGroup);
      console.log(Object.keys(pageGroup));
      module.groups = Object.keys(pageGroup).map(key => {
        let isAllSelected = true;
        let pages = pageGroup[key].map(page => {
          page.isSelected = page.userid ? true : false;
          page.isadd = page.isadd ? true : false;
          page.isedit = page.isedit ? true : false;
          page.isdeleted = page.isdeleted ? true : false;
          page.isOp = false;
          if (isAllSelected)
            isAllSelected = page.isSelected;
          return page;
        });
        if (isMasterAllSelected) {
          isMasterAllSelected = isAllSelected;
        }
        return {
          name: key,
          pages: pages,
          isSelected: isAllSelected,
        }
      });
      module.isSelected = isMasterAllSelected;
    });

    this.formattedDataApp = _.sortBy(this.formattedDataApp, ['name'], ['asc']).map(module => {
      module.groups = _.sortBy(module.groups, ['name'], ['asc']).map(groups => {
        groups.pages = _.sortBy(groups.pages, ['title'], ['asc']);
        return groups;
      });
      return module;
    });
  }

  checkOrUnCheckAll(details, type) {
    this.common.isComponentActive = true;
    console.log("component is", this.common.isComponentActive);
    if (type === 'group') {
      console.log('details.isSelected:', details.isSelected);
      details.pages.map(page => {
        console.log('details.isSelected:', details.isSelected);
        page.isSelected = details.isSelected
      });
    } else if (type === 'module') {
      details.groups.map(group => {
        group.isSelected = details.isSelected;
        group.pages.map(page => page.isSelected = details.isSelected);
      });
    }
    if (!details.isSelected && type == 'page') {
      details.isSelected = details.isSelected;
      details.isadd = false;
      details.isedit = false;
      details.isdeleted = false;
      details.isOp = true;
    }
  }

  checkOrUnCheckfunctionality(modul,indexmodule,isAll){
    console.log(modul,indexmodule,isAll);
    if(isAll){
      for(let i = 0;i<modul.pages.length;i++)
      {
        console.log(modul.pages[i]);
        modul.pages[i].isSelected = true;
        modul.pages[i].isadd = true;
        modul.pages[i].isedit = true;
        modul.pages[i].isdeleted = true;
        modul.pages[i].isOp = true;
      }
    }
    else{
      for(let i = 0;i<modul.pages.length;i++)
      {
      modul.pages[i].isSelected = false;
      modul.pages[i].isadd = false;
      modul.pages[i].isedit = false;
      modul.pages[i].isdeleted = false;
      modul.pages[i].isOp = false;
    }
  }
    // if (!details.isSelected && type == 'page') {
    //   details.isSelected = details.isSelected;
    //   details.isadd = false;
    //   details.isedit = false;
    //   details.isdeleted = false;
    //   details.isOp = true;
    // }

  }

  changePagePermission(details, type, event) {
    this.istaskOpertion = true;
    if (this.istaskOpertion) {
      return details.isOp = true;
    }
  }


  saveUserRole() {
    const params = {
      pages: this.findSelectedPages(),
      userId: this.selectedUser.details.id,
      userType: 3,
    };
    console.log("Param:", params);
    this.common.loading++;
    this.api.post('UserRoles/setPagesWrtUser', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res);
        this.common.showToast(res['msg']);
        this.refresh();

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  findSelectedPages() {
    let data = [];
    console.log('formattedData: ', this.formattedData);
    this.formattedData.map(module => {
      module.groups.map(group => {
        group.pages.map(page => {
          if (page.isSelected) {
            data.push({ id: page.id, status: 1, isadd: page.isadd, isedit: page.isedit, isdeleted: page.isdeleted, isOp: page.isOp });
          }
          else {
            data.push({ id: page.id, status: 0, isadd: false, isedit: false, isdeleted: false, isOp: page.isOp });
          }
        })
      })

    });
    this.formattedDataApp.map(module => {
      module.groups.map(group => {
        group.pages.map(page => {
          if (page.isSelected) {
            data.push({ id: page.id, status: 1, isadd: page.isadd, isedit: page.isedit, isdeleted: page.isdeleted, isOp: page.isOp });
          }
          else {
            data.push({ id: page.id, status: 0, isadd: false, isedit: false, isdeleted: false, isOp: page.isOp });
          }
        })
      })

    });
    return data;
  }



}
