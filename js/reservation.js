import { validerPassager } from "./validators.js";

export function placesLibres(trip){
    return trip.capacity -trip.reservations.length;
}

export function estComplet(trip){
    return placesLibres(trip) === 0;
}

export function estVIP(siege){
    return Number(siege) >= 1 && Number(siege) <= 4; 
}

export function prixSiege(prix,numero){
    return estVIP(numero) ? Math.round(prix * 1.1) : prix;
}

export function recetteTrajet(trip){
    const totale =trip.reservations.reduce((total,reservation) =>{
        return total + prixSiege(trip.price,reservation.seat);
    },0);
    return totale;
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
