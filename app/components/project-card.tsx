'use client';

import Link from 'next/link';
import { track } from '@vercel/analytics';


export default function ProjectCard({ title, description, link, technologies }) {
    return (
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <h2 className="text-xl font-medium mb-2">{title}</h2>
        <p className="text-neutral-700 dark:text-neutral-300 mb-3">{description}</p>
        
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {technologies.map((tech, index) => (
              <span key={index} className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <Link href={link} onClick={() => track('project_click', { project: title })} target="_blank" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
          View Project
          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>
    )
  } 