import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Article, Tag } from '@workspace/api';
import { Badge } from '@workspace/ui/components/badge';
import DataTable, { Column } from '@workspace/ui/components/my-data-table';
import { formatDate } from 'date-fns';

import ArticlesLoading from '@/components/article/Loading';
import { defaultAPI } from '@/utils/fetcher';

export const Route = createFileRoute('/_authed/table')({ component: App });

export default function App() {
  const { status, data, error } = useQuery({
    queryKey: ['allArticles'],
    async queryFn() {
      return defaultAPI.articlesGet();
    },
  });

  const columns: Column<Article>[] = [
    { key: 'title', label: 'Title', width: '200px' },
    { key: 'userEmail', label: 'Author', width: '140px' },
    {
      key: 'tags',
      label: 'Tags',
      width: '150px',
      render: (value: Tag[]) =>
        value.map(({ id, name }) => (
          <Badge className="m-0.5" key={id}>
            {name}
          </Badge>
        )),
    },
    {
      key: 'isDeleted',
      label: 'isDeleted',
      width: '100px',
      render: (value) => (
        <Badge variant={value ? 'destructive' : 'default'}>
          {value ? 'Deleted' : 'Active'}
        </Badge>
      ),
    },
    {
      key: 'createTime',
      label: 'Create Time',
      width: '150px',
      render: (value) => formatDate(value, 'PPp'),
    },
    {
      key: 'updateTime',
      label: 'Update Time',
      width: '150px',
      render: (value) => formatDate(value, 'PPp'),
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Article Management Table</h1>
      </div>
      {status === 'pending' ? (
        <ArticlesLoading />
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <DataTable data={data?.articles} columns={columns} pageSize={5} />
      )}
    </div>
  );
}
