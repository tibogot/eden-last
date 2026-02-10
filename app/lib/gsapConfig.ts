import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

import { useGSAP } from "@gsap/react";

// Register all plugins
gsap.registerPlugin(ScrollTrigger, Flip, SplitText, Draggable, InertiaPlugin);

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP, Draggable, InertiaPlugin };
