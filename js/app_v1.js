window.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

	//console.log("Iniciando...");
    carregarConfiguracio();

    crearGrups();

    //crearSemifinals();

}

function carregarConfiguracio() {
    document.getElementById("titolTorneig").textContent =
        `${CONFIG.titol} ${CONFIG.any}`;

    document.getElementById("logoTorneig").src =
        CONFIG.logos.torneig;

    document.getElementById("logoClub").src =
        CONFIG.logos.club;
		
    document.getElementById("favicon").href =
        CONFIG.logos.torneig;
}

function crearGrups() {
	//console.log(CONFIG.grups);
    const contenidor = document.getElementById("grups");

    CONFIG.grups.forEach(grup => {

        contenidor.appendChild(crearGrup(grup));

    });

}

function crearGrup(grup) {

	const article = document.createElement("article");
	article.className = "grupo";
	article.dataset.grup = CONFIG.grups.indexOf(grup);

    article.innerHTML = `
        <h2>${grup.dia}</h2>

        <table class="clasificacion">
            <thead>
                <tr>
                    <th>Equip</th>
                    <th>PJ</th>
                    <th>Pts</th>
                    <th>GF</th>
                    <th>GC</th>
                    <th>DG</th>
                </tr>
            </thead>

            <tbody></tbody>

        </table>

        <div class="partidos"></div>
    `;

    crearClasificacion(article, grup);
    crearEnfrontaments(article, grup);

    return article;

}

function crearClasificacion(article, grup) {

    const tbody = article.querySelector("tbody");

    grup.equips.forEach((equip, index) => {

        const fila = document.createElement("tr");

        fila.dataset.equip = index + 1;

		fila.innerHTML = `
			<td>${equip.nom}</td>
			<td>0</td> <!-- PJ -->
			<td>0</td> <!-- Pts -->
			<td>0</td> <!-- GF -->
			<td>0</td> <!-- GC -->
			<td>0</td> <!-- DG -->
		`;

        tbody.appendChild(fila);

    });

}

function crearEnfrontaments(article, grup){

    const div = article.querySelector(".partidos");
	
			
    CONFIG.partits.forEach((partit,index)=>{

        const html = document.createElement("div");
		const equipLocal = grup.equips[partit.local - 1];

		const equipVisitant =
			partit.visitant === null
				? null
				: grup.equips[partit.visitant - 1];
				
		const textPendent =
			partit.id === 2
				? "Perdedor P1"
				: "Guanyador P1";
					
        html.className="partido";

        html.dataset.id = partit.id;
        html.dataset.local = partit.local;
        html.dataset.visitant = partit.visitant;
        html.dataset.penals = partit.penals;

        html.innerHTML=`
            <div class="equipo local" data-equipo="${partit.local}">
                <img src="${equipLocal.escut}" alt="">
				<span>${equipLocal.nom}</span>
            </div>

            <div class="marcador">
                <input type="number" class="gol gol-local" min="0">

                <span>-</span>

                <input type="number" class="gol gol-visitante" min="0">
            </div>

            <div class="equipo visitante" data-equipo="${partit.visitant}">
                ${equipVisitant
					? `<img src="${equipVisitant.escut}" alt="">
					   <span>${equipVisitant.nom}</span>`
					: `<span class="pendent">${textPendent}</span>`
				}
            </div>

			<div class="penaltis">
				<span class="icono">🎯</span>
				<input type="number" class="penal penal-local" min="0" disabled>
				-
				<input type="number" class="penal penal-visitant" min="0" disabled>
			</div>
        `;

        div.appendChild(html);
		html.addEventListener("input", actualitzarGrup);
		if (partit.id !== 1) {

			html.querySelectorAll(".gol").forEach(campo => {
				campo.disabled = true;
			});

			html.querySelectorAll(".penal").forEach(campo => {
				campo.disabled = true;
			});

		}
    });

}

