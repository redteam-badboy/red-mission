"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/avatar"
import { getInitials } from "@/lib/utils"

export default function UserAvatar({ fullName, image }) {
  const initials = getInitials(fullName)

  return (
    <Avatar className="size-10">
      {image ? (
        <AvatarImage src={image} alt={fullName} />
      ) : null}
      <AvatarFallback className="bg-secondary text-white font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
