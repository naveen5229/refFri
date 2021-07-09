import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemaptripandrouteComponent } from './remaptripandroute.component';

describe('RemaptripandrouteComponent', () => {
  let component: RemaptripandrouteComponent;
  let fixture: ComponentFixture<RemaptripandrouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemaptripandrouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemaptripandrouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
