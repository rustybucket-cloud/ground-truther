import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { Button } from "../../Button/Button";
import { ImageViewer, useImageViewer } from "../../components";
import { css } from "@linaria/core";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";

const classifierCss = css`
  height: calc(100vh - var(--header-height));
  --bottom-content-height: 0px;
`;

export function Classifier() {
  const [isOpen, setIsOpen] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const imageViewer = useImageViewer(uploadedImages);

  return (
    <div className={classifierCss}>
      {uploadedImages.length > 0 ? (
        <ImageViewer
          {...imageViewer}
          controls={
            <ClassificationControls images={uploadedImages} imageViewer={imageViewer} />
          }
        />
      ) : null}
      {uploadedImages.length === 0 ? (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            const urls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
            setUploadedImages((curr) => [...curr, ...urls]);
          }}
        />
      ) : null}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="bg-gray-800">
          <DialogPanel className="bg-primary">
            <DialogTitle>Add Classification</DialogTitle>
            <Description>
              Add a classification for the current image
            </Description>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

type Classification = {
  src: string;
  classification?: string;
};

function ClassificationControls({
  images,
  imageViewer,
}: {
  images: string[];
  imageViewer: any;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [classifications, setClassifications] = useState<Classification[]>(
    images.map((image) => ({ src: image }))
  );
  const [query, setQuery] = useState("");

  const classificationOptions = useMemo(() => {
    return classifications.reduce((prev, classification) => {
      if (
        classification.classification &&
        !prev.includes(classification.classification)
      ) {
        return [...prev, classification.classification];
      }
      return prev;
    }, []);
  }, [classifications]);

  const setImageClassification = useCallback(
    (classification: string) => {
      setClassifications((prev) => {
        const newClassifications = [...prev];
        newClassifications[imageViewer.currentImageIndex].classification =
          classification;
        return newClassifications;
      });
      setQuery("");
      inputRef.current?.blur();
      imageViewer.imageViewerRef.current.focus();
      imageViewer.nextImage();
    },
    [imageViewer]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setImageClassification(query);
  };

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      console.log("key", event);
      if (inputRef.current === document.activeElement) return;
      if (event.key === "ArrowRight") imageViewer.nextImage();
      if (event.key === "ArrowLeft") imageViewer.prevImage();
      if (event.key === "n") inputRef.current?.focus();
      classificationOptions.forEach((classification, i) => {
        if (event.key === `${i + 1}`) {
          setImageClassification(classification);
        }
      });
    };
    document?.addEventListener("keydown", handleKeyUp);

    return () => {
      document?.removeEventListener("keydown", handleKeyUp);
    };
    // we don't include the imageViewer here
    // we don't want to recreate the event listener every time the imageViewer changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classificationOptions, setImageClassification]);

  return (
    <div className="flex gap-2">
      {classificationOptions.map((classification, i) => (
        <Button
          key={classification}
          onClick={() => setImageClassification(classification)}
          data-classification={classification}
          emphasis="high"
        >
          {i + 1}: {classification}
        </Button>
      ))}
      <form onSubmit={onSubmit}>
        <input
          className="p-3 rounded"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          ref={inputRef}
        />
      </form>
    </div>
  );
}
