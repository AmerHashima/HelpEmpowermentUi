import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorFormComponent } from './moderator-form.component';

describe('ModeratorFormComponent', () => {
  let component: ModeratorFormComponent;
  let fixture: ComponentFixture<ModeratorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
