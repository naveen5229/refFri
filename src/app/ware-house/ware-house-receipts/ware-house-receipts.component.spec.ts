import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseReceiptsComponent } from './ware-house-receipts.component';

describe('WareHouseReceiptsComponent', () => {
  let component: WareHouseReceiptsComponent;
  let fixture: ComponentFixture<WareHouseReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WareHouseReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WareHouseReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
