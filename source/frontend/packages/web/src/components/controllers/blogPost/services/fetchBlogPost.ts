type BlogPostResponse = {
  id: number;
  title: string;
  contents: {
    type: string;
    value: string;
  }[];
};

export const fetchBlogPost = async (id: number): Promise<BlogPostResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/post/${id}`,
  );
  return response.json();
};
