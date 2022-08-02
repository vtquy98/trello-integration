import React from "react";
import Modal from "./Modal";

const ModalContext = React.createContext<{
  unSetModal?: () => void;
  setModal?: React.Dispatch<any>;
}>({
  unSetModal: undefined,
  setModal: undefined,
});

type Props = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const [modal, setModal] = React.useState<any>();
  const unSetModal = React.useCallback(() => setModal(undefined), [setModal]);

  return (
    <ModalContext.Provider value={{ unSetModal, setModal }}>
      {children}
      <Modal modal={modal} unSetModal={unSetModal} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};
