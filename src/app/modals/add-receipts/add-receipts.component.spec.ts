import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceiptsComponent } from './add-receipts.component';

describe('AddReceiptsComponent', () => {
  let component: AddReceiptsComponent;
  let fixture: ComponentFixture<AddReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
