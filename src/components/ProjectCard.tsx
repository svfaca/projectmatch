
import type { Project } from "@/types/project";
import { ProjectCardView } from "./ui/projectmatch-ui";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <ProjectCardView
      title={project.title}
      description={project.problem}
      subtitle={project.vision}
      creator={project.creatorId}
      participants={project.course ?? "Projeto ativo"}
      skills={[]}
    />
  );
}
