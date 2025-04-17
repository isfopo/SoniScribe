export interface AudioPlayerProps {
  /**
   * Ref to the audio element.
   * This is used to control the audio element (play, pause, etc.).
   */
  audioElementRef: React.RefObject<HTMLAudioElement | null>;
  /**
   * The media file to be played.
   * This is a File object representing the audio file.
   */
  mediaFile: File | null;
}

/**
 * AudioPlayer component that renders an audio element.
 * It uses a ref to control the audio element and plays the media file.
 */
export const AudioPlayer = ({
  audioElementRef,
  mediaFile,
}: AudioPlayerProps) => {
  return (
    <audio ref={audioElementRef}>
      <source
        src={mediaFile ? URL.createObjectURL(mediaFile) : undefined}
        type={mediaFile?.type}
      />
      Your browser does not support the audio element.
    </audio>
  );
};
