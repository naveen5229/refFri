import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyBranchComponent } from './add-company-branch.component';

describe('AddCompanyBranchComponent', () => {
  let component: AddCompanyBranchComponent;
  let fixture: ComponentFixture<AddCompanyBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
