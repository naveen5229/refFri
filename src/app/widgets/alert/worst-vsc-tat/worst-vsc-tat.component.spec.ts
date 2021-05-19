import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstVscTatComponent } from './worst-vsc-tat.component';

describe('WorstVscTatComponent', () => {
  let component: WorstVscTatComponent;
  let fixture: ComponentFixture<WorstVscTatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorstVscTatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorstVscTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
