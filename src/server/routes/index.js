'use strict'

let express = require('express')
let router = express.Router()
let data = [
	{
		image:
			'https://www.honda.com.br/sites/hab/themes/hondahab/dist/img/automoveis-fit/conteudo/FOTO%2013%E2%80%93GALERIA%20AMBIENTADA%201%20EXL.jpg',
		brandModel: 'honda fit',
		year: 2021,
		plate: 'LPQ4493',
		color: 'gray'
	},
	{
		image:
			'https://www.honda.com.br/sites/hab/themes/hondahab/dist/img/hrv-2020/design.jpg',
		brandModel: 'honda cr-v',
		year: 2021,
		plate: 'EBF1180',
		color: 'gray'
	},
	{
		image:
			'https://www.honda.com.br/automoveis/sites/hab/files/styles/npp_header_generico_crv_big/public/2021-05/1920x680_Novo-Honda-CR-V%20%281%29.jpeg?itok=EEjtCUSa',
		brandModel: 'honda hr-v',
		year: 2021,
		plate: '20H2C03',
		color: 'gray'
	},
	{
		image:
			'https://www.honda.com.br/automoveis/sites/hab/files/2021-08/acoordwhitepearl.png',
		brandModel: 'honda civic',
		year: 2021,
		plate: 'WW34F01',
		color: 'white'
	}
]

router.get('/', function (req, res) {
	res.json(data)
})

router.post('/', function (req, res) {
	data.push({
		image: req.body.image,
		brandModel: req.body.brandModel,
		year: req.body.year,
		plate: req.body.plate,
		color: req.body.color
	})
	res.json({ message: 'success' })
})

router.delete('/', (req, res) => {
	console.log(data)
	console.log(req.body.plate)
	data = data.filter(car => {
		return car.plate !== req.body.plate
	})
	console.log(data)
	res.json({ message: 'success' })
})

module.exports = router
