export async function initialiser() {
    try{
        const data =localStorage.getItem("trip");
        
        if(data !== null){
            return JSON.parse(data);
        }

        const response = await fetch("./data/trips.json");

        if(!response.ok){
            throw new Error("Erreur");
        }

        const trip = await response.json();

        sauvegarder(trip);

        return trip;
    }catch(error){
        console.error("Error :",error);
        return [];
    }
}

export function sauvegarder(trip){
    localStorage.setItem("trip",JSON.stringify(trip));
}