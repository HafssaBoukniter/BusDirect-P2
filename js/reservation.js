import { validerPassager } from "./validators.js";

export function placesLibres(trip){
    return trip.capacity -trip.reservations.length;
}

export function estComplet(trip){
    return placesLibres(trip) === 0;
}

export function estVIP(siege){

}

export function recetteTrajet(trip){

}

export function reserver(trip, p, siege){

}

export function modifier(trip, siege, p){

}

export function annuler(trip, siege){

}

export function inscrireEnAttente(trip, p){

}

export function retirerDeAttente(trip, i){

}
