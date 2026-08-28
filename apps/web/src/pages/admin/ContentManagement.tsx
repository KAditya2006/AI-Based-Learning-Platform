import React, { useEffect, useState } from 'react';
import { learningApi } from '../../api/learning';
import type { LearningResource } from '../../api/learning';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit2, BookOpen } from 'lucide-react';

export const ContentManagement: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await learningApi.getLibrary();
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Content Management</h1>
          <p className="text-neutral-500">Manage learning resources, courses, and materials.</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" /> Add Resource
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Library ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Spinner /></div>
          ) : resources.length === 0 ? (
            <div className="text-center p-8 text-neutral-500 border-2 border-dashed rounded-md bg-neutral-50">
              <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
              <p>No learning resources found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-sm font-medium text-neutral-500">
                    <th className="pb-3 pr-4">Title</th>
                    <th className="pb-3 pr-4">Provider</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Difficulty</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {resources.map(res => (
                    <tr key={res._id} className="border-b last:border-0 hover:bg-neutral-50">
                      <td className="py-3 pr-4 font-medium">{res.title}</td>
                      <td className="py-3 pr-4">{res.provider}</td>
                      <td className="py-3 pr-4"><Badge variant="neutral">{res.type}</Badge></td>
                      <td className="py-3 pr-4">{res.difficulty}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={res.isActive ? 'success' : 'neutral'}>
                          {res.isActive ? 'Active' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">
                          <Edit2 size={14} className="mr-1" /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
