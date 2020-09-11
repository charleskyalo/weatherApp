let message ;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js').then(registration => {
        message = ("service worker registered ");
    }).catch(error => {
        message = ("service worker registration failed");
    });
}

const form = document.querySelector('.banner form');
const input = document.querySelector('.banner input');
const msg = document.querySelector('.banner .message');
const list = document.querySelector('.api-cities .cities');

const apiKey = "0e72ebcbf2bd4cc2b6bbda3a14280a0d";
form.addEventListener('submit',
    e => {
        e.preventDefault();
        const inputVal = input.value;

        const listItems = list.querySelectorAll(".api-cities .city");
       
        const listItemsArray = Array.from(listItems);

        if (listItemsArray.length > 0) {
            const filteredArray = listItemsArray.filter(el => {
                let content = "";
                //kenya
                if (inputVal.includes(",")) {
                    //we can only keep the first art of the input.
                    if (inputVal.split(",")[1].length > 2) {
                        inputVal = inputVal.split(",")[0];
                        content = el
                            .querySelector(".city-name span")
                            .textContent.toLowerCase();
                    } else {
                        content = el.querySelector(".city-name").dataset.name.toLowerCase();
                    }
                } else {
                    //kenya
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                }
                return content == inputVal.toLowerCase();
            });

            if (filteredArray.length > 0) {
                msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } ...otherwise be more specific by providing the country code as well 😉`;
                form.reset();
                input.focus();
                return;
            }
        }
        /* fetch data from the AP1 */

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                /* manipulate the data fron here */
                const {
                    main,
                    name,
                    sys,
                    weather
                } = data;
                const icon = `https://openweathermap.org/img/wn/${
                    weather[0]["icon"]
                    }@2x.png`;


                const li = document.createElement("li");
                li.classList.add('city');

                const markup = `
<h2 class="city-name" data-name="${name},${sys.country}" >
<span>${name}</span>
<sup>${sys.country}</sup> </h2>
<div class = 'city-temp'>${Math.round(main.temp)}<sup>°C</sup></div>
<figure>
<img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
<figcaption>${weather[0]["description"]}</figcaption>
</figure>
`;
                li.innerHTML = markup;
                list.appendChild(li);
            })
            /* handle errors */
            .catch((error) => {
                msg.textContent = "Please search for a valid city 😩";

            })

        msg.textContent = "";
        form.reset();
        input.focus();



    })