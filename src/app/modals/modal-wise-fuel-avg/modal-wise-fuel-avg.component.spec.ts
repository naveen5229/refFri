import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWiseFuelAvgComponent } from './modal-wise-fuel-avg.component';

describe('ModalWiseFuelAvgComponent', () => {
  let component: ModalWiseFuelAvgComponent;
  let fixture: ComponentFixture<ModalWiseFuelAvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalWiseFuelAvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWiseFuelAvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
