'use client';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tour.css'; // Import custom styles

export const useTour = () => {
  const driverObj = driver({
    showProgress: true,
    overlayColor: '#0f172a',
    steps: [
      {
        element: 'body',
        popover: {
          title: 'Welcome to Million!',
          description: "Let's take a quick tour of the main features.",
          side: 'left',
        },
      },
      {
        element: '#hero-section',
        popover: {
          title: 'Featured Property',
          description: 'This is our highlighted property. You can click on it to see more details.',
          side: 'bottom',
        },
      },
      {
        element: '#filter-bar',
        popover: {
          title: 'Find Your Perfect Home',
          description: 'Use these filters to search by name, address, or price range.',
          side: 'bottom',
        },
      },
      {
        element: '#property-list > div:first-child',
        popover: {
          title: 'Property Listings',
          description:
            'Here you will find the list of available properties. Each card shows a preview and the owner.',
          side: 'top',
        },
      },
      {
        element: '#create-property-btn',
        popover: {
          title: 'Add a New Property',
          description: 'Click here to open a form and add a new property to our catalog.',
          side: 'left',
        },
      },
      {
        element: '#create-owner-btn',
        popover: {
          title: 'Manage Owners',
          description:
            'You can create new property owners here before listing a new property.',
          side: 'left',
        },
      },
      {
        element: '#footer',
        popover: {
          title: 'More Information',
          description: 'Find additional links and contact information in the footer.',
          side: 'top',
        },
      },
      {
        element: 'body',
        popover: {
          title: 'Enjoy Your Visit!',
          description:
            'You have completed the tour. Feel free to explore the site on your own.',
        },
      },
    ],
  });

  const startTour = () => {
    driverObj.drive();
  };

  return { startTour };
};
