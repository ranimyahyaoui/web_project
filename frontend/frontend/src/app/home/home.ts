
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  stats = [
    { value: '150+', label: 'Active Members' },
    { value: '20+', label: 'Activities' },
    { value: '06', label: 'CTF Domains' }
  ];


activities = [
  {
    number: '01',
    icon: '🌐',
    title: 'Web Exploitation',
    subtitle: 'Web Security',
    description: 'Explore web application security and learn to identify common vulnerabilities.',
    tag: 'WEB SECURITY',
    color: 'green'
  },
  {
    number: '02',
    icon: '🔐',
    title: 'Cryptography',
    subtitle: 'Crypto',
    description: 'Discover encryption, decryption and cryptographic challenges.',
    tag: 'CRYPTOGRAPHY',
    color: 'blue'
  },
  {
    number: '03',
    icon: '🕵️',
    title: 'OSINT',
    subtitle: 'Open Source Intelligence',
    description: 'Learn how to collect and analyze publicly available information.',
    tag: 'INTELLIGENCE',
    color: 'purple'
  },
  {
    number: '04',
    icon: '🔎',
    title: 'Forensics',
    subtitle: 'Digital Forensics',
    description: 'Explore digital evidence analysis, file investigation and incident analysis.',
    tag: 'DIGITAL FORENSICS',
    color: 'orange'
  },
  {
    number: '05',
    icon: '💻',
    title: 'Pwn',
    subtitle: 'Binary Exploitation',
    description: 'Discover binary security, memory concepts and low-level programming.',
    tag: 'BINARY EXPLOITATION',
    color: 'green'
  },
  {
    number: '06',
    icon: '⚙️',
    title: 'Reverse Engineering',
    subtitle: 'Rev',
    description: 'Analyze programs and understand their internal structure and behavior.',
    tag: 'REVERSE ENGINEERING',
    color: 'blue'
  }
];


  steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Register and become part of our student community.'
    },
    {
      number: '02',
      title: 'Explore the Domains',
      description: 'Discover cybersecurity fields and find your interests.'
    },
    {
      number: '03',
      title: 'Start Learning',
      description: 'Join activities, solve challenges and improve your skills.'
    }
  ];

  news = [
    {
      icon: '🚀',
      title: 'New Club Season',
      description: 'A new season full of learning, challenges and opportunities.'
    },
    {
      icon: '🏆',
      title: 'CTF Challenges',
      description: 'Put your knowledge to the test with cybersecurity challenges.'
    },
    {
      icon: '🤝',
      title: 'Community Events',
      description: 'Meet other students and learn together.'
    }
  ];

}
