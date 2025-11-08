import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondHand } from './second-hand';

describe('SecondHand', () => {
  let component: SecondHand;
  let fixture: ComponentFixture<SecondHand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondHand],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondHand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
