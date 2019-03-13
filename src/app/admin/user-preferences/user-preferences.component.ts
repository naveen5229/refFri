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


  data = [
    // {
    //   id:null,
    //   title:null,
    //   url:null,
    // }
    // { id: 1, name: 'Page 1', url: '/admin/page-1' },
    // { id: 2, name: 'Page 2', url: '/admin/page-2' },
    // { id: 3, name: 'Page 3', url: '/admin/page-3' },
    // { id: 4, name: 'Page 4', url: '/admin/page-4' },
    // { id: 5, name: 'Page 5', url: '/documents/page-1' },
    // { id: 6, name: 'Page 6', url: '/documents/page-2' },
    // { id: 7, name: 'Page 7', url: '/tyres/page-3' },
    // { id: 8, name: 'Page 8', url: '/tyres/page-4' },
  ];

  sections = [];
  pagesGroups = {};

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder) {
    this.getAllPages();
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
        isSelected: false
      });
    });

    console.log('All Sections: ', this.sections, this.pagesGroups);
  }



  checkOrUnCheckAll(index) {
    this.pagesGroups[this.sections[index].title].map(page => page.isSelected = this.sections[index].isSelected);
  }

  getAllPages() {
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', {})
      .subscribe(res => {
        this.common.loading--;

        this.data = res['data'];
        console.log("Res Data:", this.data);
        this.checkSelectedPages(this.data);
        this.findSections();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  updatePreferences() {
    let param = this.pagesGroups;
    console.log("Param:",param);
        this.common.loading++;
    this.api.post('UserRoles/setPagesWrtUser', {pages:param})
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
      })
    
  }

  getUserPages(user) {
    console.log('User: ', user);
    const params = {
      id: user.id
    };
    this.common.loading++;
    this.api.post('UserRoles/getAllPages', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res);
        this.checkSelectedPages(res['data']);
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
    pages.map(page => (page.id == id) && (status = page.isSelected));
    return status;
  }


}
