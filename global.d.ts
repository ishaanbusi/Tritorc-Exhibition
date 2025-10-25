/// <reference types="react" />

// So TS accepts the module when you dynamically import it
declare module '@google/model-viewer';

// Tell TS about the <model-viewer> web component
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      // Common attributes (add more anytime)
      src?: string;
      poster?: string;
      alt?: string;

      ar?: boolean;
      'ar-modes'?: string; // "webxr scene-viewer quick-look"
      'camera-controls'?: boolean;
      'auto-rotate'?: boolean;
      'disable-zoom'?: boolean;

      'environment-image'?: string;
      'exposure'?: number | string;
      'shadow-intensity'?: number | string;
      'tone-mapping'?: string;

      'camera-orbit'?: string;     // e.g. "0deg 75deg 2.5m"
      'field-of-view'?: string;    // e.g. "30deg"
      'min-field-of-view'?: string;
      'max-field-of-view'?: string;

      'interaction-prompt'?: string;
      'interaction-prompt-style'?: string;

      'animation-name'?: string;
      'animation-crossfade-duration'?: number | string;

      style?: React.CSSProperties;
    };
  }
}
