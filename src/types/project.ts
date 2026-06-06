export interface Project {
  id: string;
  title: string;
  problem: string;
  vision: string;
  creatorId: string;
  university?: string;
  course?: string;
  createdAt: Date;
}
