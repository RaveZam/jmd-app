"use client";

import type { FormEvent, ReactElement, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type NewProduct = { name: string; price: number };

type AddProductModalProps = {
  onClose: () => void;
  onAdd: (product: NewProduct) => void;
};

function ModalOverlay({ onClose }: { onClose: () => void }): ReactElement {
  return (
    <button
      type="button"
      className="absolute inset-0 bg-black/40"
      aria-label="Close"
      onClick={onClose}
    />
  );
}

function ModalPanel({ children }: { children: ReactNode }): ReactElement {
  return (
    <div className="pointer-events-auto w-full max-w-lg rounded-2xl border bg-background shadow-xl">
      {children}
    </div>
  );
}

function ModalHeader({
  titleId,
  onClose,
}: {
  titleId: string;
  onClose: () => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
      <div>
        <h2 id={titleId} className="text-base font-semibold">
          Add New Product
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Stored temporarily (will reset on reload).
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-xl"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

function NameField({
  id,
  value,
  onChange,
  inputRef,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}): ReactElement {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        Product Name
      </label>
      <Input
        ref={inputRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Ensaymada"
        className="rounded-2xl"
      />
    </div>
  );
}

function PriceField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}): ReactElement {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        Price
      </label>
      <Input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 25"
        className="rounded-2xl"
      />
    </div>
  );
}

function FormActions({ onClose }: { onClose: () => void }): ReactElement {
  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      <Button type="button" variant="outline" className="rounded-2xl" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" className="rounded-2xl">
        Add Product
      </Button>
    </div>
  );
}

function AddProductForm({
  nameId,
  priceId,
  nameRef,
  onClose,
  onAdd,
}: {
  nameId: string;
  priceId: string;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onAdd: (product: NewProduct) => void;
}): ReactElement {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = name.trim();
    const numeric = Number(price);
    if (!trimmed) return;
    if (!Number.isFinite(numeric) || numeric < 0) return;
    onAdd({ name: trimmed, price: numeric });
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4 px-5 py-4">
      <NameField id={nameId} value={name} onChange={setName} inputRef={nameRef} />
      <PriceField id={priceId} value={price} onChange={setPrice} />
      <FormActions onClose={onClose} />
    </form>
  );
}

function AddProductPortal({
  titleId,
  nameId,
  priceId,
  nameRef,
  onClose,
  onAdd,
}: {
  titleId: string;
  nameId: string;
  priceId: string;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onAdd: (product: NewProduct) => void;
}): ReactElement {
  return createPortal(
    <div className="fixed inset-0 z-50" aria-labelledby={titleId} role="dialog" aria-modal="true">
      <ModalOverlay onClose={onClose} />
      <div className="pointer-events-none relative flex h-full w-full items-start justify-center p-4 sm:p-8">
        <ModalPanel>
          <ModalHeader titleId={titleId} onClose={onClose} />
          <AddProductForm nameId={nameId} priceId={priceId} nameRef={nameRef} onClose={onClose} onAdd={onAdd} />
        </ModalPanel>
      </div>
    </div>,
    document.body
  );
}

export function AddProductModal({ onClose, onAdd }: AddProductModalProps): ReactElement | null {
  const titleId = `${useId()}-title`;
  const nameId = useId();
  const priceId = useId();
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return (): void => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;
  return (
    <AddProductPortal
      titleId={titleId}
      nameId={nameId}
      priceId={priceId}
      nameRef={nameRef}
      onClose={onClose}
      onAdd={onAdd}
    />
  );
}

