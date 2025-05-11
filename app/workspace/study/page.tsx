import { Suspense } from 'react';
import StudyTasksClient from './StudyTaskClient';

export default function StudyTasksPage() {
  return (
    <Suspense fallback={<p>Carregando tarefas de estudo...</p>}>
      <StudyTasksClient />
    </Suspense>
  );
}
