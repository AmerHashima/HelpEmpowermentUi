import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVacnacyComponent } from './post-vacnacy.component';

describe('PostVacnacyComponent', () => {
  let component: PostVacnacyComponent;
  let fixture: ComponentFixture<PostVacnacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostVacnacyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostVacnacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
