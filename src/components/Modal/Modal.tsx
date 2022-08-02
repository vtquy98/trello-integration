import React from "react";

export type ModalRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  modal: React.ReactElement;
  unSetModal: () => void;
};

const Modal = ({ modal, unSetModal }: Props) => {
  const [size, setSize] = React.useState("");
  const handleEscape = React.useCallback(
    (event) => {
      if (event.keyCode === 27) unSetModal();
    },
    [unSetModal]
  );

  React.useEffect(() => {
    if (modal) {
      const _size = modal.props["data-size"];

      if (_size && ["sm", "lg", "xl"].includes(_size)) setSize(_size);

      document.addEventListener("keydown", handleEscape, false);
    } else {
      setSize("");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [modal, unSetModal]);

  return (
    <div
      className={`modal ${modal && "fade show"} `}
      style={{ display: modal ? "block" : "none" }}
    >
      <div
        className={`modal-dialog modal-dialog-centered ${
          size ? `modal-${size}` : ""
        }`}
        style={{ zIndex: 2 }}
      >
        <div className="modal-content">{modal}</div>
      </div>
      <div className="modal-backdrop" style={{ zIndex: 1 }}/>
    </div>
  );
};

export default Modal;
