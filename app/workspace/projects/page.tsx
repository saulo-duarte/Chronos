import { Suspense } from 'react';
import ProjectTasksClient from './ProjectTaskClient';

export default function ProjectTasksPage() {
  return (
    <Suspense fallback={<div>Carregando tarefas...</div>}>
      <ProjectTasksClient />
    </Suspense>
  );
}

