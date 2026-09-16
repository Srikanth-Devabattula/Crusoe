interface OfficeMapEmbedProps {
  embedUrl: string;
  title: string;
}

export function OfficeMapEmbed({ embedUrl, title }: OfficeMapEmbedProps) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-[#e7efe0] bg-gray-100 shadow-inner">
      <iframe
        title={`Map — ${title}`}
        src={embedUrl}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
