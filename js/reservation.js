import { afficherMessage } from "./render.js";
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

    const nouvelleRes ={
        seat : siege,
        name : p.name,
        phone : p.phone
    };
    
    trip.reservations = [...trip.reservations,nouvelleRes];
    return true;
}

export function modifier(trip, siege, p){
    trip.reservations = trip.reservations.map(r =>{
        if(r.seat === Number(siege)){
            return {
                ...r,
                name : p.name || r.name,
                phone : p.phone || r.phone,
                seat : Number(p.seat) || r.seat
            }
        }
        return r;
    });
}

export function annuler(trip, siege){
    trip.reservations = trip.reservations.filter(r =>{
        return Number(r.seat) !== Number(siege);
    });
}

export function inscrireEnAttente(trip, p){
    trip.waitingList.push(p)
}

export function retirerDeAttente(trip, i){
    trip.waitingList.splice(i,1);
}
