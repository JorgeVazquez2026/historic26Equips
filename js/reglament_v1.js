// ==========================================
// CÀLCUL DE LA CLASSIFICACIÓ
// ==========================================

function calcularClassificacio(grupHTML, grupConfig, finsPartit = 3) {

    const classificacio = [];

    const files = grupHTML.querySelectorAll("tbody tr");

    files.forEach((fila, index) => {

		const equip = grupConfig.equips[index];
		
		classificacio.push({

			equip: index + 1,

			nom: equip.nom,
			escut: equip.escut,

			categoria: equip.categoria,
			posicio: equip.posicio,

			pj: 0,
			pg: 0,
			pe: 0,
			pp: 0,
			gf: 0,
			gc: 0,
			dg: 0,
			pts: 0,
			tandesGuanyades: 0,
			golsPenals: 0,
			enfrontaments: []

		});

	});
	
	
	const partits = grupHTML.querySelectorAll(".partido");

	partits.forEach((partit, index) => {
		
		if ((index + 1) > finsPartit)
        return;

		const local = parseInt(partit.dataset.local) - 1;
		const visitant = parseInt(partit.dataset.visitant) - 1;

		// Si el partido todavía no tiene los dos equipos definidos
		if (isNaN(local) || isNaN(visitant))
			return;

		const gols = partit.querySelectorAll(".gol");

		const golsLocal = parseInt(gols[0].value);
		const golsVisitant = parseInt(gols[1].value);

		// Si aún no se ha introducido el resultado, no hacemos nada
		if (isNaN(golsLocal) || isNaN(golsVisitant))
			return;


		const penals = partit.querySelectorAll(".penal");
		const penalsLocal = isNaN(parseInt(penals[0].value))
			? null
			: parseInt(penals[0].value);

		const penalsVisitant = isNaN(parseInt(penals[1].value))
			? null
			: parseInt(penals[1].value);


		if (penalsLocal !== null && penalsVisitant !== null) {

			classificacio[local].golsPenals += penalsLocal;
			classificacio[visitant].golsPenals += penalsVisitant;

			if (penalsLocal > penalsVisitant)
				classificacio[local].tandesGuanyades++;

			if (penalsVisitant > penalsLocal)
				classificacio[visitant].tandesGuanyades++;
		}


		classificacio[local].pj++;
		classificacio[visitant].pj++;

		classificacio[local].gf += golsLocal;
		classificacio[local].gc += golsVisitant;

		classificacio[visitant].gf += golsVisitant;
		classificacio[visitant].gc += golsLocal;

		if (golsLocal > golsVisitant) {

			classificacio[local].pg++;
			classificacio[visitant].pp++;

			classificacio[local].pts += 3;

		}
		else if (golsLocal < golsVisitant) {

			classificacio[visitant].pg++;
			classificacio[local].pp++;

			classificacio[visitant].pts += 3;

		}
		else {

			classificacio[local].pe++;
			classificacio[visitant].pe++;

			classificacio[local].pts++;
			classificacio[visitant].pts++;

		}

		classificacio[local].enfrontaments.push({

			numero: index + 1,
			rival: visitant + 1,

			gf: golsLocal,
			gc: golsVisitant,

			empat: golsLocal === golsVisitant,

			penalsJugats:
				penalsLocal !== null &&
				penalsVisitant !== null,

			golsPenalsFavor:
				penalsLocal !== null
					? penalsLocal
					: 0,

			golsPenalsContra:
				penalsVisitant !== null
					? penalsVisitant
					: 0,

			guanyadorPenals:
				penalsLocal !== null &&
				penalsVisitant !== null &&
				penalsLocal > penalsVisitant

		});

		classificacio[visitant].enfrontaments.push({

			numero: index + 1,
			rival: local + 1,

			gf: golsVisitant,
			gc: golsLocal,

			empat: golsLocal === golsVisitant,

			penalsJugats:
				penalsLocal !== null &&
				penalsVisitant !== null,

			golsPenalsFavor:
				penalsVisitant !== null
					? penalsVisitant
					: 0,

			golsPenalsContra:
				penalsLocal !== null
					? penalsLocal
					: 0,

			guanyadorPenals:
				penalsLocal !== null &&
				penalsVisitant !== null &&
				penalsVisitant > penalsLocal

		});

	});


	classificacio.forEach(equip => {

		equip.dg = equip.gf - equip.gc;

	});
	
	//console.log(classificacio);
    return classificacio;

}

// ==========================================
// ORDENAR LA CLASSIFICACIÓ
// ==========================================

function ordenarClassificacio(classificacio) {

    classificacio.sort((a, b) => compararEquips(a, b, classificacio));

}

// ==========================================
// COMPARAR EQUIPOS SEGÚN REGLAMENTO
// ==========================================

