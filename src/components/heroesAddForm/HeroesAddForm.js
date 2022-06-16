import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { addHero } from '../heroesList/heroesSlice';
import {selectAll} from '../heroesFilters/filtersSlice';
import {useHttp} from '../../hooks/http.hook';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// не забывать про id 
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров
// json файл при этом можно дополнять
// форма должна быть контроллируемым компонентом, т.е. иметь внутреннее состояние
// валидация 
// анимации при появлении/удалении персонажей

const HeroesAddForm = () => {
    const dispatch = useDispatch();
    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const {request} = useHttp();
    const filters = useSelector(selectAll);

    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [element, setElement] = useState('');
    
    const onSubmitHandler = (e) => {
        e.preventDefault();
        
        const newHero = {
            id: uuidv4(),
            name,
            description: text,
            element,
        }

        request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newHero))
            .then(data => console.log(data, 'Sended'))
            .then(dispatch(addHero(newHero)))
            .catch(err => console.log(err));
        
        setName('');
        setText('');
        setElement('');
    }

    const renderFilters = (filters, status) => {
        if (status === 'loading') {
            return <option>Загрузка элементов...</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки.</option>
        }

        if (filters && filters.length > 0) {
            
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === "all") return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    onChange={(e) => setName(e.target.value)} 
                    required
                    type="text" 
                    name="name" 
                    value={name}
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    onChange={(e) => setText(e.target.value)}
                    required
                    name="text"
                    value={text} 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    onChange={(e) => setElement(e.target.value)}
                    required
                    className="form-select" 
                    value={element}
                    id="element" 
                    name="element">
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters,filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;