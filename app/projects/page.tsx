import projectsData from '../data/projects.json'
import ProjectCard from '../components/project-card'


export default function ProjectsPage() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Projects
      </h1>
      <div className="flex flex-col space-y-8">
        {projectsData.map((project, index) => (
          <ProjectCard 
            key={index}
            title={project.title} 
            description={project.description}
            link={project.link}
            technologies={project.technologies}
          />
        ))}
      </div>
    </section>
  )
}

