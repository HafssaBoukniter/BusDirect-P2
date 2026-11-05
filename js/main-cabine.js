import { initialiser, sauvegarder } from "./store.js";
import { afficherMessage, renderCabine,renderListeAttente } from "./render.js";
import { reserver,modifier,annuler,inscrireEnAttente,retirerDeAttente, estVIP, prixSiege } from "./reservation.js";
import { validerPassager } from "./validators.js";

const id = Number(new URLSearchParams(location.search).get("id"));
const tripInfo = document.querySelector("#trip-information");
const sieges = document.querySelectorAll(".siege");
const selectReservation = document.getElementById("siege-reservation");
const passagerReserve = document.querySelector("#nom-reservation");
const phonePassager = document.querySelector("#tel-reservation");
const updateSelect = document.getElementById("nouveau-siege");
const passagerSelectModif = document.querySelector("#passager-modification");
const passagerSupp = document.querySelector("#passager-suppression");
const mainBody = document.querySelector(".main-body");
const formRes = document.getElementById("form-reservation");
const parReserver = document.querySelector("#message-reservation");
const formModif = document.getElementById("form-modification");
const formSupp = document.getElementById("form-suppression");
const nouveauNom = document.querySelector("#nouveau-nom");
const nouveauPhone = document.querySelector("#nouveau-phone");
const parModif = document.querySelector("#message-modification");
const parSupp = document.querySelector("#message-suppression");


function sauvegarderTrips(){
    sauvegarder(trips);
}

const trips = await initialiser();

function actualiserSiege(trip){
    sieges.forEach(siege =>{
        const nomPassager = siege.querySelector(".nomText");
        const phoneSiege = siege.querySelector(".phoneText");
        let result=trip.reservations.find(tt=>{
            return Number(siege.dataset.seat) === Number(tt.seat)
        });
        if(result){
            nomPassager.textContent = result.name;
            phoneSiege.textContent =result.phone;
            siege.classList.add("occupe");
            siege.classList.remove("libre");
        }else{
            nomPassager.textContent = "Libre";
            phoneSiege.textContent = "";
            siege.classList.add("libre");
            siege.classList.remove("occupe");
        }
    });
}


function reservationSelect(trip) {
    selectReservation.innerHTML = '<option value="">Sélectionner un siège</option>';
    updateSelect.innerHTML = '<option value="">Sélectionner un nouveau siège</option>';

    sieges.forEach(siege => {
        if (siege.classList.contains("libre")) {
            const numSiege = Number(siege.dataset.seat);
            const option = document.createElement("option");

            option.value = numSiege;
            option.textContent = estVIP(numSiege) ?`Siège ${siege.dataset.seat} - VIP - ${prixSiege(trip.price,numSiege)}` : `Siège ${siege.dataset.seat}`;

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
    console.table(trips);

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

    actualiserSiege(trip);

    formRes.addEventListener("submit" ,e =>{
        e.preventDefault();

        const p = {
            name : passagerReserve.value.trim(),
            phone : phonePassager.value.trim()
        };

        let siege = Number(selectReservation.value);

        if(!validerPassager(trip,p)){
            return;
        }

        if(!siege){
            const siegeLibre = [...sieges].find(s =>{
                return s.classList.contains("libre") && !estVIP(Number(s.dataset.seat));
            });

            if(!siegeLibre){
                afficherMessage(parReserver,"Aucun siege libre.");
                return;
            }

            siege = Number(siegeLibre.dataset.seat);
        }

        const resultat =reserver(trip,p,siege);

        if(resultat){
            afficherMessage(parReserver,"Réservation confirmée.");
        }

        sauvegarderTrips();

        actualiserSiege(trip);
        reservationSelect(trip);
        modifSuppPassSelect();
        renderCabine(trip);

        formRes.reset();
    });
    formModif.addEventListener("submit" ,e =>{
        e.preventDefault()
        const passExist =passagerSelectModif.value;
        const nouvPass = nouveauNom.value.trim();
        const nouvPhone = nouveauPhone.value.trim();
        const nouvSiege = updateSelect.value;


        const reservation = trip.reservations.find(r =>
            Number(r.seat) === Number(passExist)
        );

        if(!reservation){
            afficherMessage(parModif,"Passager introuvable.");
            return;
        };

        const p = {
            name: nouvPass,
            phone: nouvPhone,
            seat: nouvSiege !== "" ? Number(nouvSiege) : ""
        };

        modifier(trip,passExist,p);

        afficherMessage(parModif,"Modification confirmée.");

        sauvegarderTrips();

        actualiserSiege(trip);
        renderCabine(trip);
        reservationSelect(trip);
        modifSuppPassSelect();

        formModif.reset();
    });
    formSupp.addEventListener("submit" ,e =>{
        e.preventDefault();

        const passExist =passagerSupp.value;

        if(!passExist){
            afficherMessage(parSupp,"choisir un passager.");
            return;
        }

        console.log("Passager sélectionné:", passagerSupp.value);
        console.log("Réservations avant:", trip.reservations);

        annuler(trip,passExist);

        console.log("Réservations après:", trip.reservations);

        afficherMessage(parSupp,"Suppression confirmée.");

        sauvegarderTrips()

        actualiserSiege(trip);
        renderCabine(trip);
        reservationSelect(trip);
        modifSuppPassSelect();

        formSupp.reset();
    });


    reservationSelect(trip);
    modifSuppPassSelect();
    renderCabine(trip);
}

afficherTout();