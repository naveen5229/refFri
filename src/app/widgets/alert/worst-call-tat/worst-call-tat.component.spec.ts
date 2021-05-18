import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstCallTatComponent } from './worst-call-tat.component';

describe('WorstCallTatComponent', () => {
  let component: WorstCallTatComponent;
  let fixture: ComponentFixture<WorstCallTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstCallTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstCallTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
