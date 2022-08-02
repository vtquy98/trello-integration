import axios from "axios";
import React from "react";
import Board from "react-trello";
import { Card, FormCard, ColHeader } from "./components";

const API = process.env.REACT_APP_API;
const BOARD_ID = process.env.REACT_APP_BOARD_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const KabanBoard = () => {
  const [list, setList] = React.useState([]);
 
  const [eventBus, setEventBus] = React.useState<any>(undefined);

  const onEventBus = (handle) => {
    setEventBus(handle);
  };

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
    console.log(
      "%c %c%claneId",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
      laneId
    );

    console.log(
      "%c %c%ccardInfo",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
      cardInfo
    );
    try {
      const res = await axios.post(
        `${API}/cards?idList=${laneId}&key=${API_KEY}&token=${API_TOKEN}`,
        {
          name: cardInfo.title,
          des: cardInfo.description,
          pos: "bottom",
        }
      );

      eventBus.publish({
        type: "ADD_CARD",
        laneId,
        card: {
          id: res.data.id,
          title: res.data.name,
          description: res.data.desc,
        },
      });
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

  const RenderColHeader = ({ onAddNewCard, ...props }) => {
    return <ColHeader onAddNewCard={onAddNewCard} {...props} />;
  };

  return (
    <div>
      {list && (
        <Board
          style={{ backgroundColor: "transparent", textAlign: "left" }}
          data={{ lanes: list }}
          handleDragEnd={handleDragEnd}
          onCardMoveAcrossLanes={onCardMoveAcrossLanes}
          onCardUpdate={onCardUpdate}
          onCardDelete={onCardDelete}
          laneDraggable={false}
          components={{
            NewCardForm: FormCard,
            Card,
            LaneHeader: (props) => (
              <RenderColHeader {...props} onAddNewCard={addCard} />
            ),
          }}
          eventBusHandle={onEventBus}
        />
      )}
    </div>
  );
};

export default KabanBoard;
