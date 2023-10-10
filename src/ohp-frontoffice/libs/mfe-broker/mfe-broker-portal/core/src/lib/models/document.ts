export interface Document {
  id: number;
  name: string;
  type: 'illustration' | 'DIP' | 'FMA';
  date: string;
  status: 'completed' | 'verified' | 'pending';
  upload: 'uploaded' | 'required';
}
