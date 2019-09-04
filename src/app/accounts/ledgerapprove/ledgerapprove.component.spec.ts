import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerapproveComponent } from './ledgerapprove.component';

describe('LedgerapproveComponent', () => {
  let component: LedgerapproveComponent;
  let fixture: ComponentFixture<LedgerapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
