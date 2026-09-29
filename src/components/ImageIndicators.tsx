"use client";
export function ImageIndicators({ count, active, onSelect }: { count: number; active: number; onSelect: (index: number) => void }) {
  if (count < 2) return null;
  return <div className="image-indicators" role="group" aria-label="이미지 선택">{Array.from({ length: count }, (_, index) =>
    <button key={index} type="button" aria-label={`${count}장 중 ${index + 1}번째 이미지`} aria-pressed={active === index} onClick={() => onSelect(index)}><span /></button>
  )}</div>;
}
