import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowestLoadDaysComponent } from './lowest-load-days.component';

describe('LowestLoadDaysComponent', () => {
  let component: LowestLoadDaysComponent;
  let fixture: ComponentFixture<LowestLoadDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowestLoadDaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LowestLoadDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
