const serialPort = require('serialport');
const mbPort = new serialPort(process.env.NODE_SERIAL_PORT, {
  baudRate: 115200
});
console.log('Loading Serial Module');

module.exports = class RmbSerial {
  static send(mbId, type, id, data) {
    RmbSerial.sendSerial(mbId, type, id, data)
  }
  static sendSerial(mbId, type, id, data) {
    const msg = `${mbId}${type}${id}${data}`;
    RmbSerial.sendRaw(msg);
  }
  static sendRaw(msg) {
    console.log(`Sending raw message: ${msg}`);
    mbPort.write(msg+"\n", (err) => {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log('message written:\n' + msg);
  });
  }
}

