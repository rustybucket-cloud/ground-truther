import { useEffect, useState, useRef } from "react";
import { IconButton } from "../../Button/IconButton";
import { ArrowRight, ArrowLeft } from "../Icons";
import OpenSeadragon from "openseadragon";
import { css } from "@linaria/core";

const imageViewerCss = css`
  height: calc(100vh - var(--header-height) - var(--bottom-content-height));
  width: var(--image-viewer-width, 100%);
  background-color: #d3d3d3;
`;

type ImageViewerProps = {
  imageViewerRef: React.RefObject<HTMLDivElement>;
  hasNext: boolean;
  hasPrev: boolean;
  nextImage: () => void;
  prevImage: () => void;
  controls?: React.ReactNode;
};

export function ImageViewer({
  imageViewerRef,
  hasNext,
  hasPrev,
  nextImage,
  prevImage,
  controls,
}: ImageViewerProps) {
  return (
    <div className="relative">
      <div
        ref={imageViewerRef}
        style={{ "--image-viewer-width": window.innerWidth } as React.CSSProperties}
        className={imageViewerCss}
      />
      {controls ? (
        <div className="absolute top-0 right-0 p-3">{controls}</div>
      ) : null}
      {hasNext ? (
        <div className="absolute top-0 right-0 bottom-0 w-[100px] opacity-0 hover:opacity-100">
          <IconButton
            className="absolute top-[50%] right-[14px]"
            Icon={ArrowRight}
            onClick={nextImage}
            emphasis="high"
          />
        </div>
      ) : null}
      {hasPrev ? (
        <div className="absolute top-0 left-0 bottom-0 w-[100px] opacity-0 hover:opacity-100">
          <IconButton
            className="absolute top-[50%] left-[14px]"
            Icon={ArrowLeft}
            onClick={prevImage}
            emphasis="high"
          />
        </div>
      ) : null}
    </div>
  );
}

export type UseImageViewerReturn = {
  image: string;
  imageViewerRef: React.RefObject<HTMLDivElement>;
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  nextImage: () => void;
  prevImage: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

export function useImageViewer(images: string[]): UseImageViewerReturn {
  const imageViewerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!imageViewerRef.current) return () => {};
    viewerRef.current = OpenSeadragon({
      element: imageViewerRef.current,
      tileSources: {
        type: "image",
        url: images?.[currentImageIndex] || "",
      },
      showZoomControl: false,
      showFullPageControl: false,
      showHomeControl: false,
    });

    return () => {
      if (viewerRef.current) viewerRef.current.destroy();
    };
  }, [images, currentImageIndex]);

  const hasNext = currentImageIndex < images.length - 1;
  const hasPrev = currentImageIndex > 0;

  const nextImage = () => {
    if (hasNext) setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (hasPrev)
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
  };

  return {
    image: images?.[currentImageIndex] || "",
    imageViewerRef,
    currentImageIndex,
    setCurrentImageIndex,
    nextImage,
    prevImage,
    hasNext,
    hasPrev,
  };
}
