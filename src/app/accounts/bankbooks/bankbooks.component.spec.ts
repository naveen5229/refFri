import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankbooksComponent } from './bankbooks.component';

describe('BankbooksComponent', () => {
  let component: BankbooksComponent;
  let fixture: ComponentFixture<BankbooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankbooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
