import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstDriverComponent } from './worst-driver.component';

describe('WorstDriverComponent', () => {
  let component: WorstDriverComponent;
  let fixture: ComponentFixture<WorstDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
