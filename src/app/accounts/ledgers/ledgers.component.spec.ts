import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgersComponent } from './ledgers.component';

describe('LedgersComponent', () => {
  let component: LedgersComponent;
  let fixture: ComponentFixture<LedgersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
