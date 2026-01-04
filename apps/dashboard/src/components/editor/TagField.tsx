import { Tag } from '@workspace/api';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardDescription } from '@workspace/ui/components/card';
import { Field, FieldLabel, FieldSet } from '@workspace/ui/components/field';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ChevronsUpDown, X } from 'lucide-react';
import { memo, MouseEvent, useState } from 'react';

import TagList from './TagList';

interface ITagField {
  tags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (tag: Tag) => void;
  disabled: boolean;
}

const TagField = memo(
  ({ tags, addTag, removeTag, disabled = false }: ITagField) => {
    const [openTagPop, setOpenTagPop] = useState(false);
    const [presetSearch, setPresetSearch] = useState('');

    return (
      <FieldSet>
        <Field>
          <FieldLabel>Tags</FieldLabel>
          <Popover
            open={openTagPop}
            onOpenChange={(open: boolean) => {
              setOpenTagPop(open);
              if (!open) setPresetSearch('');
            }}
          >
            <PopoverAnchor asChild>
              <PopoverTrigger asChild>
                <Card
                  className="py-2 w-120 max-w-120"
                  onClick={(event: MouseEvent) => {
                    if (disabled) event.preventDefault();
                  }}
                >
                  <div className="flex px-2 flex-wrap gap-2">
                    {tags.length === 0 && (
                      <CardDescription className="flex items-center h-9.5">
                        Click to add some tags.
                      </CardDescription>
                    )}
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        className="text-center pl-5"
                        onClick={(event: MouseEvent) => {
                          if (openTagPop) return;
                          event.preventDefault();
                          if (disabled) return;
                          setPresetSearch(tag.name);
                          Promise.resolve().then(() => {
                            setOpenTagPop(true);
                          });
                        }}
                      >
                        {tag.name}
                        <Button
                          size="icon-sm"
                          className="rounded-full"
                          onClick={(event: MouseEvent) => {
                            event.stopPropagation();
                            if (disabled) return;
                            removeTag(tag);
                          }}
                        >
                          <X />
                        </Button>
                      </Badge>
                    ))}
                    <Button variant="ghost" className="rounded-full ml-auto">
                      <ChevronsUpDown />
                    </Button>
                  </div>
                </Card>
              </PopoverTrigger>
            </PopoverAnchor>
            <PopoverContent className="w-75 p-2" side="bottom" align="end">
              <TagList
                tags={tags}
                addTag={addTag}
                removeTag={removeTag}
                presetSearch={presetSearch}
              />
            </PopoverContent>
          </Popover>
        </Field>
      </FieldSet>
    );
  },
);

export default TagField;
