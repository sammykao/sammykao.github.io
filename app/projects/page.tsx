import projectsData from '../data/projects.json'
import ProjectCard from '../components/project-card'

export const metadata = {
  title: 'Projects',
  description: 'A showcase of my featured projects and technical work',
}

export default function ProjectsPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold tracking-tighter">
        My Projects
      </h1>
      <div className="mb-8 prose prose-neutral dark:prose-invert">
        <p>
          I'm going to include my startup projects here too, rather than in the experiences page. 
          I don't sleep as much as I should, and this is why. A lot more AI projects on the bottom, if that's your jam.
          I'm hoping to one day build a A2A + MCP style AI agent project, like RapidAPI but for AI agents, using
          Google's A2A protocol. But time is a luxury I'm not sure I have.
        </p>
      </div>
      
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

