import { afficherMessage } from "./render.js";

export const REGEX_TELEPHONE = /^0[6|7]\d{8}$/;
const errorNom = document.querySelector("#error-nom");
const errorPhone = document.querySelector("#error-phone");


export function validerPassager(trip,p){

    if(!p.name || p.name.trim() ===""){
        afficherMessage(errorNom,"Le nom du passager est obligatoire.");
        return false;
    }

    const nomExist = trip.reservations.some(passager => {
        return passager.name.toLowerCase() === p.name.toLowerCase();
    });
    

    if(nomExist){
        afficherMessage(errorNom,"Ce passager possède déjà une réservation.");
        return false;
    }

    if(!p.phone || !REGEX_TELEPHONE.test(p.phone)){
        afficherMessage(errorPhone,"Le téléphone invalide : 10 chiffres commençant par 06 ou 07");
        return false;
    }

    const phoneExist = trip.reservations.some(passager => {
        return passager.phone === p.phone;
    });

    const phoneExistLA = trip.waitingList.some(passager => {
        return passager.phone === p.phone;
    });

    if(phoneExist || phoneExistLA){
        afficherMessage(errorPhone,"Ce numéro est déjà utilisé sur ce trajet.");
        return false;
    }

    return true;
}