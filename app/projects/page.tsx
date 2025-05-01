import projectsData from '../data/projects.json'
import ProjectCard from '../components/project-card'
import ideasData from '../data/ideas.json'


export default function ProjectsPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold tracking-tighter">
        My Projects + TODOs
      </h1>
      <div className="mb-8 prose prose-neutral dark:prose-invert">
        <p>
          I'm going to include my startup projects here too, rather than in the experiences page. 
          I don't sleep as much as I should, and this is why. A lot more AI projects on the bottom, if that's your jam.
          If you like one of my TODOs, let me know! Or even better, build it and show me. I'm pretty open source with
          ideas because at some point you realize the amount of execution arbitrage it really takes for something to 
          be great.
        </p>
      </div>
      <h3 className="mb-4 text-2xl font-semibold tracking-tighter">
        TODOs
      </h3>
      <div className="flex flex-col space-y-8"> 
        {ideasData.map((idea, index) => (
          <ProjectCard 
            key={index}
            title={idea.title} 
            description={idea.description}
          />
        ))}
      </div>
      <h3 className="mb-4 text-2xl font-semibold tracking-tighter">
        Projects
      </h3>
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

