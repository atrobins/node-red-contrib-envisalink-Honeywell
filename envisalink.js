'use strict'
var net = require('net')
var EventEmitter = require('events').EventEmitter
var util = require('util')
var tpidefs = require('./tpi.js')

function EnvisaLink (config) {
  EventEmitter.call(this)
  this.options = {
    host: config.host,
    port: config.port,
    password: config.password,
    zones: config.zones,
    partitions: config.partitions
  }
  this.pollId = undefined
}

util.inherits(EnvisaLink, EventEmitter)
module.exports = EnvisaLink

EnvisaLink.prototype.connect = function () {
  var _this = this
  this.zones = {}
  this.partitions = {}
  this.users = {}
  this.systems = undefined
  this.shouldReconnect = true

  this.connection = net.createConnection({ port: this.options.port, host: this.options.host })

  this.connection.on('error', function (ex) {
    _this.emit('log-error', '' + ex)
    _this.emit('error', ex)
  })

  this.connection.on('close', function (hadError) {
    clearInterval(this.pollId)
    setTimeout(function () {
      if (_this.shouldReconnect && (_this.connection === undefined || _this.connection.destroyed)) {
        _this.connect()
      }
    }, 5000)
  })

  this.connection.on('end', function () {
    _this.emit('disconnect')
  })

  this.connection.on('data', function (data) {
    data.toString('utf8').split(/\r?\n/).forEach( function (item) {    
      if (item.length !== 0) { 
        var code = item
        var tpi = tpidefs.tpicommands[item]

        if (item[0] == '%' || item[0] == '^') {
          code = item.split(',')[0]
          item = item.slice(item.indexOf(',')+1,-1)
          tpi = tpidefs.tpicommands[code]
        }
  
        // Action Handlers
        switch(tpi.action) {
          default: return
          case 'login':
            login(item)
            break
          case 'login_success':
            login_success(item)
            break
          case 'login_failure':
            login_failure(item)
            break
          case 'login_timeout':
            login_timeout(item)
            break
          case 'keypad_update':
            keypad_update(item)
            break
          case 'zone_state_change':
            zone_state_change(item)
            break
        } 
      }
    })
  })

  // Functions
  function login() {
    _this.sendCommand(_this.options.password)
  }
  function login_success() {
    _this.emit('connected')
    clearInterval(_this.pollId)
    _this.pollId = setInterval(function () {_this.sendCommand('0')}, 60000)
  }
  function login_failure() {}
  function login_timeout() {}
  function keypad_update(data) {   
    var map = data.split(',')
    if (map.length != 5 || data.indexOf('%') != -1) {
      _this.emit('log-error', '' + ex)
      return
    }

    var msg = {}
    msg.partitionNumber = parseInt(map[0])
    msg.flags = getLedFlag(map[1])
    msg.userOrZone = parseInt(map[2])
    msg.beep = tpidefs.virtual_keypad_beep[map[3]]
    msg.alpha = map[4].trim()
    msg.dscCode = getDscCode(msg.flags)

    _this.emit('zoneupdate', msg)
  }  
  
  function zone_state_change() {}
  
  function getLedFlag(flag) {
    var flags = {};
    var flagInt = parseInt(flag, 16);
    for (var key in tpidefs.led_flags) {
      flags[key] = Boolean(tpidefs.led_flags[key] & flagInt);
    }
    return flags;
  }

  function getDscCode(flags) {
    var dscCode = '';
    if (flags.alarm || flags.alarm_fire_zone || flags.fire) { dscCode = 'IN_ALARM'; }
    else if (flags.system_trouble) { dscCode = 'NOT_READY'; }
    else if (flags.ready) { dscCode = 'READY'; }
    else if (flags.bypass) { dscCode = 'READY_BYPASS'; }
    else if (flags.armed_stay) { dscCode = 'ARMED_STAY'; }
    else if (flags.armed_away) { dscCode = 'ARMED_AWAY'; }
    else if (flags.armed_zero_entry_delay) { dscCode = 'ARMED_MAX'; }
    else if (flags.not_used2 && flags.not_used3) { dscCode = 'NOT_READY'; } // added to handle 'Hit * for faults'
    return dscCode;
  }
}

EnvisaLink.prototype.sendCommand = function (data) { 
  var bytes = new Buffer(data + '\r\n', "ascii")
  this.connection.write(bytes)
 }

EnvisaLink.prototype.disconnect = function () {
  clearInterval(this.pollId)
  this.shouldReconnect = false
  if (this.connection && !this.connection.destroyed) {
    this.connection.end()
    return false
  } else {
    return true
  }
}