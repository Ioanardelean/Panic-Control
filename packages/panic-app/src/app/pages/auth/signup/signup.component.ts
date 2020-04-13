import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [routerTransition()],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public toastr: ToastrService
  ) {
    this.registerForm = this.formBuilder.group({
      username: [''],
      email: [''],
      password: [''],
    });
  }

  ngOnInit() {}

  registerUser() {
    this.authService.register(this.registerForm.value).subscribe((res) => {
      if (res.data) {
        this.registerForm.reset();
        this.router.navigate(['login']);
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.error);
      }
    });
  }
}
