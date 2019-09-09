import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import * as _ from 'lodash';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'fo-user-role',
  templateUrl: './fo-user-role.component.html',
  styleUrls: ['./fo-user-role.component.scss', '../pages.component.css']
})
export class FoUserRoleComponent implements OnInit {
  getUsersList = [];
  getAllPagesList = [];
  formattedData = [];
  selectedUser = {
    details: null,
    oldPreferences: []
  };


  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal,
    public user: UserService) {
    this.common.isComponentActive = false;
    this.common.refresh = this.refresh.bind(this);
    this.getAllUserList();
  }

  ngOnInit() {
  }
  refresh() {
    this.common.isComponentActive = false;
    this.getAllUserList();
    document.getElementById('name')['value'] = '';
    this.formattedData = [];
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
    this.selectedUser.details = user;
    const params = {
      userId: user.id,
      userType: 3
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        this.getAllPagesList = res['data'];
        this.managedata();
        console.log("Res Data:", this.getAllPagesList)
        this.selectedUser.oldPreferences = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }


  managedata() {
    let firstGroup = _.groupBy(this.getAllPagesList, 'module');
    console.log(firstGroup);
    this.formattedData = Object.keys(firstGroup).map(key => {
      return {
        name: key,
        groups: firstGroup[key],
        isSelected: false
      }
    });
    this.formattedData.map(module => {
      let pageGroup = _.groupBy(module.groups, 'group_name');
      module.groups = Object.keys(pageGroup).map(key => {
        return {
          name: key,
          pages: pageGroup[key].map(page => { page.isSelected = page.userid ? true : false; return page; }),
          isSelected: false,
        }
      });
    });


    this.formattedData = _.sortBy(this.formattedData, ['name'], ['asc']).map(module => {
      module.groups = _.sortBy(module.groups, ['name'], ['asc']).map(groups => {
        groups.pages = _.sortBy(groups.pages, ['title'], ['asc']);
        return groups;
      });
      return module;
    });
  }

  checkOrUnCheckAll(details, type) {
    this.common.isComponentActive = true;
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
