import React from "react";

const FormCard = ({ colId, defaultValue, onSubmit, onClose }) => {
  const { title = "", description = "" } = defaultValue;

  const [t, setT] = React.useState(title);
  const [d, setD] = React.useState(description);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(colId, {
          title: t,
          description: d,
        });
        onClose();
      }}
    >
      <div className="modal-body">
        <div className="mb-3">
          <label className="form-label">Card title</label>
          <input
            className="form-control"
            value={t}
            onChange={(e) => setT(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={d}
            onChange={(e) => setD(e.target.value)}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button type="submit" className="btn btn-primary">
          Save changes
        </button>
      </div>
    </form>
  );
};

export default FormCard;
