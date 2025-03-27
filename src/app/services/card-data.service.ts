import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardDataService {
  cardData: any = [
    {
      title: 'Catnip - 2D Javascript Game',
      software: ['JS', 'HTML', 'Pixaki'],
      skills: ['Design', 'Code'],
      links: ['www.catnip.davidberan.com'],
      background: '/videos/catnip.mp4',
      description:
        'personal project to practice using classes and working with the canvas context in javascript.',
    },
    {
      title: 'Join - Project Management Tool',
      software: ['JS', 'HTML', 'CSS'],
      skills: ['Code'],
      links: ['string'],
      background: 'videos/join.mp4',
      description: 'A Kanban project management tool.',
    },
    {
      title: 'CSS shadow generator',
      software: ['JS', 'HTML', 'CSS'],
      skills: ['Design'],
      links: ['string'],
      background: 'videos/niceshadow.mp4',
      description:
        'A CSS shadow generator with which it is very simple to generate realistic shadows directly as CSS code.',
    },
    {
      title: 'Portfolio',
      software: ['Angular', 'HTML', 'TS', 'SCSS'],
      skills: ['Code', 'Design'],
      links: ['string'],
      background: 'videos/portfolio.mp4',
      description: '',
    },
  ];
}
