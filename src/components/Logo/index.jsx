import * as React from 'react';
import { Svg } from './styles';

export const Logo = () => (
  <a href="/">
    <SvgComponent />
  </a>
);

const SvgComponent = (props) => (
  <Svg
    width={550.145}
    height={156.808}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-25.072 -3.404 550.145 156.808"
    style={{
      background: '0 0',
    }}
    preserveAspectRatio="xMidYMid"
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...props}
  >
    <defs>
      <filter id="a" x="-100%" y="-100%" width="300%" height="300%">
        <feFlood floodColor="#ccc" result="flood-surface" />
        <feFlood floodColor="#777" result="flood-extrude" />
        <feMorphology in="SourceAlpha" radius={1} result="erode" />
        <feConvolveMatrix
          in="erode"
          result="shadow"
          order="11,8"
          divisor={1}
          kernelMatrix="0 0 0 1 1 1 1 1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 1 1 0 1 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0"
        />
        <feOffset dy={4} in="shadow" result="offset" />
        <feGaussianBlur in="offset" stdDeviation={0.2} result="blur" />
        <feComposite
          operator="in"
          in="flood-extrude"
          in2="blur"
          result="extrude"
        />
        <feMorphology in="SourceAlpha" radius={1} result="erode2" />
        <feConvolveMatrix
          in="erode2"
          result="out"
          order="4,4"
          divisor={1}
          kernelMatrix="0 1 1 0 1 0 0 1 1 0 0 1 0 1 1 0"
        />
        <feComposite operator="in" in="flood-surface" in2="out" result="text" />
        <feMerge>
          <feMergeNode in="extrude" />
          <feMergeNode in="text" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#a)">
      <path
        d="M61.815 78.125h.08q2.69 0 4.27 1.11 1.35.15 1.35.47v.16q-1.19 0-1.19.55.24.4 1.5.48.16.39 1.11.63l2.06-.16.79.24 6.09-1.27h.32q5.93 1.59 10.67 5.22 4.99 4.99 5.78 7.68.79 2.69.79 3.71-1.11 9.42-1.9 9.42-2.93 4.74-3.56 5.38l-.71.63.24.24v.08q-1.43 1.74-2.93 2.21-.79.48-.87 1.42-1.11 1.11-3.72 1.11-5.69 1.98-7.83 1.98-.87 0-3.4-1.35-2.21-.39-3.8-.39l-.47.32q.47.87.47 4.19v1.03l.56 3.63.08 5.54v.79q0 1.98 1.42 1.98l.55.48v.07q-.55 0-.55.56 1.19 1.03 1.19 2.92l.39 1.51q-1.34.39-2.85.39l-5.53-.39q-1.51 1.1-1.66 1.1-1.74-.47-3.41-3.87l-.07-.08.07-.4q.48-.15.48-.23v-.08q-.55-.79-.55-1.19l.07-.31h.24q.16 0 .16.31h.55l.16-.08v-.95q.56-.79 1.66-.79.32-.31.32-3.87v-5.62q0-1.9-.47-7.2v-29.9l-.08-2.45h-2.06l-.24-.32-.08-4.35q0-1.98 1.98-1.98.4-.15 2.53-.31Zm-3.56 1.5q0 .48.4.71h.39q.56 0 .72-.47v-.24q-.16-.39-.72-.39h-.16q-.63 0-.63.39Zm8.7 1.74h-.15l-.16.24v.24l.16.23h.15l.16-.23v-.24l-.16-.24Zm12.11 0h-.16v.32q.95.39 1.58.39h.47v-.08q0-.39-1.89-.63Zm-19.38.16h-.4l-.24.16v.39q0 .64.64 1.03h.15l.08-.55v-.24q0-.71-.23-.79Zm9.33.95.24.08h.39l.24-.24-.16-.24h-.08q-.63.16-.63.4Zm12.74 0v.08q.79.95 2.13 1.34h.24q0-1.03-2.37-1.42Zm-7.91.79q0 .32 3.24.71 0 .16.71.16h1.19l.31-.24-.23-.23h-.24l-.95.15-.4-.15v-.08l.32-.32v-.4l-.71-.07h-1.27q-1.82.07-1.97.47Zm-12.5 3.95q0 1.19.47 1.82v.16l-.55 1.51.55 1.26q-.71 6.41-.71 9.81v5.69q0 2.46.32 4.12l-.32 2.37v.79l.16 6.8.08.16h.08q.79-.31.79-.95v-.15l-.4-.72q.32 0 .56-6.72l-.16-5.46q.39-14 .39-18.51v-.16q0-4.58-.71-4.58-.55 0-.55 2.76Zm24.36-2.37h-.24v.16q.08.32.64.55l.31-.08v-.15q-.23-.48-.71-.48Zm-10.99 3.17q0 .23 1.02.23l.56-.08v-.15l-.24-.48 4.35-.55.4-.24-.32-.47h-.63q-5.14.63-5.14 1.74Zm14.23-1.43-.08.16q.72.95 1.27 1.34h.16q0-.79-1.35-1.5Zm-5.69.63-.16-.23h-.32v.08l.32.31h.16v-.16Zm-14.79.32h-.24l-.48.48v.15h.32l.4-.39v-.24Zm12.57.24h-.63v.08q.32.55 1.74.55h.55l.24-.16q-.24-.31-1.9-.47Zm-17 .95v.47q.31 0 .47-1.34h-.16q-.31.08-.31.87Zm8.3-.48h-.16q0 .48-1.66 1.35v.16h.48l.08-.08.15.08v.08q-3.4 1.66-4.11 2.92-.24 0-.63 14.71l-.16 1.19q0 .24 3.48 2.85l3.32 1.5q.08.48.4.48h.32q2.37 0 5.37-1.74.95-.95 3.48-1.82 4.04-3.17 4.04-6.17v-1.27l-.16-1.03v-.16l.63-.79v-.23q-.71-.32-.71-1.9 0-2.77-1.58-4.51-.87-2.14-2.77-3.48-.63-1.03-4.11-1.82h-.71l-3.72.32h-.24q-.63 0-1.03-.64Zm18.67.56-.08-.24h-.24v.24l.24.16h.08v-.16Zm-6.57-.08-.31.24v.07q0 .95 1.66 1.67h.24v-.16q0-1.19-1.59-1.82Zm-20.25 9.09v-5.85l-.23.16-.16 5.46.08.47h.16l.15-.24Zm27.53-5.37-.24.07.64 1.11h.31v-.16q0-.55-.71-1.02Zm-4.82.07h-.4v.48q0 .63 1.19 2.61h.16v-.32q0-1.97-.95-2.77Zm1.34 4.67-.08-.39h-.39v.47l.39.08.08-.16Zm2.53 9.02h.16q1.5-2.45 1.5-5.54v-1.11h-.15q-.72 0-1.51 6.65Zm-2.05-6.57h-.16v1.11l.31.32h.08l.24-.24q0-.71-.47-1.19Zm-.95 4.28v.07h.08q.95-.07.95-.79v-.71l-.24-.08h-.08q-.71.56-.71 1.51Zm-2.77 5.77.08.08h.16q.95-.55 1.02-.95l-.15-.08q-1.03.48-1.11.95Zm-17.56 1.03-.63-.71h-.32q.08.95.95.95v-.24Zm17.64 1.66v.32h.16q1.02-.32 1.02-.95h-.15q-.8 0-1.03.63Zm-9.34 2.85v.08h.32q4.43-.95 4.43-1.59v-.15q0-.16-.32-.16-4.43 1.18-4.43 1.82Zm7.28-.32h.08q1.58-.63 1.82-.95v-.08l-.24-.16h-.08q-1.58.64-1.58 1.19Zm-15.98-.4-.08.08v.16q0 .79 4.67 1.27l1.58-.79v-.08l-.23-.4h-.48l-2.14.48q-2.13-.72-3.32-.72Zm-5.61 9.5v1.26q0 1.35.39 1.35.71-1.35.71-3.09v-.39q0-.24-.47-.24-.63.24-.63 1.11Zm1.1 4.59h-.31l-.32.31v1.03q0 .71.32 1.42h.39l.16-.47v-1.03q0-1.26-.24-1.26Zm1.82 7.83h-.16l-.23.23v.16l.23.32h.32l.16-.24v-.24l-.32-.23Zm-3.24.47-.24-.24h-.47v.16q.08.32.63.32l.08-.24Zm5.46-.24h-.4l-.23.24v.16l.23.32h.4l.24-.24v-.24l-.24-.24Zm-5.93 1.74h-1.51l-.16.24v.08q0 .16 1.11.32 1.27-.08 1.27-.32v-.16l-.71-.16Zm38.91-77.83 1.59-.08q10.12.39 10.12 1.82l.55 11.63q0 1.58-1.74 7.99-.39 2.53-.39 3.32v.47h.24q5.3-4.11 12.1-4.11 1.98 0 7.28 2.29 1.02.79 2.61 3.25.55.31.71 1.02l-.08.8q2.21 1.74 2.21 6.24.24 0 .4 7.76v.15q0 1.43-1.27 8.71l-.31 1.5h1.66q2.61.08 2.61.71 0 .32-2.53.55 0 .32 1.82.72l.31.47v.16q-1.5.24-1.5.39 1.5.32 1.5 1.03 0 3.72-2.13 3.72l-.64.08q-3.08 0-3.08-.87 0-.24-3.24-.4-1.43-.79-2.3-1.02l-.08-.32q0-3.48 1.03-10.13.4-3.87 1.43-8.22l-.16-2.77.23-.4q-1.02-.79-1.02-2.29-.95-1.66-1.59-2.61-2.76-1.19-3.32-1.19-4.03-1.34-7.91.32-5.14 3.48-5.14 5.14l-.47 5.14.15 5.3q-.47 5.86-1.18 5.86l-.08.39.31.08h.32l1.35-.55q1.89.31 1.89 1.26l-.55.48v.31q.08.24 1.03.56l.16.39q-.48 4.12-1.19 4.12h-.24q-1.03-.72-8.46-1.11-5.3-.48-5.3-1.58v-1.27q-.08-.32.47-1.19v-.47q-.95-1.35-.95-1.58.4-.32 3.8-.4.56 0 .79-3.08.56-.32.95-2.46.48-.63.48-1.34v-.08q0-1.26-.79-2.53l.79-1.9q.55 0 .63-17.32l1.11-11.63v-3.48q0-1.74-1.11-1.74l-2.61-.08-1.66.47q-.4 0-.56-2.13v-.79q0-3.48.95-3.48Zm-.16 56.32v.16h.16q1.03 0 3.88 1.02 4.35.08 6.88.56h.24l.24-.32v-.08q0-.79-7.52-.79-1.26-.79-3.16-.79-.72.08-.72.24Zm32.75-7.12h.24q.55 0 1.5-5.93 0-.87-.55-1.11h-.32q-.47 0-.87 7.04Zm-2.69-16.77.32.32.47-1.27q.32.63.4.95.32.55.63.55v-.63q0-1.58-2.21-3.72l-.4-.08h-.31v.32q1.1 1.11 1.82 2.37l-.72 1.19Zm-23.17-18.59q-.24.48-.24 2.85.95 0 .95 1.42h.08q.24-.47.24-1.66v-1.03h-.08l-.32.87h-.32l-.08-.47q.16-.63.32-.63l.48.15q-.16-.47-1.03-1.5Zm-4.04 37.49q0 .56 2.61.8h.16l.24-.16v-.64q-.16-.23-.63-.23h-1.59q-.79 0-.79.23Zm25.08 4.04h.16l.79.08 2.45-.08.08-.08v-.08q-.79-.55-2.53-.55-.71 0-.95.71Zm-28.8-1.58v.23h3.33q0-.63-2.46-.71-.79 0-.87.48Zm22.55-26.11-.55.08v.4q1.74.87 2.21.87l.32-.4q0-.47-1.98-.95Zm-19.78-26.57v.23q.95.71 2.69.71l.16-.31q-1.66-.63-2.85-.63Zm6.73 31.56v.63h.23q.8 0 1.03-1.42l.08-.08v-.4h-.08q-.55.32-1.26 1.27Zm1.66-31.17h-.87l-.32.4q.24.39.71.63h.08q.56 0 .71-.4v-.15l-.31-.48Zm18.03 55.85h-.87v.23q.08.48 1.03.48h.79v-.24q0-.24-.95-.47Zm-17.79-3.33h-.56l-.16.08v.4l.48.39h.39l.4-.31v-.08l-.55-.48Zm-6.25-50.07h-.79l-.4.08v.16q.08.24.55.24h.64l.47-.16v-.24l-.47-.08Zm25.31 48.65v.32h.63l.24-.16v-.4l-.24-.23q-.47 0-.63.47Zm-20.09-18.51.23.24h.56q.47 0 .55-.24l-.24-.24h-.31q-.63 0-.79.24Zm18.11-10.44v.24q.32.55 1.19.55v-.24q-.32-.55-1.19-.55Zm-1.42 6.01v.16q0 .71.79.71v-.08q-.08-.79-.79-.79Zm-18.2-20.25-.31-.32-.16.24v.56l.16.23.31-.23v-.48Zm-4.27-6.64-.87-.08h-.23v.08l.07.31h1.03v-.31Zm8.86 25.63h.24q.87-.64.87-.8h-.24q-.79.4-.87.8Zm21.2 2.21h-.16l-.23.24v.16l.47.31h.16l.16-.16-.4-.55Zm-10.36-8.7h-.08v.08q0 .24 1.03.47v-.08q0-.39-.95-.47Zm-15.74-10.44h-.08l-.16.23v.24l.24.24.31-.08v-.24l-.31-.39Zm12.18 14.95-.24-.24h-.55v.16l.24.24h.55v-.16Zm-3.64 3.4h-.24l-.31.32v.23h.23l.32-.31v-.24Zm12.1 26.66-.23-.24-.24.24v.08l.24.23h.15l.08-.31Zm-27.37-54.19-.23-.16h-.08v.64h.08l.23-.24v-.24Zm33.39 38.68-.16-.16-.24.16.24.24h.16v-.24Zm-23.74 12.34v-.24h-.31v.24h.31Zm9.81-24.76h-.16l-.15.16h.31v-.16Zm10.52 2.61v.08l-.08.16q-.15 0 0-.16l.08-.08Zm30.38-10.68 2.21.64h.72q4.5 2.21 8.38 5.3 4.03 3.48 4.03 5.22h-.15q-.64-1.11-1.27-1.11h-.08q-.24 0-.24.32.32.87 1.43 3h.16q.15 0 .39-.79h.08q.24.08.55 2.3l.72 1.58-.16 1.03.24 2.84q-.56 1.98-1.03 5.22-.32 1.51-7.36 11.24-3.16 3-6.17 3-2.77.32-6.25.32h-1.5q-1.35 0-7.04-2.29-7.2-6.41-7.2-9.81-1.03-2.14-1.74-3.96 0-1.03 2.14-6.8 0-3.64 1.74-5.06 3.71-7.99 9.41-10.37 4.98-1.82 7.99-1.82Zm-14.24 24.84v.48q1.11 2.13 2.45 4.59 0 .79 3.01 2.21 1.42 1.66 5.3 2.61l1.42.16q3.48-.71 5.22-1.5l2.85-2.38q4.43-4.74 4.27-7.99v-.71q-.47-1.26-.47-4.11 0-2.22.31-3.48 0-.56-3.08-2.77-2.22-3.16-4.59-3.88h-.95q-9.25.4-9.25 1.51-2.06 2.05-2.85 4.03-2.53 2.69-2.53 3.56-.71 3.24-1.11 7.67Zm2.45-19.14-.23.4v.31q.47 0 4.82-3.32l.63-.24.48.08q5.3-.55 5.3-1.03v-.08l-1.27-.23q-5.38 0-9.73 4.11Zm6.17 1.66v.08l.16.24h1.11l5.61-1.27v-.16l-1.5-.31q-5.38.63-5.38 1.42Zm-12.42 19.7-.31.23v.56q.16 2.69 1.5 3l.08-.07v-.08q-.55-3.64-1.27-3.64Zm12.26-22.39v.4q6.17-.71 6.17-.95l-.63-.24h-.08q-3.79 0-5.46.79Zm6.73-3q.39 1.1 1.74 1.1l.79.08.16-.08v-.39q0-.87-1.66-1.03-1.03.08-1.03.32Zm-14.4 33.38h-.55v.31q1.03 1.03 3.72 1.03h.87q-.4-.55-4.04-1.34Zm13.05 2.92v.16q0 .24 1.19.4 1.34 0 1.34-.4v-.16q-.07-.31-.55-.63h-.71q-.87 0-1.27.63Zm15.03-15.03q.08 2.38.4 2.54h.16q0-.87.71-1.9v-.24l-.87-1.19h-.16q-.16 0-.24.79Zm-5.22-13.6h-.31q.47 1.03 2.29 1.74h.32l.23-.24v-.08q-1.34-1.42-2.53-1.42Zm-1.74-2.45v.15q.24.95 2.22 1.98h.23l.16-.23v-.08q-.39-.56-2.61-1.82Zm-5.22-2.61-.16.08q1.51 1.18 2.38 1.18l.07-.16v-.08q-1.26-1.02-2.29-1.02Zm-10.52 31.8v.23q0 .48 2.22.48l.07-.08v-.16q-1.02-.47-2.29-.47Zm14.71-32.67h-.15l-.24.23q.87 1.11 1.74 1.11 0-.87-1.35-1.34Zm-19.46 8.14v.56h.24q1.03-.95 1.03-1.51v-.07h-.4q-.47.31-.87 1.02Zm17.88-3.63q.48.79 1.11.79l.08-.16v-.16q0-.71-.64-.71-.55.08-.55.24Zm7.67 20.8v.08q.64 0 1.11-1.27v-.16h-.24q-.47 0-.87 1.35Zm-23.88-21.28q.71 0 1.34-.95v-.24q-1.34.4-1.34 1.19Zm25.23 18.43-.08 1.42h.4l.31.24q.08-1.26-.39-1.11h-.16l-.08-.55Zm-10.21 12.66h.08q1.43-.48 1.43-.79l-.16-.16q-1.11.39-1.35.95Zm-18.98-6.25-.32.16v.15l.64.64h.31q0-.56-.63-.95Zm5.38 4.9v.08h1.03l.16-.16-.16-.23h-.16q-.79 0-.87.31Zm25.71-19.85h-.08l-.24.24v.31l.24.32.31-.32v-.31l-.23-.24Zm-33.54-2.53q.39 0 .71-.56v-.15q-.71 0-.71.71Zm-2.37 8.54h-.08l-.16.24q.08.71.24.71l.15-.08v-.4l-.15-.47Zm21.04-18.27v.08l.79-.64-.16-.08q-.79.48-.63.64Zm-17.09 7.04h.08q.32-.08.32-.64h-.16q-.24.16-.24.64Zm.55 9.49h-.08l-.31.32v.15h.24l.15-.23v-.24Zm4.59-11.79v-.15h-.31v.31h.15l.16-.16Zm47.23-35.99q1.74 0 2.84.95-.95 2.53-1.26 7.99l-.71 7.28q0 .55 3.16.55 9.33 0 9.33.87.4 0 .95.48-.79 1.02-.79 1.5v.24l.24 1.58-1.03 3.48q0 .55 1.19 1.58v.16q-1.9.63-3.09.63-1.26-.08-1.26-.39v-.16l.71-.08h.55l.32-.32v-.16l-.32-.07-5.3.07-4.35-.07q-.39 0-.87 4.43h-.08l-1.1-1.27-.24.87v.47q.08 2.22.55 2.38.32 0 .56-1.43v-.55h.23l.08.24-.55 7.59q.95 16.38 1.66 16.38.39 2.53 1.98 2.53.87.55 2.13.55h1.43l4.74-.24q.16 0 .56 4.2.15 1.26-.52 1.85-.67.6-2.25.6l-6.09.16q-4.99 0-8.39-2.77-2.21-.79-2.21-4.75-.16-2.13-.56-12.66l.95-10.75.24-4.67v-.63q-.55-3.33-1.9-3.33h-5.14q-1.19 0-2.37.56-.79-.08-1.98-2.14l1.58-7.04q0-.31 9.57-.39 0-1.03 1.11-2.61.32-12.34.87-12.34v-.24q0-.16-.4-.16v-.24q0-.23 5.23-.71Zm-2.85 2.3-.16-.16h-.08v.47h.24v-.31Zm4.03 0h-.79l-.32.31v.16l.24 1.82h.16q.95-.95.95-1.66v-.32l-.24-.31Zm-3.64 3.71v-.79l-.23-.23q-.16.79-.16 2.05v.32h.16l.23-1.35Zm.24 2.54h-.16l-.31 7.83v.08l.23.23h.16q.56 0 .56-1.97v-1.82l-.16-3.88q-.16-.47-.32-.47Zm-13.68 9.09q0 .56.71.56h1.18q3.25 0 6.02-.32v-.16q0-.39-3.88-.39h-3.32q-.71 0-.71.31Zm25.47-.31h-.79l-1.03.39h-2.3v.24q1.74.47 3.01.47h1.82q.16 0 .16-.23-.16-.87-.87-.87Zm2.29.79h-.87l-.24.15v.16l.24.08q.79 0 .87-.31v-.08Zm-25.63 1.02h-.87l-.16.16v.48q0 .79 5.3.79 2.69 0 2.69-.4 0-.95-6.96-1.03Zm16.53.72h-.55l-.24.23v.08q0 .4 2.85.48l1.35-.08 1.81.32h.32q.55 0 .55-.48h-.07l-6.02-.55Zm9.02 1.74h-1.03l-.31.31v.08l.31.24h.4q.71 0 .87-.47l-.24-.16Zm-24.99.31h-.72l-.31.24q0 .32.39.32l1.98.08 2.14-.08.08-.08v-.16q-.95-.32-3.56-.32Zm5.61 1.74-.16-.23-6.48-.24v.16q0 .55 6.01.55l.63-.16v-.08Zm11.15 0h-.39v.24q.08.16 2.77.79h.16v-.16q-1.27-.87-2.54-.87Zm4.04.79q2.13.72 3.8.72l.31-.32v-.47l-.23-.24h-1.75q-2.13 0-2.13.31Zm-11 2.85v.64l.24.23q.32-.08.32-.55v-.32l-.16-.55h-.08q-.32.08-.32.55Zm2.93 1.66v-.23l-.39-.32v.24l.31.31h.08Zm-2.37.08-.16-.16h-.16l-.08.4v.4l.08.47h.32v-1.11Zm.16 5.94-.16-.64h-.24v.64l.24.31h.16v-.31Zm-3.96 9.41.24 2.21-.08 2.77.08.79h.24q.47 0 .47-3.72v-1.81q0-3.64-.32-3.64-.55 0-.63 3.4Zm5.14 6.25h-.16l-.07.55v.63q0 .56.31.64h.16q.32-.08.32-.56-.08-1.26-.56-1.26Zm.64 3.4-.32.87q0 1.82.79 2.29l.16-.31v-.72q-.08-1.97-.63-2.13Zm-2.93.71-.16-.16h-.24v1.19l.16.47h.08l.16-.15v-1.35Zm2.13 4.83v.55q.08.32.56.63h.55v-.16q0-.87-1.11-1.02Zm8.78 1.58h.32q2.93-.48 2.93-1.03l-.16-.16q-3.09.79-3.09 1.19Zm-9.65.31-1.1-1.42h-.16v.32q.24 1.97 1.74 1.97h.79l.16-.23v-.08q0-.16-1.43-.56Zm41.3-35.28 2.21.64h.71q4.51 2.21 8.39 5.3 4.03 3.48 4.03 5.22h-.16q-.63-1.11-1.26-1.11h-.08q-.24 0-.24.32.32.87 1.42 3h.16q.16 0 .4-.79h.08q.23.08.55 2.3l.71 1.58-.16 1.03.24 2.84q-.55 1.98-1.03 5.22-.31 1.51-7.35 11.24-3.17 3-6.17 3-2.77.32-6.25.32h-1.5q-1.35 0-7.04-2.29-7.2-6.41-7.2-9.81-1.03-2.14-1.74-3.96 0-1.03 2.13-6.8 0-3.64 1.74-5.06 3.72-7.99 9.42-10.37 4.98-1.82 7.99-1.82Zm-14.24 24.84v.48q1.1 2.13 2.45 4.59 0 .79 3 2.21 1.43 1.66 5.3 2.61l1.43.16q3.48-.71 5.22-1.5l2.85-2.38q4.43-4.74 4.27-7.99v-.71q-.48-1.26-.48-4.11 0-2.22.32-3.48 0-.56-3.08-2.77-2.22-3.16-4.59-3.88h-.95q-9.26.4-9.26 1.51-2.05 2.05-2.84 4.03-2.54 2.69-2.54 3.56-.71 3.24-1.1 7.67Zm2.45-19.14-.24.4v.31q.48 0 4.83-3.32l.63-.24.47.08q5.3-.55 5.3-1.03v-.08l-1.26-.23q-5.38 0-9.73 4.11Zm6.17 1.66v.08l.16.24h1.1l5.62-1.27v-.16l-1.5-.31q-5.38.63-5.38 1.42Zm-12.42 19.7-.32.23v.56q.16 2.69 1.51 3l.08-.07v-.08q-.56-3.64-1.27-3.64Zm12.26-22.39v.4q6.17-.71 6.17-.95l-.63-.24h-.08q-3.8 0-5.46.79Zm6.72-3q.4 1.1 1.74 1.1l.8.08.15-.08v-.39q0-.87-1.66-1.03-1.03.08-1.03.32Zm-14.39 33.38h-.56v.31q1.03 1.03 3.72 1.03h.87q-.39-.55-4.03-1.34Zm13.05 2.92v.16q0 .24 1.19.4 1.34 0 1.34-.4v-.16q-.08-.31-.55-.63h-.71q-.87 0-1.27.63Zm15.03-15.03q.08 2.38.39 2.54h.16q0-.87.71-1.9v-.24l-.87-1.19h-.15q-.16 0-.24.79Zm-5.22-13.6h-.32q.48 1.03 2.3 1.74h.31l.24-.24v-.08q-1.35-1.42-2.53-1.42Zm-1.74-2.45v.15q.24.95 2.21 1.98h.24l.16-.23v-.08q-.4-.56-2.61-1.82Zm-5.22-2.61-.16.08q1.5 1.18 2.37 1.18l.08-.16v-.08q-1.26-1.02-2.29-1.02Zm-10.52 31.8v.23q0 .48 2.21.48l.08-.08v-.16q-1.03-.47-2.29-.47Zm14.71-32.67h-.16l-.24.23q.87 1.11 1.74 1.11 0-.87-1.34-1.34Zm-19.46 8.14v.56h.24q1.03-.95 1.03-1.51v-.07h-.4q-.47.31-.87 1.02Zm17.88-3.63q.47.79 1.11.79l.07-.16v-.16q0-.71-.63-.71-.55.08-.55.24Zm7.67 20.8v.08q.63 0 1.11-1.27v-.16h-.24q-.47 0-.87 1.35Zm-23.89-21.28q.71 0 1.35-.95v-.24q-1.35.4-1.35 1.19Zm25.24 18.43-.08 1.42h.39l.32.24q.08-1.26-.4-1.11h-.16l-.07-.55Zm-10.21 12.66h.08q1.42-.48 1.42-.79l-.15-.16q-1.11.39-1.35.95Zm-18.98-6.25-.32.16v.15l.63.64h.32q0-.56-.63-.95Zm5.38 4.9v.08h1.02l.16-.16-.16-.23h-.15q-.8 0-.87.31Zm25.7-19.85h-.08l-.23.24v.31l.23.32.32-.32v-.31l-.24-.24Zm-33.54-2.53q.4 0 .72-.56v-.15q-.72 0-.72.71Zm-2.37 8.54h-.08l-.16.24q.08.71.24.71l.16-.08v-.4l-.16-.47Zm21.04-18.27v.08l.79-.64-.15-.08q-.8.48-.64.64Zm-17.08 7.04h.08q.31-.08.31-.64h-.16q-.23.16-.23.64Zm.55 9.49h-.08l-.32.32v.15h.24l.16-.23v-.24Zm4.59-11.79v-.15h-.32v.31h.16l.16-.16Zm46.35-13.76h2.61q1.9 0 6.17 1.66 1.58 0 4.99 1.98h.39q.87 0 3.8-3.17.63 0 2.37 2.22.79.32 1.82 1.5v.24q-4.43 4.9-4.43 5.46-2.14 7.2-2.85 7.99-1.5 1.58-4.27 2.77-3.48 3.48-6.25 3.48l-2.37.07-5.14-.47h-1.03q-.63 0-1.66 5.22l.63.16h.24q1.26 0 2.77-.95l1.82-.16h3.16q7.59 0 12.5 1.43.71.47 3.48 1.74l2.69 1.97q3.16 2.69 3.95 4.83 2.85 5.54 2.85 9.41 0 2.93-4.59 7.28l-4.82 3.48q-3.8 2.37-9.02 2.37l-2.21.32q-14.08 0-19.07-5.7-3.64-2.21-3.64-5.77-1.34-2.53-1.34-6.65l-.32-1.74.32-1.02h.24q.39 1.82.63 1.82h.24q1.1-4.99 1.74-6.65v-.16h-.08q-2.3 3.72-2.3 4.27h-.15q-.32 0-.32-.87.08-1.58 2.85-5.45 3.08-2.93 3.08-3.33.79-6.56 1.19-8.14-2.06-3.96-2.06-6.49l-.08-1.34q0-1.35 1.03-4.91.87-.87 3.32-4.27 4.2-4.43 7.12-4.43Zm-2.92 1.98v.08q2.76-.72 2.76-1.19v-.08h-.23q-1.11 0-2.53 1.19Zm21.35.31h-.23l-.24.24v.08q.16.24.55.24h.48v-.16l-.56-.4Zm-19.38 1.35v.31h.16l2.37-.87v-.39h-.71q-1.82.39-1.82.95Zm-4.74 8.15v.39q1.26 6.01 1.82 6.01 1.82 1.74 3.16 1.74 6.01 0 8.62-2.69 1.98-1.82 2.85-3.79.63-1.11.63-1.66v-1.27q0-1.27-1.9-3.8-4.27-1.89-5.93-1.89-3.72 0-7.2 3.24-2.05 2.53-2.05 3.72Zm23.25-4.75v.47h.16q1.66-1.42 2.29-2.45v-.23h-.07q-.87 0-2.38 2.21Zm-22.38-.16.31.08q.48 0 1.27-1.03v-.31h-.48q-1.1.63-1.1 1.26Zm17.4-.71h-.4v.08q.56 1.5 1.35 1.5.24 0 .24-.24 0-.55-1.19-1.34Zm-22.23 4.27h.24q.24-.16 1.26-1.58l-.23-.16q-.48 0-1.27 1.74Zm-1.03 2.37q0 1.74.79 2.61h.32q.24 0 .24-.23-.32-3.32-.79-3.32-.4 0-.56.94Zm20.73 4.35v.08h.47q1.43 0 1.82-3.24v-.39l-.08-.16h-.23q-1.98 3.16-1.98 3.71Zm-16.69-3.4-.16.24q0 1.35.87 2.45h.08v-.31q-.16-2.06-.79-2.38Zm20.8 3.09h-.24l-.23.39v.08h.23q.08 0 .24-.47Zm-5.69 2.13h.23q.95-.39 1.51-1.1l-.24-.32q-1.35.95-1.5 1.42Zm-3.33.95v.24l.48.32h.31q.4 0 1.59-1.19v-.16h-.72q-.94 0-1.66.79Zm-14.39-.31h-.32v.23q.79 1.27 2.37 1.74v-.15q-.71-1.82-2.05-1.82Zm17.95 0h-.47l-.32.31v.32h.16l.63-.55v-.08Zm-14.71.55-.24.24q.32.79 1.03.79l.4-.48q0-.31-1.19-.55Zm10.13.32h-.64l-.31.31q0 .16 1.34.32l.63-.08q0-.32-1.02-.55Zm-8.39.63-.08.08v.63l.32.32h1.34v-.32q-1.34-.71-1.58-.71Zm3.48.87h-.79l-.32.24q0 .71 2.61.71h2.3q.47 0 .55-.32-1.66-.63-4.35-.63Zm-6.33.95h-.23l-.4.32v.63q0 .63.63.79l.32-.24v-1.26l-.32-.24Zm12.82 6.33h-.79l-1.74.31v.08q0 .71 8.14.95l1.66.56h.16q.24 0 .64-.24l2.29.08v-.24q-.4-.63-1.82-.63h-.79q-.4 0-.71.23l-1.9-.79q-1.66-.31-5.14-.31Zm-7.12.31h.31-.31Zm-4.04 2.22q0 .16 2.54.32 1.02-.08 1.02-.32-.39-.63-.95-.87h-.87q-1.74.24-1.74.87Zm15.43.55-1.9-.23h-.08v.07q0 .32 1.9.4l.08-.08v-.16Zm6.01-.23h-.32l-.23.31.23.16.32-.08v-.39Zm-24.92 1.02.4.24h.55l.32-.39v-.48l-.24-.32q-.79 0-1.03.95Zm-3.24 1.51v.08l.24.23q1.9-.47 1.9-1.26v-.56l-.16-.23q-1.03.39-1.98 1.74Zm29.03-1.43h-.16q0 .56 1.82.95l.32-.08v-.16q-.56-.71-1.74-.71h-.24Zm-19.93.16h-.16l-.4.32.24.23h.55v-.39l-.23-.16Zm10.99.16-.39.39q0 .32 3.95.56 3.24.95 5.62 2.61l1.11.08.31-.32v-.08q-.55-1.11-5.06-2.45-4.19-.79-5.54-.79Zm-5.14 1.11v.23l-1.27.24-1.66-.24-5.85.08q-3.64 3.33-3.64 4.67l-.47.55v.16q.55 7.91 1.58 9.81.08.4 2.85 2.37 0 .56 4.74 1.9 6.96 1.03 11.55 1.03 5.93-1.11 8.07-3.32 3.88-3.96 3.88-6.49v-.39q0-1.35-3.09-5.3-.39-1.11-2.37-2.14-3.48-2.29-7.04-2.85l-4.91-.08v-.55h-.95q-1.1 0-1.42.32Zm17.01.08h-.56v.15l3.09 2.77h.16v-.16q-1.11-2.21-2.69-2.76Zm-29.43 1.66v.23h.24l.95-.31v-.32h-.16q-1.03.08-1.03.4Zm-1.11.79v.31h.24l.48-.55v-.24q-.48 0-.72.48Zm-2.13 1.98.08.39h.16q.39 0 .94-2.37h-.15q-1.03.79-1.03 1.98Zm32.03-1.67h-.31q0 .4 2.29 3.17v.08h.16v-.32q-1.03-2.93-2.14-2.93Zm7.12 6.17v-.31h-.31v.16l.23.31.08-.16Zm-1.5.4-.32-.16h-.39v.16l.24.32h.15l.32-.32Zm-40.1.55h-.24l-.16.08v.56l.32.23h.08v-.87Zm41.05 1.51v.15q0 .72.32.8h.15q.64-1.11.64-2.38l-.08-.08h-.24q-.79.56-.79 1.51Zm-36.62-1.27h-.16l-.16.24-.16 1.58q.08 1.66.48 1.66h.15q.24-.16.24-.55v-1.03q0-1.9-.39-1.9Zm-3.88 1.58-.4-.39h-.15v.23q.08.56.31.56l.24-.16v-.24Zm35.52 5.07v.15l.23.16q1.98-.55 1.98-2.06v-.55h-.24q-1.97 1.5-1.97 2.3Zm-32.59-.4-.32.4q.24.55.47.55l.32-.4q0-.31-.47-.55Zm3.24 1.5h-.16v.24l.32.32h.47v-.24q-.08-.32-.63-.32Zm-.63.56h-.48l-.24.31v.16h.72v-.47Zm19.53 3.71q-9.72-.63-10.99-1.1l-2.14-.16v.16q1.03.79 2.69 1.02l2.38-.07.55.39.08-.08h.16q2.13.4 4.51.4h1.74q3.48 0 4.82-.87 3.32-1.19 3.32-1.35v-.08q-4.9 1.03-7.12 1.74Zm3.64 2.61h.24q.63 0 3.88-1.89v-.16h-.32q-3.8.87-3.8 2.05Zm-2.21-.31v.16h.32q1.42-.24 1.42-.95h-.32q-1.1.39-1.42.79Zm-11.87-.32h.16l-.39-.31-.08.07v.08l.31.16Zm1.35.24h-.32v.08q.08.31.87.31h.87q0-.39-1.42-.39Zm6.88 0h-.47l-.16.24v.15q.08.32.55.32h.48l1.02-.24v-.23l-1.42-.24Zm51.18-54.58q3.08 0 5.22 4.35.4 0 1.11 1.03l1.03 5.85q-.56.95-4.2.95h-.79q-2.92-.47-2.92-1.98 0-1.1-1.82-3.08-.24-.4-3.41-.4-3 0-7.27 1.58-3.01 3.17-3.96 4.91.56 13.52.4 16.93 0 .71.95.71h1.9q1.26.08 1.26.47v.08l.32 1.03-.16 4.43-.48.63-3.71.4h-.32l-1.58.47q-9.1-.31-9.1-.71-1.58 0-1.58-1.42-.16-1.43-.16-2.93 0-1.5 3.09-1.98 0-.63 2.13-.63l.24-.08v-.16l-.48-21.67q0-1.98-1.02-1.98h-.48q-.95 0-3.16.87l-.16-.16v-.15q0-.16.63-.4v-.16q-.79 0-.79-4.43-.16 0-.24-1.42 3.17-2.45 6.65-2.45h1.98q1.18 0 4.03.79v.23q-.71 1.11-.71 1.59v.55q6.41-2.85 17.56-1.66Zm-20.73 11.94v.4q.4.79.4 1.66-.08.32-.24 3.24l.16 3.17h.08q.24 0 .63-7.36.16 0 .16-1.58-.08-.71-.39-.71h-.16q-.64.39-.64 1.18Zm-4.74 23.89-1.03.08v.16q0 .39 2.29.39h2.38l.55-.07q0-.4-4.19-.56Zm13.68-32.43v.16q.71 0 1.9-2.3v-.39h-.08q-2.05.63-1.82 2.53Zm10.21 2.53h.39q.4-.08 1.51-1.9v-.08q0-.15-.32-.15-1.35.63-1.35 1.66-.07 0-.23.47Zm-17.96 3.17-.24-1.35h-.31l-.4 1.66q0 .4.48.79h.08q.23 0 .39-1.1Zm10.76-7.44.39 1.58h.64v-1.66l-.24-.24h-.24q-.55.08-.55.32Zm-15.66 32.91h-1.59l-.15.15.08.16h4.35v-.23l-2.69-.08Zm-3.01-32.99q.63.63 1.35.63l.07-.15v-.56l-.31-.39q-1.11.15-1.11.47Zm7.99 33.54.24.24h1.18l.32-.32q0-.16-.4-.32-1.34.16-1.34.4Zm22.78-31.4h-.24v.15q.64.64 1.11.64h.24v-.16q-.63-.63-1.11-.63Zm-26.18-3.01-.95-.71h-.24v.32l.48.55h.71v-.16Zm-3.32 3.96v.15h.23q.87 0 .95-.31l-.16-.24h-.15q-.72 0-.87.4Zm20.72-3.72h-.47l-.95.08v.08l.16.23h.79q.55 0 .63-.31l-.16-.08Zm-12.81 25.47h-.16l-.32.24v.63h.32l.31-.24v-.47l-.15-.16Zm-9.65 9.17v-.55l-.32-.32-.16.32v.32l.16.23h.32Zm11.54-30.37-.47-.08-.32.08v.24l.32.23h.24l.23-.23v-.24Zm12.03-4.35v.16h.55l.32-.24-.24-.24q-.63.16-.63.32Zm5.54 0h-.32l-.16.16v.08l.16.23h.32l.15-.23v-.08l-.15-.16Zm-19.31-.63-.23-.16-.4.16v.31h.4l.23-.31Zm-.23 1.26h-.24l-.32.24v.16l.16.16.4-.32v-.24Zm18.98 6.57v.16h.16l.32-.24v-.24h-.08q-.4.24-.4.32Zm-2.45-6.96h-.24l-.31.23v.08h.39l.16-.16v-.15Zm-16.61 27.37v-.32h-.16v.32h.16Zm38.05-34.49 9.8-.24q1.27 0 5.3 1.11 4.59 4.35 5.46 6.8 1.74 1.82 2.77 7.2 1.27 1.26 1.27 5.61l.08 1.98-.32 7.83q0 2.38 2.93 5.86 2.69 2.61 3.48 2.61v.15q0 .95-2.77 3.01-2.06 2.06-2.61 2.06h-.08q-1.27-.16-6.41-4.67-9.33 3.64-9.41 3.72-3.09.95-6.88.95h-.4q-4.27-.71-7.28-3.32-.55-.48-2.29-3.96-1.42-1.74-1.42-4.27v-2.3q0-2.21 1.18-4.11 1.03-3.24 3.56-6.17 1.27-1.5 2.53-1.9 4.12-2.21 8.15-2.21l3.56-.08h.47q3.01 0 4.28.87h.47q.4 0 .4-.32-.87-3.72-2.85-7.12-1.74-2.92-6.49-2.92l-3.24-.48q-4.19.87-4.19 1.74-1.66 2.14-1.98 5.3-.16.4-2.85.4l-.47.16q-.32 0-.79 1.34-2.22-.32-2.22-.95.16-.47.55-5.69 1.27-3.64 6.02-6.73 2.21-1.26 2.69-1.26Zm9.25 1.34h-.39l-.16.24.23.32h.48l.08-.16-.24-.4Zm5.62.63h-.16v.16q.63.64 1.11.64h.08v-.16q-.64-.64-1.03-.64Zm-12.66.4v.24q.08.23.79.23.71 0 1.98-.47v-.32h-.32q-1.74 0-2.45.32Zm-7.12 2.53v.16h.08q.71 0 2.14-1.5v-.24h-.08q-.79 0-2.14 1.58Zm11.63-.55h-.63l-.4.31.24.4h1.03l.23-.24-.47-.47Zm-12.1 6.56-.16-.16-.24.16v1.19h.08q.32-.08.32-.55v-.64Zm28.55 6.17h-.08v.16q.16.63.32.63l.08-.39q-.16-.4-.32-.4Zm-1.74 2.77h-.08l-.23.16v.24q.31 1.18.63 1.18h.16q0-1.02-.48-1.58Zm-23.17.48h-.08l-.87.39v.4h.15q.56 0 .8-.64v-.15Zm-.95 7.51q.55 4.75 1.34 4.75l.79 1.03v.07l-.71-.07v.23q1.5 2.06 6.17 3.8.55.32 1.58.47 1.43 0 10.92-4.66.63-.4.63-.87v-.4q-.71-3.24-1.19-7.59l-.15-.08q0-.87-1.74-1.43-5.86-1.66-7.99-1.66-6.01 1.35-8.23 4.04-1.42 1.42-1.42 2.37Zm23.81-5.06v-.08l-.24-.16v.24h.24Zm.31 1.74v-.32h-.47v.32l.24.24.23-.24Zm-2.45 1.66h-.08l-.24.24.24.31.32-.08v-.23l-.24-.24Zm2.77.24h-.24v.08q.16 3 .63 3l.16-.16v-.15q0-1.67-.55-2.77Zm-2.77 2.53h-.32l-.08.08v.47l.24.32h.08l.32-.32v-.47l-.24-.08Zm6.41 7.43h-.24v.48q.32 1.03.71 1.03h.24v-.24q-.32-1.27-.71-1.27Zm-28.95.24h-.16l-.16.16v.08l.16.16h.39v-.16l-.23-.24Zm26.89 1.03h-.39l-.24.24q.24.55.63.71h.08l.32-.32v-.16l-.4-.47Zm-11.86 1.11v.15h.31q1.11 0 2.93-.94v-.08h-.32q-2.69.31-2.92.87Zm13.52.23h-.31l-.16.32v.16l.31.32h.32l.24-.16v-.16l-.4-.48Zm-18.82.64h-1.03l-.24.23q.16.4.63.4.87-.16.87-.4v-.07l-.23-.16Zm-9.42 1.1h-.23l-.24.32q.31.71 3.95 1.82 1.19.55 3.17.55v-.08q0-.23-3.01-.87-1.74-.47-3.64-1.74Zm48.41-38.12q.87.16.87.23l-.31.56v.08h.15l4.04-.08q6.88 0 9.17 3.48 1.82 2.37 1.98 2.77l.32.08q.79 0 8.94-4.28 1.1-.55 1.82-.55 3.24 0 6.72 2.45 6.72 5.3 6.72 9.02.72 1.5 2.46 16.22v2.13q0 .71.39.87h.32q.63 0 2.53-.63 1.26 0 1.26 4.67.16 2.37.16 3.56h-1.1q-3.33.55-5.86.55l-2.53-.32-4.59.16h-.79q-.16 0-.16-.63l-1.02-1.03v-.08l.23-.79v-.16l-.39-2.13v-1.03q0-1.03 1.58-1.03 2.85.32 2.37-2.14-.08-6.17.48-9.25v-.16l-.16-4.74q0-1.27-2.14-2.93l-.63-.16h-.55l-.64.32q-.15 0-.15-.72-1.82-2.37-5.86-2.37-5.14.48-6.17 3.09-.16.71-.31 3.71l.15 1.82v5.7l-.08 2.29q0 3.56 1.98 4.12.87.15.87.55-.87 3.96-1.11 4.35l-1.97.4-6.73-.56-.79.16q-1.34 0-1.34-4.03v-.32q0-.47 2.37-1.19.63 0 .63-.63-.39-1.98-.39-4.43l.16-8.7q-.48-1.74-.48-2.77.08-1.98.56-1.98l.71.4h.08v-.16q0-1.74-5.38-4.98-1.43-.56-2.85-.56-2.21 0-4.98 1.98l-.08.4v6.4l.23 16.54.32.31h.32q.24 0 .31-.55h.16q2.14 0 2.61 1.11v.63l.08 1.9q.16 3.24-1.66 3.24-.47.16-4.27.32l-10.28-.64q-.8 0-1.51-4.82v-.08q0-.71 3.25-1.66 0-.55 3.16-1.03.55-.08.55-.79l.56-18.51.16-4.35q0-.71-1.51-.71-1.5 0-3.71.39-1.35-.71-1.35-1.5.63-.4.63-1.27v-.63q-.39-2.06-.95-2.06l-.08-.07v-.16q.48-.32 1.11-1.51 5.3-.71 11.39-1.1Zm-3.4 7.2v3.95q0 1.19-.47 2.37l.55.79-.16 1.27v.79l.16.16h.08q.63 0 .71-8.62v-.08q0-.95-.55-1.27-.32.08-.32.64Zm-7.28-1.51q0 .79 1.43.79 1.82 0 3.72-1.18v-.24h-.32q-4.83 0-4.83.63Zm13.14-.95v.08l4.11-.47q1.74 0 3.56 1.58h.24v-.32q-.48-1.66-1.67-1.66h-.71q-5.46 0-5.53.79Zm26.34-1.34q-.48.24-.48.39 0 .16 1.35.56.71 1.03 1.74 1.03h1.5v-.24q0-.79-4.03-1.74h-.08Zm-36.63 32.83h-.31l-.24.23q0 1.03 2.77.4.31.55.87.55 1.97-.08 4.11-.39v-.32l-2.06-.08q-1.97.16-4.74-.16l-.4-.23Zm12.26-30.3q0 .24 2.22.79 1.5.79 2.61.79h.08l.16-.24q-1.82-1.58-4.04-1.58h-.47q-.56.08-.56.24Zm27.45 4.03h-1.5l-.24.24q1.74 1.9 3.24 1.9l.24-.16v-.39q-.55-.72-1.74-1.59Zm-4.98-2.84v.15q.23.4.47.4 3.25 0 3.48-.4-.23-.71-2.53-.71h-.16q-1.18 0-1.26.56Zm11.07 15.03-.39-.4h-.48l-.16.32.24 3v.24l.24.32h.16l.39-.4v-3.08Zm-48.88 12.57-.08-.08h-.24q0 .72-.63 1.35.55 2.69 1.18 2.69h.24l-.47-3.96Zm25.31-13.92-.16.71v2.93l.16 1.42h.24q.31-.71.31-1.97-.15-3.09-.55-3.09Zm-14.16-18.27v.08l.32.16 5.14-.95v-.16h-2.37q-3.09 0-3.09.87Zm16.61 5.85v.71l.32.24q.95 0 2.45-1.42h-1.98q-.55 0-.79.47Zm-17.95 1.82h-.16q-.16 1.27-.16 2.69v1.03l.16.39q.55 0 .55-2.13v-.63q0-1.35-.39-1.35Zm35.67-1.82h-.24v.48q.32.95 1.51 1.9v.23h.55v-.16q0-.87-1.82-2.45Zm-12.26-2.45v.16h.08q.47 0 2.69-1.82v-.32q-2.77.87-2.77 1.98Zm15.42 29.98v.24h1.03q2.3 0 2.3-.48l-.32-.16h-.16q-2.85 0-2.85.4Zm-3.16 1.19v.15h2.06q.79 0 .95-.39-.08-.32-.64-.32h-1.18q-.4 0-1.19.56Zm2.77-20.65.95 1.42h.31v-1.18q0-.48-.23-.64h-.71q-.16 0-.32.4Zm-40.74 14.95h-1.66q.08 1.27.32 1.27h.23q1.03 0 1.11-1.27Zm-3.8-28h-1.74l-1.5.16v.23l.24.16q3.24 0 3.24-.31l-.24-.24Zm-2.61 30.85.08 1.18h.16q.56-.79 1.58-1.18v-.24l-.71-.16h-.79q-.32 0-.32.4Zm10.37 2.13-.32.24q0 .71 1.5.79l.4-.31v-.32q0-.4-1.58-.4Zm-1.19-3.32-1.58-1.34v.16q0 1.58.95 1.58h.47q.16 0 .16-.4Zm12.97-25.79h-.08v.08q0 .79 1.43 1.43v-.87q0-.16-1.35-.64Zm23.81 5.7h-.16v.16q.64 2.13 1.19 2.13v-.15q0-1.11-1.03-2.14Zm-27.45-10.44h-.47v.24q1.82.39 2.29.39h.16v-.16q0-.47-1.98-.47Zm3.41 2.85h-.16v.31q.71 1.11 1.26 1.43h.24v-.08q-.4-.95-1.34-1.66Zm-10.13 30.29h-.63l-2.06.16v.32h1.5l1.19-.16v-.32Zm18.11-28.79.08.16h.48q1.03-.08 1.03-.71l-.24-.08q-1.19.23-1.35.63Zm19.94 26.26v.16l.24.24h.23l.32-.4v-.39l-.16-.32h-.32q-.31.24-.31.71Zm-44.93 1.66h-.63l-.64.16v.24l.64.08h.63l.47-.08v-.24l-.47-.16Zm47.06 1.03.08.08h.32q.4 0 .55-.24v-.08q0-.63-.23-.63-.32 0-.72.87Zm-49.43-34.17.23.31q1.59-.15 1.59-.47l-.4-.08q-1.42.08-1.42.24Zm52.2 32.51h-.16l-.31.24v.95l.31.31q.24 0 .24-1.26l-.08-.24Zm-45.01 4.51v.16l.24.15q.71-.31 1.11-.79v-.15q-.71 0-1.35.63Zm17.01-25.79-.08.24q.16.63.32.63h.08l.47-.39v-.24q-.08-.24-.79-.24Zm-16.77-5.85v.16h.32q1.03-.08 1.03-.4v-.24h-.64q-.71.16-.71.48Zm17.09 25.39h-.56l-.31.39.23.24h.56l.31-.31v-.08l-.23-.24Zm11.23-27.84h-.48v.23q0 .24.8.24h.31l.16-.16q-.08-.31-.79-.31Zm-29.51 11.78h-.07l-.16.16v.47l.31.32h.16l.16-.16v-.39l-.4-.4Zm.48-15.5h-.55l-.16.23v.24l.23.24q.56 0 .56-.55l-.08-.16Zm11.55 4.9-.16.16q0 .79.71.79v-.16q0-.55-.55-.79Zm3.64 5.54h-.16q0 .63.63.63h.16v-.31q-.08-.32-.63-.32Zm.79 24.52h-.48l-.23.32v.15l.47.08.48-.08v-.15l-.24-.32Zm-12.5-1.34-.24-.24h-.55v.47l.55.08.24-.31Zm-11.94 2.61-.24-.24h-.16v.55l.16.24h.24v-.55Zm46.59-8.55h-.16l-.24.24v.32l.16.15h.24v-.71Zm-38.53-26.18h-.31l-.16.24v.16l.16.15h.16l.31-.15-.16-.4Zm38.92 28.64-.24-.32-.31.39v.08l.31.32.24-.32v-.15Zm-37.49-26.11v-.16l-.32-.15-.16.31.16.16h.08l.24-.16Zm16.69 25.87h-.16l-.16.24v.23l.32.08.08-.31-.08-.24Zm-20.17-13.61-.24-.16h-.08v.32l.24.24h.08v-.4Zm-.56-12.81h-.31l-.16.24v.15h.16l.31-.23v-.16Zm2.46 31.88h.15v-.08q-.08 0-.15.08Z"
      />
    </g>
  </Svg>
);
