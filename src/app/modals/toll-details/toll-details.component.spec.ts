import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollDetailsComponent } from './toll-details.component';

describe('TollDetailsComponent', () => {
  let component: TollDetailsComponent;
  let fixture: ComponentFixture<TollDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
