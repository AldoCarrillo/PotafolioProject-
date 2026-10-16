import { useEffect } from 'react'
import './App.css'

const projects = [
  { title: 'Daylight', type: 'Web app', year: '2024', stack: ['React', 'Node.js'], description: 'A quiet planning tool for making space around the work that matters.', image: '/projects/daylight.svg', href: '#' },
  { title: 'Soft launch', type: 'Experiment', year: '2024', stack: ['Next.js', 'Stripe'], description: 'An experiment in making product updates feel more like a conversation.', image: '/projects/soft-launch.svg', href: '#' },
  { title: 'Moss & mineral', type: 'Website', year: '2023', stack: ['Astro', 'Contentful'], description: 'An online home for a small ceramics studio, shaped by material and light.', image: '/projects/moss-mineral.svg', href: '#' },
  { title: 'Common ground', type: 'Identity', year: '2023', stack: ['TypeScript', 'WebGL'], description: 'A visual system for a community garden growing across three neighborhoods.', image: '/projects/common-ground.svg', href: '#' },
]

function SiteHeader() {
  return (
    <header className="header">
      <a className="logo" href="/"><span>AC</span> Aldo Carrillo</a>
      <nav aria-label="Main navigation"><a href="/about">About</a><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:hello@example.com">Contact</a></nav>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-cta"><div><p>Have a project in mind?</p><h2>Let’s make it happen.</h2></div><a href="mailto:hello@example.com">Get in touch <span aria-hidden="true">↗</span></a></div>
      <span className="copyright">© 2025 Aldo Carrillo · Built with React</span>
    </footer>
  )
}

function AboutPage() {
  useEffect(() => {
    document.title = 'About | Aldo Carrillo'
    return () => { document.title = 'Aldo Carrillo | Frontend Developer' }
  }, [])

  return (
    <main className="page">
      <SiteHeader />
      <section className="about-page" id="top">
        <a className="back-link" href="/#top">← Back to portfolio</a>
        <p className="eyebrow">A little introduction</p>
        <h1>Hey, I’m Aldo.<br /><em>I build for the web.</em></h1>
        <p className="about-intro">I’m a frontend developer from San Diego. I turn thoughtful ideas into fast, accessible web experiences with clean, dependable code.</p>
        <div className="about-facts" aria-label="About Aldo">
          <article><span>ROLE</span><h2>Frontend developer</h2></article>
          <article><span>FROM</span><h2>San Diego</h2></article>
          <article><span>FOCUS</span><h2>Web experiences</h2></article>
        </div>
        <div className="about-note">
          <span className="eyebrow">How I work</span>
          <p>I turn the fun ideas I’m drawn to into thoughtful web products, bringing them to life with clean, accessible code and an eye for the details.</p>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/about') {
    return <AboutPage />
  }

  return (
    <main className="page">
      <SiteHeader />

      <section className="hero" id="top">
        <div><p className="eyebrow">Frontend developer · New York</p>
        <h1>Building useful<br /><em>digital things.</em></h1>
        <p className="intro-copy">I turn thoughtful ideas into fast, accessible web<br className="desktop-break" /> experiences with clean, dependable code.</p>
        <a className="hero-link" href="#work">Explore my work <span aria-hidden="true">↘</span></a></div>
        <div className="code-card"><span className="code-dots">● ● ●</span><code><i>const</i> developer = &#123;<br />&nbsp;&nbsp;name: <b>'Aldo Carrillo'</b>,<br />&nbsp;&nbsp;focus: <b>'the web'</b>,<br />&nbsp;&nbsp;available: <em>true</em><br />&#125;</code></div>
      </section>

      <section className="work" id="work">
        <div className="section-heading"><div><p className="eyebrow">A few things I’ve made</p><h2>Selected projects</h2></div><span>2022—2024</span></div>
        <div className="projects">{projects.map((project) => <article className="project" key={project.title}><a href={project.href} className="project-image"><img src={project.image} alt="" /><span>View project <span aria-hidden="true">↗</span></span></a><div className="project-info"><div className="project-copy"><h3>{project.title}</h3><p>{project.description}</p><div className="stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div><div className="meta"><span>{project.type}</span><time>{project.year}</time></div></div></article>)}</div>
      </section>

      <SiteFooter />
    </main>
  )
}

export default App
