import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterViewComponent } from './transporter-view.component';

describe('TransporterViewComponent', () => {
  let component: TransporterViewComponent;
  let fixture: ComponentFixture<TransporterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
