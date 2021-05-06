import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstDriversComponent } from './worst-drivers.component';

describe('WorstDriversComponent', () => {
  let component: WorstDriversComponent;
  let fixture: ComponentFixture<WorstDriversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstDriversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
