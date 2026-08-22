"use client";

import { Avatar } from "@heroui/react";
import { useLanguage } from "../language-provider";
import { shellCopy } from "./shell-copy";

export function Brand() {
  const { language } = useLanguage();
  const t = shellCopy[language];

  return (
    <div className="brand" aria-label={t.brand}>
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-copy">
        <strong>{t.brand}</strong>
        <small>{t.brandSubtitle}</small>
      </span>
    </div>
  );
}

export function UserAvatar() {
  const { language } = useLanguage();

  return (
    <Avatar size="sm" color="accent" variant="soft">
      <Avatar.Fallback>{shellCopy[language].userInitials}</Avatar.Fallback>
    </Avatar>
  );
}
