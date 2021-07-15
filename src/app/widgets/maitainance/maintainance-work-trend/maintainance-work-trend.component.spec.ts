import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainanceWorkTrendComponent } from './maintainance-work-trend.component';

describe('MaintainanceWorkTrendComponent', () => {
  let component: MaintainanceWorkTrendComponent;
  let fixture: ComponentFixture<MaintainanceWorkTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainanceWorkTrendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainanceWorkTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
