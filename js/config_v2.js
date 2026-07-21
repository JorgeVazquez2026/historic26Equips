const CONFIG = {

    any: 2026,

    titol: "Torneig d'Històrics - ",

    logos: {
        torneig: "https://www.torneigdhistorics.cat/wp-content/uploads/2023/07/logo_th23.png",
        club: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000577607_martinenc-200x200.png"
    },

    dies: [
        "Dilluns",
        "Dimarts",
        "Dimecres",
        "Dijous"
    ],
	
	partits: [
		{ id: 1, local: 1, visitant: 2, penals: "sempre" },
		{ id: 2, local: 3, visitant: null, penals: "empat" },
		{ id: 3, local: 3, visitant: null, penals: "empat" }
	],

		// Categoria temporada anterior
		// 1 = Primera Federación
		// 2 = Segunda Federación
		// 3 = Tercera Federación
		// 4 = Lliga Elit
		// 5 = Primera Catalana

	grups: [
        {
            dia: "Dilluns",
            equips: [
                {
					nom: "CE l'Hospitalet",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0001106091_COLOR.png",
					categoria: 3,
					posicio: 5
                },
                {
                    nom: "UE Sants",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000959051_1051_SantUE_200.png",
					categoria: 5,
					posicio: 15
                },
                {
					nom: "Reus FC Reddis",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000880558_reddis_200.png",
					categoria: 2,
					posicio: 4
					
                }
            ]	
		},
		{
            dia: "Dimarts",
            equips: [
                {
					nom: "CF Montañesa",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000584781_montanesa_200x200.png",
					categoria: 3,
					posicio: 11
                },
                {
                    nom: "CE Júpiter",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000672018_cejupiter_200x200.png",
					categoria: 4,
					posicio: 14
                },
                {
					nom: "CF Badalona",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000574727_bdn_200x200.png",
					categoria: 3,
					posicio: 2
					
                }
            ]
		},
		{
            dia: "Dimecres",
            equips: [
                {
					nom: "FC Martinenc",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000577607_martinenc-200x200.png"   ,
					categoria: 4,
					posicio: 2
                },
                {
                    nom: "UA Horta",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000959029_1049_HortaUAT_200.png",
					categoria: 4,
					posicio: 12
                },
                {
					nom: "UE Sant Andreu",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000573790_standreu_200x200.png",
					categoria: 2,
					posicio: 1
					
                }
            ]
		},
		{
            dia: "Dijous",
            equips: [
                {
					nom: "CF Vilanova",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0001044079_cfv.png"  ,
					categoria: 3,
					posicio:  4
                },
                {
                    nom: "AE Prat",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000892062_aeprat_200.png",
					categoria: 4,
					posicio: 4
                },
                {
					nom: "CE Europa",
                    escut: "https://files.fcf.cat/escudos/clubes/escudos/00100_0000735880_europa_200x200.png",
					categoria: 1,
					posicio: 5
					
                }
            ]
		}
		
    ]
};