import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEstablishmentComponent } from './company-establishment.component';

describe('CompanyEstablishmentComponent', () => {
  let component: CompanyEstablishmentComponent;
  let fixture: ComponentFixture<CompanyEstablishmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyEstablishmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEstablishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
