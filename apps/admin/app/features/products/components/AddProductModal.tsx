"use client";

import type { FormEvent, ReactElement, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddProductModalProps } from "../types/product-types";
import { ModalPanel } from "./ModalPane";
import { ModalOverlay } from "./ModalOverlay";

export type NewProduct = { name: string; price: number };

function ModalHeader({
  titleId,
  title,
  onClose,
}: {
  titleId: string;
  title: string;
  onClose: () => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
      <div>
        <h2 id={titleId} className="text-base font-semibold">
          {title}
        </h2>
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
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  error?: string;
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
        className={`rounded-2xl ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PriceField({
  id,
  value,
  onChange,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}): ReactElement {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        Price
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          ₱
        </span>
        <Input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className={`rounded-2xl pl-7 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FormActions({
  onClose,
  submitLabel,
}: {
  onClose: () => void;
  submitLabel: string;
}): ReactElement {
  return (
    <div className="flex items-center justify-end gap-2 pt-1">
      <Button
        type="button"
        variant="outline"
        className="rounded-2xl"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button type="submit" className="rounded-2xl">
        {submitLabel}
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
  initialValues,
}: {
  nameId: string;
  priceId: string;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onAdd: (product: NewProduct) => void;
  initialValues?: NewProduct;
}): ReactElement {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [price, setPrice] = useState(
    initialValues ? String(initialValues.price) : "",
  );
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = name.trim();
    const numeric = Number(price);
    let valid = true;

    if (!trimmed) {
      setNameError("Product name is required.");
      valid = false;
    } else {
      setNameError("");
    }

    if (price === "" || !Number.isFinite(numeric) || numeric < 0) {
      setPriceError("Enter a valid price (0 or more).");
      valid = false;
    } else {
      setPriceError("");
    }

    if (!valid) return;
    onAdd({ name: trimmed, price: numeric });
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4 px-5 py-4">
      <NameField
        id={nameId}
        value={name}
        onChange={(v) => { setName(v); if (v.trim()) setNameError(""); }}
        inputRef={nameRef}
        error={nameError}
      />
      <PriceField
        id={priceId}
        value={price}
        onChange={(v) => { setPrice(v); if (v) setPriceError(""); }}
        error={priceError}
      />
      <FormActions
        onClose={onClose}
        submitLabel={initialValues ? "Save Changes" : "Add Product"}
      />
    </form>
  );
}

function AddProductPortal({
  titleId,
  title,
  nameId,
  priceId,
  nameRef,
  onClose,
  onAdd,
  initialValues,
}: {
  titleId: string;
  title: string;
  nameId: string;
  priceId: string;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onAdd: (product: NewProduct) => void;
  initialValues?: NewProduct;
}): ReactElement {
  return createPortal(
    <div
      className="fixed inset-0 z-50"
      aria-labelledby={titleId}
      role="dialog"
      aria-modal="true"
    >
      <ModalOverlay onClose={onClose} />
      <div className="pointer-events-none relative flex h-full w-full items-center justify-center p-4 sm:p-8">
        <ModalPanel>
          <ModalHeader titleId={titleId} title={title} onClose={onClose} />
          <AddProductForm
            nameId={nameId}
            priceId={priceId}
            nameRef={nameRef}
            onClose={onClose}
            onAdd={onAdd}
            initialValues={initialValues}
          />
        </ModalPanel>
      </div>
    </div>,
    document.body,
  );
}

export function AddProductModal({
  onClose,
  onAdd,
  initialValues,
  title,
}: AddProductModalProps): ReactElement | null {
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
      title={title ?? "Add New Product"}
      nameId={nameId}
      priceId={priceId}
      nameRef={nameRef}
      onClose={onClose}
      onAdd={onAdd}
      initialValues={initialValues}
    />
  );
}
