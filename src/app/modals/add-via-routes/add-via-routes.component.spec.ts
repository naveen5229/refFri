import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddViaRoutesComponent } from './add-via-routes.component';

describe('AddViaRoutesComponent', () => {
  let component: AddViaRoutesComponent;
  let fixture: ComponentFixture<AddViaRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddViaRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddViaRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
