import * as React from "react";

// WhatsApp Icon SVG
export const WhatsappIcon = React.forwardRef<
  React.ElementRef<"svg">,
  React.ComponentPropsWithoutRef<"svg">
>(({ className, ...props }, ref) => (
 <svg
    ref={ref}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.3-.3.1-.1.2-.2.1-.4-.1-.5-.6-1.5-.8-2.1-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2 1 2.4.1.1 1.5 2.3 3.6 3.2.5.2 1 .4 1.3.5.6.2 1.1.1 1.5-.1.5-.2 1.5-1.7 1.7-1.9.2-.2.2-.4.1-.5-.1 0-.2-.1-.4-.2zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18.4c-4.6 0-8.4-3.8-8.4-8.4 0-4.6 3.8-8.4 8.4-8.4 4.6 0 8.4 3.8 8.4 8.4 0 4.6-3.8 8.4-8.4 8.4z" />
 </svg>
));
WhatsappIcon.displayName = "WhatsappIcon";

// X (Twitter) Icon SVG
export const XIcon = React.forwardRef<
  React.ElementRef<"svg">,
  React.ComponentPropsWithoutRef<"svg">
>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.834L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
));
XIcon.displayName = "XIcon";