import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSideImagesComponent } from './on-side-images.component';

describe('OnSideImagesComponent', () => {
  let component: OnSideImagesComponent;
  let fixture: ComponentFixture<OnSideImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnSideImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnSideImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
