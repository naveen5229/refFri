import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendsFoComponent } from './trends-fo.component';

describe('TrendsFoComponent', () => {
  let component: TrendsFoComponent;
  let fixture: ComponentFixture<TrendsFoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendsFoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendsFoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
