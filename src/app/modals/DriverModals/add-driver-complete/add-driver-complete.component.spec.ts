import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverCompleteComponent } from "./add-driver-complete.component";

describe('AddDriverCompleteComponent', () => {
  let component: AddDriverCompleteComponent;
  let fixture: ComponentFixture<AddDriverCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDriverCompleteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDriverCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
