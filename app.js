
//Captura los datos del .json
const  getData = async() => {
    try{
        data_json = 'data.json';
        const response = await fetch(data_json);
        const data = await response.json(); 
        return data;
   
        console.log(data.results);
    } catch (error){
        console.log(error);
    }

}


class Box_cards {
    //declara objeto 
    static TIMES = {
        daily: 'day',
        weekly: 'week',
        monthly: 'month',
    }

    constructor(data, container = '.ficha__content', view = 'weekly') {
        this.data = data;
        this.container = document.querySelector(container);
        this.view = view;

        this.createMarkup();
    }

    createMarkup() {
        const { title, timeframes } = this.data;
        const { current, previous } = timeframes[this.view.toLowerCase()];
        const id = title.toLowerCase().replace(/ /g, '-');

        this.container.insertAdjacentHTML("beforeend",
            `<div class="contenedor__item contenedor__item--${id}">
        <article class="cards">
        <header class="cards__header">
          <h4 class="cards__title">${title}</h4>
          <img class="cards__menu" src="./images/icon-ellipsis.svg" alt="menu">
        </header>
        <div class="cards__body">
            <div class="cards__time">
              ${current}hrs
            </div>
            <div class="cards__prev-period">
              Last ${Box_cards.TIMES[this.view]} - ${previous}hrs
            </div>
        </div>
      </article>
    </div>`);
    
        this.time = document.querySelector(`.contenedor__item--${id} .cards__time`);
        this.prev = document.querySelector(`.contenedor__item--${id} .cards__prev-period`);
    }

    cambioVista(view) {
        this.view = view;
        const { current, previous } = this.data.timeframes[this.view.toLowerCase()];

        this.time.innerText = `${current}hrs`;
        this.prev.innerText = `Last ${Box_cards.TIMES[this.view]} - ${previous}hrs`;

    }

}

document.addEventListener('DOMContentLoaded', () => {
    getData().
        then(data => {
            const activities = data.map(activity => new Box_cards(activity));
            const selectors = document.querySelectorAll('.view-selector__item');

            selectors.forEach(selector => {
                selector.addEventListener('click', (e) => {
                    selectors.forEach(el => {
                        el.classList.remove('view-selector__item--active');
                    });
                    selector.classList.add('view-selector__item--active');
                    const currentView = selector.innerText.toLowerCase().trim();
                    activities.forEach(activity => activity.cambioVista(currentView)); 
                });
            });
        });
});