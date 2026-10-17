import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import projects from '../data/projects.js'

function ProjectCard({ project }) {
  if (project.href) {
    return (
      <article className="project">
        <a className="project-card-link" href={project.href}>
          <div className="project-image"><img src={project.image} alt="" /></div>
          <div className="project-info project-info-linked">
            <div>
              <span className="project-label">{project.category}</span>
              <h3>{project.title}</h3>
            </div>
            <span className="project-open">Open project <span aria-hidden="true">↗</span></span>
          </div>
        </a>
      </article>
    )
  }

  return (
    <article className="project">
      <div className="project-image"><img src={project.image} alt="" /></div>
      <div className="project-info"><h3>{project.title}</h3></div>
    </article>
  )
}

function HomePage() {
  return (
    <main className="page">
      <SiteHeader />
      <section className="hero" id="top">
        <h1>Building useful<br /><em>digital things.</em></h1>
        <a className="hero-link" href="#work">Explore my work <span aria-hidden="true">↘</span></a>
      </section>
      <section className="work" id="work">
        <div className="section-heading"><h2>Selected projects</h2></div>
        <div className="projects">
          {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

export default HomePage
