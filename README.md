# Animated Skills & Progress Dashboard

A production-quality, highly interactive skills dashboard built with Vanilla HTML5, CSS3, and JavaScript. This project was developed to fulfill the Day 29 Web Development Internship Task, focusing on smooth CSS animations, scroll detection, and modern UI/UX principles.

🔗 Live Demo: https://vishal-maddheshiya.github.io/Animated-Skills-Progress-Dashboard/
💻 GitHub Repo: https://github.com/VISHAL-MADDHESHIYA/Animated-Skills-Progress-Dashboard/

## 🚀 Features

- **Premium Dark/Light Theme**: Glassmorphism design with smooth theme transitions.
- **Scroll-Triggered Animations**: Uses `IntersectionObserver` to animate progress bars when they enter the viewport.
- **Configurable Data**: Skill percentages are driven entirely by HTML `data-progress` attributes.
- **Dynamic Dashboard Summary**: Automatically calculates and animates the total number of skills and average proficiency.
- **Filtering System**: Filter skills by All, Frontend, Tools, and Design. Includes an empty state.
- **Replay Button**: Resets and replays all animations without refreshing the page.
- **Back to Top**: Smooth scrolling back to the top of the page.
- **Fully Responsive**: Mobile-first approach supporting all screen sizes.
- **Accessible**: ARIA attributes, keyboard navigation support, and `prefers-reduced-motion` fallbacks.

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and data attributes.
- **CSS3**: Custom properties (variables), Flexbox, Grid, Glassmorphism, and CSS transitions.
- **Vanilla JavaScript**: DOM manipulation, IntersectionObserver API, and `requestAnimationFrame` for counters.
- **No external libraries or frameworks** were used.

## 📁 Folder Structure

```text
animated-skills-dashboard/
│
├── index.html      # Main HTML structure
├── style.css       # Styling, theming, and animations
├── script.js       # Logic, observers, and interactions
└── README.md       # Project documentation