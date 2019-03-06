import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryReceiptDetailsComponent } from './lorry-receipt-details.component';

describe('LorryReceiptDetailsComponent', () => {
  let component: LorryReceiptDetailsComponent;
  let fixture: ComponentFixture<LorryReceiptDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LorryReceiptDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LorryReceiptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
