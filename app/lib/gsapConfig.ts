import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomEase } from "gsap/CustomEase";

import { useGSAP } from "@gsap/react";

// Register all plugins
gsap.registerPlugin(ScrollTrigger, Flip, SplitText, Draggable, InertiaPlugin, CustomEase);

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP, Draggable, InertiaPlugin, CustomEase };
