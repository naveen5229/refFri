import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankEmptyDetailsComponent } from './tank-empty-details.component';

describe('TankEmptyDetailsComponent', () => {
  let component: TankEmptyDetailsComponent;
  let fixture: ComponentFixture<TankEmptyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankEmptyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankEmptyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
