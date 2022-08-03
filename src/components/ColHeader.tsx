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
          padding: 8,
          height: 20,
          width: 20,
          borderRadius: "50%",
          background: "#0d6eac",
          cursor: "pointer",
        }}
        onClick={() => setModal && setModal(<NewCardModal />)}
      >
        <i className="fa fa-plus" style={{ fontSize: 12, color: "white" }} />
      </span>
    </div>
  );
};

export default ColHeader;
