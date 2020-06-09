const fs = require('fs')

let totalAPagar = 0
let autos = []

const segurosDeAutos = (marca) => ({
  "Renault": 0.8,
  "Ford": 1,
  "Chevrolet": 0.5
})[marca]

try {
  const stringObjeto = fs.readFileSync('./autos.json')
  autos = JSON.parse(stringObjeto)
  showPrecios(autos)
}catch (error) {
  console.log('Tu JSON no es válido')
}

function calcularSeguro(auto) {
  let vaAPagar = 1000
  const porcentaje = segurosDeAutos(auto.marca)
  vaAPagar *= porcentaje
  return vaAPagar
}

function showPrecios(autos){
  if (autos.length) {
    for (let auto of autos) {
      const seguro = calcularSeguro(auto)
      console.log(`El seguro de ${auto.marca} ${auto.modelo} es:$`, seguro)
      auto.seguro = seguro
      totalAPagar += seguro
    }
    const objetoString = JSON.stringify(autos, null, 4)
    fs.writeFileSync('./autos.json', objetoString)
    console.log(`El Total a pagar es de:$${totalAPagar}`)
  } else {
    console.log('No hay autos a calcular')
  }
}
