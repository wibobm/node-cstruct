let types = require('./types')
let assert = require('assert')

function innerWrite (schema, data, buffer, offset) {
  function getType (name) {
    return (schema.linkedTypes.get(name) || types.get(name))
  }

  schema.attributes.forEach(function (def) {
    // let type = types.get(def.type)
    // let type = def.type
    let type = getType(def.type)

    if (def.isArray === false) {
      type.write(data[def.name], buffer, offset + def.offset)
      return
    }

    let size = type.byteLength

    for (let i = 0; i < def.count; i++) {
      type.write(data[def.name][i], buffer, offset + def.offset + (i * size))
    }
  })

  return buffer
}

export default function write (schema, data, targetBuffer = null, targetOffset = 0) {
  if (targetBuffer) {
    assert(targetOffset >= 0 && targetBuffer.length >= targetOffset + schema.byteLength)
    return innerWrite(schema, data, targetBuffer, targetOffset)
  } else {
    assert(targetOffset === 0)
    return innerWrite(schema, data, new Buffer(schema.byteLength), 0)
  }
}
