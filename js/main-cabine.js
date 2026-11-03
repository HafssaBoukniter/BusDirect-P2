import { initialiser } from "./store.js";
import { renderCabine,renderListeAttente } from "./render.js";
import { reserver,modifier,annuler,inscrireEnAttente,retirerDeAttente } from "./reservation.js";

const id = Number(new URLSearchParams(location.search).get("id"));
const tripInfo = document.querySelector("#trip-information");
const sieges = document.querySelectorAll(".siege");
const selectReservation = document.getElementById("siege-reservation");
const updateSelect = document.getElementById("nouveau-siege");
const passagerSelectModif = document.querySelector("#passager-modification");
const passagerSupp = document.querySelector("#passager-suppression");
const mainBody = document.querySelector(".main-body");



function reservationSelect() {
    selectReservation.innerHTML = '<option value="">Sélectionner un siège</option>';
    updateSelect.innerHTML = '<option value="">Sélectionner un nouveau siège</option>';

    sieges.forEach(siege => {
        if (siege.classList.contains("libre")) {
            const option = document.createElement("option");

            option.value = siege.dataset.seat;
            option.textContent = `Siège ${siege.dataset.seat}`;

            selectReservation.appendChild(option);
            updateSelect.appendChild(option.cloneNode(true));
        }
    });
}

function modifSuppPassSelect() {
    passagerSelectModif.innerHTML = '<option value="">Choisir un passager</option>';
    passagerSupp.innerHTML = '<option value="">Choisir un passager</option>';

    sieges.forEach(siege => {
        if (siege.classList.contains("occupe")) {
            const passager = siege.querySelector(".nomText");

            if (passager) {
                const nom = passager.textContent.trim();
                const numS = siege.dataset.seat;

                const option1 = document.createElement("option");
                option1.value = numS;
                option1.textContent = nom;

                passagerSelectModif.appendChild(option1);
                passagerSupp.appendChild(option1.cloneNode(true));
            }
        }
    });
}

async function afficherTout() {
    const trips = await initialiser();

    const trip = trips.find(trip => trip.id === id);

    if(!trip){
        tripInfo.innerHTML = `
            <div class="h-75 flex items-center justify-center w-full">
                <p text-center text-slate-500>Trajet introuvable</p>
            </div>
        `;
        mainBody.style.display = "none";
        return;
    }

    sieges.forEach(siege =>{
        const nomPassager = siege.querySelector(".nomText");
        const phonePassager = siege.querySelector(".phoneText");
        let result=trip.reservations.find(tt=>{
            return Number(siege.dataset.seat) === Number(tt.seat)
        });
        if(result){
            nomPassager.textContent = result.name;
            phonePassager.textContent =result.phone;
            siege.classList.add("occupe");
            siege.classList.remove("libre");
        }
    });


    reservationSelect();
    modifSuppPassSelect();
    renderCabine(trip);
}

afficherTout();