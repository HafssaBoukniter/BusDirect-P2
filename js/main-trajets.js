import { initialiser } from "./store.js";
import { renderPagination, renderTrajets } from "./render.js";
import { estComplet } from "./reservation.js";

const trips = await initialiser();

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const listT = document.getElementById("list-trajet");
const pagination = document.querySelector("#pagination");

let res = trips;

let pageActuelle = 1;
const limit = 6;

async function afficher(){

    function actualiser(){
        const valeur = search.value.trim();
        const statut = filter.value;

        res = trips.filter(trip =>{
            const recherche = trip.departure.toLowerCase().includes(valeur) || trip.destination.toLowerCase().includes(valeur);

            const filtrage = statut === "tous" || (statut === "disponible" && !estComplet(trip)) || (statut === "complet" && estComplet(trip));

            if(res.length === 0){
                listT.innerHTML = `<p class="text-center w-full"> Aucun trajet ne correspond.</p>`;
                return;
            }

            return recherche && filtrage;
        });

        pageActuelle = 1;
        afficherPage()
    }

    
    search.addEventListener("input", actualiser);
    filter.addEventListener ("change", actualiser);

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

    listT.addEventListener("click" ,e =>{
        const btn = e.target.closest(".ouvrir");

        if(!btn) return;

        const id = btn.dataset.id;

        location.href = `cabine.html?id=${id}`;
    });

    afficherPage();
    actualiser()
}

afficher()