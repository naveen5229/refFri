import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPumpComponent } from './add-pump.component';

describe('AddPumpComponent', () => {
  let component: AddPumpComponent;
  let fixture: ComponentFixture<AddPumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
