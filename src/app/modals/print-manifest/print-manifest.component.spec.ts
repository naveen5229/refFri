import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintManifestComponent } from './print-manifest.component';

describe('PrintManifestComponent', () => {
  let component: PrintManifestComponent;
  let fixture: ComponentFixture<PrintManifestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintManifestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintManifestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
