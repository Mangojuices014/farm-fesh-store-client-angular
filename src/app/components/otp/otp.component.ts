import {Component, type ElementRef, inject, type OnInit, type QueryList, ViewChild, ViewChildren} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import { SceneEnvironment } from '../../../assets/scripts/SceneEnvironment.js';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-otp",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OTPComponent implements OnInit {
  @ViewChildren("otpInput") otpInputs!: QueryList<ElementRef>
  otpValues: string[] = ["", "", "", "", "", ""]
  isButtonActive = false

  @ViewChild('container') containerRef!: ElementRef; // Tham chiếu đến div container
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;

  authService = inject(AuthService)
  router = inject(Router)
  toastHeading = ""; toastDescription = ""; toastVisible = false;


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

    // this.scene.background = new THREE.Color("#ffa80d");
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

  ngOnInit(): void {
    // Focus the first input on component initialization
    setTimeout(() => {
      if (this.otpInputs.first) {
        this.otpInputs.first.nativeElement.focus()
      }
    }, 0)
  }

  onKeyUp(event: KeyboardEvent, index: number): void {
    const currentInput = this.otpInputs.get(index)?.nativeElement
    const nextInput = this.otpInputs.get(index + 1)?.nativeElement
    const prevInput = this.otpInputs.get(index - 1)?.nativeElement

    // If the value has more than one character, clear it
    if (currentInput.value.length > 1) {
      currentInput.value = ""
      this.otpValues[index] = ""
      return
    }

    // If the next input exists and the current value is not empty
    if (nextInput && currentInput.value !== "") {
      nextInput.disabled = false
      nextInput.focus()
    }

    // If the backspace key is pressed
    if (event.key === "Backspace") {
      this.otpInputs.forEach((input, i) => {
        if (index <= i && prevInput) {
          input.nativeElement.disabled = true
          input.nativeElement.value = ""
          this.otpValues[i] = ""
          prevInput.focus()
        }
      })
    }

    // Check if the fourth input is filled to activate the button
    // Note: In the original code it was checking the 4th input (index 3)
    // but we'll check if all inputs are filled
    this.checkButtonActivation()
  }

  checkButtonActivation(): void {
    // Check if all inputs are filled
    this.isButtonActive = this.otpValues.every((value) => value !== "")
  }

  verifyOTP(): void {
    if (!this.isButtonActive) return;

    const otp = this.otpValues.join("").trim();
    if (!otp || otp.length !== 6) { // Giả sử OTP có 6 số
      alert("Vui lòng nhập OTP hợp lệ!");
      return;
    }
    this.authService.verifyOtp(otp).subscribe({
      next: () => {
        localStorage.removeItem("otpEmail");
        this.generateToast('Thành công', 'Xác thực thành công')
        this.router.navigate(["/login"]);
      },
      error: err => {
        this.generateToast('Thành công', err.message)
      }
    });
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
