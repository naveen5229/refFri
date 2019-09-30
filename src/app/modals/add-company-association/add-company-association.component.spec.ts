import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyAssociationComponent } from './add-company-association.component';

describe('AddCompanyAssociationComponent', () => {
  let component: AddCompanyAssociationComponent;
  let fixture: ComponentFixture<AddCompanyAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
