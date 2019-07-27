import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAssociationComponent } from './company-association.component';

describe('CompanyAssociationComponent', () => {
  let component: CompanyAssociationComponent;
  let fixture: ComponentFixture<CompanyAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
