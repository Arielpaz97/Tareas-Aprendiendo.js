const readline = require('readline')
// const program = require('commander')
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const preguntar = (pregunta) => new Promise(resolve => rl.question(pregunta, resolve))

const agregarUsuario = async (usuarios) => {
  const name = await preguntar('Ingrese el nombre: ')
  const age = await preguntar('Ingrese el apellido: ')
  const nuevoUsuario = {
    name,
    age
  }
  usuarios.push(nuevoUsuario)
  console.log(usuarios)
  return usuarios
}

function showUsuarios(usuarios) {
  console.log('Los usuarios cargados son: ')
  usuarios.forEach(usuario => {
    console.log(`Nombre: ${usuario.name} | edad: ${usuario.age}`)
  })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const editarUsuarios = async (usuarios) => {
  const name = await preguntar('Ingrese el nombre que desea editar: ')
  let flag = false
  await asyncForEach(usuarios, async (usuario) => {
    if (name.toUpperCase() === usuario.name.toUpperCase() && !flag) {
      const newName = await preguntar('Ingrese el nuevo nombre: ')
      const newAge = await preguntar('Ingrese la nueva edad: ')
      usuario.name = newName
      usuario.age = newAge
      flag = true
    }
  })
  if (!flag) {
    console.log('No se encontro el nombre, vuelva a intentar')
  }
  return usuarios
}

(async _ => {
  let usuarios = [
    {
      name: 'prueba',
      age: 0
    }
  ]
  try {
    if (fs.existsSync('./usuarios.json')) {
      let ask
      const stringObjeto = fs.readFileSync('./usuarios.json')
      usuarios = JSON.parse(stringObjeto)
      if (usuarios.length) {
        showUsuarios(usuarios)
        ask = await preguntar('Desea agregar un usuario? Porfavor responda con "si" o "no": ')
        if (ask.toUpperCase() === 'SI') { usuarios = await agregarUsuario(usuarios) }
        ask = await preguntar('Desea editar un usuario? Porfavor responda con "si" o "no": ')
        if (ask.toUpperCase() === 'SI') { usuarios = await editarUsuarios(usuarios) }
      } else {
        console.log('No hay usuarios')
        ask = await preguntar('Desea agregar un usuario? Porfavor responda con "si" o "no": ')
        if (ask.toUpperCase() === 'SI') { usuarios = await agregarUsuario(usuarios) }
      }
    } else {
      console.log("No existe el archivo, se creara uno nuevo")
    }
  } catch (error) {
    console.log(error)
  } finally {
    const objetoString = JSON.stringify(usuarios, null, 4)
    fs.writeFileSync('./usuarios.json', objetoString)
    console.log('Finalizo')
  }
})()