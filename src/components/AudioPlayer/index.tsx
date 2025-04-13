export interface AudioPlayerProps {
  audioElementRef: React.RefObject<HTMLAudioElement | null>;
  mediaFile: File | null;
}

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
