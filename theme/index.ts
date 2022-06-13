import { extendTheme } from "@chakra-ui/react";
// Global style overrides
import styles from "./styles";
// Foundational style overrides
import fonts from "./foundations/fonts";
import colors from "./foundations/colors";
import breakpoints from "./foundations/breakpoints";
import shadows from "./foundations/shadows";
// Component style overrides
//
import Button from "./components/button";
import Link from "./components/link";
import Heading from "./components/heading";
import Badge from "./components/badge";
import Popover from "./components/popover";


const overrides = {
  styles,
  colors,
  fonts,
  breakpoints,
  shadows,
  // Other foundational style overrides go here
  components: {
    Button,
    Link,
    Heading,
    Badge,
    Popover
    // Other components go here
  },
};

export default extendTheme(overrides);
