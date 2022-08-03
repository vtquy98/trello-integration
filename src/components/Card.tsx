import React from "react";

const Card = ({ onChange, id, title, description, onDelete, cardStyle, ...props }) => {
  const [value, setValue] = React.useState(title);
  const [editing, setEditing] = React.useState(false);
  const [deleteVisible, setDeleteVisible] = React.useState(false);

  const updateCard = (card) => {
    onChange({ title: card, id });
  };

  const updateValue = () => {
    setEditing(false);
    if (title !== value) {
      updateCard(value);
    }
  };

  return (
    <div
      className="card p-2 mb-2 position-relative"
      style={cardStyle}
      onMouseEnter={() => setDeleteVisible(true)}
      onMouseLeave={() => setDeleteVisible(false)}
    >
      {editing ? (
        <input
          onBlur={() => updateValue()}
          style={{ border: "none", width: "100%" }}
          value={value}
          onFocus={(e) => {
            e.target.select();
          }}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus
        />
      ) : (
        <div onClick={props.onClick}>
          <div className="text-wrap">{title}</div>

          {description && (
            <div>
              <hr className="mt-1 text-secondary" />
              <div className="text-wrap small text-secondary">
                {description}
              </div>
            </div>
          )}
        </div>
      )}
      {deleteVisible && (
        <span
          className="position-absolute d-flex justify-content-center align-items-center"
          style={{
            top: 5,
            right: 8,
            padding: 4,
            height: 10,
            width: 10,
            borderRadius: "50%",
            background: "#fef3f2",
            cursor: "pointer",
          }}
          onClick={() => onDelete()}
        >
          <i
            className="fa fa-trash"
            style={{ fontSize: 8, color: "#f04438" }}
          />
        </span>
      )}
    </div>
  );
};

export default Card;
