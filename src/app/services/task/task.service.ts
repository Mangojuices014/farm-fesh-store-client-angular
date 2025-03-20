import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Task } from "../../model/Task";
import { apiUrl } from "../../utils/api.config";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8182/api/v1/process/task";
  private BASE_URL = apiUrl.BASE_URL + '/process';

  // Lấy token từ LocalStorage (hoặc nơi bạn lưu token)
  private getToken(): string {
    return localStorage.getItem("token") || "";  // Lấy token từ LocalStorage
  }

  // Headers với Token
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.getToken()}`  // Thêm Bearer Token vào headers
    });
  }

  /**
   * Get tasks with taskDefinitionKey=Complete_Order
   */
  getCompletionTasks(): Observable<Task[]> {
    const url = `${this.apiUrl}/order`;
    return this.http.get<Task[]>(url, { headers: this.getHeaders() });
  }

  /**
   * Approve a task by completing it
   */
  approveTask(taskId: string): Observable<any> {
    const url = `${this.BASE_URL}/order/approval/${taskId}`;
    const payload = {
      variables: {
        approved: { value: true, type: "Boolean" },
      },
    };
    return this.http.post(url, payload, { headers: this.getHeaders() });
  }

  /**
   * Reject a task by completing it with rejection flag
   */
  rejectTask(taskId: string): Observable<any> {
    const url = `${this.BASE_URL}/order/approval/${taskId}`;
    const payload = {
      variables: {
        approved: { value: false, type: "Boolean" },
      },
    };
    return this.http.post(url, payload, { headers: this.getHeaders() });
  }
}
