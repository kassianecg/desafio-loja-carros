;(function ($) {
	'use strict'

	/*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax. - Feito

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js. - Feito

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app". - Feito
  */

	let app = (function appController() {
		return {
			init: function init() {
				this.companyInfo()
				this.loadListCar()
				this.saveNewCar()
			},

			companyInfo: function companyInfo() {
				let ajax = new XMLHttpRequest()
				ajax.open('GET', 'company.json', true)
				ajax.send()
				ajax.onreadystatechange = this.getCompanyInfo
			},

			getElement: function getElement(element) {
				return $(`[data-js=${element}]`).get()
			},

			getCompanyInfo: function getCompanyInfo() {
				if (!app.requestOk.call(this)) return

				let response = JSON.parse(this.responseText)
				let $title = app.getElement('title')
				let $tel = app.getElement('phone')
				$title.textContent = response.name
				$tel.textContent = response.phone
			},

			requestOk: function requestOk() {
				return this.readyState === 4 && this.status === 200
			},

			saveNewCar: function saveNewCar() {
				$('[data-js="formCadastro"]').on('submit', this.handleSubmit)
			},

			handleSubmit: function handleSubmit(e) {
				e.preventDefault()

				let $url = app.getElement('urlImage').value
				let $brand = app.getElement('brand').value
				let $year = app.getElement('year').value
				let $plate = app.getElement('plate').value
				let $cor = app.getElement('color').value

				let ajax = new XMLHttpRequest()
				ajax.open('POST', 'http://localhost:3000/car')
				ajax.setRequestHeader(
					'Content-Type',
					'application/x-www-form-urlencoded'
				)
				ajax.send(
					`image=${$url}&brandModel=${$brand}&year=${$year}&plate=${$plate}&color=${$cor}`
				)

				ajax.onreadystatechange = function () {
					if (ajax.readyState === 4) {
						let $tableCar = app.getElement('table-car')
						let count = $tableCar.children.length
						for (let i = 0; i < count; i++) {
							$tableCar.children[0].remove()
						}
						app.loadListCar()
					}
				}
			},

			deleteCar: function deleteCar(plate) {
				let ajax = new XMLHttpRequest()
				ajax.open('DELETE', 'http://localhost:3000/car')
				ajax.setRequestHeader(
					'Content-Type',
					'application/x-www-form-urlencoded'
				)
				ajax.send(`plate=${plate}`)

				ajax.onreadystatechange = function () {
					if (ajax.readyState === 4) alert('registro removido com sucesso!')
				}
			},

			createEl: function createEl(element) {
				return document.createElement(element)
			},

			removeRow: function removeRow(event) {
				let $plate = event.target.getAttribute('data-plate')
				let $tr = $(`[data-plate="${$plate}"]`).get()
				$tr.remove()
				app.deleteCar($plate)
			},

			loadListCar: function loadListCar() {
				let ajax = new XMLHttpRequest()
				ajax.open('GET', 'http://localhost:3000/car')
				ajax.send()
				ajax.onreadystatechange = this.getDataCar
			},

			getDataCar: function getDataCar() {
				if (!app.requestOk.call(this)) return

				let response = JSON.parse(this.responseText)
				let $tableCar = app.getElement('table-car')
				response.map(car => {
					$tableCar.appendChild(app.createNewCar(car))
				})
			},

			createNewCar: function createNewCar(car) {
				let $fragment = document.createDocumentFragment()
				let $tr = document.createElement('tr')
				$tr.setAttribute('data-plate', car.plate)

				let $tdImage = this.createEl('td')
				let $image = this.createEl('img')
				let $tdBrand = this.createEl('td')
				let $tdYear = this.createEl('td')
				let $tdPlate = this.createEl('td')
				let $tdCor = this.createEl('td')
				let $tdRemove = this.createEl('td')
				let $buttonRemove = this.createEl('button')

				$image.setAttribute('src', car.image)
				$tdImage.appendChild($image)
				$tdBrand.textContent = car.brandModel
				$tdYear.textContent = car.year
				$tdPlate.textContent = car.plate
				$tdCor.textContent = car.color

				$buttonRemove.setAttribute('type', 'button')
				$buttonRemove.setAttribute('data-plate', car.plate)
				$buttonRemove.textContent = 'remover'
				$buttonRemove.addEventListener('click', this.removeRow)
				$tdRemove.appendChild($buttonRemove)

				$tr.appendChild($tdImage)
				$tr.appendChild($tdBrand)
				$tr.appendChild($tdYear)
				$tr.appendChild($tdPlate)
				$tr.appendChild($tdCor)
				$tr.appendChild($tdRemove)

				$fragment.appendChild($tr)

				return $fragment
			}
		}
	})()

	app.init()
})(window.DOM)
