// render props するコンポーネントのインターフェースを定義
export type BlogPostContentProps = {
  type: string;
  value: string;
};

export type BlogPostTitleProps = {
  children: React.ReactNode;
};

export type BlogPostDateProps = {
  label: string;
  date: string;
};
