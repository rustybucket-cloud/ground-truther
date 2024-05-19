import { useEffect, useRef, useState, useCallback } from "react";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import { ImageViewerType } from "./types";


export function ImageViewer({ image, imgRef }: ImageViewerType) {
  return (
    <div>
      <img className="max-h-[750px]" ref={imgRef} src={image.src} />
    </div>
  );
}

export function useImageViewer(imageSrcs: string[]): ImageViewerType {
  const [images, setImages] = useState(imageSrcs.map((src) => ({ src })));
  const [selectedImage, setSelectedImage] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (imgRef.current == null) return () => {};
    viewerRef.current = new Viewer(imgRef.current, {
      inline: true,
      navbar: false,
      toolbar: false,
      url() {
        return images[selectedImage].src;
      },
    });

    return () => {
      if (viewerRef.current) viewerRef.current.destroy();
    };
  }, [images, selectedImage]);

  const next = useCallback(() => {
    setSelectedImage((curr) => curr + 1);
  }, []);

  const prev = useCallback(() => {
    setSelectedImage((curr) => curr - 1);
  }, []);

  const hasNext = selectedImage !== imageSrcs.length - 1;

  const hasPrev = selectedImage !== 0;

  const zoomIn = useCallback(() => {
    if (viewerRef.current) viewerRef.current.zoom(0.1);
  }, []);

  const zoomOut = useCallback(() => {
    if (viewerRef.current) viewerRef.current.zoom(-0.1);
  }, []);

  const classifySelectedImage = useCallback(
    (classification: string) => {
      setImages((curr) => {
        return curr.map((image) =>
          image.src === images[selectedImage].src
            ? { ...image, classification }
            : image
        );
      });
    },
    [images, selectedImage]
  );

  return {
    image: images[selectedImage],
    next,
    prev,
    imgRef,
    zoomIn,
    zoomOut,
    classifySelectedImage,
    hasNext,
    hasPrev,
  };
}
