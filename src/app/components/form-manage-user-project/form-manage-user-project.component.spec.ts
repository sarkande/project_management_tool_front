import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManageUserProjectComponent } from './form-manage-user-project.component';

describe('FormManageUserProjectComponent', () => {
  let component: FormManageUserProjectComponent;
  let fixture: ComponentFixture<FormManageUserProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormManageUserProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormManageUserProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
