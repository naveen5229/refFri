import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckloginandredirectComponent } from './checkloginandredirect.component';

describe('CheckloginandredirectComponent', () => {
  let component: CheckloginandredirectComponent;
  let fixture: ComponentFixture<CheckloginandredirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckloginandredirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckloginandredirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
