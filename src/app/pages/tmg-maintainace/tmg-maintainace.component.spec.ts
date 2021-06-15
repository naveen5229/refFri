import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgMaintainaceComponent } from './tmg-maintainace.component';

describe('TmgMaintainaceComponent', () => {
  let component: TmgMaintainaceComponent;
  let fixture: ComponentFixture<TmgMaintainaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmgMaintainaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgMaintainaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
