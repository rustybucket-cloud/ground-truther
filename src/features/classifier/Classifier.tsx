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
import JSZip from "jszip";
import { useHotkeys } from "react-hotkeys-hook";

const classifierCss = css`
  height: calc(100vh - var(--header-height));
  --bottom-content-height: 0px;
`;

export function Classifier() {
  const [isOpen, setIsOpen] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const imageViewer = useImageViewer(uploadedImages);
  const [isFinished, setIsFinished] = useState(false);
  const [classifications, setClassifications] = useState<Classification[]>([]);

  const classifcationCounts = useMemo(() => {
    return classifications.reduce((prev, classification) => {
      if (classification.classification) {
        return {
          ...prev,
          [classification.classification]:
            (prev[classification.classification] || 0) + 1,
        };
      }
      return prev;
    }, {});
  }, [classifications]);

  const finish = useCallback(() => {
    setIsFinished(true);
  }, []);

  const createZip = useCallback(async () => {
    const zip = new JSZip();
    const folderNames = [];
    const folders = [];
    await Promise.all(
      classifications.map(async (classification, i) => {
        if (!classification.classification) return;
        if (!folderNames.includes(classification.classification)) {
          folderNames.push(classification.classification);
          folders.push(zip.folder(classification.classification));
        }
        const response = await fetch(classification.src);
        const blob = await response.blob();
        folders[folderNames.indexOf(classification.classification)].file(
          `${i}.jpg`,
          new File([blob], `${i}.jpg`, { type: "image/jpeg" })
        );
      })
    );
    return zip;
  }, [classifications]);

  const downloadResults = useCallback(async () => {
    const zip = await createZip();
    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "classifications.zip";
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [createZip]);

  return (
    <div className={classifierCss}>
      {uploadedImages.length > 0 && !isFinished ? (
        <ImageViewer
          {...imageViewer}
          controls={
            <ClassificationControls
              images={uploadedImages}
              imageViewer={imageViewer}
              finish={finish}
              classifications={classifications}
              setClassifications={setClassifications}
            />
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
            const urls = Array.from(e.target.files).map((file) =>
              URL.createObjectURL(file)
            );
            setUploadedImages((curr) => [...curr, ...urls]);
            setClassifications((curr) => [
              ...curr,
              ...urls.map((src) => ({ src })),
            ]);
          }}
        />
      ) : null}
      {isFinished ? (
        <div>
          <h1>Finished!</h1>
          <h2>Results</h2>
          <ul>
            {Object.entries(classifcationCounts).map(
              ([classification, count]) => (
                <li key={classification}>
                  {classification}: {count}
                </li>
              )
            )}
          </ul>
          <Button onClick={downloadResults}>Download Results</Button>
        </div>
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
  imageViewer,
  finish,
  classifications,
  setClassifications,
}: {
  images: string[];
  imageViewer: any;
  finish: (classifications: Classification[]) => void;
  classifications: Classification[];
  setClassifications: (classifications: Classification[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
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
      if (imageViewer.hasNext) imageViewer.nextImage();
      else finish(classifications);
    },
    [classifications, finish, imageViewer, setClassifications]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setImageClassification(query);
  };

  useHotkeys("ctrl+i", () => {
    inputRef.current?.focus();
  });
  useHotkeys("ArrowRight", () => {
    imageViewer.nextImage();
  });
  useHotkeys("ArrowLeft", () => {
    imageViewer.prevImage();
  });

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (inputRef.current === document.activeElement) return;
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
