import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgermappingComponent } from './ledgermapping.component';

describe('LedgermappingComponent', () => {
  let component: LedgermappingComponent;
  let fixture: ComponentFixture<LedgermappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgermappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
