import React from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div>
      <h1>Modal</h1>
    </div>,
    document.body
  );
};

export default Modal;
