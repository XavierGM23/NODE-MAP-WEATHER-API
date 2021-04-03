require('dotenv').config();
const _ = require('lodash');

const { leerInput, pausa, inquirerMenu, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

// console.log(process.env.MAPBOX_KEY);

const main = async () => {
	const busquedas = new Busquedas();
	let opt = 0;

	do {
		opt = await inquirerMenu();
		// console.log({ opt });

		switch (opt) {
			case 1: // TODO: BUSCAR CIUDAD
				// Mostrar mensaje
				const termino = await leerInput('Ciudad: ');

				// Buscar Lugares
				const lugares = await busquedas.ciudad(termino);

				// Seleccionar el termino
				const id = await listarLugares(lugares);
				if (id === '0') continue;

				const lugarSel = lugares.find((l) => l.id === id);

				// Guardar en DB
				busquedas.agregarHistorial(lugarSel.nombre);

				// Clima
				const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

				// Mostrar Resultados

				console.log('\nInformacion de la ciudad\n'.green);
				console.log('Ciudad :>> '.italic, lugarSel.nombre);
				console.log('Latitud :>> '.italic, lugarSel.lat);
				console.log(`Longitud :>> `.italic, lugarSel.lng);
				console.log('Temperatura :>> '.italic, clima.temp);
				console.log('Minima :>> '.italic, clima.min);
				console.log('Maxima :>> '.italic, clima.max);
				console.log('Como esta el clima :>> '.italic, `${_.startCase(clima.desc)}`.cyan);

				break;

			case 2: // TODO: HISTORIAL
				busquedas.historialCapitalizado.forEach((lugar, i) => {
					const idx = `${i + 1}.`.green;
					console.log(`${idx} ${lugar}`);
				});
				break;

			default:
				break;
		}
		if (opt !== 3) {
			await pausa();
			console.clear();
		}
	} while (opt !== 3);
};

main();
