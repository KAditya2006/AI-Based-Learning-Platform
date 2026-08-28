import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Filter, PlayCircle } from 'lucide-react';
import { learningApi } from '../../api/learning';
import type { LearningResource } from '../../api/learning';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

export const ExploreLearning: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await learningApi.getLibrary();
        setResources(data);
      } catch (error) {
        console.error('Failed to load library', error);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Learning</h1>
          <p className="page-description">Discover internal courses, materials, and training programs.</p>
        </div>
        <div className="search-filter-bar">
          <div className="input-group">
            <Search className="input-icon" size={18} />
            <input type="text" placeholder="Search resources..." className="input-field" />
          </div>
          <Button variant="outline"><Filter size={16} className="mr-2" /> Filter</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Spinner size="lg" /></div>
      ) : resources.length === 0 ? (
        <Card className="text-center p-12">
          <BookOpen className="mx-auto text-neutral-400 mb-4" size={48} />
          <h3 className="text-xl font-medium">No Resources Found</h3>
          <p className="text-neutral-500 mt-2">The learning catalog is currently empty.</p>
        </Card>
      ) : (
        <div className="grid-cards">
          {resources.map((resource) => (
            <Card key={resource._id} className="hover-lift">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="neutral">{resource.type}</Badge>
                  <span className="text-xs text-neutral-500 font-medium">{resource.durationMinutes} min</span>
                </div>
                <CardTitle>{resource.title}</CardTitle>
                <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{resource.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                    {resource.difficulty}
                  </span>
                  <span className="text-xs text-neutral-500">By {resource.provider}</span>
                </div>
                {resource.competencies && resource.competencies.length > 0 && (
                  <div className="text-xs text-neutral-500">
                    <strong>Covers:</strong> {resource.competencies.map(c => c.name || 'Competency').join(', ')}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/learning/${resource._id}`)}
                >
                  <PlayCircle size={16} className="mr-2" /> View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
