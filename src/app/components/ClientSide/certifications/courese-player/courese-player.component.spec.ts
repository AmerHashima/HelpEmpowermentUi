import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouresePlayerComponent } from './courese-player.component';

describe('CouresePlayerComponent', () => {
  let component: CouresePlayerComponent;
  let fixture: ComponentFixture<CouresePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouresePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouresePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
