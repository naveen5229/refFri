import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollAnalaticsComponent } from './toll-analatics.component';

describe('TollAnalaticsComponent', () => {
  let component: TollAnalaticsComponent;
  let fixture: ComponentFixture<TollAnalaticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollAnalaticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollAnalaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
