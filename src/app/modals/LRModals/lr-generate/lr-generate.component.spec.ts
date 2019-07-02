import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrGenerateComponent } from './lr-generate.component';

describe('LrGenerateComponent', () => {
  let component: LrGenerateComponent;
  let fixture: ComponentFixture<LrGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
