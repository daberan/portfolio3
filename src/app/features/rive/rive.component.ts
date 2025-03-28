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

  constructor() {}

  ngOnInit(): void {
    window.addEventListener('resize', this.updateCanvasCenter);
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

        window.addEventListener('mousemove', this.updateMousePosition);
      },
    });
  }

  private updateCanvasCenter = () => {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.rive?.resizeDrawingSurfaceToCanvas();

    this.canvasCenterX = rect.left + rect.width / 2;
    this.canvasCenterY = rect.top + rect.height / 2;
  };

  private updateMousePosition = (e: MouseEvent) => {
    if (!this.xInput || !this.yInput) return;

    let xMapped =
      50 + ((e.clientX - this.canvasCenterX) / window.innerWidth) * 50 * 2;

    let yMapped =
      50 - ((e.clientY - this.canvasCenterY) / window.innerHeight) * 50 * 2;

    this.xInput.value = Math.max(0, Math.min(100, xMapped));
    this.yInput.value = Math.max(0, Math.min(100, yMapped));
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateCanvasCenter);
    window.removeEventListener('mousemove', this.updateMousePosition);
    if (this.rive) {
      this.rive.cleanup();
    }
  }
}
