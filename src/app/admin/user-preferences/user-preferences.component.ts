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

  form: FormGroup;


  data = [];
  selectedUser = {
    details: null,
    oldPreferences: []
  };

  sections = [];
  pagesGroups = {};

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder) {
 
  }


  ngOnInit() {
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
        isSelected: data.userid
      });
    });

    console.log('All Sections: ', this.sections, this.pagesGroups);
  }



  checkOrUnCheckAll(index) {
    this.pagesGroups[this.sections[index].title].map(page => page.isSelected = this.sections[index].isSelected);
  }



  getUserPages(user) {
    this.selectedUser.details = user;
    console.log('User: ', user);
    const params = {
      userId: user.id
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res);
        
        this.data = res['data'];
        console.log("Res Data:", this.data)

        this.selectedUser.oldPreferences = res['data'];
        this.checkSelectedPages(res['data']);
        this.findSections();

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
  }

  checkSelectedPages(pages) {
    this.sections.map(section => {
      this.pagesGroups[section.title].map(page => {
        page.isSelected = this.findSelectedOrNot(page.id, pages);
      });
    });
  }

  findSelectedOrNot(id, pages) {
    let status = false;
    pages.map(page => (page.id == id) && (status = page.userid ? true : false));
    return status;
  }

  updatePreferences() {
    const params = { pages: this.findSelectedPages(), userId: this.selectedUser.details.id };
    console.log("Param:", params);
    this.common.loading++;
    this.api.post('UserRoles/setPagesWrtUser', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res);
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
          console.log('---------------------------------------------');
          data.push({ "id": page.id, "status":page.isSelected });
        }
      })
    });
    return data;
  }








}
