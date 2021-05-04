import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciseColumnPrefrenceComponent } from './concise-column-prefrence.component';

describe('ConciseColumnPrefrenceComponent', () => {
  let component: ConciseColumnPrefrenceComponent;
  let fixture: ComponentFixture<ConciseColumnPrefrenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConciseColumnPrefrenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciseColumnPrefrenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
