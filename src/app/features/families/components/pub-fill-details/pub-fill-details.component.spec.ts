import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubFillDetailsComponent } from './pub-fill-details.component';

describe('PubFillDetailsComponent', () => {
  let component: PubFillDetailsComponent;
  let fixture: ComponentFixture<PubFillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubFillDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PubFillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
