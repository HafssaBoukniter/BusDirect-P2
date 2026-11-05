import { estComplet, placesLibres, recetteTrajet } from "./reservation.js";

export function renderTrajets(trips) {
    const listT = document.querySelector("#list-trajet");

    listT.innerHTML = trips.map(trip => {
        const { id, departure, destination, departureTime, arrivalTime, price, reservations, waitingList } = trip;
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

                <button data-id="${trip.id}" class="ouvrir bg-teal-800 text-white w-full rounded-xl p-2" type="submit">Gérer la cabine →</button>
            </div>
        `;
    }).join("");


    const totalPassager = trips.reduce((total, trip) => {
        return total + trip.reservations.length;
    }, 0);

    const nombrePassager = document.getElementById("nombre-passager");

    nombrePassager.textContent = totalPassager;

    const totalPrix = trips.reduce((total, trip) => {
        return total + (trip.price * trip.reservations.length);
    }, 0);

    const recetteTotal = document.getElementById("recette-total");

    recetteTotal.textContent = totalPrix
}

export function renderPagination(page, total) {
    const pagination = document.getElementById("pagination");

    if (!pagination) return;

    let pages = "";

    if (page > 1) {
        pages = ` 
            <button type="button" id="precedent" data-page="${page - 1}" ${page <= 1 ? "disabled" : ""}
                class="px-4 py-2 rounded-lg bg-teal-200 text-white hover:bg-teal-300"><</button>
        `;
    }


    for (let i = 1; i <= total; i++) {
        pages += `<button id="${i}" data-page="${i}" ${page === i ? "disabled" : ""} type="button" class="px-4 py-2 rounded-lg ${page === i ? "bg-teal-400" : "bg-teal-200"} hover:bg-teal-300 text-white">${i}</button>`;
    }

    if (page < total) {
        pages += `
            <button type="button" id="suivant" data-page="${page + 1}" ${page >= total ? "disabled" : ""}
                class="px-4 py-2 rounded-lg bg-teal-200 text-white hover:bg-teal-300">></button>
        `;
    }


    pagination.innerHTML = pages;
}

export function renderCabine(trip) {
    document.getElementById("trajet-titre").textContent = `${trip.departure} → ${trip.destination}`;

    document.getElementById("heure-depart").textContent = `${trip.departureTime}`;

    document.getElementById("heure-arrivee").textContent = `${trip.arrivalTime}`;

    document.getElementById("places-disponibles").textContent = placesLibres(trip);

    document.getElementById("prix-normal").textContent = `${trip.price}`;

    const prixVip = Math.round(trip.price * 1.1);
    document.getElementById("prix-vip").textContent = prixVip;

    document.getElementById("totale").textContent = recetteTrajet(trip);
}

export function renderListeAttente(trip) {
    const listAtt = document.querySelector("#listattente");
    if(estComplet(trip)){
        listAtt.innerHTML = `
            <div class="flex text-center justify-between">
                <h2 class="text-lg font-bold text-amber-600 mb-4">
                    <span class="inline-flex items-center justify-center bg-amber-500 text-white rounded-lg w-9 h-9 mr-2"><i class="fa-solid fa-user-clock" style="color: rgb(255, 255, 255);"></i></span>List d'attente
                </h2>

                <span class="bg-amber-100 text-amber-800 h-fit py-2 rounded-full px-3 text-sm font-semibold">
                    <span id="nombre-attente">${trip.waitingList.length}</span> personne(s)
                </span>
            </div>
            <form id="form-listattente">
                <div class="mb-3">
                    <label for="nom-attente" class="block text-sm font-medium mb-2">Nom du passager <span class="text-rose-500">*</span></label>
                    <input type="text" id="nom-listattente" name="nom" placeholder="Ex : Hafssa"  class="w-full border border-slate-300 rounded-lg  px-3 py-2.5 outline-none  focus:border-teal-500">
                    <p id="error-nom" class="text-sm mt-3"></p>
                </div>
                <div class="mb-3">
                    <label for="tel-listattente" class="block text-sm font-medium mb-2">Téléphone <span class="text-rose-500">*</span></label>
                        <input type="tel" id="tel-listattente" name="tel" placeholder="Ex : 06XXXXXXXX"  class="w-full border border-slate-300 rounded-lg  px-3 py-2.5 outline-none  focus:border-teal-500">
                        <p id="error-nom" class="text-sm mt-3"></p>
                </div>

                <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg py-3">Ajouter à list d'attente</button>

                <p id="message-listattente" role="status" aria-live="polite" class="text-sm mt-3"></p>
            </form>
        `;
    }else{
        listAtt.innerHTML = `
            <div class="opacity-50 flex text-center justify-between">
                <h2 class="text-lg font-bold text-amber-600 mb-4">
                    <span class="inline-flex items-center justify-center bg-amber-500 text-white rounded-lg w-9 h-9 mr-2"><i class="fa-solid fa-user-clock" style="color: rgb(255, 255, 255);"></i></span>List d'attente
                </h2>

                <span class="bg-amber-100 text-amber-800 h-fit py-2 rounded-full px-3 text-sm font-semibold">
                    <span id="nombre-attente">${trip.waitingList.length}</span> personne(s)
                </span>
            </div>
            <p class="w-full text-center text-sm mt-3 font-semibold rounded-lg p-3">Le formulaire d'inscription à la liste d'attente est désactivé.</p>
        `;
    }
}

export function listAttente(trip){
    const listAttAff = document.querySelector("#listAttenteAff");
    listAttAff.innerHTML = `
         <h2 class="text-lg font-bold text-amber-600 mb-4">List d'attente</h2>
        <div class="flex flex-col gap-3">
            ${trip.waitingList.map((p,index) => `
              <div class="waitPassager flex justify-between items-center p-3 bg-transparent rounded-lg border border-slate-300">
                    <div>
                        <p class="font-semibold text-gray-800">${index + 1}. ${p.name} - ${p.phone}</p>
                    </div>
                    <button  class="retirer bg-red-400 border border-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg" data-index="${index}">Retirer</button>
                </div>
            `).join("")}
        </div>
    `;
}

export function afficherMessage(el, texte) {
    el.textContent = `${texte}`;
        setTimeout(() => {
            el.textContent = "";
        }, 3000);
    return;
}