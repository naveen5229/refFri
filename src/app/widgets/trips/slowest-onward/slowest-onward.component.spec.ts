import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowestOnwardComponent } from './slowest-onward.component';

describe('SlowestOnwardComponent', () => {
  let component: SlowestOnwardComponent;
  let fixture: ComponentFixture<SlowestOnwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlowestOnwardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowestOnwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
