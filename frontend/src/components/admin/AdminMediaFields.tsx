"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";

export interface AdminMediaState {
  keepImages: string[];
  removeImages: string[];
  galleryFiles: File[];
  imageUrls: string[];
  removeAllImages: boolean;
}

interface AdminMediaFieldsProps {
  mediaType: "blog" | "news";
  existingImages?: string[];
  resolveImageUrl: (ref: string) => string | null;
  videoUrls?: string[];
  onVideoUrlsChange: (urls: string[]) => void;
  videoUrlError?: string;
  onMediaChange: (state: AdminMediaState) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function AdminMediaFields({
  mediaType,
  existingImages = [],
  resolveImageUrl,
  videoUrls = [],
  onVideoUrlsChange,
  videoUrlError,
  onMediaChange,
}: AdminMediaFieldsProps) {
  const [keptRefs, setKeptRefs] = useState<string[]>([]);
  const [removedRefs, setRemovedRefs] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [pendingUrls, setPendingUrls] = useState<string[]>([]);
  const [urlPreviews, setUrlPreviews] = useState<string[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState("");

  useEffect(() => {
    setKeptRefs([...existingImages]);
    setRemovedRefs([]);
    setGalleryFiles([]);
    setFilePreviews([]);
    setPendingUrls([]);
    setUrlPreviews([]);
    setImageUrlInput("");
    setVideoUrlInput("");
  }, [existingImages]);

  useEffect(() => {
    const urls = galleryFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [galleryFiles]);

  const keptExisting = useMemo(
    () => keptRefs.filter((ref) => !removedRefs.includes(ref)),
    [keptRefs, removedRefs]
  );

  useEffect(() => {
    onMediaChange({
      keepImages: keptExisting,
      removeImages: removedRefs,
      galleryFiles,
      imageUrls: pendingUrls,
      removeAllImages:
        keptExisting.length === 0 &&
        galleryFiles.length === 0 &&
        pendingUrls.length === 0 &&
        removedRefs.length > 0,
    });
  }, [keptExisting, removedRefs, galleryFiles, pendingUrls, onMediaChange]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setGalleryFiles((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const removeExisting = (ref: string) => {
    setRemovedRefs((prev) => (prev.includes(ref) ? prev : [...prev, ref]));
  };

  const removeNewFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed || !/^https?:\/\/.+/i.test(trimmed)) return;
    setPendingUrls((prev) => [...prev, trimmed]);
    setUrlPreviews((prev) => [...prev, trimmed]);
    setImageUrlInput("");
  };

  const removePendingUrl = (index: number) => {
    setPendingUrls((prev) => prev.filter((_, i) => i !== index));
    setUrlPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addVideoUrl = () => {
    const trimmed = videoUrlInput.trim();
    if (!trimmed || !/^https?:\/\/.+/i.test(trimmed)) return;
    onVideoUrlsChange([...videoUrls, trimmed]);
    setVideoUrlInput("");
  };

  const removeVideoUrl = (index: number) => {
    onVideoUrlsChange(videoUrls.filter((_, i) => i !== index));
  };

  const label = mediaType === "blog" ? "Blog images" : "News images";

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-800">{label}</label>
        <p className="mb-2 text-xs text-gray-500">
          Upload multiple JPG, PNG, WebP, or GIF files (max 5MB each, up to 10). First image is
          used as the card thumbnail.
        </p>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand/10 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20"
        />

        <div className="mt-3 flex gap-2">
          <input
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            className={inputClass}
            placeholder="Or paste image URL: https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={addImageUrl}
            className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Add URL
          </button>
        </div>

        {(keptExisting.length > 0 || filePreviews.length > 0 || urlPreviews.length > 0) && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {keptExisting.map((ref) => {
              const src = resolveImageUrl(ref);
              if (!src) return null;
              return (
                <div
                  key={ref}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200"
                >
                  <Image src={src} alt="" fill unoptimized className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExisting(ref)}
                    aria-label="Remove image"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            {filePreviews.map((src, index) => (
              <div
                key={`file-${index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-dashed border-brand/40"
              >
                <Image src={src} alt="" fill unoptimized className="object-cover" />
                <span className="absolute left-2 top-2 rounded bg-brand/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                  New
                </span>
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  aria-label="Remove new image"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ))}
            {urlPreviews.map((src, index) => (
              <div
                key={`url-${index}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-dashed border-brand/40"
              >
                <Image src={src} alt="" fill unoptimized className="object-cover" />
                <span className="absolute left-2 top-2 rounded bg-brand/90 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                  URL
                </span>
                <button
                  type="button"
                  onClick={() => removePendingUrl(index)}
                  aria-label="Remove URL image"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-800">Videos (optional)</label>
        <p className="mb-2 text-xs text-gray-500">
          Add multiple YouTube, Vimeo, or direct video URLs. Shown below the article text.
        </p>
        <div className="flex gap-2">
          <input
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
          />
          <button
            type="button"
            onClick={addVideoUrl}
            className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Add video
          </button>
        </div>
        {videoUrlError && <p className="mt-1.5 text-xs text-red-600">{videoUrlError}</p>}

        {videoUrls.length > 0 && (
          <ul className="mt-3 space-y-2">
            {videoUrls.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-xs text-gray-700">{url}</span>
                <button
                  type="button"
                  onClick={() => removeVideoUrl(index)}
                  aria-label="Remove video"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