function compararEquips(a, b, classificacio) {

    // 1. Puntos
    if (a.pts !== b.pts)
        return b.pts - a.pts;


    const empatats = obtenirEmpatats(classificacio, a.pts);


    // 2. Si hay empate entre dos equipos:
    //    primero enfrentamiento directo
    if (empatats.length === 2) {

        const directe = compararDueloDirecto(a, b);

        if (directe !== 0)
            return directe;

    }


    // 3. Si siguen empatados o son 3 equipos:
    //    Goal-average general
    if (a.dg !== b.dg)
        return b.dg - a.dg;


    // 4. Más goles marcados
    //    (sin contar tandas)
    if (a.gf !== b.gf)
        return b.gf - a.gf;


    // 5. Penaltis entre los equipos empatados
    if (empatats.length === 2) {

        const enfrontament = obtenirEnfrontament(a, b.equip);

        if (enfrontament &&
            enfrontament.penalsJugats &&
            enfrontament.golsPenalsFavor !== enfrontament.golsPenalsContra) {

            return enfrontament.golsPenalsFavor >
                   enfrontament.golsPenalsContra
                ? -1
                : 1;
        }

    }


    // 6. Más goles en las tandas de penaltis
    if (a.golsPenals !== b.golsPenals)
        return b.golsPenals - a.golsPenals;


    // 7. Categoría temporada anterior
    // Menor número = categoría superior
    if (a.categoria !== b.categoria)
        return a.categoria - b.categoria;


    // 8. Mejor posición temporada anterior
    if (a.posicio !== b.posicio)
        return a.posicio - b.posicio;


    return 0;
}

// ==========================================
// ENFRENTAMIENTO DIRECTO ENTRE DOS EQUIPOS
// ==========================================

function compararDueloDirecto(a, b) {

    const partit = obtenirEnfrontament(a, b.equip);

    if (!partit)
        return 0;


    // Victoria en partido directo
    if (partit.gf > partit.gc)
        return -1;


    if (partit.gf < partit.gc)
        return 1;


    // Si empataron, NO se usan aquí los penaltis todavía.
    // El reglamento dice:
    // "Si se mantiene el empate o son tres equipos..."
    // pasa a Goal Average general.

    return 0;

}

function simularClassificacio(
    grupHTML,
    grupConfig,
    modificacions = [],
    finsPartit = 3
) {

    console.log("SIMULAR CLASIFICACION");


    // Clonamos para no tocar pantalla
    const copia = grupHTML.cloneNode(true);


    modificacions.forEach(mod => {


        const partit = copia.querySelector(
            `.partido[data-id="${mod.partit}"]`
        );


        if (!partit) {
            console.log(
                "No existe partido",
                mod.partit
            );
            return;
        }


        // -------------------------
        // Goles
        // -------------------------

        if (mod.gols) {

            const gols =
                partit.querySelectorAll(".gol");


            gols[0].value =
                mod.gols.local;


            gols[1].value =
                mod.gols.visitant;


            console.log(
                "P",
                mod.partit,
                "goles",
                mod.gols.local,
                mod.gols.visitant
            );
        }



        // -------------------------
        // Penaltis
        // -------------------------

        if (mod.penals) {


            const penals =
                partit.querySelectorAll(".penal");


            penals[0].value =
                mod.penals.local;


            penals[1].value =
                mod.penals.visitante;


            console.log(
                "P",
                mod.partit,
                "penaltis",
                mod.penals.local,
                mod.penals.visitante
            );

        }


    });



    const clasificacion =
        calcularClassificacio(
            copia,
            grupConfig,
            finsPartit
        );


    ordenarClassificacio(
        clasificacion
    );


    console.table(
        clasificacion.map(e => ({
            equipo:e.equip,
            puntos:e.pts,
            dg:e.dg,
            tandas:e.tandesGuanyades
        }))
    );


    return clasificacion;

}







/*function continuaEmpat(a, b) {

    // 1. Enfrentamiento directo
    if (compararDueloDirecto(a, b) !== 0)
        return false;

    // 2. Goal Average
    if (a.dg !== b.dg)
        return false;

    // 3. Goles a favor
    if (a.gf !== b.gf)
        return false;

    return true;

}*/

/*function segueixenEmpatats(equips) {

    if (equips.length < 2)
        return false;

    const dg = equips[0].dg;
    const gf = equips[0].gf;

    return equips.every(equip =>
        equip.dg === dg &&
        equip.gf === gf
    );

}*/

/*function necessitaCriteriPenals(classificacio) {

    const puntsRevisats = [];

    for (const equip of classificacio) {

        if (puntsRevisats.includes(equip.pts))
            continue;

        puntsRevisats.push(equip.pts);

        const empatats = obtenirEmpatats(classificacio, equip.pts);

        if (empatats.length === 2) {

            if (continuaEmpat(empatats[0], empatats[1]))
                return true;

        }

    }

    return false;

}*/

/*function copiarClassificacio(classificacio) {

    return JSON.parse(JSON.stringify(classificacio));

}*/

/*function obtenirCampio(classificacio) {

    ordenarClassificacio(classificacio);

    return classificacio[0].equip;

}*/

