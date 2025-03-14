import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { ToastComponent } from "../toast/toast.component";
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from "../services/auth/auth.service";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import { SceneEnvironment } from '../../assets/scripts/SceneEnvironment.js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ToastComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements AfterViewInit {
  accountService = inject(AuthService);
  router = inject(Router)
  toastHeading = ""; toastDescription = ""; toastVisible = false;

  @ViewChild('container') containerRef!: ElementRef;
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
        const side = i % 2 === 0 ? -1 : 1;
        orange.position.set(
          side * (300 + Math.random() * 300),
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
    this.renderer.setAnimationLoop(this.animate.bind(this));
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.accountService.createAccount(form.value).subscribe({
        next: res => {
          this.generateToast("Thành công", "Đăng ký thành công");
          localStorage.setItem('otpEmail', form.value.email);
          form.reset();
          this.router.navigate(['/otp']); // Điều hướng đến trang nhập OTP
        },
        error: err => {
          const errorMessage = err?.error?.message
          this.generateToast("Thất bại", errorMessage);
        }
      });
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
