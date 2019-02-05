import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBranchesComponent } from './company-branches.component';

describe('CompanyBranchesComponent', () => {
  let component: CompanyBranchesComponent;
  let fixture: ComponentFixture<CompanyBranchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBranchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
