import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'fo-user-role',
  templateUrl: './fo-user-role.component.html',
  styleUrls: ['./fo-user-role.component.scss']
})
export class FoUserRoleComponent implements OnInit {
  getUsersList = [];
  getAllPagesList = [];
  selectedUser = {
    details: null,
    oldPreferences: []
  };

  sections = [];
  pagesGroups = {};

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService) {
    this.common.refresh = this.refresh.bind(this);
    this.getAllUserList();
  }

  ngOnInit() {
  }
  refresh() {
    this.getAllUserList();
    document.getElementById('name')['value'] = '';
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
        console.log("Res Data:", this.getAllPagesList)
        this.selectedUser.oldPreferences = res['data'];
        this.findSections();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  findSections() {
    this.sections = [];
    this.pagesGroups = {};
    this.getAllPagesList.map(data => {
      let section = { title: data.route.split('/')[1], isSelected: false };
      if (!this.sections.filter(s => s.title == section.title).length) {
        this.sections.push(section);
      }
      if (!this.pagesGroups[section.title]) {
        this.pagesGroups[section.title] = [];
      }
      this.pagesGroups[section.title].push({
        id: data.id,
        title: data.title,
        route: data.route,
        isSelected: data.userid ? true : false
      });

    });
    console.log("Get All Pages Access:", this.pagesGroups);

  }
  checkOrUnCheckAll(index) {
    this.pagesGroups[this.sections[index].title].map(page => page.isSelected = this.sections[index].isSelected);
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
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  findSelectedPages() {
    let data = [];
    console.log('Sections: ', this.sections);
    this.sections.map(section => {
      console.log('Pages: ', this.pagesGroups[section.title]);
      this.pagesGroups[section.title].map(page => {
        if (page.isSelected) {
          data.push({ id: page.id, status: 1 });
        }
        else {
          data.push({ id: page.id, status: 0 });
        }
      })

    });
    return data;
  }


}
