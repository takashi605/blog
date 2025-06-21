'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';

type ImageListState = {
  getAllImages: () => ImageDTO[];
  updateImages: (image: ImageDTO[]) => void;
};

const ImageListContext = createContext<ImageListState | null>(null);

export default function ImageListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [imageList, setImageList] = useState<ImageDTO[]>([]);
  const getAllImages = useCallback(() => {
    return imageList;
  }, [imageList]);
  const updateImages = useCallback((images: ImageDTO[]) => {
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
