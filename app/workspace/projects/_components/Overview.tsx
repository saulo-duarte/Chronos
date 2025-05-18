'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverviewProps {
  category: {
    name: string;
    description?: string;
    status?: string;
    objectives?: string;
    technologies?: string;
    importantLinks?: string[];
    startDate?: string;
    deadline?: string;
  };
}

export default function Overview({ category }: OverviewProps) {
  if (!category) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {category.description || 'No description provided.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {category.objectives || 'No objectives defined.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {category.technologies || 'Not specified.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Useful Links</CardTitle>
        </CardHeader>
        <CardContent>
          {category.importantLinks && category.importantLinks.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-blue-600 underline">
              {category.importantLinks.map((link, i) => (
                <li key={i}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No links provided.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
