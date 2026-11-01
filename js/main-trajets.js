import { initialiser } from "./store.js";
import { renderPagination, renderTrajets } from "./render.js";
import { estComplet } from "./reservation.js";

const trips = await initialiser();
console.table(trips);

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const listT = document.getElementById("list-trajet");
const pagination = document.querySelector("#pagination");

const res = trips;

let pageActuelle = 1;
const limit = 6;

async function afficher(){

    search.addEventListener("input", e =>{
        e.preventDefault();

        const valeur = search.value.trim();
        

        const recherche = trips.filter(trip =>{
            return trip.departure.toLowerCase().includes(valeur) || trip.destination.toLowerCase().includes(valeur)
        });

        if(recherche.length === 0){
            listT.innerHTML = `<p class="text-center w-full"> Aucun trajet ne correspond.</p>`;
            return;
        }

        renderTrajets(recherche);
        pageActuelle = 1;
    });

    filter.addEventListener ("change",e =>{
        e.preventDefault();

        const statut = filter.value;

        const filtrage = trips.filter(trip =>{
            return statut === "tous" || (statut === "disponible" && !estComplet(trip)) || (statut === "complet" && estComplet(trip))
        });

        renderTrajets(filtrage);
        pageActuelle = 1;
    });

    function afficherPage(){
        const nbrPages = Math.ceil(res.length / limit);

        const start = (pageActuelle - 1) * limit ;

        const trajetsPages = res.slice(start,start + limit);

        renderPagination(pageActuelle,nbrPages);
        renderTrajets(trajetsPages);
    }
    
    pagination.addEventListener("click", e =>{
        const btn = e.target.closest("[data-page]");
        if(!btn || btn.disabled ) return;

        pageActuelle = Number(btn.dataset.page);

        

        afficherPage();
    });

    afficherPage();
}

afficher()