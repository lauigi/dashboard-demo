import { ArticleDraft } from '@/components/editor';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const mineFilterAtom = atomWithStorage('mineFilter', false, undefined, {
  getOnInit: true,
});

export const draftAtom = atomWithStorage(
  'draft',
  {
    title: '',
    content: '',
    tags: [],
  } as ArticleDraft,
  undefined,
  { getOnInit: true },
);

export const titleKeywordAtom = atom('');
