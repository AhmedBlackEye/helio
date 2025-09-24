import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";
import { useMemo } from "react";
import { Avatar, AvatarImage } from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";

interface DicebearAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  badgeClassName?: string;
  imageUrl?: string;
  badgeImageUrl?: string;
}

export const DicebearAvatar = ({
  seed,
  size = 32,
  className,
  badgeClassName,
  imageUrl,
  badgeImageUrl,
}: DicebearAvatarProps) => {
  const avatarSrc = useMemo(() => {
    if (imageUrl) return imageUrl;
    const avatar = createAvatar(glass, {
      seed: seed.toLowerCase().trim(),
      size,
    });
    return avatar.toDataUri();
  }, [seed, size, imageUrl]);

  const badgeSize = Math.round(size * 0.5);

  return (
    <div className="relative inline-block">
      <Avatar
        className={cn("border", className)}
        style={{ width: size, height: size }}
      >
        <AvatarImage alt="Avatar" src={avatarSrc} />
      </Avatar>
      {badgeImageUrl && (
        <div
          className={cn(
            "border-background absolute bottom-0 right-0 flex items-center justify-center overflow-hidden rounded-full border-2",
            badgeClassName,
          )}
          style={{
            width: badgeSize,
            height: badgeSize,
            transform: "translate(15%, 15%)",
          }}
        >
          <img
            alt="Badge"
            className="h-full w-full object-cover"
            height={badgeSize}
            src={badgeImageUrl}
            width={badgeSize}
          />
        </div>
      )}
    </div>
  );
};
