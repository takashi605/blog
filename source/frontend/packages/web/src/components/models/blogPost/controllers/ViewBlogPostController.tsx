import { useViewBlogPostController } from '@/components/models/blogPost/controllers/viewBlogPostControllerHooks';
import React from 'react';

export type ContentProps = {
  type: string;
  value: string;
};

type ContentComponentType = (props: ContentProps) => JSX.Element | null;

function ViewBlogPostController({
  ContentComponent,
}: {
  ContentComponent: ContentComponentType;
}) {
  const { title, contents } = useViewBlogPostController(1);

  return (
    <div>
      <h1>{title}</h1>
      {contents.map((content) => (
        <ContentComponent
          key={content.id}
          type={content.type}
          value={content.value}
        />
      ))}
    </div>
  );
}

export default ViewBlogPostController;
