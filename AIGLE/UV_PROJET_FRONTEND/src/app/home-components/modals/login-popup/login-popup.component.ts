import { Component } from '@angular/core';
import { RegisterComponent } from '../register-popup/register-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomvalidationService } from '../../../services/customvalidation.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent {
  password!: string;
  email!: string;
  user: any;
  loginForm!: FormGroup;
  codeForm!: FormGroup;
  errorMessage = '';
  resetForm!: FormGroup;
  showPasswordReset = false;
  submitted3 = false;
  isLoading: boolean = false;
  resetRequestForm!: FormGroup;
  verificationForm!: FormGroup;
  submitted = false;
  showVerification = false;
  showResetPasswordForm = false;
  showSuccessMessage = false;
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginPopupComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private customValidator: CustomvalidationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.resetRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.verificationForm = this.fb.group({
      verificationCode: ['', Validators.required]
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([
        Validators.required,
        this.customValidator.patternValidator()
      ])]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.customValidator.MatchPassword('newPassword', 'confirmPassword')
    });
  }

  get loginFormControl() { return this.loginForm.controls; }
  get resetRequestFormControl() { return this.resetRequestForm.controls; }
  get verificationFormControl() { return this.verificationForm.controls; }
  get resetFormControl() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    this.isLoading = true;

    this.userService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: value => {
        const queryParams = {
          token: value.access_token,
          name: value.username,
          role: value.role,
          id: value.id,
          isLoggedOut: false
        };

        // Stockage local
        localStorage.setItem('token', value.access_token);
        localStorage.setItem('name', value.username);
        localStorage.setItem('role', value.role);
        localStorage.setItem('id', value.id);
        localStorage.setItem('user', JSON.stringify(value.user));

        // 🔁 Redirection en fonction du rôle
        this.redirectUserByRole(value.role, queryParams);

        this.dialogRef.close();
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = "Adresse email ou mot de passe invalide";
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // ✅ Méthode ajoutée : redirection selon le rôle
  private redirectUserByRole(role: string, queryParams: any) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard'], { queryParams });
        break;
      case 'superviseur':
        this.router.navigate(['/enseignant'], { queryParams });
        break;
      case 'user':
        this.router.navigate(['/user/dashboard'], { queryParams });
        break;
      default:
        this.router.navigate(['/unauthorized']);
        break;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  openRegisterDialog(): void {
    this.dialogRef.close();
    const dialogRef2 = this.dialog.open(RegisterComponent, {
      width: '387px',
      height: '600px',
    });
    dialogRef2.afterClosed().subscribe(() => console.log('Register dialog closed'));
  }

  openForgetPasswordDialog(): void {
    this.dialogRef.close();
    const dialogRef3 = this.dialog.open(ForgetPasswordComponent, {
      width: '400px',
      height: '500px'
    });
    dialogRef3.afterClosed().subscribe(() => console.log('Forget password dialog closed'));
  }

  onSendVerificationCode() {
    this.submitted = true;
    if (this.resetRequestForm.invalid) return;

    this.isLoading = true;
    const email = this.resetRequestForm.value.email;

    this.userService.sendVerificationCode(email).subscribe({
      next: () => { this.showVerification = true; },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de l\'envoi du code de vérification.';
        alert(this.errorMessage);
      },
      complete: () => { this.isLoading = false; }
    });
  }

  onVerifyCode() {
    this.submitted = true;
    if (this.verificationForm.invalid) return;

    this.isLoading = true;
    const { email } = this.resetRequestForm.value;
    const { verificationCode } = this.verificationForm.value;

    this.userService.verifyResetcode(email, verificationCode).subscribe({
      next: () => { this.showResetPasswordForm = true; },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = 'Code de vérification invalide.';
        alert(this.errorMessage);
      },
      complete: () => { this.isLoading = false; }
    });
  }

  onResetPassword() {
    this.submitted = true;
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    const { email } = this.resetRequestForm.value;
    const { newPassword } = this.resetForm.value;
    const { verificationCode } = this.verificationForm.value;

    this.userService.resetPassword(email, newPassword, verificationCode).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        this.successMessage = 'Votre mot de passe a été réinitialisé avec succès.';
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = 'Aucun utilisateur trouvé avec cette adresse email.';
        alert(this.errorMessage);
      },
      complete: () => { this.isLoading = false; }
    });
  }
}
