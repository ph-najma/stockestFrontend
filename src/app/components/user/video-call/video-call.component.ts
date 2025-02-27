import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-call',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css',
})
export class VideoCallComponent implements OnInit {
  private socket: Socket;
  localStream: any;
  remoteStream: any;
  peerConnection: any;
  roomCode: string = '';
  joiner: boolean = false;
  userRoomCode: string = '';
  isHost: boolean = false;
  servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  constructor() {
    this.socket = io(environment.socketUrl);
  }
  ngOnInit() {
    const token = sessionStorage.getItem('token'); // Ensure the token is stored correctly

    this.socket = io(environment.socketUrl, {
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`, // Send token in headers
      },
    });
    this.socket.on('room-created', (roomCode) => {
      this.roomCode = roomCode;
    });

    this.socket.on('room-joined', (roomCode) => {
      this.roomCode = roomCode;
      this.createPeerConnection();
    });

    this.socket.on('user-joined', () => {
      if (this.isHost) this.createOffer();
    });

    this.socket.on('offer', async (offer: any) => {
      await this.createAnswer(offer);
    });

    this.socket.on('answer', async (answer: any) => {
      await this.peerConnection.setRemoteDescription(answer);
    });

    this.socket.on('ice-candidate', (candidate: any) => {
      this.peerConnection.addIceCandidate(candidate);
    });
    this.socket.on('call-ended', () => {
      this.terminateCall();
    });
    this.getMedia();
  }
  startCall() {
    this.isHost = true;
    this.socket.emit('create-room');
  }

  joinCall() {
    if (this.userRoomCode) {
      this.joiner = true;
      this.socket.emit('join-room', this.userRoomCode);
    }
  }

  // createPeerConnection() {
  //   this.peerConnection = new RTCPeerConnection(this.servers);

  //   // Add local stream tracks
  //   this.localStream.getTracks().forEach((track: any) => {
  //     this.peerConnection.addTrack(track, this.localStream);
  //   });

  //   // Handle incoming remote stream
  //   this.peerConnection.ontrack = (event: any) => {
  //     const remoteVideo = document.getElementById(
  //       'remoteVideo'
  //     ) as HTMLVideoElement;
  //     remoteVideo.srcObject = event.streams[0];
  //   };

  //   // Handle ICE candidates
  //   this.peerConnection.onicecandidate = (event: any) => {
  //     if (event.candidate) {
  //       this.socket.emit('ice-candidate', event.candidate);
  //     }
  //   };
  // }
  terminateCall() {
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Stop local media stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: any) => track.stop());
    }

    // Clear video element sources
    const localVideo = document.getElementById(
      'localVideo'
    ) as HTMLVideoElement;
    const remoteVideo = document.getElementById(
      'remoteVideo'
    ) as HTMLVideoElement;

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
  }

  async getMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const videoElement = document.getElementById(
        'localVideo'
      ) as HTMLVideoElement;
      videoElement.srcObject = this.localStream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }

  // async createOffer() {
  //   this.peerConnection = new RTCPeerConnection(this.servers);
  //   this.localStream
  //     .getTracks()
  //     .forEach((track: any) =>
  //       this.peerConnection.addTrack(track, this.localStream)
  //     );

  //   this.peerConnection.ontrack = (event: any) => {
  //     const videoElement = document.getElementById(
  //       'remoteVideo'
  //     ) as HTMLVideoElement;
  //     videoElement.srcObject = event.streams[0];
  //   };

  //   this.peerConnection.onicecandidate = (event: any) => {
  //     if (event.candidate) {
  //       this.socket.emit('ice-candidate', event.candidate);
  //     }
  //   };

  //   const offer = await this.peerConnection.createOffer();
  //   await this.peerConnection.setLocalDescription(offer);
  //   this.socket.emit('offer', offer);
  // }

  // async createAnswer(offer: any) {
  //   this.peerConnection = new RTCPeerConnection(this.servers);
  //   this.localStream
  //     .getTracks()
  //     .forEach((track: any) =>
  //       this.peerConnection.addTrack(track, this.localStream)
  //     );

  //   this.peerConnection.ontrack = (event: any) => {
  //     const videoElement = document.getElementById(
  //       'remoteVideo'
  //     ) as HTMLVideoElement;
  //     videoElement.srcObject = event.streams[0];
  //   };

  //   this.peerConnection.onicecandidate = (event: any) => {
  //     if (event.candidate) {
  //       this.socket.emit('ice-candidate', event.candidate);
  //     }
  //   };

  //   await this.peerConnection.setRemoteDescription(offer);
  //   const answer = await this.peerConnection.createAnswer();
  //   await this.peerConnection.setLocalDescription(answer);
  //   this.socket.emit('answer', answer);
  // }
  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.servers);

    // Ensure tracks are added properly
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: any) => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    // Set up event listener for remote track
    this.peerConnection.ontrack = (event: any) => {
      console.log('Remote track received:', event.streams[0]);

      const remoteVideo = document.getElementById(
        'remoteVideo'
      ) as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', {
          roomCode: this.roomCode,
          candidate: event.candidate,
        });
      }
    };
  }

  async createOffer() {
    this.createPeerConnection();
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('offer', { roomCode: this.roomCode, offer });
  }

  async createAnswer(offer: any) {
    this.createPeerConnection();
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.socket.emit('answer', { roomCode: this.roomCode, answer });
  }
  endCall() {
    this.terminateCall();
    this.socket.emit('call-ended', { roomCode: this.roomCode });
  }

  maximizeVideo(videoId: string) {
    const videoElement = document.getElementById(videoId) as HTMLVideoElement;
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if ((videoElement as any).webkitRequestFullscreen) {
      // Safari
      (videoElement as any).webkitRequestFullscreen();
    } else if ((videoElement as any).msRequestFullscreen) {
      // IE/Edge
      (videoElement as any).msRequestFullscreen();
    }
  }

  minimizeVideo(videoId: string) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  async enablePictureInPicture(videoId: string) {
    const videoElement = document.getElementById(videoId) as HTMLVideoElement;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoElement.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture error:', error);
    }
  }
}
