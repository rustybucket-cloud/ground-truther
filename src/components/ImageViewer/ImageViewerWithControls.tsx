import { ImageViewer, useImageViewer  } from "./ImageViewer";

export type ImageViewerWithControlsProps = {
  images: string[];
}

export const ImageViewerWithControls = ({ images, controls }: ImageViewerWithControlsProps) => {
  const imageViewer = useImageViewer(images);
  return (
    <div>
      <ImageViewer {...imageViewer} controls={controls} />
    </div>
  );
};