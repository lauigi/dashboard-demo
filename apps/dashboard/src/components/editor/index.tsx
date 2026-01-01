import { Article, Tag } from '@workspace/api';
import {
  ChangeEvent,
  Ref,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FieldLabel,
  Field,
  FieldError,
  FieldSet,
  FieldDescription,
} from '@workspace/ui/components/field';
import { Textarea } from '@workspace/ui/components/textarea';
import { Input } from '@workspace/ui/components/input';
import TagField from './TagField';
import { EDITOR_LIMIT, TAGS_LENGTH_LIMIT } from '@/utils/constants';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { draftAtom } from '@/utils/atoms';
import * as z from 'zod/mini';
import { useShouldShowError } from '@/utils/hooks';

export type ArticleDraft = Pick<Article, 'title' | 'content' | 'tags'>;

export interface EditorHandle {
  getData: () => ArticleDraft;
  reset: () => void;
}

interface IEditor {
  preset?: ArticleDraft;
  ref: Ref<EditorHandle>;
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

export default function Editor({ preset, ref }: IEditor) {
  const [draft, setDraft] = useAtom(draftAtom);
  const [title, setTitle] = useState(preset?.title ?? draft.title);
  const [content, setContent] = useState(preset?.content ?? draft.content);
  const [tags, setTags] = useState(preset?.tags ?? draft.tags);
  const [focusOnTitle, setFocusOnTitle] = useState(false);
  const [focusOnContent, setFocusOnContent] = useState(false);
  const hasFocusedTitleRef = useRef(false);
  const hasFocusedContentRef = useRef(false);
  const titleValidation = useMemo(() => TitlePattern.safeParse(title), [title]);
  const contentValidation = useMemo(
    () => ContentPattern.safeParse(content),
    [content],
  );
  const showTitleError = useShouldShowError(
    !focusOnTitle && hasFocusedTitleRef.current,
    !titleValidation.success,
  );
  const showContentError = useShouldShowError(
    !focusOnContent && hasFocusedContentRef.current,
    !contentValidation.success,
  );

  useImperativeHandle(ref, () => ({
    getData: () => ({ title, content, tags }),
    reset: () => {
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
      <FieldSet className="mb-4 min-w-100 max-w-150">
        <Field>
          <FieldLabel htmlFor="article-editor-title">
            Title *
            <span
              className={showTitleError ? 'text-destructive' : 'text-gray-500'}
            >
              {title.length ?? '-'} / {EDITOR_LIMIT.title.max}
            </span>
            {showTitleError && (
              <FieldError>
                {titleValidation.error?.issues[0].message}
              </FieldError>
            )}
          </FieldLabel>
          <Input
            id="article-editor-title"
            placeholder="Title"
            autoComplete="off"
            value={title}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTitle(event.target.value);
              setDraft((val) => ({ ...val, title: event.target.value }));
            }}
            onFocus={() => {
              hasFocusedTitleRef.current = true;
              setFocusOnTitle(true);
            }}
            onBlur={() => setFocusOnTitle(false)}
          />
        </Field>
      </FieldSet>
      <FieldSet className="mb-4 min-w-210">
        <Field>
          <FieldLabel htmlFor="article-editor-content">
            Content *
            {showContentError && (
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
            value={content}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setContent(event.target.value);
              setDraft((val) => ({ ...val, content: event.target.value }));
            }}
            onFocus={() => {
              hasFocusedContentRef.current = true;
              setFocusOnContent(true);
            }}
            onBlur={() => setFocusOnContent(false)}
          />
          <FieldDescription>
            Content character Count:{' '}
            <span className={showContentError ? 'text-destructive' : undefined}>
              {content.length ?? '-'} / {EDITOR_LIMIT.content.max}
            </span>
          </FieldDescription>
        </Field>
      </FieldSet>
      <TagField tags={tags} addTag={addTag} removeTag={removeTag} />
    </div>
  );
}
