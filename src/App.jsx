import './App.css'

const projects = [
  { title: 'Daylight', type: 'Web app', year: '2024', stack: ['React', 'Node.js'], description: 'A quiet planning tool for making space around the work that matters.', image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=1000&q=85', href: '#' },
  { title: 'Soft launch', type: 'Experiment', year: '2024', stack: ['Next.js', 'Stripe'], description: 'An experiment in making product updates feel more like a conversation.', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85', href: '#' },
  { title: 'Moss & mineral', type: 'Website', year: '2023', stack: ['Astro', 'Contentful'], description: 'An online home for a small ceramics studio, shaped by material and light.', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=85', href: '#' },
  { title: 'Common ground', type: 'Identity', year: '2023', stack: ['TypeScript', 'WebGL'], description: 'A visual system for a community garden growing across three neighborhoods.', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1000&q=85', href: '#' },
]

function App() {
  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="#top"><span>AC</span> Aldo Carrillo</a>
        <nav><a href="#work">Work</a><a href="#about">About</a><a href="https://github.com/" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:hello@example.com">Contact</a></nav>
      </header>

      <section className="hero" id="top">
        <div><p className="eyebrow">Frontend developer · New York</p>
        <h1>Building useful<br /><em>digital things.</em></h1>
        <p className="intro-copy">I turn thoughtful ideas into fast, accessible web<br className="desktop-break" /> experiences with clean, dependable code.</p></div>
        <div className="code-card"><span className="code-dots">● ● ●</span><code><i>const</i> developer = &#123;<br />&nbsp;&nbsp;name: <b>'Aldo Carrillo'</b>,<br />&nbsp;&nbsp;focus: <b>'the web'</b>,<br />&nbsp;&nbsp;available: <em>true</em><br />&#125;</code></div>
      </section>

      <section className="work" id="work">
        <div className="section-heading"><h2>Selected projects</h2><span>2022—2024</span></div>
        <div className="projects">{projects.map((project) => <article className="project" key={project.title}><a href={project.href} className="project-image"><img src={project.image} alt="" /><span>View project ↗</span></a><div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p><div className="stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div><div className="meta"><span>{project.type}</span><time>{project.year}</time></div></div></article>)}</div>
      </section>

      <footer className="footer" id="about"><div><p>Have a project in mind?</p><a href="mailto:hello@example.com">hello@example.com ↗</a></div><span>© 2024 Aldo Carrillo · Built with React</span></footer>
    </main>
  )
}

export default App
