exports.applicationcommands = {
  '^00' : {
     'name': 'Poll',
     'description' : 'Envisalink poll',
     'action': 'poll_response',
     'type' : 'envisalink'
	 },
   '^01' : {
     'name': 'Change Default Partition',
     'description': 'Change the partition which keystrokes are sent to when using the virtual keypad.',
     'action': 'command_response',
     'type' : 'envisalink'
	 },
   '^02' : {
     'name': 'Dump Zone Timers',
     'description' : 'This command contains the raw zone timers used inside the Envisalink. The dump is a 256 character packed HEX string representing 64 UINT16 (little endian) zone timers. Zone timers count down from 0xFFFF (zone is open) to 0x0000 (zone is closed too long ago to remember). Each tick of the zone time is actually 5 seconds so a zone timer of 0xFFFE means 5 seconds ago. Remember, the zone timers are LITTLE ENDIAN so the above example would be transmitted as FEFF.',
     'action': 'command_response',
     'type' : 'envisalink'
	 },
   '^03' : {
     'name': 'Keypress to Specific Partition',
     'description' : 'This will send a keystroke to the panel from an arbitrary partition. Use this if you dont want to change the TPI default partition.',
     'action': 'command_response',
     'type' : 'envisalink'
	 },
   '^0C' : {
     'name': 'Response for Invalid Command',
     'description' : 'This response is returned when an invalid command number is passed to Envisalink',
     'action': 'command_response',
     'type' : 'envisalink'
	 }
}

exports.tpicommands = {
  'Login:': {
    'name' : 'Login Prompt',
    'description' : 'Sent During Session Login Only.',
    'action': 'login'
	},
  'OK': {
    'name' : 'Login Success',
    'description' : 'Send During Session Login Only, successful login',
    'action': 'login_success'
	},
  'FAILED': {
    'name' : 'Login Failure',
    'description' : 'Sent During Session Login Only, password not accepted',
    'action': 'login_failure'
	},
  'Timed Out!': {
    'name' : 'Login Timed Out',
    'description' : 'Sent during Session Login Only, socket connection is then closed',
    'action': 'login_timeout'
	},
  '%00': {
    'name' : 'Virtual Keypad Update',
    'description' : 'The panel wants to update the state of the keypad',
    'action': 'keypad_update'
	},
  '%01': {
    'name' : 'Zone State Change',
    'description' : 'A zone change-of-state has occurred',
    'action': 'zone_state_change',
	'type' : 'zone'
	}, 
  '%02': {
    'name' : 'Partition State Change',
    'description' : 'A partition change-of-state has occured',
    'action' : 'partition_state_change',
    'type' : 'partition'
	},
  '%03': {
    'name' : 'Realtime CID Event',
    'description' : 'A system event has happened that is signaled to either the Envisalerts servers or the central monitoring station',
    'action' : 'realtime_cid_event',
    'type' : 'system'
	},
  '%FF': {
    'name' : 'Envisalink Zone Timer Dump',
    'description' : 'This command contains the raw zone timers used inside the Envisalink. The dump is a 256 character packed HEX string representing 64 UINT16 (little endian) zone timers. Zone timers count down from 0xFFFF (zone is open) to 0x0000 (zone is closed too long ago to remember). Each tick of the zone time is actually 5 seconds so a zone timer of 0xFFFE means 5 seconds ago. Remember, the zone timers are LITTLE ENDIAN so the above example would be transmitted as FEFF.',
    'action' : 'zone_timer_dump'
	}
}

exports.virtual_keypad_beep = {
  '00' : 'off',
  '01' : 'beep 1 time',
  '02' : 'beep 2 times',
  '03' : 'beep 3 times',
  '04' : 'continous fast beep',
  '05' : 'continuous slow beep'	
}

exports.led_flags = {
  'alarm' : 1,
  'alarm_in_memory' : 2,
  'armed_away' : 4,
  'ac_present' : 8,
  'bypass' : 16,
  'chime' : 32,
  'not_used1' : 64,
  'armed_zero_entry_delay' : 128,
  'alarm_fire_zone' : 256,
  'system_trouble' : 512,
  'not_used2' : 1024,
  'not_used3' : 2048,
  'ready' : 4096,
  'fire' : 8192,
  'low_battery' : 16384,
  'armed_stay' : 32768
  }
