import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Rive } from '@rive-app/canvas';

@Component({
  selector: 'app-rive',
  templateUrl: './rive.component.html',
  styleUrl: './rive.component.scss',
})
export class RiveComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private rive?: Rive;
  private canvasCenterX: number = 0;
  private canvasCenterY: number = 0;
  private xInput: any;
  private yInput: any;
  private isMobile: boolean = false;

  private defaultXValue: number = 100;
  private defaultYValue: number = 70;

  constructor() {
    this.detectMobileDevice();
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.handleResize);
  }

  ngAfterViewInit() {
    this.updateCanvasCenter();

    const canvas = this.canvasRef.nativeElement;
    this.rive = new Rive({
      src: '/rive/face.riv',
      canvas: canvas,
      autoplay: true,
      stateMachines: 'lookAround',
      onLoad: () => {
        this.rive!.resizeDrawingSurfaceToCanvas();

        const inputs = this.rive!.stateMachineInputs('lookAround');
        this.xInput = inputs.find((input) => input.name === 'xAxis');
        this.yInput = inputs.find((input) => input.name === 'yAxis');

        if (!this.isMobile) {
          window.addEventListener('mousemove', this.updateMousePosition);
        } else {
          this.setDefaultValues();
        }
      },
    });
  }

  private detectMobileDevice(): void {
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
  }

  private setDefaultValues(): void {
    if (this.xInput && this.yInput) {
      this.xInput.value = this.defaultXValue;
      this.yInput.value = this.defaultYValue;
    }
  }

  private handleResize = () => {
    this.updateCanvasCenter();
    this.detectMobileDevice();

    if (this.isMobile) {
      window.removeEventListener('mousemove', this.updateMousePosition);
      this.setDefaultValues();
    } else if (this.xInput && this.yInput) {
      window.removeEventListener('mousemove', this.updateMousePosition);
      window.addEventListener('mousemove', this.updateMousePosition);
    }
  };

  private updateCanvasCenter = () => {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.rive?.resizeDrawingSurfaceToCanvas();

    this.canvasCenterX = rect.left + rect.width / 2;
    this.canvasCenterY = rect.top + rect.height / 2;
  };

  private updateMousePosition = (e: MouseEvent) => {
    if (!this.xInput || !this.yInput || this.isMobile) return;

    let xMapped =
      50 + ((e.clientX - this.canvasCenterX) / window.innerWidth) * 50 * 2;

    let yMapped =
      50 - ((e.clientY - this.canvasCenterY) / window.innerHeight) * 50 * 2;

    this.xInput.value = Math.max(0, Math.min(100, xMapped));
    this.yInput.value = Math.max(0, Math.min(100, yMapped));
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.updateMousePosition);
    if (this.rive) {
      this.rive.cleanup();
    }
  }
}
