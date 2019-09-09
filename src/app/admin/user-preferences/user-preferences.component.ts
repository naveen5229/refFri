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
  selectedUser = {
    details: null,
    oldPreferences: []
  };
  formattedData = [];
  pageGroup = [];
  pagesGroups = {};
  pageGroupKeys = [];
  newPage = {
    module: null,
    group: null,
    title: null,
    url: null,
    type: 'Dashboard',
    addType: 1,
  };
  getUsersList = [];



  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    public route: RouteGuard) {
    this.common.isComponentActive = false;
    this.common.refresh = this.refresh.bind(this);
    this.getAllUserList();
  }




  ngOnInit() {
  }
  ngDestroy() {

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
    this.pagesGroups = {};
    document.getElementById('employeename')['value'] = '';
    this.common.isComponentActive = false;
    this.formattedData = [];
  }


  createNewPage() {
    let params = {
      moduleName: this.newPage.module,
      groupName: this.newPage.group,
      title: this.newPage.title,
      route: this.newPage.url,
      type: this.newPage.type,
      add_type: this.newPage.addType
    };
    this.common.loading++;
    this.api.post('UserRoles/insertNewPageDetails', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg'])
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
    this.formattedData = [];
    this.selectedUser.details = user;
    const params = {
      userId: user.id,
      userType: 1
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        this.data.map(id => {

        });
        if (res['data'])
          console.log("Res Data:", this.data)
        this.selectedUser.oldPreferences = res['data'];
        this.managedata();
        // this.findSections();
        // this.checkSelectedPages(res['data']);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  managedata() {
    let firstGroup = _.groupBy(this.data, 'module');
    this.formattedData = Object.keys(firstGroup).map(key => {
      return {
        name: key,
        groups: firstGroup[key],
        isSelected: false
      }
    });
    this.formattedData.map(module => {
      let isMasterAllSelected = true;
      let pageGroup = _.groupBy(module.groups, 'group_name');
      module.groups = Object.keys(pageGroup).map(key => {
        let isAllSelected = true;
        let pages = pageGroup[key].map(page => {
          page.isSelected = page.userid ? true : false;
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
    console.log("After Formatted", this.formattedData);

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
            data.push({ id: page.id, status: 1 });
          }
          else {
            data.push({ id: page.id, status: 0 });
          }
        })
      })

    });
    return data;
  }



}
