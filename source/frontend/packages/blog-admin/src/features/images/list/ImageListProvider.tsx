'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { Image } from 'shared-lib/src/api';

type ImageListState = {
  getAllImages: () => Image[];
  updateImages: (image: Image[]) => void;
};

const ImageListContext = createContext<ImageListState | null>(null);

export default function ImageListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [imageList, setImageList] = useState<Image[]>([]);
  const getAllImages = useCallback(() => {
    return imageList;
  }, [imageList]);
  const updateImages = useCallback((images: Image[]) => {
    setImageList(images);
  }, []);

  return (
    <ImageListContext.Provider value={{ getAllImages, updateImages }}>
      {children}
    </ImageListContext.Provider>
  );
}

// コンテキストを利用するためのカスタムフック
export const useImageListContext = () => {
  const imageListState = useContext(ImageListContext);
  if (imageListState === null) {
    throw new Error(
      'useImageListContext は ImageListProvider でラップされていなければ利用できません',
    );
  }
  return imageListState;
};
