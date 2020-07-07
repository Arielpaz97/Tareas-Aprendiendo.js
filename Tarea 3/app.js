const fs = require('fs')

const segurosDeAutos = async (marca) => ({
  "Renault": 0.8,
  "Ford": 1,
  "Chevrolet": 0.5
})[marca]

(async _ => {
  let autos = []
  try {
    const stringObjeto = fs.readFileSync('./autos.json')
    autos = JSON.parse(stringObjeto)
    const newAutos = await getNewAutos(autos)
    const objetoString = JSON.stringify(newAutos, null, 4)
    fs.writeFileSync('./autos.json', objetoString)
  } catch (error) {
    console.log('Tu JSON no es válido')
  } 
})()

const calcularSeguro = async (auto) => {
  let vaAPagar = 1000
  const porcentaje = segurosDeAutos(auto.marca)
  vaAPagar *= porcentaje
  return vaAPagar
}

const getNewAutos = async (autos) => {
  let totalAPagar = 0
  if (autos.length) {
    let i
    for (i = 0; i < autos.length; i++) {
      const auto = autos[i]
      if (auto.marca && auto.modelo) {
        const seguro = await calcularSeguro(auto)
        console.log(`El seguro de ${auto.marca} ${auto.modelo} es:$`, seguro)
        auto.seguro = seguro
        totalAPagar += seguro
      } else if (i === autos.length - 1) { // para saber si es el ultimo auto
        auto.totalAPagar = totalAPagar
      } else { // error al calcular
        auto.error = "No se puede calcular"
      }
    }
    console.log(`El Total a pagar es de:$${totalAPagar}`)
  } else {
    console.log('No hay autos a calcular')
  }
}
