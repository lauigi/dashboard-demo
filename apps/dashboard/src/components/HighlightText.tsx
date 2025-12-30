import React from 'react';

interface IHighlightText {
  text: string;
  keywords?: string[];
  highlightClassName?: string;
}

export default function HighlightText({
  text,
  keywords,
  highlightClassName = 'text-orange-700 font-extrabold',
}: IHighlightText) {
  if (!keywords || keywords.length === 0 || !text) {
    return <>{text}</>;
  }
  const validWords = keywords
    .filter((word) => word && word.trim())
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (validWords.length === 0) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${validWords.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, index) => {
        const isMatch = validWords.some(
          (word) => part.toLowerCase() === word.toLowerCase(),
        );

        return isMatch ? (
          <span key={index} className={highlightClassName}>
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </>
  );
}
