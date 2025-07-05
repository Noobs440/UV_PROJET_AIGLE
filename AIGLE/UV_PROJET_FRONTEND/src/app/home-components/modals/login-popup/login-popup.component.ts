import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CustomvalidationService } from '../../../services/customvalidation.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register-popup/register-popup.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent {
  loginForm!: FormGroup;
  resetForm!: FormGroup;

  submitted = false;
  isLoading = false;
  errorMessage = '';

  // Propriétés booléennes manquantes pour le template
  showPasswordReset: boolean = false;
  showVerification: boolean = false;
  showSuccessMessage: boolean = false;
  showResetPasswordForm: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginPopupComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private customValidator: CustomvalidationService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])]
    }, {
      validator: this.customValidator.MatchPassword('password', 'confirmPassword')
    });

    this.resetForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.customValidator.MatchPassword('newPassword', 'confirmPassword')
    });
  }

  // Getter pour utiliser dans le template (ex: resetFormControl['newPassword'])
  get resetFormControl() {
    return this.resetForm.controls;
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // 1. Init CSRF cookie
    this.authService.initCsrf().subscribe({
      next: () => {
        // 2. Login avec Laravel
        this.authService.login(email, password).subscribe({
          next: (user) => {
            if (user) {
              // Auth réussie, on ferme le modal et redirige selon rôle
              this.dialogRef.close();
              this.router.navigate([`/${user.role}/dashboard`]);
            } else {
              this.errorMessage = 'Identifiants invalides';
            }
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Adresse email ou mot de passe invalide';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du CSRF cookie', err);
        this.errorMessage = 'Erreur interne, merci de réessayer plus tard.';
        this.isLoading = false;
      }
    });
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

    dialogRef2.afterClosed().subscribe(() => {
      // Optionnel : actions après fermeture du registre
    });
  }

  openForgetPasswordDialog(): void {
    this.dialogRef.close();

    const dialogRef3 = this.dialog.open(ForgetPasswordComponent, {
      width: '400px',
      height: '500px'
    });

    dialogRef3.afterClosed().subscribe(() => {
      // Optionnel : actions après fermeture du reset
    });
  }
  onResetPassword() {
  this.submitted = true;

  if (this.resetForm.invalid) {
    return;
  }
}

  // Si tu utilises dans le template des méthodes comme onResetPassword,
  // pense à les définir ici pour éviter des erreurs similaires
}
