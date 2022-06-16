import { useHttp } from "../../hooks/http.hook";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";


import { heroDelete, fetchHeroes, filteredHeroesSelector } from "./heroesSlice";

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния,
// т.е. из state, к-ый в reducer удаляем персонажа из массива,
// сохраняя принцип иммутабельности
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE
// как пользоваться DELETE написано в документации json-server
// мы посылаем запрос с методом DELETE и указываем id

const HeroesList = () => {
  const filteredHeroes = useSelector(filteredHeroesSelector);
  const heroesLoadingStatus = useSelector(
    (state) => state.heroes.heroesLoadingStatus
  );
  const dispatch = useDispatch();
  const { request } = useHttp();

  const onDelete = useCallback((id) => {
    request(`http://localhost:3001/heroes/${id}`, "DELETE")
      .then((data) => console.log(data, "Deleted"))
      .then(dispatch(heroDelete(id)))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // fetchHeroes(request);
    dispatch(fetchHeroes());
    // eslint-disable-next-line
  }, []);

  if (heroesLoadingStatus === "loading") {
    return <Spinner />;
  } else if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  return (
    <ul>
      {filteredHeroes.length === 0 ? (
        <h5 className="text-center mt-5">Героев пока нет</h5>
      ) : (
        filteredHeroes.map(({ id, ...props }) => {
          return (
            <HeroesListItem
              deleteHero={() => onDelete(id)}
              key={id}
              {...props}
            />
          );
        })
      )}
    </ul>
  );
};

export default HeroesList;
