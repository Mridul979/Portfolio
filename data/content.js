// All the text on the site lives here — edit this file to update your portfolio.

export const profile = {
  name: 'Mridul Sharma',
  shortName: 'Mridul.',
  role: 'B.Tech CSE · Cyber Security',
  status: 'Open to research internships',
  email: 'mridulsharma979@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mridul-sharma-2744112a5',
  linkedinHandle: 'mridul-sharma',
  location: 'Jammu, J&K, India',
};

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#certifications', label: 'Certifications' },
];

export const marquee = [
  'Network Security', 'Python', 'IoT & ESP32', 'Machine Learning',
  'Kali Linux', 'React.js', 'OSINT', 'Wireshark',
];

// The About paragraph. Segments with `mark: true` get the lime highlight.
export const aboutText = [
  { text: "I'm a Cyber Security undergraduate who enjoys pulling systems apart to understand how they break — and then building them back stronger. From port scanners and packet captures to sensor networks and deep‑learning models, I like working where " },
  { text: 'software meets the real world', mark: true },
  { text: ". NCC training taught me to lead, plan and stay calm under pressure — and I bring that same discipline to security research." },
];

export const stats = [
  { value: 4, suffix: '+', label: 'Hands-on projects shipped' },
  { value: 50, suffix: '+', label: 'NCC cadets led as JUO' },
  { value: 5, suffix: '', label: 'Certifications & courses' },
  { value: 2027, suffix: '', label: 'Expected graduation' },
];

export const education = {
  school: 'Central University of Jammu',
  degree: 'B.Tech — Computer Science & Engineering (Cyber Security) · DSA, Computer Networks, OS, DBMS, OOPS, IoT Systems, AI/ML, Data Science',
  years: '2023 — 2027',
};

// `visual` picks one of the animated illustrations in data/visuals.js
export const projects = [
  {
    no: '01',
    title: 'Network Vulnerability Scanner',
    tag: 'Python / Cyber Security',
    visual: 0,
    bullets: [
      'Developed a Python-based tool to scan open ports and identify potential vulnerabilities on target systems.',
      'Integrated socket programming with basic reconnaissance techniques to enumerate live hosts and services.',
      'Simulated a real-world penetration-testing reconnaissance workflow to assess network exposure.',
    ],
    chips: ['Python', 'Sockets', 'Recon', 'Network Protocols'],
  },
  {
    no: '02',
    title: 'Web Development Intern — Uvin',
    tag: 'Internship',
    visual: 1,
    bullets: [
      'Built and maintained responsive web applications using HTML, JavaScript, React.js and Node.js.',
      'Collaborated with the development team to integrate frontend components with backend services and APIs.',
      'Improved UI functionality and overall user experience through hands-on development tasks.',
    ],
    chips: ['React.js', 'Node.js', 'JavaScript', 'REST APIs'],
  },
  {
    no: '03',
    title: 'Smart Automated Irrigation',
    tag: 'IoT Project',
    visual: 2,
    bullets: [
      'IoT solution monitoring real-time soil moisture and weather conditions with sensors on Arduino / ESP32.',
      'Designed an automated control mechanism to optimise water usage in a reliable sensor–actuator system.',
      'Deployed and tested in a real-world setting, improving irrigation efficiency and reducing water wastage.',
    ],
    chips: ['ESP32', 'Arduino', 'Sensors', 'Embedded C'],
  },
  {
    no: '04',
    title: 'Garbage Classification Model',
    tag: 'AI / Deep Learning',
    visual: 3,
    bullets: [
      'Automated image classification system for waste sorting using the EfficientNetV2-B2 CNN architecture.',
      'Handled dataset collection, preprocessing and augmentation to improve accuracy and generalisation.',
      'Trained, evaluated and deployed the model with reliable performance across multiple categories.',
    ],
    chips: ['TensorFlow', 'EfficientNetV2', 'Gradio', 'NumPy'],
  },
];

// `icon` must match a name in components/Icon.js
export const skills = [
  { icon: 'shield', title: 'Cyber Security & Networking', items: ['Nmap', 'Wireshark', 'Kali Linux', 'Socket Programming', 'OSINT', 'Network Protocols'] },
  { icon: 'code', title: 'Programming Languages', items: ['C', 'Python', 'SQL', 'JavaScript'] },
  { icon: 'chip', title: 'IoT & Embedded Systems', items: ['Arduino', 'Raspberry Pi', 'ESP32 / ESP8266', 'Sensor Integration'] },
  { icon: 'network', title: 'Machine Learning', items: ['TensorFlow', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib', 'Gradio'] },
  { icon: 'browser', title: 'Web Development', items: ['JavaScript', 'React.js', 'Node.js', 'HTML / CSS'] },
  { icon: 'tool', title: 'Developer Tools', items: ['Git', 'GitHub', 'VS Code', 'Postman', 'Jupyter'] },
];

export const experience = [
  {
    when: 'Aug 2023 — Feb 2026',
    chip: 'NCC',
    title: 'Junior Under Officer (JUO)',
    org: 'National Cadet Corps',
    bullets: [
      'Led a team of 50+ cadets, managing training schedules and coordinating field activities.',
      'Built leadership, discipline and team coordination through military-style training; proficient in map reading, navigation and hardware–software integration.',
    ],
  },
  {
    when: '2025 · New Delhi',
    chip: 'DG NCC',
    title: 'All India Thal Sainik Camp (AITSC 2025)',
    org: 'One of the most prestigious NCC camps nationally',
    bullets: ['Excelled in advanced navigation and map-reading events at the national level.'],
    accent: true,
  },
  {
    when: 'University Sports Meet',
    chip: '🥇 Gold',
    title: 'Gold Medal — Basketball Tournament',
    org: 'Central University of Jammu',
    bullets: ['Won gold with the team at the University Sports Meet basketball tournament.'],
  },
];

export const certifications = [
  { title: 'Python Development Intern', issuer: 'Shadowfox' },
  { title: 'AI & Data Analytics Intern', issuer: 'Edunet Foundation (AICTE)' },
  { title: 'Quantum Computing', issuer: 'C-DAC Hyderabad & IIT Roorkee, MeitY' },
  { title: 'Soft Computing & Applications', issuer: 'Short-Term Course, SMVDU' },
  { title: 'AI, ML & Data Science Bootcamp', issuer: 'Udemy' },
];

export const terminalScript = [
  ['cmd', 'whoami'],
  ['out', 'mridul — cyber security @ CUJ'],
  ['cmd', 'python3 scanner.py --target lab'],
  ['dim', '[*] enumerating live hosts…'],
  ['ok', '[+] 22/tcp  open  ssh'],
  ['ok', '[+] 443/tcp open  https'],
  ['cmd', 'echo $STATUS'],
  ['out', 'open to research internships ✓'],
];
