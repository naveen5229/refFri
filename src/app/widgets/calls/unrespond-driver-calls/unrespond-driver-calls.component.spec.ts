import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnrespondDriverCallsComponent } from './unrespond-driver-calls.component';

describe('UnrespondDriverCallsComponent', () => {
  let component: UnrespondDriverCallsComponent;
  let fixture: ComponentFixture<UnrespondDriverCallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnrespondDriverCallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnrespondDriverCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
