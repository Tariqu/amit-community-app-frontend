import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchFilterComponent } from './user-search-filter.component';

describe('UserSearchFilterComponent', () => {
  let component: UserSearchFilterComponent;
  let fixture: ComponentFixture<UserSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSearchFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
