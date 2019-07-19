import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseDashbordComponent } from './ware-house-dashbord.component';

describe('WareHouseDashbordComponent', () => {
  let component: WareHouseDashbordComponent;
  let fixture: ComponentFixture<WareHouseDashbordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WareHouseDashbordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WareHouseDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
