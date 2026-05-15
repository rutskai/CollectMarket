import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPersonalizationPage } from './user-personalization-page';

describe('UserPersonalizationPage', () => {
  let component: UserPersonalizationPage;
  let fixture: ComponentFixture<UserPersonalizationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPersonalizationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPersonalizationPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
