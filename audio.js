// const player = new Tone.Player("https://tonejs.github.io/audio/berklee/gong_1.mp3").toDestination();
// Tone.loaded().then(() => {
// 	player.start();
// });

//const synth = new Tone.Synth().toDestination();

// let noteRanges = {
//     0 : ['C1', 'C#1'],
//     1 : ['C2', 'C#2'],
//     2 : ['C3', 'C#4'],
//     3 : ['C4', 'C#4'],
// }

const range = (start, stop, step=1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);


let sampleUrls = {}
let noteRanges = {}

let midiNumber = 0;
let midiStart = midiNumber;

// bss_eggo_dingthing_ding_1.wav - 17
for (var i = 1; i <= 17; i++) {
    let key = Tone.Frequency(midiNumber, "midi").toNote()
    sampleUrls[key] = `bss_eggo_dingthing_ding_${i}.wav`;
    midiNumber++; 
}
noteRanges[0] = range(midiStart,midiNumber - 1);

midiStart = midiNumber;
// bss_eggo_dingthing_leggo_1.wav - 11
for (var i = 1; i <= 11; i++) {
    let key = Tone.Frequency(midiNumber, "midi").toNote()
    sampleUrls[key] = `bss_eggo_dingthing_leggo_${i}.wav`;
    midiNumber++; 
}
noteRanges[1] = range(midiStart,midiNumber - 1);

midiStart = midiNumber;
// bss_eggo_dingthing_toaster_1.wav - 11
for (var i = 1; i <= 11; i++) {
    let key = Tone.Frequency(midiNumber, "midi").toNote()
    sampleUrls[key] = `bss_eggo_dingthing_toaster_${i}.wav`;
    midiNumber++; 
}
noteRanges[2] = range(midiStart,midiNumber - 1);

midiStart = midiNumber;
// bss_eggo_dingthing_waffle_1.wav - 6
for (var i = 1; i <= 6; i++) {
    let key = Tone.Frequency(midiNumber, "midi").toNote()
    sampleUrls[key] = `bss_eggo_dingthing_waffle_${i}.wav`;
    midiNumber++; 
}
noteRanges[3] = range(midiStart,midiNumber - 1);

const sampler = new Tone.Sampler({
	urls: sampleUrls,
	release: 1,
	baseUrl: "./audio/",
}).toDestination();

const totalDuration = 4.0;

function createPart(values) {
    if (typeof part !== "undefined") { 
        part.dispose()
    }
    part = new Tone.Part(((time, value) => {
        sampler.triggerAttackRelease(value.note, 4.0, time, value.velocity)
    }), values);
    
    part.start(0);
}

function randomNotes() {
    return Array.from([0,1,2,3], (i) => randomNote(i));
  }
  
function randomNote(voiceIndex) {
    let time = Math.random() * totalDuration * 0.9;
    let velocity = Math.random() * 0.9 + 0.1;
    
    let noteIndex = Math.floor(Math.random() * noteRanges[voiceIndex].length);
    let note = new NoteValue(time, velocity, voiceIndex, noteIndex);
    // return {'time': time, 'note': notes[noteIndex], 'voiceIndex': voiceIndex, 'velocity': velocity }
    return note;
}

function randomTimeinMeasures() {
    let sixteenths = Math.floor(Math.random() * partDuration);
    let inSixteenths = sixteenths;
    let measures = Math.floor(sixteenths / 16);
    sixteenths %= 16;
    let quarters = Math.floor(sixteenths / 4);
    sixteenths %= 4;
    let time = measures + ":" + quarters + ":" + sixteenths;

    return {time, inSixteenths}
}

class NoteValue {
    constructor(time, velocity, voiceIndex, noteIndex) {
        this.time = time;
        this.velocity = velocity;
        this.voiceIndex = voiceIndex;
        this.noteIndex = noteIndex;
    }

    get note() {
        let midiNumber = parseInt(noteRanges[this.voiceIndex][this.noteIndex]);
        return Tone.Frequency(midiNumber, "midi").toNote()
    }

    nextNoteIndex() {
        this.noteIndex += 1;
        this.noteIndex %= noteRanges[this.voiceIndex].length;
        sampler.triggerAttackRelease(this.note, 4.0, undefined, this.velocity);
    }

}