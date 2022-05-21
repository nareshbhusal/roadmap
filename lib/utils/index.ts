import * as urlSlug from 'url-slug';

export const slugify = (str: string) => urlSlug.convert(str, {
    transformer: urlSlug.LOWERCASE_TRANSFORMER,
    separator: '-',
});
