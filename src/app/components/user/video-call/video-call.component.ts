import { Component, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../enviornments/enviornment';

@Component({
  selector: 'app-video-call',
  imports: [],
  standalone: true,
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css',
})
export class VideoCallComponent implements OnInit {
  private socket = io(environment.apiUrl);
  localStream: any;
  remoteStream: any;
  peerConnection: any;
  servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  ngOnInit() {
    this.getMedia();

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
  }
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

  async createOffer() {
    this.peerConnection = new RTCPeerConnection(this.servers);
    this.localStream
      .getTracks()
      .forEach((track: any) =>
        this.peerConnection.addTrack(track, this.localStream)
      );

    this.peerConnection.ontrack = (event: any) => {
      const videoElement = document.getElementById(
        'remoteVideo'
      ) as HTMLVideoElement;
      videoElement.srcObject = event.streams[0];
    };

    this.peerConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('offer', offer);
  }

  async createAnswer(offer: any) {
    this.peerConnection = new RTCPeerConnection(this.servers);
    this.localStream
      .getTracks()
      .forEach((track: any) =>
        this.peerConnection.addTrack(track, this.localStream)
      );

    this.peerConnection.ontrack = (event: any) => {
      const videoElement = document.getElementById(
        'remoteVideo'
      ) as HTMLVideoElement;
      videoElement.srcObject = event.streams[0];
    };

    this.peerConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', event.candidate);
      }
    };

    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.socket.emit('answer', answer);
  }
  endCall() {
    // Close peer connection and clean up local media
    this.terminateCall();

    // Notify the server that the call has ended
    this.socket.emit('call-ended');
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