/*function simularPenals(classificacio, equipGuanyaPenals) {

    const copia = copiarClassificacio(classificacio);

    const equip = copia.find(e => e.equip === equipGuanyaPenals);

    equip.tandesGuanyades++;

    return obtenirCampio(copia);

}*/

/*function necessitaPenals(partit, grupHTML, grupConfig) {

    console.log("Evaluando penaltis partido", partit.dataset.id);

    const gols = partit.querySelectorAll(".gol");

    const golsLocal = parseInt(gols[0].value);
    const golsVisitant = parseInt(gols[1].value);

    console.log(
        "Resultado:",
        golsLocal,
        golsVisitant
    );

    if (isNaN(golsLocal) || isNaN(golsVisitant)) {
        console.log("Sin resultado");
        return false;
    }


    if (golsLocal !== golsVisitant) {
        console.log("No es empate");
        return false;
    }


    console.log("Empate detectado, simulando");

    return simulacioCanviaClassificacio(
        partit,
        grupHTML,
        grupConfig
    );

}*/

/*function simulacioCanviaClassificacio(partit, grupHTML, grupConfig) {

    const numero = partit.dataset.id;


    // Simulamos P2 con dos posibles tandas
    const grupoTandaLocal =
        simularPenalsPartit(
            grupHTML,
            numero,
            5,
            4
        );


    const grupoTandaVisitant =
        simularPenalsPartit(
            grupHTML,
            numero,
            4,
            5
        );


    // Posibles resultados de P3
    const resultadosP3 = [

        { local: 1, visitante: 0 },
        { local: 0, visitante: 0 },
        { local: 0, visitante: 1 }

    ];


    for (const resultado of resultadosP3) {


        const simLocal =
            simularResultadoPartit3(
                grupoTandaLocal,
                resultado.local,
                resultado.visitante
            );


        const simVisitant =
            simularResultadoPartit3(
                grupoTandaVisitant,
                resultado.local,
                resultado.visitante
            );


        const campeonLocal =
            obtenirCampioGrup(
                simLocal,
                grupConfig
            );


        const campeonVisitant =
            obtenirCampioGrup(
                simVisitant,
                grupConfig
            );


        console.log(
            "P3",
            resultado,
            "Tanda local:",
            campeonLocal,
            "Tanda visitante:",
            campeonVisitant
        );


        if (campeonLocal !== campeonVisitant)
            return true;

    }


    return false;

}*/

/*function obtenirOrdre(classificacio) {

    const copia = structuredClone(classificacio);

    ordenarClassificacio(copia);

    return copia.map(equip => equip.equip);

}*/

/*function mateixOrdre(ordre1, ordre2) {

    return JSON.stringify(ordre1) === JSON.stringify(ordre2);

}*/

/*function obtenirOrdreGrup(grupHTML, grupConfig) {

    const classificacio = calcularClassificacio(grupHTML, grupConfig);

    ordenarClassificacio(classificacio);

    return classificacio.map(equip => equip.equip);

}*/

/*function clonarGrup(grupHTML) {

    return grupHTML.cloneNode(true);

}*/

/*function simularPenalsPartit(grupHTML, numeroPartit, penalsLocal, penalsVisitant) {

    const grup = grupHTML.cloneNode(true);

    const partit = grup.querySelector(
        `.partido[data-id="${numeroPartit}"]`
    );

    const penals = partit.querySelectorAll(".penal");

    penals[0].value = penalsLocal;
    penals[1].value = penalsVisitant;

    return grup;

}*/

/*function obtenirCampioGrup(grupHTML, grupConfig, finsPartit = 3) {

    const classificacio =
        calcularClassificacio(grupHTML, grupConfig, finsPartit);

    ordenarClassificacio(classificacio);

    return classificacio[0].equip;

}*/

/*function actualitzarPenalsPartit2(partit, grupHTML, grupConfig) {

    console.log("Comprobando penaltis P2");

    const necessari = necessitaPenals(partit, grupHTML, grupConfig);

    console.log("P2 necesita penaltis:", necessari);

    const penals = partit.querySelectorAll(".penal");

    penals.forEach(penal => {
        penal.disabled = !necessari;
    });

}*/

/*function actualitzarPenalsPartit3(partit, grupHTML, grupConfig) {

    console.log("Comprobando penaltis P3");

    const necessari = necessitaPenals(partit, grupHTML, grupConfig);

    console.log("P3 necesita penaltis:", necessari);

    const penals = partit.querySelectorAll(".penal");

    penals.forEach(penal => {
        penal.disabled = !necessari;
    });

}*/


/*function simularResultadoPartit3(
    grupHTML,
    golesLocal,
    golesVisitante
) {


    const grupo =
        grupHTML.cloneNode(true);


    const partit3 =
        grupo.querySelector(
            '.partido[data-id="3"]'
        );


    const goles =
        partit3.querySelectorAll(".gol");


    goles[0].value = golesLocal;
    goles[1].value = golesVisitante;


    return grupo;

}*/