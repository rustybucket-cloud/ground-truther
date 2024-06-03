export type ImageType = {
  src: string;
  classification?: string;
};

export type ImageViewerType = {
  imageViewerRef: React.RefObject<HTMLDivElement>;
};