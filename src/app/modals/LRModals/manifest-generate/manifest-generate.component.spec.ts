import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestGenerateComponent } from './manifest-generate.component';

describe('ManifestGenerateComponent', () => {
  let component: ManifestGenerateComponent;
  let fixture: ComponentFixture<ManifestGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManifestGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifestGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
