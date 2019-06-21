import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadHaltComponent } from './load-halt.component';

describe('LoadHaltComponent', () => {
  let component: LoadHaltComponent;
  let fixture: ComponentFixture<LoadHaltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadHaltComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadHaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
