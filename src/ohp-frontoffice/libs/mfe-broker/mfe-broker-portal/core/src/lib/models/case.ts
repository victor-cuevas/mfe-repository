import { User } from './user';

export interface Case {
  id: string;
  applicants: string[];
  createdDate: Date | string;
  amount: number;
  stage: 'full-mortgage' | 'dip' | 'illustration';
  tasks: [] | string[];
  createdBy: string;
  status: 'active' | 'paused' | 'declined' | 'completed';
  assignee: User;
}
