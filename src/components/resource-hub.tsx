import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { resources } from '@/lib/constants';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ResourceHub() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Resource Hub</CardTitle>
        <CardDescription>Your one-stop-shop for all study materials.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {resources.map((resource) => (
            <Link
              href={resource.href}
              key={resource.title}
              className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-2 rounded-md">
                   <resource.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{resource.title}</p>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
