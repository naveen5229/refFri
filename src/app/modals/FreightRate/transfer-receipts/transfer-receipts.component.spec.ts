import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferReceiptsComponent } from './transfer-receipts.component';

describe('TransferReceiptsComponent', () => {
  let component: TransferReceiptsComponent;
  let fixture: ComponentFixture<TransferReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
