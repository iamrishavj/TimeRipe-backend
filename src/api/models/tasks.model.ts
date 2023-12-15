export type Task = {
  task_id: number;
  session_id: number;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  order_index: number;
};
