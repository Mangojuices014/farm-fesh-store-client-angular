import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { FormsModule, NgForm } from "@angular/forms";
import { ToastComponent } from "../toast/toast.component";
import { JwtHelperService } from "@auth0/angular-jwt";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import { SceneEnvironment } from '../../assets/scripts/SceneEnvironment.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements AfterViewInit {
  accountService = inject(AuthService);
  router = inject(Router);
  private jwtHelper = new JwtHelperService();
  toastHeading = ""; toastDescription = ""; toastVisible = false;

  @ViewChild('container') containerRef!: ElementRef; // Tham chiếu đến div container
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;

  ngAfterViewInit(): void {
    this.initThreeJS();
  }

  initThreeJS() {
    const container = this.containerRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(35, width / height, 1, 2000);
    this.camera.position.set(0, 400, 800);

    this.scene = new THREE.Scene();

    const loader = new GLTFLoader().setPath('./assets/models/');
    loader.load('orange_fruit.glb', (gltf) => {
      for (let i = 0; i < 30; i++) {
        const orange = gltf.scene.clone();
        const side = i % 2 === 0 ? -1 : 1; // Chia đều trái cam về 2 bên
        orange.position.set(
          side * (300 + Math.random() * 300), // Giữ cam ở hai bên, không ở giữa
          Math.random() * 300,
          (Math.random() - 0.5) * 600
        );
        orange.rotation.y = Math.random() * Math.PI;
        orange.scale.setScalar(1 + Math.random());
        this.scene.add(orange);
      }
    });

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setAnimationLoop(this.animate.bind(this)); // Bind 'this'
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    container.appendChild(this.renderer.domElement);

    const environment = new SceneEnvironment(this.renderer);
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);

    this.scene.background = new THREE.Color("#ffa80d");
    this.scene.environment = pmremGenerator.fromScene(environment).texture;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.minDistance = 200;
    this.controls.maxDistance = 1000;
    this.controls.target.set(0, 150, 0);
    this.controls.update();

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.scene.rotation.y += 0.002;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }


  onLogin(form: NgForm) {
    if (form.valid) {
      this.accountService.loginAccount(form.value).subscribe({
        next: res => {
          const response = res as any;
          if (response?.data?.access_token) {
            localStorage.setItem("token", response.data.access_token);
            const decodedToken = this.jwtHelper.decodeToken(
              response.data.access_token
            )
            const roles = decodedToken?.realm_access?.roles || [];

            if (roles.includes("ADMIN")) {
              localStorage.setItem("role", "admin");
              this.router.navigate(["/user"]);
            } else {
              localStorage.setItem("role", "user");
              this.router.navigate(["/home"]);
            }
            this.router.navigate(["/profile"]); // Chuyển hướng khi đăng nhập thành công
            form.reset();
          } else {
            this.generateToast("Thất bại", "Không tìm thấy token trong phản hồi.");
          }
        },
        error: err => {
          const errorMessage = err?.error?.message
          this.generateToast("Thất bại", errorMessage);
        }
      })
    }
  }

  generateToast(heading: string, description: string) {
    this.toastHeading = heading;
    this.toastDescription = description;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 5000);

  }
}
