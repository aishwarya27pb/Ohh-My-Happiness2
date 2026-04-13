interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <div className={`${centered ? "text-center" : ""} mb-10 ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF8A00] mb-3 bg-[#FFE4C2] px-4 py-1.5 rounded-full">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A1A1A] leading-tight">
        {highlight ? (
          <>
            {titleParts[0]}
            <span className="text-gradient">{highlight}</span>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-[#6B6B6B] text-sm sm:text-base max-w-2xl leading-relaxed ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
