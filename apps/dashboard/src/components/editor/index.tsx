import { Article, Tag } from '@workspace/api';
import {
  ChangeEvent,
  Ref,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {
  FieldLabel,
  Field,
  FieldError,
  FieldSet,
} from '@workspace/ui/components/field';
import { Textarea } from '@workspace/ui/components/textarea';
import { Input } from '@workspace/ui/components/input';
import TagField from './TagField';
import { TAGS_LENGTH_LIMIT } from '@/utils/constants';
import { toast } from 'sonner';

type ArticleDraft = Pick<Article, 'title' | 'content' | 'tags'>;

export interface EditorHandle {
  getData: () => ArticleDraft;
  reset: () => void;
}

interface IEditor {
  preset?: ArticleDraft;
  ref: Ref<EditorHandle>;
}

export default function Editor({ preset, ref }: IEditor) {
  const [title, setTitle] = useState(preset?.title ?? '');
  const [content, setContent] = useState(preset?.content ?? '');
  const [tags, setTags] = useState(preset?.tags ?? []);

  useImperativeHandle(ref, () => ({
    getData: () => ({ title, content, tags }),
    reset: () => {
      setTitle('');
      setContent('');
      setTags([]);
    },
  }));

  const addTag = useCallback(
    (tag: Tag) => {
      if (tags.length >= TAGS_LENGTH_LIMIT) {
        toast.warning('Maximum number of tags reached');
        return;
      }
      setTags((vals) => {
        if (vals.find(({ id }) => id === tag.id)) return vals;
        return [...vals, tag];
      });
    },
    [tags.length],
  );

  const removeTag = useCallback((tag: Tag) => {
    setTags((vals) => {
      return vals.filter(({ id }) => id !== tag.id);
    });
  }, []);

  return (
    <div aria-label="Article editor">
      <FieldSet className="mb-4 min-w-100 max-w-150">
        <Field>
          <FieldLabel htmlFor="article-editor-title">
            Title<FieldError>Validation message.</FieldError>
          </FieldLabel>
          <Input
            id="article-editor-title"
            placeholder="Title"
            autoComplete="off"
            value={title}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setTitle(event.target.value)
            }
          />
        </Field>
      </FieldSet>
      <FieldSet className="mb-4 min-w-210">
        <Field>
          <FieldLabel htmlFor="article-editor-content">
            Content<FieldError>Validation message.</FieldError>
          </FieldLabel>
          <Textarea
            id="article-editor-content"
            placeholder="Compose your article."
            className="resize-none max-h-100 min-h-32"
            value={content}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setContent(event.target.value)
            }
          />
        </Field>
      </FieldSet>
      <TagField tags={tags} addTag={addTag} removeTag={removeTag} />
    </div>
  );
}
