import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWiseFuelAverageComponent } from './modal-wise-fuel-average.component';

describe('ModalWiseFuelAverageComponent', () => {
  let component: ModalWiseFuelAverageComponent;
  let fixture: ComponentFixture<ModalWiseFuelAverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalWiseFuelAverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWiseFuelAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
