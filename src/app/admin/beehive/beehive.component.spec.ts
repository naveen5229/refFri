import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeehiveComponent } from './beehive.component';

describe('BeehiveComponent', () => {
  let component: BeehiveComponent;
  let fixture: ComponentFixture<BeehiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeehiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeehiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
