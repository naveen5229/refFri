import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvGpsApiReqComponent } from './mv-gps-api-req.component';

describe('MvGpsApiReqComponent', () => {
  let component: MvGpsApiReqComponent;
  let fixture: ComponentFixture<MvGpsApiReqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvGpsApiReqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvGpsApiReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
