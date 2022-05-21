import Flubber from "./Flubber";
import Slide from "./FlubberSlide";
import Grip from "./FlubberGrip";

type Flubber = typeof Flubber & { Grip: typeof Grip; Slide: typeof Slide };
(Flubber as Flubber).Grip = Grip;
(Flubber as Flubber).Slide = Slide;

export default Flubber as Flubber;

export { default as useFlubberGripSize } from "./useFlubberGripSize";
export { default as usePushAndPull } from "./usePushAndPull";

export * from "./FlubberGrip";
export * from "./Flubber";
export * from "./FlubberSlide";
