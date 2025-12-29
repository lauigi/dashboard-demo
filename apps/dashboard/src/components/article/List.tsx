import { ArticlesGet200Response } from '@workspace/api';
import { ItemGroup } from '@workspace/ui/components/item';
import ArticleItem from './ArticleItem';

interface IArticles {
  list: ArticlesGet200Response[];
}
export default function Articles({ list }: IArticles) {
  return (
    <ItemGroup>
      {list.map(({ articles }) =>
        articles.map((article) => (
          <ArticleItem key={article.id} article={article} />
        )),
      )}
    </ItemGroup>
  );
}
