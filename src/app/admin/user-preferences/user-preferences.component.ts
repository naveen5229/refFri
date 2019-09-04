import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  sections = [];
  pagesGroups = {};

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
    private formBuilder: FormBuilder) {
    this.common.refresh = this.refresh.bind(this);
    this.getAllUserList();
  }


  ngOnInit() {
  }

  refresh() {
    this.data = [];
    this.selectedUser = {
      details: null,
      oldPreferences: []
    };

    this.sections = [];
    this.pagesGroups = {};
    document.getElementById('employeename')['value'] = '';
  }

  checkOrUnCheckAll(index) {
    this.pagesGroups[this.sections[index].title].map(page => page.isSelected = this.sections[index].isSelected);
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
        console.log("Res Data:", this.data)
        this.selectedUser.oldPreferences = res['data'];
        this.findSections();
        // this.checkSelectedPages(res['data']);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  findSections() {
    this.sections = [];
    this.pagesGroups = {};
    this.data.map(data => {
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

  checkSelectedPages(pages) {
    this.sections.map(section => {
      this.pagesGroups[section.title].map(page => {
        console.log('________page:::::,', page);
        // page.isSelected = this.findSelectedOrNot(page.id, pages);
      });
    });
  }

  findSelectedOrNot(id, pages) {
    let status = false;
    pages.map(page => (page.id == id) && (status = page.userid ? true : false));
    return status;
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
        // this.refresh();
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

}
