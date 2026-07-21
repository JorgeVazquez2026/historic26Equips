// ==========================================
// FUNCIONS AUXILIARS
// ==========================================

function obtenirEnfrontament(equip, rival) {

    return equip.enfrontaments.find(e => e.rival === rival);

}

function obtenirEmpatats(classificacio, punts) {

    return classificacio.filter(equip => equip.pts === punts);

}
