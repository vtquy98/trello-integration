import React from "react";
import FormCard from "./FormCard";
import { useModal } from "./Modal";

const ColHeader = (props) => {
  const { id: colId, title, onAddNewCard } = props;

  const { setModal, unSetModal } = useModal();

  const NewCardModal = () => {
    return (
      <>
        <FormCard
          colId={colId}
          onClose={() => unSetModal && unSetModal()}
          defaultValue={{
            title: "",
            description: "",
          }}
          onSubmit={onAddNewCard}
        />
      </>
    );
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="fw-bold">{title}</div>
      <div className="" onClick={() => setModal && setModal(<NewCardModal />)}>
        Add
      </div>
    </div>
  );
};

export default ColHeader;
