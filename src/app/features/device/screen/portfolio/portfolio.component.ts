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

  cards: any = [];
  cardIsClicked: boolean = false;
  activeCardID: number = 0;

  // For drag scrolling
  isDragging = false;
  startX!: number;
  scrollLeft!: number;

  // For drag physics
  lastMouseX!: number;
  velocityX = 0;
  velocityTracker: number[] = [];
  momentumAnimationId: number | null = null;
  lastTimestamp = 0;

  constructor(private ngZone: NgZone, private cardData: CardDataService) {
    this.cards = cardData.cardData;
  }

  ngAfterViewInit() {
    const scrollContainer = document.querySelector('.cards-wrapper');
    scrollContainer!.addEventListener('scroll', () => {
      this.activeCardID = this.getCardAtCenter();
    });
    this.initDragScroll();
  }

  initDragScroll() {
    const slider: any = document.querySelector('.cards-wrapper');

    // Check if this is a touch device
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      // Desktop only - custom physics
      slider.addEventListener('mousedown', this.startDragging.bind(this));
      slider.addEventListener('mousemove', this.drag.bind(this));
      slider.addEventListener('mouseup', this.stopDragging.bind(this));
      slider.addEventListener('mouseleave', this.stopDragging.bind(this));

      // Prevent default browser drag behavior on desktop
      slider.addEventListener('dragstart', (e: Event) => e.preventDefault());
    }

    // Touch events - let browser handle physics
    slider.addEventListener('touchstart', this.startDragging.bind(this));
    slider.addEventListener('touchmove', this.drag.bind(this));
    slider.addEventListener('touchend', this.stopDragging.bind(this));

    // Make the slider scrollable with -webkit-overflow-scrolling: touch for iOS
    slider.style.webkitOverflowScrolling = 'touch';
  }

  startDragging(e: any) {
    if (this.momentumAnimationId !== null) {
      cancelAnimationFrame(this.momentumAnimationId);
      this.momentumAnimationId = null;
    }

    this.isDragging = true;
    const slider: any = document.querySelector('.cards-wrapper');

    const isTouchEvent = e.type === 'touchstart';

    if (isTouchEvent) {
      this.startX = e.touches[0].pageX - slider.offsetLeft;
      this.lastMouseX = e.touches[0].pageX;
    } else {
      this.startX = e.pageX - slider.offsetLeft;
      this.lastMouseX = e.pageX;
    }

    this.scrollLeft = slider.scrollLeft;

    // Only initialize velocity tracking for desktop (non-touch) events
    if (!isTouchEvent) {
      this.velocityTracker = [];
      this.lastTimestamp = Date.now();
    }
  }

  drag(e: any) {
    if (!this.isDragging) return;

    const slider: any = document.querySelector('.cards-wrapper');
    let x;
    const isTouchEvent = e.type === 'touchmove';

    if (isTouchEvent) {
      x = e.touches[0].pageX - slider.offsetLeft;
      // For touch events, we don't track velocity - let the native system handle it
    } else {
      x = e.pageX - slider.offsetLeft;
      e.preventDefault();

      // Track velocity only for desktop events
      const now = Date.now();
      const dt = now - this.lastTimestamp;
      if (dt > 0) {
        const dx = e.pageX - this.lastMouseX;
        const velocity = dx / dt;

        // Store last 5 velocity samples
        this.velocityTracker.push(velocity);
        if (this.velocityTracker.length > 5) {
          this.velocityTracker.shift();
        }

        this.lastMouseX = e.pageX;
        this.lastTimestamp = now;
      }
    }

    const walk = (x - this.startX) * 1;
    slider.scrollLeft = this.scrollLeft - walk;
  }

  stopDragging() {
    if (!this.isDragging) return;

    this.isDragging = false;

    // Only apply momentum for mouse events (desktop), not touch events
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && this.velocityTracker.length > 0) {
      this.velocityX =
        this.velocityTracker.reduce((sum, v) => sum + v, 0) /
        this.velocityTracker.length;

      // Scale for better feel (multiplier can be adjusted)
      this.velocityX *= 15;

      // Apply momentum if velocity is significant
      if (Math.abs(this.velocityX) > 0.5) {
        this.applyMomentum();
      } else {
        // If velocity is too small, just update active card ID
        this.activeCardID = this.getCardAtCenter();
      }
    } else {
      // For touch devices, just update the active card ID
      this.activeCardID = this.getCardAtCenter();
    }
  }

  applyMomentum() {
    // Using NgZone.runOutsideAngular for better performance
    this.ngZone.runOutsideAngular(() => {
      const slider: any = document.querySelector('.cards-wrapper');
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

        // Apply friction (can be adjusted for different physics feel)
        const friction = 0.95;
        this.velocityX *= friction;

        // Apply velocity to scroll position
        slider.scrollLeft -= (this.velocityX * elapsed) / 30;

        this.momentumAnimationId = requestAnimationFrame(animate);
      };

      this.momentumAnimationId = requestAnimationFrame(animate);
    });
  }

  snapToActiveCard() {
    const activeCard = document.querySelector('.isActive');
    const scrollContainer = document.querySelector('.cards-wrapper');

    if (activeCard && scrollContainer) {
      const containerRect = document
        .querySelector('.portfolio-section')!
        .getBoundingClientRect();
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
  }

  moveCardToCenter(direction: string) {
    // Cancel any ongoing momentum animation
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

    // Smoothly scroll to the selected card
    setTimeout(() => {
      const activeCard = document.querySelector('.isActive');
      const scrollContainer = document.querySelector('.cards-wrapper');

      if (activeCard && scrollContainer) {
        const containerRect = document
          .querySelector('.portfolio-section')!
          .getBoundingClientRect();
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
    const scrollContainer = document.querySelector('.cards-wrapper');
    const containerRect = scrollContainer!.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

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
