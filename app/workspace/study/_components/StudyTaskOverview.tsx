'use client';

import { Task } from '@/types/Task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  CalendarClock,
  XCircle,
  Repeat 
} from 'lucide-react';

interface StudyTasksOverviewProps {
  tasks: Task[];
  subjectId?: number;
}

export default function StudyTasksOverview({ tasks }: StudyTasksOverviewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const recallTasks = tasks.filter(task => task.status === 'recall').length;
  const pendingTasks = totalTasks - completedTasks;

  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const today = new Date();
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'done') return false;
    return new Date(task.due_date) < today;
  });

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'done') return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= today && dueDate <= sevenDaysFromNow;
  });

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <img src="/Studying.svg" alt="No tasks found" className="w-82 h-82 mb-4" />
        <h2 className="text-center text-3xl font-semibold text-blue-500">
          Welcome to your study planner!
        </h2>
        <p className="text-center text-gray-400 mt-2">
          Start by adding your first study task to track your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Total Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-gray-500">{completionRate}% completion rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recall</CardTitle>
            <Repeat className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recallTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Pending</CardTitle>
            <CalendarClock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Overdue Tasks</CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <p className="text-gray-500">No overdue tasks!</p>
            ) : (
              <ul className="space-y-2">
                {overdueTasks.map(task => (
                  <li key={task.id} className="border-l-4 border-red-500 pl-3 py-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.due_date!).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
            <CalendarClock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500">No upcoming tasks in the next 7 days.</p>
            ) : (
              <ul className="space-y-2">
                {upcomingTasks.map(task => (
                  <li key={task.id} className="border-l-4 border-blue-500 pl-3 py-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(task.due_date!).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
