import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { RouteGuard } from '../../guards/route.guard';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { group } from '@angular/animations';
@Component({
  selector: 'user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss', '../../pages/pages.component.css']
})
export class UserPreferencesComponent implements OnInit {
  data = [];
  dashBoardPages = [];
  appPages = [];
  parentPages = [];
  selectedUser = {
    details: null,
    oldPreferences: []
  };
  formattedData = [];
  formattedDataApp = [];
  pageGroup = [];
  newPage = {
    module: null,
    group: null,
    title: null,
    url: null,
    parentId: null,
    type: 'Dashboard',
    addType: 1,
    add: 0,
    edit: 0,
    delete: 0
  };
  getUsersList = [];
  istaskOpertion = false;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    public route: RouteGuard) {
    this.common.isComponentActive = false;
    this.common.refresh = this.refresh.bind(this);
    this.getAllUserList();
    this.getPages();
  }


  ngOnInit() {
  }
  ngDestroy() {

  }

  changePermissionType(type, value) {
    let isFlag = false;
    isFlag = value.target.checked;
    if (isFlag) this.newPage[type] = 1;
    else this.newPage[type] = 0;
  }

  //Confirmation that before Leave the PAge
  canDeactivate() {
    console.log("activity Start", this.common.isComponentActive);
    if (this.common.isComponentActive) {
      this.common.params = {
        title: 'Confirmation ',
        description: `<b>&nbsp;` + 'Are Sure To Leave This Page WithOut Save' + `<b>`,
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

  refresh() {
    this.data = [];
    this.selectedUser = {
      details: null,
      oldPreferences: []
    };
    document.getElementById('employeename')['value'] = '';
    this.common.isComponentActive = false;
    this.formattedData = [];
    this.formattedDataApp = [];
  }


  createNewPage() {
    let params = {
      moduleName: this.newPage.module,
      groupName: this.newPage.group,
      title: this.newPage.title,
      route: this.newPage.url,
      type: this.newPage.type,
      add_type: this.newPage.addType,
      hasAdd: this.newPage.add,
      hasEdit: this.newPage.edit,
      hasDelete: this.newPage.delete,
      parentId: this.newPage.parentId
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('UserRoles/insertNewPageDetails', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  checkOrUnCheckAll(details, type) {
    this.common.isComponentActive = true;
    if (type === 'group') {
      details.pages.map(page => {
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
  changePagePermission(details, type, event) {
    this.istaskOpertion = true;
    if (this.istaskOpertion) {
      return details.isOp = true;
    }
  }

  getAllUserList() {
    this.common.loading++;
    this.api.get('UserRoles/getActiveAdminUsers?')
      .subscribe(res => {
        this.common.loading--;
        this.getUsersList = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  getUserPages(user) {
    console.log(user);
    this.appPages = [];
    this.dashBoardPages = [];
    this.formattedData = [];
    this.selectedUser.details = user;
    const params = {
      userId: user.id,
      userType: 1,
      iswallet: localStorage.getItem('iswallet') || '0'
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
         this.selectedUser.oldPreferences = res['data'];
        this.data.map(dt=>{
          // console.log('dt',dt);
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

  getPages() {

    this.common.loading++;
    this.api.get('UserRoles/getPages')
      .subscribe(res => {
        this.common.loading--;
        this.parentPages = res['data'] ? res['data'] : [];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  managedata() {
    this.formattedData = [];
    console.log("this.dashBoardPages",this.dashBoardPages);
    let firstGroup = _.groupBy(this.dashBoardPages, 'module');
    console.log("firstGroup", firstGroup);
    console.log("firstGroupkeys", Object.keys(firstGroup));
    this.formattedData = Object.keys(firstGroup).map(key => {
      return {
        name: key,
        groups: firstGroup[key],
        isSelected: false,
        isOp: false,
      }
    });
    console.log("formattedData", this.formattedData);
    this.formattedData.map(module => {
      let isMasterAllSelected = true;
      let pageGroup = _.groupBy(module.groups, 'group_name');
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
    console.log("firstGroup", firstGroup);
    console.log("firstGroupkeys", Object.keys(firstGroup));
    console.log("this.formattedDataApp",this.formattedDataApp);
    this.formattedDataApp = Object.keys(firstGroup).map(key => {
      return {
        name: key,
        groups: firstGroup[key],
        isSelected: false,
        isOp: false,
      }
    });
    console.log("formattedData1", this.formattedDataApp);
    this.formattedDataApp.map(module => {
      let isMasterAllSelected = true;
      let pageGroup = _.groupBy(module.groups, 'group_name');
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


  updatePreferences() {
    const params = {
      pages: this.findSelectedPages(),
      userId: this.selectedUser.details.id,
      userType: 1,
    };
    console.log("Param:", params);
    this.common.loading++;
    this.api.post('UserRoles/setPagesWrtUser', params)
      .subscribe(res => {
        console.log(res);
        this.common.loading--;
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
  functionalityFlag = [];

  checkOrUnCheckfunctionality(modul, indexmodule, isAll) {
    console.log(modul, indexmodule, isAll);
    if (isAll) {
      for (let i = 0; i < modul.pages.length; i++) {
        console.log(modul.pages[i]);
        modul.pages[i].isSelected = true;
        modul.pages[i].isadd = true;
        modul.pages[i].isedit = true;
        modul.pages[i].isdeleted = true;
        modul.pages[i].isOp = true;
      }
    }
    else {
      for (let i = 0; i < modul.pages.length; i++) {
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

  selectParent(parent) {
    this.newPage.parentId = parent.id
  }

}
