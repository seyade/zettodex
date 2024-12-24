import { Cross, CrossIcon, X } from "lucide-react";
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
    <div className="fixed z-10 flex inset-0 p-4 w-full h-full items-center justify-center overflow-y-auto bg-slate-950 bg-opacity-75 transition-all duration-300">
      <div className="w-full max-w-lg rounded-lg bg-stone-800 p-4 shadow-lg">
        <div>
          <div className="cursor-pointer float-right" onClick={onClose}>
            <X />
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
