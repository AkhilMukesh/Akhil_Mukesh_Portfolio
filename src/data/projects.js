/**
 * Project list — a mix of professional enterprise work and personal AI
 * projects. Each project carries a `category` ('AI' | 'Enterprise') so the
 * Projects section can filter between full-stack/enterprise work and AI work.
 */
const projects = [
  // === Personal Projects ===
  {
    title: 'Flappy Bird',
    description:
      'A browser-based Flappy Bird game featuring responsive gameplay, real-time score tracking, collision detection, animated obstacles, and a restart system. Built to recreate the classic arcade experience with smooth controls and a lightweight interactive UI.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/AkhilMukesh/Flappy-Bird',
    featured: true,
    category: 'Web',
    hasInteractiveDemo: false,
  },
  {
  title: 'Secret Image Sharing — SIS',

  description:
    'A secure image-sharing project that uses pixel-level encryption to protect image data before sharing. Implements image encryption and decryption techniques to securely transform visual information while preserving the ability to reconstruct the original image.',

  tech: ['MATLAB', 'Image Processing', 'Encryption', 'Pixel Manipulation'],

  github:
    'https://github.com/AkhilMukesh/Secret-Image-Sharing-SIS-Based-on-Encrypted-Pixels',

  featured: false,

  category: 'Security',

  hasInteractiveDemo: false,
},
  {
  title: 'Google App Rating Analysis',

  description:
    'A data analysis project exploring Google Play Store app ratings and characteristics using real-world app data. Performs data cleaning, exploratory analysis, and visualization to identify rating patterns, app trends, and factors associated with app performance.',

  tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Jupyter Notebook'],

  github:
    'https://github.com/AkhilMukesh/Google-App-Rating-Analysis',

  featured: false,

  category: 'Data Analytics',

  hasInteractiveDemo: false,
},
  
];

export default projects;
