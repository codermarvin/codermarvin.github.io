import React from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Smartphone,
  Code2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Apple,
  Play,
} from 'lucide-react';
import SectionTitle from './components/SectionTitle';
import ProjectCard from './components/ProjectCard';
import ExperienceCard from './components/ExperienceCard';

const skills = [
  'Flutter',
  'Dart',
  'BLoC',
  'Clean Architecture',
  'Firebase',
  'REST APIs',
  'Google Maps SDK',
  'Stripe Payments',
  'Google AdMob',
  'Localization (i18n)',
  'App Store Deployment',
  'Performance Optimization',
  'Push Notifications',
  'Agile / Remote Collaboration',
];

const GITHUB_USERNAME = 'codermarvin';
const LINKEDIN_USERNAME = 'codermarvin';
const EMAIL_ADDRESS = 'heymarvin@yahoo.com';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/developer?id=Marvin+Aquino';
const APP_STORE_URL = 'https://apps.apple.com/us/developer/marvin-aquino/id1567403944';

const projects = [
  {
    name: 'Gigasure',
    type: 'Insurance Platform',
    description:
      'The next generation of insurance. Built a polished, high-performance Flutter experience with strong UX focus, third-party integrations, and production-level optimization.',
    tags: ['Flutter', 'Insurance', 'APIs', 'Mobile UX'],
    link: 'https://gigasure.com/',
  },
  {
    name: 'Racer',
    type: 'Racing App',
    description:
      'Your all-in-one racing app. High-performance mobile experience for enthusiasts.',
    tags: ['Flutter', 'Sports', 'Performance', 'UX'],
    link: 'https://getracer.com/',
  },
  {
    name: 'Regala Top - CL',
    type: 'Virtual Gift List App',
    description:
      'Everyone’s favorite virtual gift list app. A social gifting platform for sharing and tracking gift wishlists.',
    tags: ['Flutter', 'Social', 'E-commerce', 'Mobile'],
    link: 'https://regalatop.cl/',
  },
  {
    name: 'Kaya',
    type: 'Service Marketplace',
    description:
      'Connects with reliable service providers. Designed and delivered a scalable Flutter marketplace app from concept to release.',
    tags: ['Flutter', 'Marketplace', 'Service Providers', 'Architecture'],
    link: '#',
  },
  {
    name: 'bXTRA PH',
    type: 'Rewards & Cashback',
    description:
      'Shopping and dining experience while enjoying exclusive Cashback rewards. Integrated rewards platform for retail and dining.',
    tags: ['Flutter', 'Rewards', 'Cashback', 'Payments'],
    link: 'https://bxtra.ph/',
  },
  {
    name: 'MyBasurero',
    type: 'Waste Collection Service',
    description:
      'Hassle-free, safe, and secure waste collection service. Streamlining waste management through digital solutions.',
    tags: ['Flutter', 'Utility', 'Logistics', 'Sustainability'],
    link: 'https://mybasurero.com.ph/',
  },
  {
    name: 'Field Service Record',
    type: 'Multilingual Utility App',
    description:
      'Helps record, organize, and track ministry activities for Jehovah’s Witnesses. Supports 17 languages. Available in Google Play and Apple Store.',
    tags: ['Flutter', 'Firebase', 'Localization', 'AdMob'],
    link: '#',
  },
];

