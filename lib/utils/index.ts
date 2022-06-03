import * as urlSlug from 'url-slug';

export const slugify = (str: string) => urlSlug.convert(str, {
    transformer: urlSlug.LOWERCASE_TRANSFORMER,
    separator: '-',
});

const getPositionAtCenter = (element: Element) => {
  const {top, left, width, height} = element.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2
  };
}

export const getDistanceBetweenElements = (a: Element, b: Element) => {
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}