/*function actualitzarGrup(evento) {

    const partit = evento.currentTarget;

    actualitzarPenals(partit);

    const grupHTML = evento.currentTarget.closest(".grupo");
    const grupConfig = CONFIG.grups[parseInt(grupHTML.dataset.grup)];

    const classificacio = calcularClassificacio(grupHTML, grupConfig);

    ordenarClassificacio(classificacio);

    pintarClassificacio(grupHTML, classificacio);

    actualitzarCalendari(grupHTML, grupConfig);

	const idPartit = evento.currentTarget.dataset.id;

	controlarEstadoPartidos(
		grupHTML,
		grupConfig
	);


    console.log(
        "¿Necesita criterio de penaltis?:",
        necessitaCriteriPenals(classificacio)
    );
}*/

function actualitzarGrup(evento) {

    console.log("ENTRA actualitzarGrup");

    const grupHTML =
        evento.currentTarget.closest(".grupo");

    const grupConfig =
        CONFIG.grups[parseInt(grupHTML.dataset.grup)];


    controlarEstadoPartidos(
        grupHTML,
        grupConfig
    );

}

function controlarEstadoPartidos(grupHTML, grupConfig) {

	console.log("ENTRA controlarEstadoPartidos");

    const p1 =
        grupHTML.querySelector('.partido[data-id="1"]');

    const p2 =
        grupHTML.querySelector('.partido[data-id="2"]');

    const p3 =
        grupHTML.querySelector('.partido[data-id="3"]');


	/*console.log("P1", p1);
    console.log("P2", p2);
    console.log("P3", p3);


    console.log(
        "P1 resultado:",
        tieneResultado(p1)
    );*/

    // =========================
    // PARTIDO 1
    // =========================

    if (!tieneResultado(p1)) {
		console.log("SALGO: P1 sin resultado");
        return;
    }


    habilitarPenals(p1);


    if (!tienePenaltis(p1)) {
		console.log("SALGO: P1 penaltis");
        return;
    }


    // Aquí ya sabemos ganador/perdedor P1
    actualitzarCalendari(
        grupHTML,
        grupConfig
    );

	//console.log("P1 terminado. Habilitando P2");
    habilitarGoles(p2);



    // =========================
    // PARTIDO 2
    // =========================

    if (!tieneResultado(p2)) {
        return;
    }


    if (necesitaPenaltisPartido2(
        grupHTML,
        grupConfig
    )) {

        habilitarPenals(p2);


        if (!tienePenaltis(p2)) {
            return;
        }

    }


    habilitarGoles(p3);



    // =========================
    // PARTIDO 3
    // =========================

    if (!tieneResultado(p3)) {
        return;
    }


    if (necesitaPenaltisPartido3(
        grupHTML,
        grupConfig
    )) {

        habilitarPenals(p3);


        if (!tienePenaltis(p3)) {
            return;
        }

    }


    // Aquí ya está todo acabado
    console.log("CLASIFICACIÓN FINAL");

}

function tieneResultado(partido) {

    const goles = partido.querySelectorAll(".gol");

    const local = parseInt(goles[0].value);
    const visitante = parseInt(goles[1].value);

    return (
        !isNaN(local) &&
        !isNaN(visitante)
    );
}

function tienePenaltis(partido) {

    const penales = partido.querySelectorAll(".penal");

    const local = parseInt(penales[0].value);
    const visitante = parseInt(penales[1].value);

    return (
        !isNaN(local) &&
        !isNaN(visitante)
    );
}

function habilitarGoles(partido) {

    const goles = partido.querySelectorAll(".gol");

    goles.forEach(gol => {
        gol.disabled = false;
    });

}

function bloquearGoles(partido) {

    const goles = partido.querySelectorAll(".gol");

    goles.forEach(gol => {
        gol.disabled = true;
    });

}

function habilitarPenals(partit) {

    const penals = partit.querySelectorAll(".penal");

    penals.forEach(camp => {
        camp.disabled = false;
    });

}