const experience = [
  {
    years: '2024 – 2025',
    title: 'Mobile Developer',
    company: 'Web Fuel Agency Ltd.',
    summary:
      'Built pixel-perfect, high-performance Flutter apps for iOS and Android. Integrated third-party APIs, payments, maps, and analytics while optimizing rendering, animations, and startup performance.',
    projects: ['Gigasure', 'Racer', 'RegalaTop CL'],
  },
  {
    years: '2023 – 2024',
    title: 'Senior Software Engineer',
    company: 'Rising Tide Digital, Inc.',
    summary:
      'Designed and delivered Flutter applications from concept to release. Implemented feature updates, bug fixes, and performance improvements for production mobile products.',
    projects: ['Kaya'],
  },
  {
    years: '2021 – 2023',
    title: 'Senior Mobile Application Developer',
    company: 'SD Solutions, Inc.',
    summary:
      'Developed and deployed cross-platform Flutter apps. Integrated APIs, payment flows, and push notifications. Published and maintained apps on Google Play and App Store.',
    projects: ['bXTRA PH', 'MyBasurero'],
  },
  {
    years: '2014 – 2021',
    title: 'Freelance Programmer',
    company: 'Independent',
    summary:
      'Delivered custom mobile and web solutions for multiple clients, including multilingual Flutter apps, Firebase-backed platforms, and internal business systems.',
    projects: ['Field Service Record', 'Project Monitoring System'],
  },
  {
    years: '2003 – 2014',
    title: 'Senior Programmer / Team Lead',
    company: 'Z Getcare Systems, Inc.',
    summary:
      'Led development of healthcare and case management systems for US clients, mentored developers, and handled long-term system maintenance and enhancements.',
    projects: ['HOMCare', 'PACECare', 'MSSPCare'],
  },
];

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.12),transparent_30%)]" />
      <div className="grid-bg absolute inset-0 bg-grid opacity-30" />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="section-container flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white transition-colors hover:text-cyan-300">
            <img
              src="/profile.jpg"
              alt="Marvin Aquino"
              className="h-8 w-8 rounded-full border border-white/10 object-cover"
            />
            Marvin Aquino
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-300 transition-colors hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15"
          >
            Let’s Talk
          </a>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <section className="section-container flex min-h-[92vh] items-center py-16 md:py-24">
          <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                <Sparkles className="h-4 w-4" />
                Senior Flutter Developer • Mobile Software Engineer
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                Building production-ready mobile apps that scale.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                I’m Marvin Aquino, a Senior Flutter Developer with deep experience in
                cross-platform mobile engineering, clean architecture, app store deployment,
                API integrations, and performance optimization for iOS and Android.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>

                <a
                  href={`https://linkedin.com/in/${LINKEDIN_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  LinkedIn
                </a>

                {/* <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Me
                </a> */}

                <a
                  href={GOOGLE_PLAY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Google Play
                </a>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  <Apple className="mr-2 h-4 w-4" />
                  App Store
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Years in Software', value: '20+' },
                  { label: 'Years in Flutter', value: '5+' },
                  { label: 'Platforms', value: 'iOS + Android' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-3xl p-5">
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass relative flex flex-col items-center gap-6 rounded-[2rem] p-6 shadow-glow"
            >
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
                <div className="relative h-48 w-48 overflow-hidden rounded-full border-2 border-white/10 shadow-2xl md:h-64 md:w-64">
                  <img
                    src="/profile.jpg"
                    alt="Marvin Aquino"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              <div className="w-full rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-400/10 p-3">
                    <Smartphone className="h-6 w-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Core Strengths</h3>
                    <p className="text-sm text-slate-400">Modern Flutter product delivery</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    'Flutter & Dart with scalable architecture',
                    'BLoC + Clean Architecture implementation',
                    'Firebase, payments, maps, analytics',
                    'App Store & Google Play production releases',
                    'Performance tuning, bug fixing, and UX polish',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="section-container py-16">
          <SectionTitle
            eyebrow="About"
            title="A senior mobile engineer focused on shipping real products."
            subtitle="From freelance systems to enterprise healthcare platforms to modern Flutter apps, my work has consistently centered on maintainable architecture, reliable delivery, and polished user experience."
          />

          <div className="glass rounded-[2rem] p-8 md:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3">
                  <Code2 className="h-6 w-6 text-cyan-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">What I bring</h3>
                <p className="mt-3 leading-8 text-slate-300">
                  I build mobile applications with a strong focus on architecture,
                  maintainability, performance, and business impact. My specialty is turning
                  product requirements into clean, scalable Flutter apps that are ready for
                  real-world users.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  'Cross-platform Flutter apps for iOS and Android',
                  'API integrations, payments, maps, analytics',
                  'Production support, debugging, and optimization',
                  'App publishing, updates, and long-term maintenance',
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section-container py-16">
          <SectionTitle
            eyebrow="Skills"
            title="Tech stack & mobile expertise"
            subtitle="Built around Flutter, clean architecture, and production mobile delivery."
          />

          <div className="glass rounded-[2rem] p-8">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section-container py-16">
          <SectionTitle
            eyebrow="Projects"
            title="Selected mobile work"
            subtitle="Use real GitHub links, app store links, or case study links here for maximum impact."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        </section>

        <section id="experience" className="section-container py-16">
          <SectionTitle
            eyebrow="Experience"
            title="20+ years of software development"
            subtitle="A progression from systems development and leadership into senior-level Flutter and mobile engineering."
          />

          <div className="space-y-6">
            {experience.map((item, index) => (
              <ExperienceCard key={`${item.company}-${index}`} item={item} index={index} />
            ))}
          </div>
        </section>

        <section className="section-container py-16">
          <SectionTitle eyebrow="Education" title="Academic background" />

          <div className="glass rounded-[2rem] p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/5 p-3">
                <GraduationCap className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Bachelor’s Degree, Computer Engineering
                </h3>
                <p className="mt-2 text-slate-300">Rizal Technological University</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-container py-16">
          <div className="glass rounded-[2rem] p-8 md:p-12">
            <SectionTitle
              eyebrow="Contact"
              title="Let’s build something impactful."
              subtitle="Open to Flutter, mobile engineering, and cross-platform development opportunities."
            />

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="inline-flex items-center rounded-2xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
              >
                <Mail className="mr-2 h-4 w-4" />
                {EMAIL_ADDRESS}
              </a>

              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>

              <a
                href={`https://linkedin.com/in/${LINKEDIN_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </a>

              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                <Play className="mr-2 h-4 w-4" />
                Google Play
              </a>

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                <Apple className="mr-2 h-4 w-4" />
                App Store
              </a>
            </div>
          </div>
        </section>
      </main>

      <a
        href="#about"
        className="fixed bottom-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition hover:bg-white/10"
      >
        <ChevronDown className="h-5 w-5 text-cyan-300" />
      </a>
    </div>
  );
}