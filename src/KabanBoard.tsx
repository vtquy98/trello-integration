import React from "react";
import axios from "axios";
import Board from "react-trello";

import { Card, FormCard, ColHeader } from "./components";
import { useModal } from "./components/Modal";

const API = process.env.REACT_APP_API;
const BOARD_ID = process.env.REACT_APP_BOARD_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const KabanBoard = () => {
  const [list, setList] = React.useState<Array<any>>([]);
  const [eventBus, setEventBus] = React.useState<any>(undefined);
  const { setModal, unSetModal } = useModal();

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
            style: { minWidth: 360, backgroundColor: "#eef2f6" },
            cards: item.cards.map((c) => ({
              id: c.id,
              title: c.name,
              cardStyle: {
                width: 340,
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

  const updateCard = async (
    cardId: string,
    vars: Object,
    noReload?: boolean
  ) => {
    try {
      const res = await axios.put(
        `${API}/cards/${cardId}?key=${API_KEY}&token=${API_TOKEN}`,
        vars
      );

      if (!noReload) {
        //trigger event to update data returned from trello
        eventBus.publish({
          type: "UPDATE_CARD",
          laneId: res.data.idList,
          card: {
            id: res.data.id,
            title: res.data.name,
            description: res.data.desc,
            cardStyle: {
              width: 340,
            },
          },
        });

        //update data in the state
        const newList = list.map((item) => {
          if (item.id === res.data.idList) {
            return {
              ...item,
              cards: item.cards.map((c) => {
                if (c.id === res.data.id) {
                  return {
                    id: res.data.id,
                    title: res.data.name,
                    description: res.data.desc,
                    cardStyle: {
                      width: 340,
                    },
                  };
                }
                return c;
              }),
            };
          }
          return item;
        });
        setList(newList);
      }

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
          desc: cardInfo.description,
          pos: "bottom",
        }
      );

      //trigger event to update data with id returned from trello
      eventBus.publish({
        type: "ADD_CARD",
        laneId,
        card: {
          id: res.data.id,
          title: res.data.name,
          description: res.data.desc,
          cardStyle: {
            width: 340,
          },
        },
      });

      //update data in the state
      const newList = list.map((item: any) => {
        if (item.id === laneId) {
          item.cards.push({
            id: res.data.id,
            title: res.data.name,
            description: res.data.desc,
            cardStyle: {
              width: 340,
            },
          });
        }
        return item;
      });
      setList(newList);
    } catch (err) {
      console.error(err);
    }
  };

  // const handleDragEnd = (
  //   cardId,
  //   sourceLaneId,
  //   targetLaneId,
  //   position,
  //   cardDetails
  // ) => {
  //   //TODO: need to check later
  //   updateCard(cardId, {
  //     pos: position,
  //   });
  // };

  const onCardMoveAcrossLanes = (fromLaneId, toLaneId, cardId, index) => {
    if (fromLaneId !== toLaneId) {
      //update card in the state
      const card = list
        .find((item: any) => item.id === fromLaneId)
        ?.cards.find((item: any) => item.id === cardId);

      const newList = list.map((item: any) => {
        if (item.id === fromLaneId) {
          item.cards.splice(index, 1);
        }
        if (item.id === toLaneId) {
          item.cards.push(card);
        }
        return item;
      });
      setList(newList);

      updateCard(
        cardId,
        {
          idList: toLaneId,
        },
        true
      );
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

  const onCardClicked = (cardId, metadata, laneId) => {
    const cards = list.find((item) => item.id === laneId);
    const data = cards?.cards.find((item) => item.id === cardId);
    setModal &&
      setModal(
        <FormCard
          colId={laneId}
          onClose={() => unSetModal && unSetModal()}
          defaultValue={{
            title: data.title,
            description: data.description,
          }}
          onSubmit={(_, cardInfo) =>
            updateCard(cardId, {
              name: cardInfo.title,
              desc: cardInfo.description,
            })
          }
        />
      );
  };

  return (
    <div>
      {list && (
        <Board
          style={{
            backgroundColor: "white",
            textAlign: "left",
            minWidth: "100vw",
          }}
          data={{ lanes: list }}
          // handleDragEnd={handleDragEnd}
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
          onCardClick={onCardClicked}
        />
      )}
    </div>
  );
};

export default KabanBoard;