function actualitzarCalendari(grupHTML, grupConfig) {
	
	console.log("ENTRA actualitzarCalendari");

    const partit1 = grupHTML.querySelector('.partido[data-id="1"]');

    const gols = partit1.querySelectorAll(".gol");

    const golsLocal = parseInt(gols[0].value);
    const golsVisitant = parseInt(gols[1].value);


    // Si aún no hay resultado
    if (isNaN(golsLocal) || isNaN(golsVisitant)) {
		console.log("Partido ignorado");
		restaurarPartits(grupHTML);
		return;
	}

	// P1 siempre necesita tanda antes de continuar

	const penals = partit1.querySelectorAll(".penal");

	const penalsLocal = parseInt(penals[0].value);
	const penalsVisitant = parseInt(penals[1].value);


	if (
		isNaN(penalsLocal) ||
		isNaN(penalsVisitant)
	) {

		return;

	}

	let guanyador;
	let perdedor;

	if (golsLocal > golsVisitant) {

		guanyador = parseInt(partit1.dataset.local);
		perdedor = parseInt(partit1.dataset.visitant);

	}
	else if (golsVisitant > golsLocal) {

		guanyador = parseInt(partit1.dataset.visitant);
		perdedor = parseInt(partit1.dataset.local);

	}
	else {

		const penals = partit1.querySelectorAll(".penal");

		const penalLocal = penals[0];
		const penalVisitant = penals[1];

		const penalsLocal = parseInt(penalLocal.value);
		const penalsVisitant = parseInt(penalVisitant.value);

		penalLocal.classList.remove("penal-error");
		penalVisitant.classList.remove("penal-error");

		if (isNaN(penalsLocal) || isNaN(penalsVisitant))
			return;

		if (penalsLocal > penalsVisitant) {

			guanyador = parseInt(partit1.dataset.local);
			perdedor = parseInt(partit1.dataset.visitant);

		}
		else if (penalsVisitant > penalsLocal) {

			guanyador = parseInt(partit1.dataset.visitant);
			perdedor = parseInt(partit1.dataset.local);

		}
		else {


			penalLocal.classList.add("penal-error");
			penalVisitant.classList.add("penal-error");
			return;

		}

	}

	console.log(
    "Ganador P1:", guanyador,
    "Perdedor P1:", perdedor
	);

	const partit2 =
		grupHTML.querySelector('.partido[data-id="2"]');

	const partit3 =
		grupHTML.querySelector('.partido[data-id="3"]');


	actualitzarEquipPartit(
		partit2,
		grupConfig.equips[perdedor - 1],
		perdedor
	);

	actualitzarEquipPartit(
		partit3,
		grupConfig.equips[guanyador - 1],
		guanyador
	);
	
}

/*function actualitzarEquipPartit(partit, equip, numeroEquip) {

    console.log("Actualizando partido", partit.dataset.id);


    const equipoActual =
        parseInt(partit.dataset.visitant);


    // Solo limpiamos si realmente cambia el equipo
    const cambiaEquipo =
        equipoActual !== numeroEquip;


    const visitant = partit.querySelector(".equipo.visitante");

    visitant.innerHTML = `
        <img src="${equip.escut}" alt="">
        <span>${equip.nom}</span>
    `;


    partit.dataset.visitant = numeroEquip;


    if (cambiaEquipo) {

        console.log(
            "Cambia equipo, limpiando partido",
            partit.dataset.id
        );


        partit.querySelectorAll(".gol").forEach(gol => {
            gol.value = "";
        });


        partit.querySelectorAll(".penal").forEach(penal => {
            penal.value = "";
            penal.disabled = true;
        });

    }

}*/

