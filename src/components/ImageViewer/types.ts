export type ImageType = {
  src: string;
  classification?: string;
};

export type ImageViewerType = {
  image: ImageType;
  next: () => void;
  prev: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  imgRef: React.RefObject<HTMLImageElement>;
  classifySelectedImage: (classification: string) => void;
  hasNext: boolean;
  hasPrev: boolean;
};