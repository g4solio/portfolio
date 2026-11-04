/** The mark: the letter D drawn as a casebook figure. Construction, letter, measure. */
export function Mark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
      <circle className="m-circle" cx="26" cy="32" r="18" pathLength={1} />
      <path className="m-lines" d="M10 14H54M10 50H54" pathLength={1} />
      <path className="m-letter" fillRule="evenodd" d="M16 14h10a18 18 0 0 1 0 36H16Zm10 8v20a10 10 0 0 0 0-20Z" />
      <path className="m-ticks" d="M16 56H44M16 54v4M44 54v4" pathLength={1} />
    </svg>
  );
}
