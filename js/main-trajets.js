import { initialiser } from "./store.js";
import { renderTrajets } from "./render.js";
import { estComplet } from "./reservation.js";

const trips = await initialiser();
console.table(trips);

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const listT = document.getElementById("list-trajet");

async function afficher(){
    renderTrajets(trips);

    search.addEventListener("input", e =>{
        e.preventDefault();

        const valeur = search.value.trim();
        

        const res = trips.filter(trip =>{
            return trip.departure.toLowerCase().includes(valeur) || trip.destination.toLowerCase().includes(valeur)
        });

        if(res.length === 0){
            listT.innerHTML = `<p class="text-center w-full"> Aucun trajet ne correspond.</p>`;
            return;
        }

        renderTrajets(res);
    });

    filter.addEventListener ("change",e =>{
        e.preventDefault();

        const statut = filter.value;

        const filtrage = trips.filter(trip =>{
            return statut === "tous" || (statut === "disponible" && !estComplet(trip)) || (statut === "complet" && estComplet(trip))
        });

        renderTrajets(filtrage);
    });
}

afficher()