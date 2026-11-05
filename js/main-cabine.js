import { initialiser, sauvegarder } from "./store.js";
import { afficherMessage, listAttente, renderCabine,renderListeAttente } from "./render.js";
import { reserver,modifier,annuler,inscrireEnAttente,retirerDeAttente, estVIP, prixSiege, estComplet } from "./reservation.js";
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
const listAttenteAff = document.querySelector("#listAttenteAff");
const disabledForm = document.querySelector("#disabled");


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

function actualiserListAttente(trip){
    const complet = estComplet(trip);
    const hasWaiting = trip.waitingList.length > 0;

    if(complet){
        disabledForm.disabled = true;
        disabledForm.style.opacity = 0.5;
    }else{
        disabledForm.disabled = false;
        disabledForm.style.opacity = 1;
    }

    if(complet && hasWaiting){
        listAttenteAff.classList.remove("hidden");
    }else{
        listAttenteAff.classList.add("hidden");
    }

    listAttente(trip);
    renderListeAttente(trip);
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

function dragItem(trip){
    let drag;
    sieges.forEach(siege =>{
        siege.addEventListener("dragstart",e =>{
            if(!siege.classList.contains("occupe")){
                e.preventDefault();
                return;
            }

            drag = siege;
        });

        siege.addEventListener("dragover",e =>{
            e.preventDefault();
        });

        siege.addEventListener("drop",e =>{
            e.preventDefault();
            if(!drag || drag == siege ) return;
            if(!siege.classList.contains('libre')) return;

            const num = Number(drag.dataset.seat);
            const nouvSg = Number(siege.dataset.seat);

            const reservation = trip.reservations.find(r =>
                Number(r.seat) === num
            );

            if(!reservation) return;

            reservation.seat = nouvSg;

            sauvegarderTrips();
            actualiserSiege(trip);
            reservationSelect(trip);
            modifSuppPassSelect();
            renderCabine(trip);

            drag = null;
        });
    });
}

async function afficherTout() {

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
    actualiserListAttente(trip);

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

        annuler(trip,passExist);


        if(trip.waitingList.length > 0){
            const passager = trip.waitingList[0];

            const siegeLibre = Number(passExist);

            const reslt = reserver(trip,passager,siegeLibre);

            afficherMessage(parSupp,`${passager.name}  a obtenu le siège ${siegeLibre}`);
            
            if(reslt){
                trip.waitingList.splice(0, 1);
            }
        }else{
            afficherMessage(parSupp,"Suppression confirmée.");
        }

        sauvegarderTrips()

        actualiserSiege(trip);
        actualiserListAttente(trip);
        renderCabine(trip);
        reservationSelect(trip);
        modifSuppPassSelect();

        formSupp.reset();
    });

    renderListeAttente(trip);

    const passagerListAt = document.querySelector("#nom-listattente");
    const phoneListAt = document.querySelector("#tel-listattente");
    const formListAt = document.getElementById("form-listattente");
    const parLA = document.querySelector("#message-listattente");

   if(formListAt){
        formListAt.addEventListener("submit", e =>{
            e.preventDefault();

            const p = {
                name : passagerListAt.value.trim(),
                phone : phoneListAt.value.trim()
            };

            if(!validerPassager(trip,p)){
                return;
            }

            afficherMessage(parLA,"Vous avez ajouter dans la liste d'attente.");

            inscrireEnAttente(trip,p);
            sauvegarderTrips();
            actualiserListAttente(trip);
        });
   }

   listAttente(trip);

   const container = document.querySelectorAll(".waitPassager");
   if(container){
        container.forEach(div=>{
            div.addEventListener("click",e =>{
                e.preventDefault();
                const btn = e.target.closest(".retirer");
                const index = Number(btn.dataset.index);
                retirerDeAttente(trip,index);

                sauvegarderTrips();
                listAttente(trip);
                actualiserListAttente(trip);
            })   
        })
    }
   

    reservationSelect(trip);
    modifSuppPassSelect();
    renderCabine(trip);
    dragItem(trip);
}

afficherTout();