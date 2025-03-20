import { Component, inject, signal } from '@angular/core';
import { TaskService } from "../../services/task/task.service";
import { Router } from "@angular/router";
import { Task } from "../../model/Task";
import { SidebarComponent } from "../../page/sidebar/sidebar.component";
import { HeaderComponent } from "../../page/header/header.component";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private router = inject(Router);

  isAdmin = signal<boolean>(false);
  tasks = signal<Task[]>([]);
  isLoading = signal<boolean>(true);
  loadingTaskId = signal<string | null>(null); // ID của task đang xử lý
  error = signal<string | null>(null);

  constructor() {
    this.checkAdminRole();
  }

  checkAdminRole(): void {
    const role = localStorage.getItem("role");
    this.isAdmin.set(role === "admin");
  }

  ngOnInit(): void {
    if (!this.isAdmin()) return;
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.taskService.getCompletionTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading tasks", err);
        this.error.set("Failed to load tasks. Please try again later.");
        this.isLoading.set(false);
      },
    });
  }

  approveTask(taskId: string): void {
    this.loadingTaskId.set(taskId); // Hiện loading

    this.taskService.approveTask(taskId).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
        this.loadingTaskId.set(null); // Ẩn loading khi xong
      },
      error: (err) => {
        console.error("Error approving task", err);
        this.error.set("Failed to approve task. Please try again.");
        this.loadingTaskId.set(null);
      },
    });
  }

  rejectTask(taskId: string): void {
    this.loadingTaskId.set(taskId); // Hiện loading

    this.taskService.rejectTask(taskId).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
        this.loadingTaskId.set(null); // Ẩn loading khi xong
      },
      error: (err) => {
        console.error("Error rejecting task", err);
        this.error.set("Failed to reject task. Please try again.");
        this.loadingTaskId.set(null);
      },
    });
  }
}
