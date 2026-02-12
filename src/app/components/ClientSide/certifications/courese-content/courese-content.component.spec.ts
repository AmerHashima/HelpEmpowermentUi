import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoureseContentComponent } from './courese-content.component';

describe('CoureseContentComponent', () => {
  let component: CoureseContentComponent;
  let fixture: ComponentFixture<CoureseContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoureseContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoureseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
