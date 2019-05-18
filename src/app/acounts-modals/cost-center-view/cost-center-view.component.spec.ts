import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterViewComponent } from './cost-center-view.component';

describe('CostCenterViewComponent', () => {
  let component: CostCenterViewComponent;
  let fixture: ComponentFixture<CostCenterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostCenterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
