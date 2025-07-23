import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() projectId!: number;
  comments: any[] = [];
  newComment = '';
  replyContent = '';
  replyingTo: number | null = null;
  editingCommentId: number | null = null;
  editContent = '';
  currentUser: any = null;

  constructor(private commentsService: CommentsService) {}

  ngOnInit() {
    // Simule l'utilisateur courant (à remplacer par l'auth réelle)
    this.currentUser = {
      id: localStorage.getItem('id'),
      name: localStorage.getItem('name'),
      avatar: 'assets/img/default-avatar.png'
    };
    this.loadComments();
  }

  loadComments() {
    this.commentsService.getComments(this.projectId).subscribe((data: any) => this.comments = data);
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentsService.postComment(this.projectId, this.newComment).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }

  // Répondre à un commentaire
  startReply(comment: any) {
    this.replyingTo = comment.id;
    this.replyContent = '';
    this.editingCommentId = null;
  }
  cancelReply() {
    this.replyingTo = null;
    this.replyContent = '';
  }
  sendReply(parent: any) {
    if (!this.replyContent.trim()) return;
    this.commentsService.replyToComment(parent.id, this.replyContent).subscribe(() => {
      this.cancelReply();
      this.loadComments();
    });
  }

  // Éditer un commentaire
  startEdit(comment: any) {
    this.editingCommentId = comment.id;
    this.editContent = comment.content;
    this.replyingTo = null;
  }
  cancelEdit() {
    this.editingCommentId = null;
    this.editContent = '';
  }
  saveEdit(comment: any) {
    if (!this.editContent.trim()) return;
    this.commentsService.updateComment(comment.id, this.editContent).subscribe(() => {
      this.cancelEdit();
      this.loadComments();
    });
  }

  // Supprimer un commentaire ou une réponse
  deleteComment(comment: any) {
    if (!confirm('Supprimer ce commentaire ?')) return;
    this.commentsService.deleteComment(comment.id).subscribe(() => {
      this.loadComments();
    });
  }

  // Vérifie si l'utilisateur courant est le propriétaire du commentaire
  isOwner(comment: any): boolean {
    return this.currentUser && comment.user && (comment.user.id == this.currentUser.id);
  }
}