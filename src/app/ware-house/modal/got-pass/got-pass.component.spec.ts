import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GotPassComponent } from './got-pass.component';

describe('GotPassComponent', () => {
  let component: GotPassComponent;
  let fixture: ComponentFixture<GotPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GotPassComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GotPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
