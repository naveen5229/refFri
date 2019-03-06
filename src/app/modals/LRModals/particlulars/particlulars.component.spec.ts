import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticlularsComponent } from './particlulars.component';

describe('ParticlularsComponent', () => {
  let component: ParticlularsComponent;
  let fixture: ComponentFixture<ParticlularsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticlularsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticlularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