/*function necesitaPenaltisPartido2(grupHTML, grupConfig) {

    console.log("Evaluando necesidad de penaltis P2");


    const escenariosP3 = [
        { local: 1, visitant: 0 },
        { local: 0, visitant: 0 },
        { local: 0, visitant: 1 }
    ];


    for (const p3 of escenariosP3) {


        const clasSinPenal =
            simularClassificacio(
                grupHTML,
                grupConfig,
                [
                    {
                        partit: 3,
                        gols: p3
                    }
                ],
                3
            );


        const clasConPenal =
            simularClassificacio(
                grupHTML,
                grupConfig,
                [
                    {
                        partit: 2,
                        gols: {
                            local: 0,
                            visitant: 2
                        },
                        penals: {
                            local: 5,
                            visitante: 4
                        }
                    },
                    {
                        partit: 3,
                        gols: p3
                    }
                ],
                3
            );


        const ordenSin =
            clasSinPenal
                .map(e => e.equip)
                .join("-");


        const ordenCon =
            clasConPenal
                .map(e => e.equip)
                .join("-");


        console.log(
            "P3",
            p3,
            "SIN:",
            ordenSin,
            "CON:",
            ordenCon
        );


        if (ordenSin !== ordenCon) {

            console.log(
                "P2 necesita penaltis"
            );

            return true;

        }

    }


    console.log(
        "P2 NO necesita penaltis"
    );

    return false;
}*/

/*function simularPenaltisPartido(
    grupHTML,
    grupConfig,
    numeroPartido,
    ganaLocal
) {

    // Clonar el grupo para no modificar la pantalla
    const copia = grupHTML.cloneNode(true);

    const partido =
        copia.querySelector(
            `.partido[data-id="${numeroPartido}"]`
        );

    const penales =
        partido.querySelectorAll(".penal");

    if (ganaLocal) {

        penales[0].value = 5;
        penales[1].value = 4;

    }
    else {

        penales[0].value = 4;
        penales[1].value = 5;

    }

    const clasificacion =
        calcularClassificacio(
            copia,
            grupConfig
        );

    ordenarClassificacio(clasificacion);

    return clasificacion.map(
        equipo => equipo.equip
    );

}
*/

/*function actualitzarPenals(partit) {

    const tipusPenals = partit.dataset.penals;

    const penals = partit.querySelectorAll(".penal");

    const penalLocal = penals[0];
    const penalVisitant = penals[1];

    // Si el reglamento dice que siempre hay penaltis
    if (tipusPenals === "sempre") {

        penalLocal.disabled = false;
        penalVisitant.disabled = false;
        return;

    }

    const gols = partit.querySelectorAll(".gol");

    const golsLocal = parseInt(gols[0].value);
    const golsVisitant = parseInt(gols[1].value);

    if (isNaN(golsLocal) || isNaN(golsVisitant))
        return;

    if (golsLocal === golsVisitant) {

        penalLocal.disabled = false;
        penalVisitant.disabled = false;

    } else {

        penalLocal.value = "";
        penalVisitant.value = "";

        penalLocal.disabled = true;
        penalVisitant.disabled = true;

        penalLocal.classList.remove("penal-error");
        penalVisitant.classList.remove("penal-error");

    }

}*/

/*function pintarClassificacio(grup, classificacio) {

    const files = grup.querySelectorAll("tbody tr");

    classificacio.forEach((equip, index) => {

        const fila = files[index];
		fila.cells[0].textContent = equip.nom;
        fila.cells[1].textContent = equip.pj;
        fila.cells[2].textContent = equip.pts;
        fila.cells[3].textContent = equip.gf;
        fila.cells[4].textContent = equip.gc;
        fila.cells[5].textContent = 
			equip.dg > 0 ? "+" + equip.dg : equip.dg;

    });

}*/

/*function restaurarPartits(grupHTML) {

    const partits = [
        grupHTML.querySelector('.partido[data-id="2"]'),
        grupHTML.querySelector('.partido[data-id="3"]')
    ];


    partits.forEach(partit => {

        partit.dataset.visitant = "";


        partit.querySelector(".equipo.visitante").innerHTML =
            `<span class="pendent">Pendent P1</span>`;


        partit.querySelectorAll(".gol")
            .forEach(gol => gol.value = "");


        partit.querySelectorAll(".penal")
            .forEach(penal => {

                penal.value = "";
                penal.disabled = true;

            });

    });

}*/

