import { Article, Tag } from '@workspace/api';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { useAtom } from 'jotai';
import {
  ChangeEvent,
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import * as z from 'zod/mini';

import { draftAtom } from '@/utils/atoms';
import { EDITOR_LIMIT, TAGS_LENGTH_LIMIT } from '@/utils/constants';

import TagField from './TagField';

export type ArticleDraft = Pick<Article, 'title' | 'content' | 'tags'>;

export interface EditorHandle {
  getData: () => ArticleDraft | undefined;
  reset: () => void;
}

interface IEditor {
  preset?: Partial<ArticleDraft>;
  ref: Ref<EditorHandle>;
  disabled: boolean;
}

const TitlePattern = z
  .string()
  .check(
    z.maxLength(EDITOR_LIMIT.title.max, 'Too long'),
    z.minLength(
      EDITOR_LIMIT.title.min,
      `Too short, at least ${EDITOR_LIMIT.title.min}`,
    ),
  );
const ContentPattern = z
  .string()
  .check(
    z.maxLength(EDITOR_LIMIT.content.max, 'Too long'),
    z.minLength(
      EDITOR_LIMIT.content.min,
      `Too short, at least ${EDITOR_LIMIT.content.min}`,
    ),
  );

export default function Editor({ preset, ref, disabled = false }: IEditor) {
  const [draft, setDraft] = useAtom(draftAtom);
  const [title, setTitle] = useState(preset?.title ?? draft.title);
  const [content, setContent] = useState(preset?.content ?? draft.content);
  const [tags, setTags] = useState(preset?.tags ?? draft.tags);
  const titleValidation = useMemo(() => TitlePattern.safeParse(title), [title]);
  const contentValidation = useMemo(
    () => ContentPattern.safeParse(content),
    [content],
  );
  const [showTitleError, setShowTitleError] = useState(false);
  const [showContentError, setShowContentError] = useState(false);

  useImperativeHandle(ref, () => ({
    getData() {
      if (contentValidation.success && titleValidation.success) {
        return { title, content, tags };
      }

      // Force to show possible errors
      setShowTitleError(true);
      setShowContentError(true);
      toast.error('Please resolve the issue(s) before publishing.');
    },
    reset() {
      setShowTitleError(false);
      setShowContentError(false);
      setTitle('');
      setContent('');
      setTags([]);
      setDraft({ title: '', content: '', tags: [] });
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
        const newTags = [...vals, tag];
        setDraft((draft) => ({ ...draft, tags: newTags }));
        return newTags;
      });
    },
    [tags.length],
  );

  const removeTag = useCallback((tag: Tag) => {
    setTags((vals) => {
      const newTags = vals.filter(({ id }) => id !== tag.id);
      setDraft((draft) => ({ ...draft, tags: newTags }));
      return newTags;
    });
  }, []);

  return (
    <div aria-label="Article editor">
      <FieldSet className="mb-4 min-w-75 max-w-150">
        <Field>
          <FieldLabel htmlFor="article-editor-title">
            Title *
            <span
              className={
                showTitleError && !titleValidation.success
                  ? 'text-destructive'
                  : 'text-gray-500'
              }
            >
              {title.length ?? '-'} / {EDITOR_LIMIT.title.max}
            </span>
            {showTitleError && !titleValidation.success && (
              <FieldError>
                {titleValidation.error?.issues[0].message}
              </FieldError>
            )}
          </FieldLabel>
          <Input
            id="article-editor-title"
            placeholder="Title"
            autoComplete="off"
            disabled={disabled}
            value={title}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTitle(event.target.value);
              setDraft((val) => ({ ...val, title: event.target.value }));
            }}
            onBlur={() => setShowTitleError(true)}
          />
        </Field>
      </FieldSet>
      <FieldSet className="mb-4 min-w-75">
        <Field>
          <FieldLabel htmlFor="article-editor-content">
            Content *
            {showContentError && !contentValidation.success && (
              <FieldError>
                {contentValidation.error?.issues[0].message}
              </FieldError>
            )}
          </FieldLabel>
          <Textarea
            id="article-editor-content"
            placeholder="Compose your article."
            className="resize-none max-h-100 min-h-32"
            maxLength={EDITOR_LIMIT.content.max * 2}
            disabled={disabled}
            value={content}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              setContent(event.target.value);
              setDraft((val) => ({ ...val, content: event.target.value }));
            }}
            onBlur={() => setShowContentError(true)}
          />
          <FieldDescription>
            Content character Count:{' '}
            <span
              className={
                showContentError && !contentValidation.success
                  ? 'text-destructive'
                  : undefined
              }
            >
              {content.length ?? '-'} / {EDITOR_LIMIT.content.max}
            </span>
          </FieldDescription>
        </Field>
      </FieldSet>
      <TagField
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        disabled={disabled}
      />
    </div>
  );
}
