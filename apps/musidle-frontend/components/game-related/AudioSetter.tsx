'use client';
import { Session } from 'next-auth';
import { useAudioStore } from '../../stores/AudioStore';
import { useEffect } from 'react';

export default function AudioSetter({
  buffer,
  songId,
  session,
}: {
  buffer: string | null;
  songId: string | null;
  session: Session | null;
}) {
  useEffect(() => {
    if (buffer != null && songId != null) {
      try {
        const arrayBuffer = Uint8Array.from(Buffer.from(buffer, 'base64')).buffer;
        // Use the audio data to create an AudioContext and decode the audio data
        const audioContext = new AudioContext();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = session?.user.settings?.volume ?? 0.25;
        gainNode.connect(audioContext.destination);
        audioContext
          .decodeAudioData(arrayBuffer, audioBuffer => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            source.connect(gainNode);
            source.start();
            audioContext.suspend();
            useAudioStore.setState({
              audio: source,
              audioContext: audioContext,
            });
          })
          .catch(err => console.log(err));
        useAudioStore.getState().setSongId(songId);
      } catch (err) {
        console.log(err);
      }
    }
  }, [buffer, songId, session]);
  return null;
}
