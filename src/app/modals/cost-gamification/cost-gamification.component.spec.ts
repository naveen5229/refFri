import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostGamificationComponent } from './cost-gamification.component';

describe('CostGamificationComponent', () => {
  let component: CostGamificationComponent;
  let fixture: ComponentFixture<CostGamificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostGamificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostGamificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
