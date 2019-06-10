import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollUsageComponent } from './toll-usage.component';

describe('TollUsageComponent', () => {
  let component: TollUsageComponent;
  let fixture: ComponentFixture<TollUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
