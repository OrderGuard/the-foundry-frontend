declare module 'aos' {
  interface AosOptions {
    disable?: boolean | 'phone' | 'tablet' | 'mobile';
    startEvent?: string;
    initClassName?: string;
    animatedClassName?: string;
    useClassNames?: boolean;
    disableMutationObserver?: boolean;
    debounceDelay?: number;
    throttleDelay?: number;
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: 'top-bottom' | 'top-center' | 'bottom-bottom' | 'bottom-center';
  }

  function init(options?: AosOptions): void;
  function refresh(): void;

  const AOS: {
    init: typeof init;
    refresh: typeof refresh;
  };

  export { init, refresh };
  export default AOS;
}

