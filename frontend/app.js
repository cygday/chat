// age gate

if (document.getElementById('allow')) {
    document.getElementById('allow').onclick = () => {
        localStorage.setItem('adult', 'yes');
        location.href = 'login.html';
    };
    document.getElementById('deny').onclick = () => {
        alert('You must be at least 18 years old to access this site.');
    };
}

//project page

if (location.pathname.includes('login.html') ||
location.pathname.includes('call')) {
    if (localStorage.getItem('adult') !== 'yes') {
        location.href = 'index.html';
    }
}

//login

function login(type) {
    localStorage.setItem('user', type);
    location.href = 'call.html';    
     }



//vc

const socket = io("https://https://chat-wn1p.onrender.com");
let pc;
let localStream;

const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    pc = new RTCPeerConnection(config);
    localStream.getTracks().forEach(t => pc.addTrack(t, localStream));

    pc.ontrack = e => remoteVideo.srcObject = e.streams[0];
    pc.onicecandidate = e => e.candidate && socket.emit('ice', e.candidate);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', offer);
}

socket.on('offer', async offer => {
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', a => 
pc.setRemoteDescription(a));
socket.on('ice', c =>
pc.addIceCandidate(c));



document.getElementById('start')?.addEventListener('click', startCall);
document.getElementById('hangup')?.addEventListener('click', () => location.reload());


//chat

function sendMsg() {
    const msg = document.getElementById("msg").value;
    socket.emit("chat", msg);
}

socket.on("chat", msg => {
    const div = document.createElement("div");
    div.innerText = msg;

document.getElementById("messages").appendChild(div);
});