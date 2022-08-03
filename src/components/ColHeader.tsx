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
    <div className="d-flex justify-content-between align-items-center">
      <div className="fw-bold">{title}</div>
      <span
        className=" d-flex justify-content-center align-items-center"
        style={{
          padding: 4,
          height: 16,
          width: 16,
          borderRadius: "50%",
          background: "#fef3f2",
          cursor: "pointer",
        }}
        onClick={() => setModal && setModal(<NewCardModal />)}
      >
        <i className="fa fa-plus" style={{ fontSize: 12, color: "#0d6eac" }} />
      </span>
    </div>
  );
};

export default ColHeader;
