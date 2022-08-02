import axios from "axios";
import React from "react";
import Board from "react-trello";

const API = process.env.REACT_APP_API;
const BOARD_ID = process.env.REACT_APP_BOARD_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const KabanBoard = () => {
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    const getList = async () => {
      try {
        const list = await fetch(
          `${API}/boards/${BOARD_ID}/lists?key=${API_KEY}&token=${API_TOKEN}&cards=all`
        );
        const listData = await list.json();

        const data = listData?.map((item) => {
          return {
            id: item.id,
            title: item.name,
            // label: '20/70',
            style: { width: 280 },
            cards: item.cards.map((c) => ({
              id: c.id,
              title: c.name,
              // label: '15 mins',
              cardStyle: {
                width: 270,
                maxWidth: 270,
                margin: "auto",
                marginBottom: 5,
              },
              description: c.desc,
            })),
          };
        });
        setList(data);
      } catch (error) {
        console.error(error);
      }
    };

    getList();
  }, []);

  const updateCard = async (cardId: string, vars: Object) => {
    try {
      const res = await axios.put(
        `${API}/cards/${cardId}?key=${API_KEY}&token=${API_TOKEN}`,
        vars
      );

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const addCard = async (laneId: string, cardInfo: any) => {
    try {
      const res = await axios.post(
        `${API}/cards?idList=${laneId}&key=${API_KEY}&token=${API_TOKEN}`,
        {
          name: cardInfo.title,
          des: cardInfo.description,
          pos: "bottom",
        }
      );

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    updateCard(cardId, {
      pos: position,
    });
  };

  const onCardMoveAcrossLanes = (fromLaneId, toLaneId, cardId, index) => {
    if (fromLaneId !== toLaneId) {
      updateCard(cardId, {
        idList: toLaneId,
      });
    }
  };

  const onCardAdd = (card, laneId) => {
    addCard(laneId, card);
  };

  const onCardUpdate = (_, data) => {
    updateCard(data.id, {
      name: data.title,
    });
  };

  const onDeleteCard = async (cardId: string) => {
    try {
      const res = await axios.delete(
        `${API}/cards/${cardId}?key=${API_KEY}&token=${API_TOKEN}`
      );

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const onCardDelete = (cardId, laneId) => {
    onDeleteCard(cardId);
  };

  return (
    <div>
      {list && (
        <Board
          style={{ backgroundColor: "white", justifyContent: "center" }} // Style
          data={{ lanes: list }}
          draggable
          handleDragEnd={handleDragEnd}
          onCardMoveAcrossLanes={onCardMoveAcrossLanes}
          onCardUpdate={onCardUpdate}
          onCardAdd={onCardAdd}
          onCardDelete={onCardDelete}
          laneDraggable={false}
          editable
          labelStyle={{ display: "none" }}
          components={{ NewCardForm, Card }}
        />
      )}
    </div>
  );
};

const Card = ({ onChange, id, title, description, onDelete }) => {
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
      style={{ width: 260 }}
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
        <>
          <div className="text-wrap" onClick={() => setEditing(true)}>
            {title}
          </div>

          {description && (
            <>
              <hr className="mt-1 text-secondary" />
              <div className="text-wrap small text-secondary">
                {description}
              </div>
            </>
          )}
        </>
      )}
      {deleteVisible && (
        <span
          className="position-absolute d-flex justify-content-center align-items-center"
          style={{
            top: 5,
            right: 10,
            padding: 4,
            height: 16,
            width: 16,
            borderRadius: "50%",
            background: "#fef3f2",
            cursor: "pointer",
          }}
          onClick={() => onDelete()}
        >
          <i
            className="fa fa-trash"
            style={{ fontSize: 10, color: "#f04438" }}
          />
        </span>
      )}
    </div>
  );
};

const NewCardForm = (props) => {
  const [title, setTitle] = React.useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      props.onCancel();
    }
  };

  return (
    <form className="d-flex" onSubmit={() => props.onAdd({ title })}>
      <input
        onKeyDown={handleKeyDown}
        className="form-control form-control-sm"
        onChange={(e) => {
          e.stopPropagation();
          setTitle(e.target.value);
        }}
        placeholder="Add a card..."
        value={title}
        autoFocus
      />
      <button className="btn" type="submit">
        Submit
      </button>
    </form>
  );
};

export default KabanBoard;
