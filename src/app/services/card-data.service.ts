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
      links: [
        'http://catnip.davidberan.com/',
        'https://github.com/daberan/catnipgame',
      ],
      background: '/videos/catnip.mp4',
      description:
        'personal project to practice using classes and working with the canvas context in javascript.',
    },
    {
      title: 'Join - Project Management Tool',
      software: ['JS', 'HTML', 'CSS'],
      skills: ['Code'],
      links: [
        'https://join.davidberan.com',
        'https://github.com/daberan/join-project',
      ],
      background: 'videos/join.mp4',
      description: 'A Kanban project management tool.',
    },
    {
      title: 'CSS shadow generator',
      software: ['JS', 'HTML', 'CSS'],
      skills: ['Design'],
      links: [
        'https://niceshadows.com',
        'https://github.com/daberan/niceshadows',
      ],
      background: 'videos/niceshadow.mp4',
      description:
        'A CSS shadow generator to generate realistic shadows directly as CSS code.',
    },
    {
      title: 'Portfolio',
      software: ['Angular', 'HTML', 'TS', 'SCSS'],
      skills: ['Code', 'Design'],
      links: [
        'https://dev.davidberan.com',
        'https://github.com/daberan/portfolio3',
      ],
      background: 'videos/portfolio.mp4',
      description: 'Frontend developer portfolio',
    },
  ];
}
