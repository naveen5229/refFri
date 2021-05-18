import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCallTatComponent } from './alert-call-tat.component';

describe('AlertCallTatComponent', () => {
  let component: AlertCallTatComponent;
  let fixture: ComponentFixture<AlertCallTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertCallTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCallTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
