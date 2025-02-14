import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideLoginComponent } from './right-side-login.component';

describe('RightSideLoginComponent', () => {
  let component: RightSideLoginComponent;
  let fixture: ComponentFixture<RightSideLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSideLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightSideLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
