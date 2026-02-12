import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoureseAudienceComponent } from './courese-audience.component';

describe('CoureseAudienceComponent', () => {
  let component: CoureseAudienceComponent;
  let fixture: ComponentFixture<CoureseAudienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoureseAudienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoureseAudienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
