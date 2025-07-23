

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-enseignant-ag-tab',
  templateUrl: './enseignant-ag-tab.component.html',
  styleUrls: ['./enseignant-ag-tab.component.css']
})
export class EnseignantAgTabComponent implements OnInit {
  columnDefs: ColDef[] = [
    { headerName: 'SN', field: 'id', sortable: true, filter: true, flex: 1 },
    { headerName: 'Title', field: 'titre_projet', sortable: true, filter: true, flex: 4 },
    { headerName: 'Author', field: 'nom_utilisateur', sortable: true, filter: true },
    { headerName: 'Image', field: 'image', sortable: true, filter: true, cellRenderer: this.imageCellRenderer.bind(this) },
    { headerName: 'Status', field: 'status', sortable: true, cellRenderer: this.statusCellRenderer.bind(this) },
    { headerName: 'Action', field: 'action', filter: true, cellRenderer: this.actionCellRenderer.bind(this) }
  ];

  rowData: any[] = [];

  constructor(private router: Router, private projetService: ProjetService) {}

  ngOnInit() {
    // Charger uniquement les projets supervisés par l'enseignant
    const email = localStorage.getItem('email');
    if (email) {
      this.projetService.getSupervisedProjectsByEmail(email).subscribe(projets => {
        this.rowData = projets;
      });
    }
  }

  getFullImageUrl(projectImage: string): string {
    if (!projectImage) {
      return '';
    }
    return projectImage.startsWith('http') ? projectImage : `http://localhost:8000/${projectImage.replace(/^\/+/, '')}`;
  }

  imageCellRenderer(params: any) {
    const imageUrl = this.getFullImageUrl(params.value);
    return `<img src="${imageUrl}" alt="image" class="img-fluid" style="max-width: 100px; max-height: 100px;">`;
  }

  statusCellRenderer(params: any) {
    const statusClass = params.value === 'Approved' ? 'bg-success' :
                       params.value === 'Pending' ? 'bg-warning' :
                       'bg-danger';
    return `<span class="badge ${statusClass}">${params.value}</span>`;
  }

  actionCellRenderer(params: any) {
    // Seule la vue détail est proposée pour l'enseignant
    return `
      <i class="view-button fas fa-eye text-primary" style="border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; background-color: #f6f6fe; cursor: pointer;"></i>
    `;
  }

  showDetail(params: any) {
    const projectId = params.data.id;
    const queryParams = {
      title: params.data.titre_projet,
      status: params.data.status,
      image: params.data.image,
      description: params.data.descript_projet,
      views: params.data.views,
      author: params.data.nom_utilisateur,
      category: params.data.nom_categorie,
      level: params.data.niveau,
      type: params.data.type,
      date: params.data.created_at,
      email: params.data.email,
      id: params.data.id,
    };
    this.router.navigate(['/enseignant/dashboard/project-detail', projectId], { queryParams });
  }

  onGridReady(params: any) {
    params.api.addEventListener('cellClicked', (event: any) => {
      if (event.colDef.field === 'action' && event.event.target.classList.contains('view-button')) {
        this.showDetail(event);
      }
    });
  }
}
