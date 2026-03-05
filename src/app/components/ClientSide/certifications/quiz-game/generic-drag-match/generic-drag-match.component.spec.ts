import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDragMatchComponent } from './generic-drag-match.component';

describe('GenericDragMatchComponent', () => {
  let component: GenericDragMatchComponent;
  let fixture: ComponentFixture<GenericDragMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDragMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericDragMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
