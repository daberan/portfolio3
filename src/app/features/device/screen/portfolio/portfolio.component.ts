import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { CardComponent } from './card/card.component';
import { CardDataService } from '../../../../services/card-data.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements AfterViewInit {
  @ViewChild('cardsWrapper') cardsWrapper!: ElementRef;
  fadeIn = true;

  cards: any = [];
  cardIsClicked: boolean = false;
  activeCardID: number = 0;

  isDragging = false;
  startX!: number;
  scrollLeft!: number;

  lastMouseX!: number;
  velocityX = 0;
  velocityTracker: number[] = [];
  momentumAnimationId: number | null = null;
  lastTimestamp = 0;
  videoElements: HTMLCollectionOf<Element> =
    document.getElementsByClassName('background-video');

  constructor(private ngZone: NgZone, private cardData: CardDataService) {
    this.cards = cardData.cardData;
  }

  async handleVideoPlay() {
    let index = -1;
    const videoPromises = Array.from(this.videoElements).map(
      async (element) => {
        index += 1;
        const video = element as HTMLVideoElement;

        if (index === this.activeCardID) {
          try {
            await video.play();
          } catch (error) {}
        } else {
          video.pause();
        }
      }
    );
    await Promise.all(videoPromises);
  }

  ngAfterViewInit() {
    this.fadeIn = true;
    setTimeout(() => {
      this.fadeIn = false;
    }, 700);
    const scrollContainer = this.cardsWrapper.nativeElement;
    scrollContainer.addEventListener('scroll', () => {
      this.activeCardID = this.getCardAtCenter();
      this.handleVideoPlay();
    });

    this.initDragScroll();
    this.handleVideoPlay();
  }

  initDragScroll() {
    const slider = this.cardsWrapper.nativeElement;
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      slider.addEventListener('mousedown', this.startDragging.bind(this));
      slider.addEventListener('mousemove', this.drag.bind(this));
      slider.addEventListener('mouseup', this.stopDragging.bind(this));
      slider.addEventListener('mouseleave', this.stopDragging.bind(this));
      slider.addEventListener('dragstart', (e: Event) => e.preventDefault());
    } else {
      slider.addEventListener('touchend', () => {
        setTimeout(() => {
          this.activeCardID = this.getCardAtCenter();
        }, 100);
      });
    }

    slider.style.webkitOverflowScrolling = 'touch';
  }

  startDragging(e: any) {
    if (e.type === 'touchstart') {
      return;
    }

    if (this.momentumAnimationId !== null) {
      cancelAnimationFrame(this.momentumAnimationId);
      this.momentumAnimationId = null;
    }

    this.isDragging = true;
    const slider = this.cardsWrapper.nativeElement;

    this.startX = e.pageX - slider.offsetLeft;
    this.lastMouseX = e.pageX;
    this.scrollLeft = slider.scrollLeft;

    this.velocityTracker = [];
    this.lastTimestamp = Date.now();
  }

  drag(e: any) {
    if (e.type === 'touchmove') {
      return;
    }
    if (!this.isDragging) return;

    const slider = this.cardsWrapper.nativeElement;
    const x = e.pageX - slider.offsetLeft;
    e.preventDefault();

    const now = Date.now();
    const dt = now - this.lastTimestamp;
    if (dt > 0) {
      const dx = e.pageX - this.lastMouseX;
      const velocity = dx / dt;

      this.velocityTracker.push(velocity);
      if (this.velocityTracker.length > 5) {
        this.velocityTracker.shift();
      }
      this.lastMouseX = e.pageX;
      this.lastTimestamp = now;
    }

    const walk = (x - this.startX) * 1;
    slider.scrollLeft = this.scrollLeft - walk;
  }

  stopDragging(e: any) {
    if (e && e.type && e.type.startsWith('touch')) {
      return;
    }
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.velocityTracker.length > 0) {
      this.velocityX =
        this.velocityTracker.reduce((sum, v) => sum + v, 0) /
        this.velocityTracker.length;

      this.velocityX *= 15;
      if (Math.abs(this.velocityX) > 0.5) {
        this.applyMomentum();
      } else {
        this.activeCardID = this.getCardAtCenter();
      }
    } else {
      this.activeCardID = this.getCardAtCenter();
    }
  }

  applyMomentum() {
    this.ngZone.runOutsideAngular(() => {
      const slider = this.cardsWrapper.nativeElement;
      let lastTimestamp = performance.now();
      const animate = (timestamp: number) => {
        if (Math.abs(this.velocityX) < 0.1) {
          this.ngZone.run(() => {
            this.activeCardID = this.getCardAtCenter();
          });
          return;
        }
        const elapsed = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        const friction = 0.95;
        this.velocityX *= friction;
        slider.scrollLeft -= (this.velocityX * elapsed) / 30;
        this.momentumAnimationId = requestAnimationFrame(animate);
      };
      this.momentumAnimationId = requestAnimationFrame(animate);
    });
  }

  moveCardToCenter(direction: string) {
    if (this.momentumAnimationId !== null) {
      cancelAnimationFrame(this.momentumAnimationId);
      this.momentumAnimationId = null;
    }

    if (direction === 'left' && this.activeCardID > 0) {
      this.activeCardID -= 1;
    } else if (
      direction === 'right' &&
      this.activeCardID < this.cards.length - 1
    ) {
      this.activeCardID += 1;
    }

    setTimeout(() => {
      const activeCard = document.querySelector('.isActive');
      const scrollContainer = this.cardsWrapper.nativeElement;

      if (activeCard && scrollContainer) {
        const portfolioSection = document.querySelector('.portfolio-section');

        const containerRect = portfolioSection!.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        const cardRect = activeCard.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;

        const scrollAdjustment = cardCenter - containerCenter;
        const targetScrollLeft = scrollContainer.scrollLeft + scrollAdjustment;

        scrollContainer.scroll({
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      }
    }, 0);
  }

  getCardAtCenter(): number {
    const scrollContainer = this.cardsWrapper.nativeElement;

    if (!scrollContainer) {
      console.error('Cards wrapper not found');
      return 0;
    }

    const containerRect = scrollContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const portfolioSection = document.querySelector('.portfolio-section');
    if (!portfolioSection) {
      console.error('Portfolio section not found');
      return 0;
    }

    const cards = document.querySelectorAll('app-card');
    let closestCardId = 0;
    let minDistance = Number.MAX_VALUE;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCardId = index;
      }
    });

    return closestCardId;
  }
}
