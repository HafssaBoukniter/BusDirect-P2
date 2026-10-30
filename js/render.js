import { estComplet,placesLibres } from "./reservation.js";

export function renderTrajets(trips){
    const listT = document.querySelector("#list-trajet");

    listT.innerHTML = trips.map(trip =>{
        const  {id, departure, destination, departureTime, arrivalTime, price, reservations, waitingList} = trip;
        const Complet = estComplet(trip);
        const placesLibre = placesLibres(trip);

        return `
            <div class="card mx-auto w-full max-w-2xl rounded-[22px] border border-teal-300 bg-white p-6">
                <div class="flex items-center justify-between gap-3 mb-4">
                    <h5 class="text-base font-semibold text-teal-800">
                        Trajet #<span id="identif">${trip.id}</span>
                    </h5>
                    <span id="disponibilite" class="rounded-full text-sm font-semibold p-2 ${Complet ? "bg-red-200 text-red-700" : "bg-emerald-200 text-emerald-700"}">${Complet ? "Complet" : "Disponible"}</span>
                </div>
                <div class="flex items-center gap-3 mb-3">
                    <span id="departure" class="text-xl font-bold text-teal-800"><i class="text-teal-800 fa-solid fa-location-dot"></i>${trip.departure}</span>

                    <span class="text-xl text-teal-800">→</span>

                    <span id="destination" class="text-xl font-bold text-teal-800"><i class="text-teal-800 fa-solid fa-location-dot"></i>${trip.destination}</span>
                </div>

                <div class="border border-b border-slate-200 mb-3"></div>

                <div class="flex gap-4 justify-center mb-3">
                    <div class="text-teal-800">
                        <i class="fa-regular fa-clock"></i>
                        <span id="depart" class="text-black">${trip.departureTime}</span>
                    </div>

                    <div class="border border-r border-slate-300"></div>

                    <div class="text-teal-800">
                        <i class="fa-regular fa-clock"></i>
                        <span id="arrivee" class="text-black">${trip.arrivalTime}</span>
                    </div>

                    <div class="border border-r border-slate-300"></div>

                    <div class="text-teal-800">
                        <i class="fa-solid fa-coins"></i>
                        <span id="prix" class="text-black">${trip.price}</span>
                    </div>
                </div>

                <div class="flex items-center gap-3 mb-3">
                    <div class="bg-teal-50 p-3 w-full rounded-xl flex items-center gap-3">
                        <i class="fa-solid fa-chair"></i>
                        <div class="flex flex-col gap-1">
                            <span>Places libres</span>
                            <span id="places-libres" class="text-xl">${placesLibre}/20</span>
                        </div>
                    </div>
                    <div class="bg-teal-50 p-3 rounded-xl w-full flex items-center gap-3">
                        <i class="fa-solid fa-users"></i>
                        <div class="flex flex-col gap-1">
                            <span>En attente</span>
                            <span id="en-attente" class="text-xl">${trip.waitingList.length}</span>
                        </div>
                    </div>
                </div>

                <button class="bg-teal-800 text-white w-full rounded-xl p-2" type="submit"><a href="cabine.html">Gérer la cabine →</a></button>
            </div>
        `;
    }).join("");


    const totalPassager = trips.reduce((total,trip) => {
        return total + trip.reservations.length;
    },0);

    const nombrePassager = document.getElementById("nombre-passager");

    nombrePassager.textContent = totalPassager;

    const totalPrix = trips.reduce((total,trip) => {
        return total + (trip.price * trip.reservations.length);
    },0);

    const recetteTotal = document.getElementById("recette-total");

    recetteTotal.textContent = totalPrix
}

export function renderPagination(page, total){

}

export function renderCabine(trip){

}

export function renderListeAttente(trip){

}

export function afficherMessage(el, texte){

}