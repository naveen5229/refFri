import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseModalComponent } from './ware-house-modal.component';

describe('WareHouseModalComponent', () => {
  let component: WareHouseModalComponent;
  let fixture: ComponentFixture<WareHouseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WareHouseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WareHouseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
