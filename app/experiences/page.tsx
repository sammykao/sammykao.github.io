import experiencesData from '../data/experiences.json'

export const metadata = {
  title: 'Experiences',
  description: 'My professional journey and work experiences',
}

export default function ExperiencesPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold tracking-tighter">
        My Experiences
      </h1>
      <div className="mb-8 prose prose-neutral dark:prose-invert">
        <p>
          My professional journey has equipped me with a diverse set of skills and experiences. 
          I've been fortunate to work with some amazing people and learn a lot about the world.
          I really value wokring with talented and fast paced people. I hate calling it 'work', 
          you should really enjoy what you do. What's the point of waking up every day and not?

        </p>
      </div>
      
      <div className="flex flex-col space-y-8">
        {experiencesData.map((experience, index) => (
          <ExperienceCard 
            key={index}
            title={experience.title} 
            company={experience.company}
            description={experience.description}
            skills={experience.skills}
          />
        ))}
      </div>
    </section>
  )
}

function ExperienceCard({ title, company, description, skills }) {
  return (
    <div className="border-l-2 border-neutral-200 dark:border-neutral-700 pl-4 transition-all">
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
        <h2 className="text-xl font-medium">{company}</h2>
      </div>
      <p className="text-neutral-800 dark:text-neutral-200 font-medium mb-2">{title}</p>
      <p className="text-neutral-700 dark:text-neutral-300 mb-3">{description}</p>
      
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  )
} 