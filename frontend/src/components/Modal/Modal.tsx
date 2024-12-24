import { CrossIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
};

const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="w-1/3 p-6 bg-teal-950 rounded-lg">
      <div className="flex">
        {title && <h2>{title}</h2>}{" "}
        <div onClick={onClose}>
          <CrossIcon />
        </div>
      </div>

      <div>{children}</div>
    </div>,
    document.body
  );
};

export default Modal;
