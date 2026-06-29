import { Image, ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';

cssInterop(Image, { className: 'style' });

export type AppImageProps = ImageProps & {
  className?: string;
};

export function AppImage({
  contentFit = 'cover',
  transition = 200,
  className,
  ...props
}: AppImageProps) {
  return (
    <Image
      contentFit={contentFit}
      transition={transition}
      className={className}
      {...props}
    />
  );
}
