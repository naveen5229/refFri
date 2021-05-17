import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlowestOnwardVeiclesComponent } from './slowest-onward-veicles.component';

describe('SlowestOnwardVeiclesComponent', () => {
  let component: SlowestOnwardVeiclesComponent;
  let fixture: ComponentFixture<SlowestOnwardVeiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlowestOnwardVeiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlowestOnwardVeiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
