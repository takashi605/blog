type BlogPostDate = {
  value: Date;
  getDate: () => Date;
};

export const createBlogPostDate = (dateString: string): BlogPostDate => {
  const value = new Date(dateString);

  return {
    value,
    getDate: () => value,
  };
};
