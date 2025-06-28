import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-email',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.css']
})
export class EditEmailComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  updateEmail(form: NgForm) {
    if (form.valid) {
      // Ici vous ajouterez votre logique pour mettre à jour l'email
      // Par exemple, appel à un service API
      console.log('Nouvel email:', this.email);

      // Simulation de succès
      this.message = 'Votre adresse email a été mise à jour avec succès !';
      this.error = '';

      // Réinitialiser le formulaire après la soumission
      form.resetForm();
    } else {
      this.error = 'Veuillez entrer une adresse email valide.';
      this.message = '';
    }
  }
}
