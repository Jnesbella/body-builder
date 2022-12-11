import * as React from "react";
import {
  Space,
  Effect,
  Tooltip,
  IconButton,
  theme,
  TooltipProps,
  Menu,
  Text,
  Pressable,
  Layout,
} from "@jnesbella/body-builder";
import { compact } from "lodash";

import { Tag } from "../../types";

import { Chip } from "../common";

export interface NoteTagsInputChipsProps {
  tags?: Tag[];
  tooltipProps?: Partial<TooltipProps>;
}

function NoteTagsInputChips({
  tags: selectedTags = [],
  tooltipProps,
}: NoteTagsInputChipsProps) {
  const [item1, item2, ...moreTags] = selectedTags;

  const hasMore = moreTags.length > 0;

  return (
    <React.Fragment>
      {compact([item1, item2]).map((tag) => (
        <React.Fragment key={tag.id}>
          <Space />

          <Chip label={tag.label} size="small" />
        </React.Fragment>
      ))}

      {hasMore && (
        <React.Fragment>
          <Space />

          <MoreTagsMenu tags={moreTags} tooltipProps={tooltipProps} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

interface MoreTagsMenuProps {
  tooltipProps?: Partial<TooltipProps>;
  tags?: Tag[];
}

function MoreTagsMenu({ tooltipProps, tags = [] }: MoreTagsMenuProps) {
  const numTags = tags.length;

  return (
    <Tooltip
      placement="top"
      {...tooltipProps}
      content={(tooltipElement) => (
        <Effect.FadeIn
          fadeIn={tooltipElement.visible}
          fadeOut={!tooltipElement.visible}
        >
          <Menu elevation={1}>
            <Layout.Column spacingSize={[0, 0.5]}>
              {tags.map((tag, index) => (
                // <Menu.Item key={tag.id}>
                <Layout.Box key={tag.id} spacingSize={[1, 0]}>
                  {index > 0 && <Space spacingSize={0.5} />}
                  <Chip label={tag.label} size="small" fullWidth />
                </Layout.Box>
                // </Menu.Item>
              ))}
            </Layout.Column>
          </Menu>
        </Effect.FadeIn>
      )}
      topOffset={-theme.spacing}
    >
      {(tooltipElement) => (
        <Pressable
          onHoverOver={tooltipElement.onHoverOver}
          onHoverOut={tooltipElement.onHoverOut}
        >
          <Chip label={`+${numTags}`} size="small" />
        </Pressable>
      )}
    </Tooltip>
  );
}

export default NoteTagsInputChips;
