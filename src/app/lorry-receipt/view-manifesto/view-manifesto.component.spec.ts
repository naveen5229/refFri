import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManifestoComponent } from './view-manifesto.component';

describe('ViewManifestoComponent', () => {
  let component: ViewManifestoComponent;
  let fixture: ComponentFixture<ViewManifestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewManifestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManifestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
