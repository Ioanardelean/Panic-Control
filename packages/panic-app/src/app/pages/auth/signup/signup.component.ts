import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as data from 'src/app/core/validators/account.message.json';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [routerTransition()],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitted = false;
  list = [];
  accountValidationMessages = (data as any).default;
  constructor(
    public formBuilder: FormBuilder,

    public authService: AuthService,
    public router: Router,
    public toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({

      username: ['',
        Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      email: ['',
        Validators.compose([Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
        )
      ],
      password: ['', Validators.compose([
        Validators.minLength(8),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])],
    });
  }
  registerUser() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.authService.register(this.registerForm.value).subscribe((res) => {
      this.registerForm.reset();
      this.router.navigate(['auth/login']);
      this.toastr.success(this.translate.instant('SUCCESS'));

    }, error => {
      this.toastr.error(this.translate.instant('USER'));
    });
  }


}
