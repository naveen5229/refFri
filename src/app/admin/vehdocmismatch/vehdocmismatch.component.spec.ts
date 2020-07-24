import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehdocmismatchComponent } from './vehdocmismatch.component';

describe('VehdocmismatchComponent', () => {
  let component: VehdocmismatchComponent;
  let fixture: ComponentFixture<VehdocmismatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehdocmismatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehdocmismatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