/*function actualitzarNecessitatPenals(grupHTML, grupConfig, numeroPartit) {

    if (numeroPartit === 2) {

        const partit2 = grupHTML.querySelector('.partido[data-id="2"]');

        actualitzarPenalsPartit2(
            partit2,
            grupHTML,
            grupConfig
        );

    }


    if (numeroPartit === 3) {

        const partit3 = grupHTML.querySelector('.partido[data-id="3"]');

        actualitzarPenalsPartit3(
            partit3,
            grupHTML,
            grupConfig
        );

    }

}*/

/*function actualitzarPenalsPartit2(partit, grupHTML, grupConfig) {


    const necessari =
        necessitaPenals(
            partit,
            grupHTML,
            grupConfig
        );


    const penals =
        partit.querySelectorAll(".penal");


    penals.forEach(penal => {

        penal.disabled = !necessari;


        if (!necessari) {

            penal.value = "";

        }

    });


    // Si no hacen falta penaltis,
    // el partido 3 queda libre

    if (!necessari) {

        habilitarPartit3(grupHTML);

    }

}*/

/*function actualitzarPenalsPartit3(partit, grupHTML, grupConfig) {

    const necessari = necessitaPenals(partit, grupHTML, grupConfig);

    const penals = partit.querySelectorAll(".penal");

    penals.forEach(penal => {

        penal.disabled = !necessari;

        if (!necessari) {

            penal.value = "";
            penal.classList.remove("penal-error");

        }

    });

}*/

/*function deshabilitarPenals(partit) {

    const penals = partit.querySelectorAll(".penal");

    penals.forEach(camp => {

        camp.disabled = true;
        camp.value = "";
        camp.classList.remove("penal-error");

    });

}*/

/*function habilitarPartido(partit) {

    partit.querySelectorAll(".gol").forEach(campo => {
        campo.disabled = false;
    });

}*/

/*function habilitarResultatPartit(partit) {

    partit.querySelectorAll(".gol").forEach(campo => {
        campo.disabled = false;
    });

}*/

/*function bloquejarResultatPartit(partit) {

    partit.querySelectorAll(".gol").forEach(campo => {
        campo.disabled = true;
    });

    partit.querySelectorAll(".penal").forEach(campo => {
        campo.disabled = true;
    });

}*/

/*function finalizarPartido1(grupHTML, grupConfig, guanyador, perdedor) {


    const partit2 =
        grupHTML.querySelector('.partido[data-id="2"]');


    const partit3 =
        grupHTML.querySelector('.partido[data-id="3"]');


    const equipPerdedor =
        grupConfig.equips[perdedor - 1];


    const equipGuanyador =
        grupConfig.equips[guanyador - 1];


    actualitzarEquipPartit(
        partit2,
        equipPerdedor,
        perdedor
    );


    actualitzarEquipPartit(
        partit3,
        equipGuanyador,
        guanyador
    );


    // P2 se puede jugar
    habilitarResultatPartit(partit2);


    // P3 todavía bloqueado
    bloquejarResultatPartit(partit3);

}*/

/*function habilitarPartit3(grupHTML) {

    const partit3 =
        grupHTML.querySelector(
            '.partido[data-id="3"]'
        );


    partit3.querySelectorAll(".gol")
        .forEach(gol => {

            gol.disabled = false;

        });

}*/

/*function controlarEstadoPartidos(grupHTML, grupConfig) {


    const partit2 =
        grupHTML.querySelector('.partido[data-id="2"]');


    const gols =
        partit2.querySelectorAll(".gol");


    const golsLocal =
        parseInt(gols[0].value);


    const golsVisitant =
        parseInt(gols[1].value);



    // P2 incompleto
    if (
        isNaN(golsLocal) ||
        isNaN(golsVisitant)
    ) {

        return;

    }


    // P2 completo -> decidir tanda
    actualitzarPenalsPartit2(
        partit2,
        grupHTML,
        grupConfig
    );

}

*/
