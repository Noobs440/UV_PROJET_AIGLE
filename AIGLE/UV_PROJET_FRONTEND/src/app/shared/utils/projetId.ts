
export function getProjectId(project: any): number | undefined {
  return (
    project?.id ??
    project?.Id ??
    project?.ID ??
    project?.projetId ??
    project?.projetID ??
    project?.projet_id ??
    project?.id_projet ??
    project?.idProjet ??
    project?.ID_PROJET ??
    project?.IDProjet ??
    project?.ID_Projet ??
    project?.projet_id_projet ??
    project?.idProjetFinal ??
    project?.id_projet_final ??
    project?.id_projetFinal ??
    project?.projetIDFinal ??
    project?.projet_id_final ??
    project?.projetID_final
  );
}